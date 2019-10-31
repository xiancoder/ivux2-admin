<template>
    <div>
        <x-header class="fix_header" :left-options="{backText: ''}" :right-options="{showMore: true}" @on-click-more="addImg" style="background-color: #0094eb">我的头像</x-header>
        <div class="mask" :style="{minHeight: bodyHeight+'px'}">
            <div class="photo_center">
                <img :src="src + randomNum" style="max-width: 100%" v-show="userInfo.userPhoto">
                <div class="name_photo" v-show="!userInfo.userPhoto">{{fName}}</div>
            </div>
        </div>
        <div style="display: none"><input type="file" id="change" accept="image" @change="change"></div>
    </div>
</template>
<script>
import { XHeader } from 'vux'
export default {
    name: 'my-photo',
    components: {
        XHeader
    },
    data () {
        return {
            randomNum: ' ? t=' + Math.ceil(Math.random() * 10000),
            photoImg: {},
            userInfo: {},
            fName: '',
            src: '',
            bodyHeight: ''
        }
    },
    methods: {
        init () {
            this.bodyHeight = document.body.clientHeight
            this.getInfo()
        },
        getInfo () {
            this.$get('api/my/detail_info', {
            }).then((res) => {
                this.userInfo = res.data.data.result
                this.fName = this.userInfo.userName[0]
                if (this.userInfo.userPhoto) {
                    this.src = this.userInfo.userPhoto.replace(/_60/g, '')
                }
            })
        },
        // 获取本地图片路径
        getObjectURL (file) {
            var url = null
            if (window.createObjectURL!=undefined) { // basic
                url = window.createObjectURL(file)
            } else if (window.URL!=undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file)
            } else if (window.webkitURL!=undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file)
            }
            return url
        },
        change (e) {
            let files = e.target.files || e.dataTransfer.files
            if (!files.length) return
            this.picValue = files[0]
            const url = this.getObjectURL(this.picValue)
            this.$router.push({name: 'photo-edit', query: {url: url}})
        },
        addImg () {
            var fileElem = document.getElementById('change')
            return fileElem.click()
        }
    },
    mounted () {
        this.init()
    }
}
</script>
<style scoped>
    .fix_header{ position: fixed; width: 100%;}
    .mask{ min-height: 100%; background-color: rgba(0, 0, 0, 0.3);}
    .photo_center{ margin: 0 auto; text-align: center; padding: 25% 0 15% 0;}
    .name_photo{display: inline-block; width: 100px; height: 100px; line-height: 100px; border-radius: 50px; text-align: center; background-color: #fff; color: #0094eb;}
</style>
