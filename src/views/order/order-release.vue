<template>
    <div>
        <x-header :left-options="{backText: ''}" class="header_white">
            <span class="header_title">发布工单</span>
            <div slot="right" class="header_right">
                <span @click="orderSave(1)" style="margin-right: 15px">保存</span>
                <span @click="orderSave(0)">发送</span>
            </div>
        </x-header>
        <div class="header_blank" style="border-bottom: 1px solid #d7d7d7"></div>
        <div class="info_container">
            <group>
                <cell title="接收人" primary="content">
                    <span slot="icon" class="red" style="margin-right: 3px">*</span>
                    <div @click="openC(1)" v-show="receiver.length === 0" class="select_style">
                        请选择接收人或组
                        <img src="../../img/arrow_grey.jpg"/>
                    </div>
                    <div @click="openC(1)" v-show="receiver.length > 0" class="select_style">
                        <span v-for="(co, index) in receiver" :key="index" v-if="index < 3"><span v-show="receiver.length !== 1 && index !== 0">，</span>{{co.name}}</span>
                        <span v-show="receiver.length > 3">等</span>
                        <img src="../../img/arrow.png"/>
                    </div>
                </cell>
                <cell title="抄送人" primary="content">
                    <div @click="openC(2)" v-show="correlation.length === 0" class="select_style">
                        请选择抄送人或组
                        <img src="../../img/arrow_grey.jpg"/>
                    </div>
                    <div @click="openC(2)" v-show="correlation.length > 0" class="select_style">
                        <span v-for="(co, index) in correlation" :key="index" v-if="index < 3"><span v-show="correlation.length !== 1 && index !== 0">，</span>{{co.name}}</span>
                        <span v-show="correlation.length > 3">等</span>
                        <img src="../../img/arrow.png"/>
                    </div>
                    <popup v-model="modalC" position="bottom" height="100%" class="margin_style">
                        <div class="popTop">
                            <span @click="cancelC">取消</span>
                            <span style="float: right;color: #0094eb" @click="confirmC">确定</span>
                        </div>
                        <search @result-click="resultClickC" @on-change="getResultC" :results="resultsC" v-model="valueC" class="searchInput"
                                :auto-fixed="false" ref="searchC" placeholder="搜索并选择人员或组"></search>
                        <div class="popResult" v-show="editBox.length > 0">
                            <span v-for="(co, index) in editBox" :key="index" @click="removeCo(index)">{{co.name}}<icon type="clear"></icon>&nbsp;&nbsp;</span>
                        </div>
                    </popup>
                </cell>
                <cell title="标题" primary="content">
                    <span slot="icon" class="red" style="margin-right: 3px">*</span>
                    <x-input placeholder="请输入标题" v-model="workName" text-align="right" :max="50"></x-input>
                </cell>
                <popup-picker show-name :columns="1" title="类型" :data="typeList" v-model="workType"></popup-picker>
                <cell title="工单内容"></cell>
                <vue-html5-editor :content="workContent" @change="contentGet" :height="150" :z-index="100" class="task_content" style="margin-left: 15px"></vue-html5-editor>
                <cell title="附件" style="margin-top: 20px" primary="content">
                    <span slot="icon"><img src="../../img/file-add.png" style="width: 18px;margin: 3px 3px 0 0"></span>
                    <input ref="uploadFile" id="upFile" type="file" style="display: none">
                    <div class="select_style" @click="addFile">点击上传<img src="../../img/arrow_grey.jpg"/></div>
                </cell>
                <div style="padding-left: 15px" v-if="fileList.length > 0">
                    <div v-for="(file, index) in fileList" :key="index" class="file_model" @click="removeFile(index)">
                        <div class="file_name text_overflow">{{urlName(file)}}</div>
                        <icon class="file_close" type="clear"></icon>
                    </div>
                </div>
                <cell></cell>
            </group>
        </div>
        <loading :show="loadingShow === '1'" text="Loading"></loading>
    </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import VueHtml5Editor from 'vue-html5-editor'
import {XHeader, Group, Cell, XInput, PopupPicker, Loading, Datetime, Popup, Search, Icon} from 'vux'
import {removeOrder} from '../../libs/common.js'
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
    name: 'order-release',
    components: {Group, Cell, XHeader, XInput, Popup, Search, PopupPicker, Loading, Icon},
    data () {
        return {
            id: 0,
            modalMark: 0,
            receiver: [],
            correlation: [],
            editBox: [],
            userList: [],
            workName: '',
            workType: ['1'],
            typeList: [{name: '工作', value: '1'}, {name: '日报周报', value: '2'}, {name: '通知公告', value: '3'}, {name: '温馨提示', value: '4'}],
            workContent: '',
            fileList: [],
            urlName: function (url) {
                let index = url.lastIndexOf('_')
                url = url.substring(index + 1, url.length)
                return url
            },
            modalC: false,
            valueC: '',
            resultsC: [],
            idBox: [], // 搜索时储存已选人员
            loadingShow: '',
            leaveMark: 0 // 离开页面方式标记
        }
    },
    methods: {
        init () {
            let self = this
            this.$get('api/order/user_list', {
            }).then((res) => {
                this.userList = res.data.data.list
            })
            this.$refs.uploadFile.onchange = function () {
                if (this.files[0]) {
                    self.resetSetItem('watchStorage', '1')
                    let fd = new FormData()
                    fd.append('file', this.files[0])
                    let config = {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        timeout: 300000
                    }
                    axios.post('api/order/file_url', fd, config).then(res => {
                        self.resetSetItem('watchStorage', '0')
                        if (res.data.data.fileurl) {
                            self.fileList.push(res.data.data.fileurl)
                        } else {
                            self.$vux.alert.show({
                                title: '提示',
                                content: res.data.msg || '操作失败'
                            })
                        }
                    })
                }
                self.$refs.uploadFile.value = ''
            }
            if (this.$route.query.id) {
                this.id = parseInt(this.$route.query.id)
                this.$get('api/order/info_edit', {
                    id: this.id
                }).then((res) => {
                    let info = res.data.data.info
                    this.workName = info.workName
                    this.workType = [info.workType.toString()]
                    this.workContent = info.workContent
                    this.fileList = info.workEnclosure
                    if (this.$route.query.type === '2') {
                        this.receiver = info.receiver
                        this.correlation = info.correlation
                    } else {
                        this.id = 0
                    }
                })
            }
        },
        contentGet (val) {
            this.workContent = val
        },
        addFile () {
            return this.$refs.uploadFile.click()
        },
        removeFile (index) {
            this.fileList.splice(index, 1)
        },
        // 深度复制对象数组
        copyArray (arr) {
            return arr.map((e) => {
                if (typeof e === 'object') {
                    return Object.assign({}, e)
                } else {
                    return e
                }
            })
        },
        // 抄送人
        getBox () {
            let check = function (obj) {
                return obj.onlyId
            }
            this.idBox = this.editBox.map(check)
        },
        openC (n) {
            this.leaveMark = 2
            this.modalMark = n
            if (this.modalMark === 1) {
                this.editBox = this.copyArray(this.receiver)
            } else {
                this.editBox = this.copyArray(this.correlation)
            }
            this.modalC = true
            this.valueC = ''
            this.resultsC = []
        },
        cancelC () {
            this.leaveMark = 0
            this.modalC = false
            if (this.modalMark === 1) {
                this.editBox = this.copyArray(this.receiver)
            } else {
                this.editBox = this.copyArray(this.correlation)
            }
        },
        confirmC () {
            this.leaveMark = 0
            this.modalC = false
            if (this.modalMark === 1) {
                this.receiver = this.copyArray(this.editBox)
            } else {
                this.correlation = this.copyArray(this.editBox)
            }
        },
        resultClickC (item) {
            if (item.value === -1) {
                return
            }
            let co = {onlyId: item.onlyId, id: item.value, type: item.type, name: item.title}
            this.getBox()
            if (!this.idBox.includes(item.onlyId)) {
                this.editBox.push(co)
            }
        },
        removeCo (index) {
            this.editBox.splice(index, 1)
        },
        getUserC (val) {
            let rs = []
            for (let i = 0; i < this.userList.length; i++) {
                if (this.userList[i].emailStr.includes(val)) {
                    rs.push({
                        title: this.userList[i].name,
                        value: this.userList[i].id,
                        type: this.userList[i].type,
                        onlyId: this.userList[i].onlyId
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
        orderSave (n) {
            if (this.receiver.length === 0) {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请选择接收人'
                })
            } else if (this.workName === '') {
                this.$vux.alert.show({
                    title: '提示',
                    content: '标题不能为空'
                })
            } else if (this.workContent === '') {
                this.$vux.alert.show({
                    title: '提示',
                    content: '工单内容不能为空'
                })
            } else {
                this.loadingShow = '1'
                this.$post('api/order/edit', {
                    id: this.id,
                    isBack: n,
                    receiver: this.receiver,
                    correlation: this.correlation,
                    workName: this.workName,
                    workType: parseInt(this.workType[0]),
                    workContent: this.workContent,
                    workEnclosure: this.fileList
                }).then(res => {
                    this.loadingShow = ''
                    if (res.data.data.res === 1) {
                        this.leaveMark = 1
                        this.$vux.alert.show({
                            title: '提示',
                            content: '操作成功'
                        })
                        if (n === 1) {
                            if (this.$route.query.tab === '1') {
                                sessionStorage.setItem('to_name', 'drafts-list')
                                this.$router.go(-1)
                                setTimeout(() => {
                                    removeOrder();// 清空工单缓存
                                    this.$router.replace('drafts-list')
                                }, 0)
                            } else if (this.$route.query.home === '1') {
                                removeOrder()
                                this.$router.replace('drafts-list')
                            } else {
                                this.$router.go(-1)
                            }
                        } else {
                            if (this.$route.query.tab === '1' || this.$route.query.type === '2') {
                                sessionStorage.setItem('to_name', 'send-list')
                                this.$router.go(-1)
                                setTimeout(() => {
                                    removeOrder()
                                    this.$router.replace('send-list')
                                }, 0)
                            } else if (this.$route.query.home === '1') {
                                removeOrder()
                                this.$router.replace('send-list')
                            } else {
                                this.$router.go(-1)
                            }
                        }
                    } else {
                        this.$vux.alert.show({
                            title: '提示',
                            content: res.data.msg || '操作失败'
                        })
                    }
                })
            }
        },
        fun () {
            // history.go(-1)
        }
    },
    mounted () {
        window.addEventListener('setItem', () => {
            this.loadingShow = sessionStorage.getItem('watchStorage')
        })
        this.init()
    },
    beforeRouteLeave (to, from, next) {
        if (this.leaveMark === 0) {
            this.$vux.confirm.show({
                content: '<strong>信息还未保存，确认要离开么？</strong>',
                onCancel () {
                    history.go(1)
                },
                onConfirm () {
                    next()
                }
            })
        } else if (this.leaveMark === 2) {
            this.cancelC()
            history.go(1)
        } else {
            next()
        }
    }
}
</script>
<style scoped>
    .file_model{display: inline-block; width: 50%; margin-bottom: 10px;}
    .file_name{display: inline-block; max-width: 80%; vertical-align: middle;}
    .file_close{display: inline-block;}
</style>
