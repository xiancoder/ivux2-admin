<template>
    <div id="demo" class="tailor clear">
        <div class="img posiRel fl" v-show="imgShow">
            <img class="img " src="../../img/qq_active.png" alt="" @click="delShow = true;">
            <div class="mask" v-show="delShow" @click="delImg">
                <img class="del" src="../../img/delete.png">
            </div>
        </div>
        <div class="add fl" v-show="addShow">
            <span>+</span>
            <input class="imageInput" ref="imgValue" type="file"    accept="image/*" @change="change">
        </div>
        <div class="container" v-show="panel">
            <div><img id="image" :src="url" alt="Picture"></div>
            <button type="button" id="button" @click="crop">确定</button>
        </div>
    </div>
</template>
<script>
import {Icon} from 'vux'
import Cropper from 'cropperjs'
export default {
    // dsf-2019-6-6 上传图片
    name: 'up-image',
    components: {
        Icon
    },
    data () {
        return {
            // headerImage: '',
            picValue: '',
            cropper: '',
            croppable: false,
            panel: false,
            url: '',
            imgShow: false,
            delShow: false,
            addShow: true,
            only: false // 确认按钮点击一次
        }
    },
    methods: {
        delImg () {
            this.imgShow = false
            this.delShow = false
            this.addShow = true
            this.panel = false
            this.$refs.imgValue.value = ''
        },
        getObjectURL (file) {
            var url = null
            if (window.createObjectURL !=undefined) {
                // basic
                url = window.createObjectURL(file)
            } else if (window.URL !=undefined) {
                // mozilla(firefox)
                url = window.URL.createObjectURL(file)
            } else if (window.webkitURL !=undefined) {
                // webkit or chrome
                url = window.webkitURL.createObjectURL(file)
            }
            return url
        },
        change (e) {
            let files = e.target.files || e.dataTransfer.files
            if (!files.length) return
            this.panel = true
            this.picValue = files[0]
            this.url = this.getObjectURL(this.picValue)
            // 每次替换图片要重新得到新的url
            if (this.cropper) {
                this.cropper.replace(this.url)
            }
            this.panel = true
        },
        crop () {
            if (this.only) {
                console.log('???')
            } else {
                this.only = true
                this.$vux.loading.show({
                    text: 'Loading'
                })
                this.panel = false
                var croppedCanvas
                // var roundedCanvas
                if (!this.croppable) {
                    return
                }
                // Crop
                croppedCanvas = this.cropper.getCroppedCanvas()
                // Round
                // roundedCanvas = this.getRoundedCanvas(croppedCanvas)
                // this.headerImage = roundedCanvas.toDataURL()
                // this.postImg()
                croppedCanvas.toBlob(blob => {
                    var fd = new FormData()
                    fd.append('img', blob)
                    let config = {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    }
                    this.$post('api/my/userPhoto_add', fd, config).then(res => {
                        if (res.data.data.res === 1) {
                            this.imgShow = true
                            this.addShow = false
                        } else {
                            this.$vux.alert.show({
                                title: '提示',
                                content: res.data.data
                            })
                        }
                        this.$vux.loading.hide()
                        this.only = false
                    })
                })
            }
        },
        getRoundedCanvas (sourceCanvas) {
                var canvas = document.createElement('canvas')
                var context = canvas.getContext('2d')
                var width = sourceCanvas.width
                var height = sourceCanvas.height
                canvas.width = width
                canvas.height = height
                context.imageSmoothingEnabled = true
                context.drawImage(sourceCanvas, 0, 0, width, height)
                context.globalCompositeOperation = 'destination-in'
                context.beginPath()
                context.arc( width / 2, height / 2,
                        Math.min(width, height) / 2,
                        0,
                        2 * Math.PI,
                        true
                )
                context.fill()
                return canvas
        },
        postImg () {
                // 这边写图片的上传
        }
    },
    mounted () {
        // 初始化这个裁剪框
        var self = this
        var image = document.getElementById('image')
        this.cropper = new Cropper(image, {
                aspectRatio: 1 / 1,
                viewMode: 1, background: false,
                zoomable: false,
                ready: function () {
                        self.croppable = true
                }
        })
    }
}
</script>
<style lang='less'>
    .tailor .cropper-view-box,
    .cropper-face { border-radius: 4%;}
    .tailor .cropper-container { font-size: 0; line-height: 0; position: relative; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; direction: ltr; -ms-touch-action: none; touch-action: none;}
    .tailor .cropper-container img { /* Avoid margin top issue (Occur only when margin-top <= -height) */display: block; min-width: 0 !important; max-width: none !important; min-height: 0 !important; max-height: none !important; width: 100%; height: 100%; image-orientation: 0deg;}
    .tailor .cropper-wrap-box,
    .tailor .cropper-canvas,
    .tailor .cropper-drag-box,
    .tailor .cropper-crop-box,
    .tailor .cropper-modal { position: absolute; top: 0; right: 0; bottom: 0; left: 0;}
    .tailor .cropper-wrap-box { overflow: hidden;}
    .tailor .cropper-drag-box { opacity: 0; background-color: #fff;}
    .tailor .cropper-modal { opacity: 0.5; background-color: #000;}
    .tailor .cropper-view-box {display: block; overflow: hidden; width: 100%; height: 100%; outline: 1px solid #39f; outline-color: rgba(51, 153, 255, 0.75);}
    .tailor .cropper-dashed { position: absolute;display: block; opacity: 0.5; border: 0 dashed #eee;}
    .tailor .cropper-dashed.dashed-h { top: 33.33333%; left: 0; width: 100%; height: 33.33333%; border-top-width: 1px; border-bottom-width: 1px;}
    .tailor .cropper-dashed.dashed-v { top: 0; left: 33.33333%; width: 33.33333%; height: 100%; border-right-width: 1px; border-left-width: 1px;}
    .tailor .cropper-center { position: absolute; top: 50%; left: 50%;display: block; width: 0; height: 0; opacity: 0.75;}
    .tailor .cropper-center:before,
    .cropper-center:after { position: absolute;display: block; content: ' '; background-color: #eee;}
    .tailor .cropper-center:before { top: 0; left: -3px; width: 7px; height: 1px;}
    .tailor .cropper-center:after { top: -3px; left: 0; width: 1px; height: 7px;}
    .tailor .cropper-face,
    .tailor .cropper-line,
    .tailor .cropper-point { position: absolute;display: block; width: 100%; height: 100%; opacity: 0.1;}
    .tailor .cropper-face { top: 0; left: 0; background-color: #fff;}
    .tailor .cropper-line { background-color: #39f;}
    .tailor .cropper-line.line-e { top: 0; right: -3px; width: 5px; cursor: e-resize;}
    .tailor .cropper-line.line-n { top: -3px; left: 0; height: 5px; cursor: n-resize;}
    .tailor .cropper-line.line-w { top: 0; left: -3px; width: 5px; cursor: w-resize;}
    .tailor .cropper-line.line-s { bottom: -3px; left: 0; height: 5px; cursor: s-resize;}
    .tailor .cropper-point { width: 5px; height: 5px; opacity: 0.75; background-color: #39f;}
    .tailor .cropper-point.point-e { top: 50%; right: -3px; margin-top: -3px; cursor: e-resize;}
    .tailor .cropper-point.point-n { top: -3px; left: 50%; margin-left: -3px; cursor: n-resize;}
    .tailor .cropper-point.point-w { top: 50%; left: -3px; margin-top: -3px; cursor: w-resize;}
    .tailor .cropper-point.point-s { bottom: -3px; left: 50%; margin-left: -3px; cursor: s-resize;}
    .tailor .cropper-point.point-ne { top: -3px; right: -3px; cursor: ne-resize;}
    .tailor .cropper-point.point-nw { top: -3px; left: -3px; cursor: nw-resize;}
    .tailor .cropper-point.point-sw { bottom: -3px; left: -3px; cursor: sw-resize;}
    .tailor .cropper-point.point-se { right: -3px; bottom: -3px; width: 20px; height: 20px; cursor: se-resize; opacity: 1;}
    @media (min-width: 768px) {
        .tailor .cropper-point.point-se { width: 15px; height: 15px;}
    }
    @media (min-width: 992px) {
        .tailor .cropper-point.point-se { width: 10px; height: 10px;}
    }
    @media (min-width: 1200px) {
        .tailor .cropper-point.point-se { width: 5px; height: 5px; opacity: 0.75;}
    }
    .tailor .cropper-point.point-se:before { position: absolute; right: -50%; bottom: -50%;display: block; width: 200%; height: 200%; content: ' '; opacity: 0; background-color: #39f;}
    .tailor .cropper-invisible { opacity: 0;}
    .tailor .cropper-bg { background-image: url('data: image/png;base64, iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz// // TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');}
    .tailor .cropper-hide { position: absolute;display: block; width: 0; height: 0;}
    .tailor .cropper-hidden {display: none !important;}
    .tailor .cropper-move { cursor: move;}
    .tailor .cropper-crop { cursor: crosshair;}
    .tailor .cropper-disabled .cropper-drag-box,
    .tailor .cropper-disabled .cropper-face,
    .tailor .cropper-disabled .cropper-line,
    .tailor .cropper-disabled .cropper-point { cursor: not-allowed;}
</style>
<style scoped>
    * { margin: 0; padding: 0;}
    #demo #button { position: absolute; right: 10px; top: 10px; width: 80px; height: 40px; border: none; border-radius: 5px; background: white;}
    #demo .show { width: 100px; height: 100px; overflow: hidden; position: relative; border-radius: 50%; border: 1px solid #d5d5d5;}
    #demo .picture { width: 100%; height: 100%; overflow: hidden; background-position: center center; background-repeat: no-repeat; background-size: cover;}
    #demo .container { z-index: 99; position: fixed; padding-top: 60px; left: 0; top: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 1);}
    #demo #image { max-width: 100%;}
    .add {display: inline-block; width: 50px; height: 50px; text-align: center; line-height: 50px; font-size: 30px; cursor: pointer; border: 1px dashed #c7c5c5; color: #999; position: relative; border-radius: 10%;}
    .imageInput { width: 50px; height: 50px; position: absolute; left: 0; top: 0; opacity: 0;}
    .img{display: inline-block; width: 50px; height: 50px; border-radius: 10%; margin-right: 10px;}
    .posiRel{ position: relative;}
    .mask{ position: absolute; left: 0; top: 0; right: 0; bottom: 0; background: #000; opacity: .3; border-radius: 10%; text-align: center; vertical-align: middle;}
    .del{ width: 15px; margin-top: 16px;}
</style>
