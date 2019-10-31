<template>
    <div>
        <x-header :left-options="{backText: ''}" class="header_fix">
            回复工单
            <div slot="right" style="color: #fff">
                <span @click="orderReply">回复</span>
            </div>
        </x-header>
        <div class="header_blank"></div>
        <group style="margin-top: -20px">
            <x-textarea v-model="content" placeholder="请输入内容（必填）" :rows="9" style="font-size: 14px"></x-textarea>
        </group>
        <div class="info_container" style="border-bottom: 1px solid #eeeeee">
            <group>
                <cell title="附件" primary="content">
                    <input ref="uploadFile" id="upFile" type="file" style="display: none">
                    <div class="select_style" @click="addFile">点击上传<img src="../../img/arrow_grey.jpg"/></div>
                </cell>
                <div style="padding-left: 15px" v-if="fileList.length > 0">
                    <div v-for="(file, index) in fileList" :key="index" class="file_model" @click="removeFile(index)">
                        <div class="file_name text_overflow">{{urlName(file)}}</div>
                        <icon class="file_close" type="clear"></icon>
                    </div>
                </div>
            </group>
        </div>
        <loading :show="loadingShow === '1'" text="Loading"></loading>
    </div>
</template>
<script>
import axios from 'axios'
import {urlToLink} from '../../libs/common.js'
import { XHeader, Group, Cell, Loading, XTextarea, Icon } from 'vux'
export default {
    name: 'order-reply',
    components: {
        Group, Cell, XHeader, Loading, XTextarea, Icon
    },
    data () {
        return {
            id: this.$route.query.id,
            content: '',
            fileList: [],
            urlName: function (url) {
                let index = url.lastIndexOf('_')
                url = url.substring(index + 1, url.length)
                return url
            },
            loadingShow: ''
        }
    },
    methods: {
        init () {
            let self = this
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
        },
        addFile () {
            return this.$refs.uploadFile.click()
        },
        removeFile (index) {
            this.fileList.splice(index, 1)
        },
        orderReply () {
            if (this.content === '') {
                this.$vux.alert.show({
                    title: '提示',
                    content: '回复内容不能为空'
                })
            } else {
                this.loadingShow = '1'
                this.$post('api/order/reply', {
                    id: parseInt(this.id),
                    content: urlToLink(this.content),
                    enclosure: this.fileList
                }).then((res) => {
                    this.loadingShow = ''
                    if (res.data.data && res.data.data.res === 1) {
                        this.$vux.alert.show({
                            title: '提示',
                            content: '操作成功'
                        })
                        this.$router.go(-1)
                        this.$router.replace({name: 'order-info', query: {id: this.id, handle: '1', ending: this.$route.query.send}})
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
