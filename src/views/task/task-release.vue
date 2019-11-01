<template>
    <div>
        <x-header @on-click-back="goList" :left-options="{backText: '', preventGoBack: true}" style="background-color: #0094eb">发布任务<a slot="right" style="color: #fff" @click="saveTask">保存</a></x-header>
        <div class="info_container">
            <group>
                <cell title="任务名称" primary="content"><x-input placeholder="必填" v-model="taskName" required text-align="right" :max="50"></x-input></cell>
                <popup-picker show-name :columns="1" title="优先级" :data="statusList" v-model="taskPriority"></popup-picker>
                <cell title="完成日期" v-show="taskPriority[0] === '2'" primary="content"><datetime v-model="completeTime" placeholder="必填"></datetime></cell>
                <cell title="任务内容"></cell>
                <vue-html5-editor :content="taskContent" @change="contentGet" :height="150" :z-index="100" class="task_content" style="margin-left: 15px"></vue-html5-editor>
                <cell title="附件" style="margin-top: 20px" primary="content">
                    <input ref="uploadFile" id="upFile" type="file" style="display: none">
                    <div class="select_style" @click="addFile">点击上传<img src="../../img/arrow.png"/></div>
                </cell>
                <div style="padding-left: 15px" v-if="fileList.length > 0">
                    <div v-for="(file, index) in fileList" :key="index" class="file_model" @click="removeFile(index)">
                        <div class="file_name text_overflow">{{file.name}}</div>
                        <icon class="file_close" type="clear"></icon>
                    </div>
                </div>
                <cell title="负责人" primary="content">
                    <div @click="openP" v-show="personLiableName === ''" class="select_style">必填<img src="../../img/arrow.png"/></div>
                    <div @click="openP" v-show="personLiableName !== ''" class="select_style">{{personLiableName}}<img src="../../img/arrow.png"/></div>
                    <popup  v-model="modalP" position="bottom" height="315px" class="margin_style">
                        <search @result-click="resultClickP" @on-change="getResultP" :results="resultsP" v-model="valueP" class="searchInput"
                                :auto-fixed="false" ref="searchP" placeholder="搜索并选择负责人"></search>
                    </popup>
                </cell>
                <cell title="抄送人" primary="content">
                    <div @click="openC" v-show="nameBox.length === 0" class="select_style">请选择<img src="../../img/arrow.png"/></div>
                    <div @click="openC" v-show="nameBox.length > 0" class="select_style">
                        <span v-for="(name, index) in nameBox" :key="index" v-show="index < 3"><span v-show="nameBox.length !== 1 && index !== 0">, </span>{{name}}</span>
                        <span v-show="nameBox.length > 3">等</span>
                        <img src="../../img/arrow.png"/>
                    </div>
                    <popup v-model="modalC" position="bottom" height="100%" class="margin_style">
                        <div class="popTop">
                            <span @click="cancelC">取消</span>
                            <span style="float: right;color: #0094eb" @click="confirmC">确定</span>
                        </div>
                        <search @result-click="resultClickC" @on-change="getResultC" :results="resultsC" v-model="valueC" class="searchInput"
                                :auto-fixed="false" ref="searchC" placeholder="搜索并选择抄送人"></search>
                        <div class="popResult" v-show="popNameBox.length > 0">
                            <span v-for="(co, index) in popNameBox" :key="index" @click="removeCo(index)">{{co}}<icon type="clear"></icon>&nbsp;&nbsp;</span>
                        </div>
                    </popup>
                </cell>
                <cell></cell>
            </group>
        </div>
        <button id="btn" @click="cons" style="width: 50px;display: none"></button>
        <loading :show="loadingShow === '1'" text="Loading"></loading>
    </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import VueHtml5Editor from 'vue-html5-editor'
import {XHeader, Group, Cell, XInput, PopupPicker, Loading, Datetime, Popup, Search, Icon} from 'vux'
Vue.use(VueHtml5Editor, {
    name: 'vue-html5-editor',
    showModuleName: false,
    icons: {
        text: 'fa fa-pencil', color: 'fa fa-paint-brush',
        font: 'fa fa-font',
        align: 'fa fa-align-justify',
        list: 'fa fa-list',
        tabulation: 'fa fa-table',
        image: 'fa fa-file-image-o',
        hr: 'fa fa-minus',
        eraser: 'fa fa-eraser'
    },
    // 配置图片模块
    // config image module
    image: {
        // 文件最大体积，单位字节  max file size
        sizeLimit: 10000 * 1024,
        upload: {
            url: null,
            headers: {},
            params: {},
            fieldName: {}
        },
        compress: { width: 1600, height: 1600,
            quality: 80
        },
        uploadHandler (responseText) {
            var json = JSON.parse(responseText)
            if (!json.ok) {
                alert(json.msg)
            } else {
                return json.data
            }
        }
    },
    // 语言，内建的有英文（en-us）和中文（zh-cn）
    // default en-us, en-us and zh-cn are built-in
    language: 'zh-cn',
    hiddenModules: [],
    visibleModules: [
        'text',
        'color',
        'font',
        'align',
        'list',
        'tabulation',
        'image',
        'hr',
        'eraser'
    ],
    modules: {
        // omit, reference to source code of build-in modules
    }
})
export default {
    name: 'task-release',
    components: {Group, Cell, XHeader, XInput, Popup, Search, PopupPicker, Loading, Icon},
    data () {
        return {
            userList: [],
            taskName: '',
            taskPriority: ['0'],
            statusList: [{name: '一般', value: '0'}, {name: '重要', value: '1'}, {name: '紧急', value: '2'}],
            completeTime: '',
            taskContent: '',
            fileList: [],
            modalP: false,
            valueP: '',
            personLiable: '',
            personLiableName: '',
            resultsP: [],
            modalC: false,
            valueC: '',
            idBox: [],
            nameBox: [],
            popIdBox: [],
            popNameBox: [],
            resultsC: [],
            loadingShow: ''
        }
    },
    methods: {
        init () {
            let self = this
            this.$get('api/task/allusers', {
            }).then((res) => {
                this.userList = res.data.data.list
            })
            this.$refs.uploadFile.onchange = function () {
                if (this.files[0]) {
                    self.fileList.push(this.files[0])
                }
                let fileElem = document.getElementById('upFile')
                fileElem.value = ''
            }
        },
        goList () {
            document.getElementById('btn').click()
            setTimeout(() => {
                this.$router.replace({name: 'my-task'})
            }, 500)
        },
        cons () {}, // 用于关闭输入法弹框
        contentGet (val) {
            this.taskContent = val
        },
        addFile () {
            let fileElem = document.getElementById('upFile')
            return fileElem.click()
        },
        removeFile (index) {
            this.fileList.splice(index, 1)
        },
        // 负责人
        openP () {
            this.modalP = true
            this.valueP = ''
            this.resultsP = []
        },
        resultClickP (item) {
            this.personLiable = item.value
            this.personLiableName = item.title
            this.modalP = false
        },
        getUserP (val) {
            let rs = []
            for (let i = 0; i < this.userList.length; i++) {
                if (this.userList[i].userName.indexOf(val) !== -1) {
                    rs.push({
                        title: this.userList[i].userName,
                        value: this.userList[i].userId
                    })
                }
            }
            if (rs.length === 0) {
                return [{title: '无匹配数据', value: -1}]
            } else {
                return rs
            }
        },
        getResultP (val) {
            this.resultsP = val ? this.getUserP(this.valueP) : []
        },
        // 抄送人
        openC () {
            this.modalC = true
            this.valueC = ''
            this.resultsC = []
        },
        cancelC () {
            this.modalC = false
            this.popIdBox = JSON.parse(JSON.stringify(this.idBox))
            this.popNameBox = JSON.parse(JSON.stringify(this.nameBox))
        },
        confirmC () {
            this.modalC = false
            this.idBox = JSON.parse(JSON.stringify(this.popIdBox))
            this.nameBox = JSON.parse(JSON.stringify(this.popNameBox))
        },
        resultClickC (item) {
            let id = item.value
            let name = item.title
            if (this.popIdBox.indexOf(id) === -1) {
                this.popIdBox.push(id)
                this.popNameBox.push(name)
            }
        },
        removeCo (index) {
            this.popIdBox.splice(index, 1)
            this.popNameBox.splice(index, 1)
        },
        getUserC (val) {
            let rs = []
            for (let i = 0; i < this.userList.length; i++) {
                if (this.userList[i].userName.indexOf(val) !== -1) {
                    rs.push({
                        title: this.userList[i].userName,
                        value: this.userList[i].userId
                    })
                }
            }
            if (rs.length === 0) {
                return [{title: '无匹配数据', value: -1}]
            } else {
                return rs
            }
        },
        getResultC (val) {
            this.resultsC = val ? this.getUserC(this.valueC) : []
        },
        saveTask () {
            // 清空非紧急任务的完成时间
            if (this.taskPriority[0] !== '2') {
                this.completeTime = ''
            }
            if (this.taskName === '') {
                this.$vux.alert.show({
                    title: '提示',
                    content: '任务名称不能为空！'
                })
            } else if (this.taskPriority[0] === '2' && this.completeTime === '') {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请选择完成时间！'
                })
            } else if (this.taskContent === '') {
                this.$vux.alert.show({
                    title: '提示',
                    content: '任务内容不能为空！'
                })
            } else if (this.personLiable === '') {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请选择负责人！'
                })
            } else {
                this.resetSetItem('watchStorage', '1')
                var fd = new FormData()
                fd.append('taskName', this.taskName)
                fd.append('taskPriority', this.taskPriority[0])
                fd.append('completeTime', this.completeTime === '' ? null : this.completeTime)
                fd.append('taskContent', this.taskContent)
                fd.append('personLiable', this.personLiable)
                fd.append('correlation', this.idBox)
                for (let file in this.fileList) {
                    fd.append('file', this.fileList[file])
                }
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    timeout: 300000
                }
                axios.post('api/task/found', fd, config).then(res => {
                    this.resetSetItem('watchStorage', '0')
                    if (res.data.data.res === 1) {
                        this.$vux.alert.show({
                            title: '提示',
                            content: '操作成功'
                        })
                        this.$router.replace({name: 'my-task'})
                    } else {
                        this.$vux.alert.show({
                            title: '提示',
                            content: res.data.data || '操作失败'
                        })
                    }
                })
            }
        }
    },
    mounted () {
        window.addEventListener('setItem', () => {
            this.loadingShow = sessionStorage.getItem('watchStorage')
        })
        this.init()
    }
}
</script>
<style scoped>
    .file_model{display: inline-block; width: 50%; margin-bottom: 10px;}
    .file_name{display: inline-block; max-width: 80%; vertical-align: middle;}
    .file_close{display: inline-block;}
</style>
