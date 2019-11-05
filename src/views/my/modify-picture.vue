<template>
    <div>
        <x-header @on-click-back="goMy" :left-options="{backText: '', preventGoBack: true}" style="background-color: #0094eb">
            认证照片
            <a slot="right" style="color: #fff" @click="postImg" v-show="!img || imgFile">保存</a>
            <a slot="right" style="color: #fff" @click="turnImg" v-show="img && !imgFile">保存</a>
        </x-header>
        <div class="no_img" v-show="!img && isEmpty && !imgFile">
            <img src="../../img/add_img.png" @click="upImg">
            <div>请上传清晰的个人照片</div>
        </div>
        <div class="img_box" v-show="imgSrc" :style="{width: '100%', height: pWidth.toString()}">
            <img :src="imgSrc" style="max-width: 100%;max-height: 100%; image-orientation: from-image" @click="upImg">
        </div>
        <!--<viewer class="images" @inited="inited" :options="option" style="display: none">-->
            <!--<img :src="img + randomNum" class="user_img" id="img">-->
        <!--</viewer>-->
        <div :style="{backgroundImage: 'url(' + img + ')', backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', width: '100%', height: pWidth.toString(), transform: 'rotate(' + deg(angle) + ')'}" @click="upImg" v-show="!imgSrc && img"></div>
        <div class="textCen blue" style="margin-top: 30px" v-show="!imgSrc && img">
            <i class="fa fa-undo fa-2x" aria-hidden="true" style="margin-right: 30px" @click="left"></i>
            <i class="fa fa-repeat fa-2x" aria-hidden="true" @click="right"></i>
        </div>
        <div style="display: none">
            <input ref="uploadImg" id="upImg" type="file" accept="image/*">
        </div>
    </div>
</template>
<script>
import axios from 'axios'

export default {
    name: 'modify-picture',
    components: { },
    data () {
        return {
            imgFile: null,
            img: '',
            imgSrc: '',
            isEmpty: false,
            pWidth: sessionStorage.getItem('phoneWidth') + 'px',
            angle: 0,
            randomNum: ' ? t=' + Math.ceil(Math.random() * 10000),
            isEdit: false
            // showModal: false,
            // viewer: {},
            // option: {
            //     button: false, // 右上角按钮
            //     navbar: false, // 底部缩略图
            //     title: false, // 当前图片标题
            //     toolbar: {
            //         rotateLeft: { show: true, size: 'large', click: this.left},
            //         rotateRight: { show: true, size: 'large', click: this.right}
            //     }, // 底部工具栏
            //     movable: false, // 是否可以移动
            //     zIndex: 9999
            // }
        }
    },
    methods: {
        init () {
            this.getImg()
            const self = this
            this.$refs.uploadImg.onchange = function () {
                if (this.files[0]) {
                    self.$vux.loading.show({
                        text: 'Loading'
                    })
                    self.isEdit = true
                    self.imgFile = this.files[0]
                    reads(this.files[0])
                    function reads (fil) {
                        var reader = new FileReader()
                        reader.readAsDataURL(fil)
                        reader.onload = function () {
                            self.imgSrc = this.result
                            self.$vux.loading.hide()
                        }
                    }
                }
            }
        },
        goMy () {
            if (this.isEdit) {
                this.$vux.confirm.show({
                    content: '图片尚未保存，确定要离开吗？',
                    onCancel () {},
                    onConfirm () {
                        history.go(-1)
                    }
                })
            } else {
                history.go(-1)
            }
        },
        getImg () {
            this.$vux.loading.show({
                text: 'Loading'
            })
            this.$get('api/my/base_info', {
            }).then((res) => {
                if (res.data.data.result.userPicture) {
                    this.imgSrc = ''
                    this.img = res.data.data.result.userPicture + ' ? t=' + Math.ceil(Math.random() * 10000)
                    this.angle = parseInt(this.urlName(this.img))
                    this.imgFile = null
                    this.isEdit = false
                } else {
                    this.isEmpty = true
                }
                this.$vux.loading.hide()
            })
        },
        urlName (url) {
            let index = url.lastIndexOf('_')
            let index2 = url.lastIndexOf('.')
            let angle = url.substring(index + 1, index2)
            if (angle === 'picture') {
                return '0'
            } else {
                return angle
            }
        },
        deg (n) {
            return n + 'deg'
        },
        inited (viewer) {
            this.viewer = viewer
            const self = this
            this.$el.querySelector('.images').addEventListener('hide', function (e) {
                self.showModal = false
                let n = self.angle < 0 ? self.angle + 360 : self.angle
                self.angle = 0
                self.turnImg(n)
            })
        },
        showAction () {
            const self = this
            this.viewer.show()
            setTimeout(function () {
                self.viewer.rotate(90)
            }, 500)
            this.showModal = true
        }, left () {
            // this.viewer.rotate(-90)
            this.isEdit = true
            this.angle = this.angle - 90
            if (this.angle === -360) {
                this.angle = 0
            }
        }, right () {
            // this.viewer.rotate(90)
            this.isEdit = true
            this.angle = this.angle + 90
            if (this.angle === 360) {
                this.angle = 0
            }
        },
        upImg () {
            let fileElem = document.getElementById('upImg')
            return fileElem.click()
        },
        postImg () {
            if (this.imgFile === null) {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请先上传图片'
                })
            } else {
                this.$vux.loading.show({
                    text: 'Loading'
                })
                let fd = new FormData()
                fd.append('img', this.imgFile)
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    timeout: 300000
                }
                axios.post('api/my/userPicture', fd, config).then(res => {
                    this.$vux.loading.hide()
                    if (res.data.data.res === 1) {
                        this.$vux.alert.show({
                            title: '提示',
                            content: '操作成功'
                        })
                        this.getImg()
                    } else {
                        this.$vux.alert.show({
                            title: '提示',
                            content: res.data.msg || '操作失败'
                        })
                    }
                })
            }
        },
        turnImg () {
            this.$vux.loading.show({
                text: 'Loading'
            })
            this.$get('api/my/change_angle', {
                angle: this.angle < 0 ? this.angle + 360 : this.angle
            }).then(res => {
                this.$vux.loading.hide()
                if (res.data.data.res === 1) {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '操作成功'
                    })
                    this.getImg()
                } else {
                    this.$vux.alert.show({
                        title: '提示',
                        content: res.data.msg || '操作失败'
                    })
                }
            })
        }
    },
    mounted () {
        this.init()
    }
}
</script>
<style scoped>
    .no_img{ text-align: center; margin: 10% auto;}
    .img_box{display: flex; align-items: center; justify-content: center;}
</style>
