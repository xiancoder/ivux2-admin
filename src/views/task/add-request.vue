<template>
    <div>
        <x-header :left-options="{backText: ''}" style="background-color: #0094eb">追加需求<a slot="right" style="color: #fff" @click="saveAdd">保存</a></x-header>
        <div class="info_container">
            <group>
                <cell title="追加内容"></cell>
                <vue-html5-editor :content="addContent" @change="contentGet" :height="150" :z-index="100" class="task_content" style="margin-left: 15px"></vue-html5-editor>
                <cell title="附件" style="margin-top: 20px" primary="content">
                    <input ref="uploadFile" id="upFile" type="file" style="display: none">
                    <div class="select_style" @click="addFile">上传<img src="../../img/arrow.png"/></div>
                </cell>
                <div style="padding-left: 15px" v-if="fileList.length > 0">
                    <div v-for="(file, index) in fileList" :key="index" class="file_model" @click="removeFile(index)">
                        <div class="file_name text_overflow">{{file.name}}</div>
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
import {XHeader, Group, Cell, AlertPlugin, Loading, Icon} from 'vux'
Vue.use(AlertPlugin)
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
    name: 'add-request',
    components: { Group, Cell, XHeader, Loading, Icon},
    data () {
        return {
            addContent: '',
            fileList: [],
            loadingShow: ''
        }
    },
    methods: {
        init () {
            let self = this
            this.$refs.uploadFile.onchange = function () {
                if (this.files[0]) {
                    self.fileList.push(this.files[0])
                }
                let fileElem = document.getElementById('upFile')
                fileElem.value = ''
            }
        },
        contentGet (val) {
            this.addContent = val
        },
        addFile () {
            let fileElem = document.getElementById('upFile')
            return fileElem.click()
        },
        removeFile (index) {
            this.fileList.splice(index, 1)
        },
        saveAdd () {
            if (this.addContent === '') {
                this.$vux.alert.show({
                    title: '提示',
                    content: '追加内容不能为空！'
                })
            }  else {
                this.resetSetItem('watchStorage', '1')
                var fd = new FormData()
                fd.append('id', this.$route.query.taskId)
                fd.append('taskAddContent', this.addContent)
                for (let file in this.fileList) {
                    fd.append('file', this.fileList[file])
                }
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    timeout: 300000
                }
                axios.post('api/task/addneed', fd, config).then(res => {
                    this.resetSetItem('watchStorage', '0')
                    if (res.data.data.res === 1) {
                        this.$vux.alert.show({
                            title: '提示',
                            content: '操作成功'
                        })
                        this.$router.replace({name: 'task-info', query: {taskId: this.$route.query.taskId, role: '1'}})
                    } else {
                        this.$vux.alert.show({
                            title: '提示',
                            content: res.data.msg || '操作失败'
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
