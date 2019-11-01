<template>
    <div>
        <x-header :left-options="{backText: ''}" style="background-color: #0094eb">写跟进<a slot="right" style="color: #fff" @click="addFollow">保存</a></x-header>
        <div class="add_cusName" style="padding: 16px 0 16px 15px;line-height: 18px;font-size: 16px;color: #333;border-bottom: 1px solid #e1e1e1">
            <span style="display: inline-block;border-left: 2px solid #0094eb">&nbsp;</span>{{cusName}}
        </div>
        <div class="info_container" style="padding: 15px">
            <XTextarea v-model="content" :show-counter="false" style="border: 1px solid #d9d9d9;min-height: 70px;border-radius: 5px" placeholder="跟进内容"></XTextarea>
            <div style="margin-top: 10px">
                <div class="follow_img" v-for="(img, index) in imgSrc" :key="index" v-show="imgSrc.length > 0">
                    <x-icon type="ios-close" size="15" @click="removeImg(index)" style="position: absolute;right: 0;top: 0"></x-icon>
                    <img :src="img">
                </div>
                <div class="follow_img" v-show="fileList.length > 0">
                    <x-icon type="ios-close" size="15" @click="removeFile" style="position: absolute;right: 0;top: 0"></x-icon>
                    <img src="../../img/file.png">
                </div>
            </div>
            <div class="add_upload">
                <div style="display: none">
                    <input ref="uploadImg" id="upImg" type="file" multiple accept="image/*">
                    <input ref="uploadFile" id="upFile" type="file">
                </div>
                <div style="margin-right: 30px;touch-action: none" @click="addImg"><img src="../../img/uploadImg.png"><div>上传图片</div></div>
                <div style="touch-action: none" @click="addFile"><img src="../../img/uploadFile.png"><div>上传附件</div></div>
            </div>
            <group style="margin-left: -15px">
                <popup-picker popup-title="合作状态" placeholder="请选择" show-name :columns="1" title="合作状态" :data="statusList" v-model="cusStatus"></popup-picker>
                <popup-picker v-show="!noContact" popup-title="联系人" placeholder="请选择" show-name :columns="1" title="联系人" :data="contactList" v-model="contact"></popup-picker>
                <cell title="联系人" value="暂无联系人" primary="content" v-show="noContact"></cell>
                <cell title="跟进方式"></cell>
            </group>
            <div class="add_method">
                <div><img src="../../img/greyQQ.png" @click="changeWay(2)" v-show="way !== 2"/><img src="../../img/qq_active.png" v-show="way === 2"/></div>
                <div><img src="../../img/greyMail.png" @click="changeWay(3)" v-show="way !== 3"/><img src="../../img/mail_active.png" v-show="way === 3"/></div>
                <div><img src="../../img/greyTel.png" @click="changeWay(0)" v-show="way !== 0"/><img src="../../img/tel_active.png" v-show="way === 0"/></div>
                <div><img src="../../img/greyMeet.png" @click="changeWay(4)" v-show="way !== 4"/><img src="../../img/face_active.png" v-show="way === 4"/></div>
                <div><img src="../../img/greyWechat.png" @click="changeWay(1)" v-show="way !== 1"/><img src="../../img/wechat_active.png" v-show="way === 1"/></div>
            </div>
        </div>
        <loading :show="loadingShow === '1'" text="Loading"></loading>
    </div>
</template>
<script>
import axios from 'axios'
import {XHeader, Group, Cell, XInput, XTextarea, PopupPicker, Loading} from 'vux'
export default {
    name: 'add-follow',
    components: {Group, Cell, XHeader, XTextarea, PopupPicker, Loading},
    data () {
        return {
            cusId: '',
            cusName: '',
            imgSrc: [],
            imgList: [],
            fileList: [],
            statusList: [{name: '未合作', value: '0'}, {name: '已合作', value: '1'}, {name: '已终止', value: '3'}],
            cusStatus: [],
            contactList: [],
            contact: [],
            content: '',
            way: 0,
            noContact: false,
            loadingShow: ''
        }
    },
    methods: {
        init () {
            // 获取联系人信息
            if (this.$route.query.contactId) {
                this.$get('api/home/contactdetail', {
                    id: this.$route.query.contactId
                }).then((res) => {
                    let data = res.data.data.result
                    this.cusId = data.cusId
                    this.cusName = data.busName
                    this.cusStatus.push(data.teamWorkStatus + '')
                    this.contactList = [{name: data.name, value: data.id + ''}]
                    this.contact = [data.id + '']
                })
            } else {
                this.cusId = this.$route.query.companyId
                this.cusName = this.$route.query.companyName
                this.cusStatus.push(this.$route.query.status + '')
                // 获取联系人下拉框
                this.$get('api/customer/contacter', {
                    id: this.$route.query.companyId
                }).then((res) => {
                    const data = res.data.data.list
                    this.noContact = data.length === 0
                    for (let i = 0; i < data.length; i++) {
                        this.contactList.push({value: '', name: ''})
                        this.contactList[i].value = data[i].id + ''
                        this.contactList[i].name = data[i].name
                    }
                })
            }
            const self = this
            this.$refs.uploadImg.onchange = function () {
                var file = this.files // 读取文件
                for (var i = 0; i < file.length; i++) {
                    self.imgList.push(file[i])
                    reads(file[i])
                }
                function reads (fil) {
                    var reader = new FileReader()
                    reader.readAsDataURL(fil)
                    reader.onload = function () {
                        self.imgSrc.push(this.result)
                    }
                }
            }
            this.$refs.uploadFile.onchange = function () {
                self.fileList.push(this.files[0])
            }
        },
        addImg () {
            var fileElem = document.getElementById('upImg')
            return fileElem.click()
        },
        addFile () {
            var fileElem = document.getElementById('upFile')
            if (fileElem.value !== '') {
                this.$vux.alert.show({
                    title: '提示',
                    content: '只能上传一个文件'
                })
                return
            }
            return fileElem.click()
        },
        removeImg (index) {
            this.imgSrc.splice(index, 1)
            this.imgList.splice(index, 1)
            var fileElem = document.getElementById('upImg')
            fileElem.value = ''
        },
        removeFile () {
            this.fileList.splice(0, 1)
            var fileElem = document.getElementById('upFile')
            fileElem.value = ''
        },
        changeWay (num) {
            this.way = num
        },
        addFollow () {
            if (this.content === '') {
                this.$vux.alert.show({
                    title: '提示',
                    content: '跟进内容不能为空！'
                })
            } else if (this.way === '') {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请选择跟进方式！'
                })
            } else {
                this.resetSetItem('watchStorage', '1')
                var fd = new FormData()
                fd.append('cusId', this.cusId)
                fd.append('content', this.content)
                fd.append('way', this.way)
                fd.append('contact', this.contact[0])
                fd.append('teamWorkStatus', this.cusStatus[0])
                for (var i = 0; i < this.imgList.length; i++) {
                    fd.append('img', this.imgList[i])
                }
                if (this.fileList.length > 0) {
                    fd.append('file', this.fileList[0])
                }
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    timeout: 300000
                }
                axios.post('api/customer/followup_add', fd, config).then(res => {
                    this.resetSetItem('watchStorage', '0')
                    if (res.data.data.res === 1) {
                        this.$vux.alert.show({
                            title: '提示',
                            content: '操作成功'
                        })
                        if (this.$route.query.contactId) {
                            if (this.$route.query.mark) {
                                this.$router.replace({name: 'contact-list'})
                            } else {
                                this.$router.replace({name: 'private-contact', query: {companyId: this.cusId}})
                            }
                        } else {
                            this.$router.replace({name: 'private-info', query: {companyId: this.$route.query.companyId}})
                        }
                    } else {
                        this.$vux.alert.show({
                            title: '提示',
                            content: res.data.data
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
    .add_cusName{ overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
    .add_upload{ margin-top: 10px;display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */display: -moz-box; /* Firefox 17- */display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */display: -moz-flex; /* Firefox 18+ */display: -ms-flexbox; /* IE 10 */display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */ -webkit-box-pack: end; -moz-justify-content: flex-end; -webkit-justify-content: flex-end; justify-content: flex-end;}
    .add_upload>div{ text-align: center; font-size: 13px; color: #666;}
    .add_upload img{display: inline-block; width: 40px; height: 40px;}
    .add_method{display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */display: -moz-box; /* Firefox 17- */display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */display: -moz-flex; /* Firefox 18+ */display: -ms-flexbox; /* IE 10 */display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */ -webkit-box-pack: center; -moz-justify-content: space-around; -webkit-justify-content: space-around; justify-content: space-around; margin-top: 10px;}
    .add_method>div{ text-align: center;}
    .add_method img{display: inline-block; width: 40px; height: 40px;}
</style>
