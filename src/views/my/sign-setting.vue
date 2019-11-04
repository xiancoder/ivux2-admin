<template>
    <div>
        <x-header :left-options="{backText: ''}" style="background-color: #0094eb;z-index: 999">设置落款</x-header>
        <div class="signatureBox">
            <div class="canvasBox" ref="canvasHW">
                <canvas @touchstart='touchStart' @touchmove='touchMove' @touchend='touchEnd'
                    ref="canvasF" @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp">
                </canvas>
                <div class="btnBox">
                    <span>请横转手机后设置落款</span>
                    <button @click="overwrite">清除</button>
                    <button @click="saveSign">提交</button>
                </div>
            </div>
        </div>
        <loading :show="loadingShow" text="Loading"></loading>
    </div>
</template>
<script>
import {Loading} from 'vux'
export default {
    name: 'sign-setting',
    components: {Loading},
    data () {
        return {
            points: [],
            canvasTxt: null,
            startX: 0,
            startY: 0,
            moveY: 0,
            moveX: 0,
            endY: 0,
            endX: 0,
            w: null,
            h: null,
            isDown: false,
            loadingShow: false
        }
    },
    created () {
    },
    mounted () {
        setTimeout(() => {
            let canvas = this.$refs.canvasF
            canvas.height = this.$refs.canvasHW.offsetHeight
            canvas.width = this.$refs.canvasHW.offsetWidth
            this.canvasTxt = canvas.getContext('2d')
            this.canvasTxt.lineWidth = 3
        }, 1000)
    },
    methods: {
        // 电脑设备事件
        mouseDown (ev) {
            ev = ev || event
            ev.preventDefault()
            if (1 !== 2) {
                let obj = {
                    x: ev.offsetX,
                    y: ev.offsetY
                }
                this.startX = obj.x
                this.startY = obj.y
                this.canvasTxt.beginPath()
                this.canvasTxt.moveTo(this.startX, this.startY)
                this.canvasTxt.lineTo(obj.x, obj.y)
                this.canvasTxt.stroke()
                this.canvasTxt.closePath()
                this.points.push(obj)
                this.isDown = true
            }
        },
        // 移动设备事件
        touchStart (ev) {
            ev = ev || event
            ev.preventDefault()
            if (ev.touches.length === 1) {
                let obj = {
                    x: ev.targetTouches[0].clientX,
                    y: ev.targetTouches[0].clientY - 48
                }
                this.startX = obj.x
                this.startY = obj.y
                this.canvasTxt.beginPath()
                this.canvasTxt.moveTo(this.startX, this.startY)
                this.canvasTxt.lineTo(obj.x, obj.y)
                this.canvasTxt.stroke()
                this.canvasTxt.closePath()
                this.points.push(obj)
            }
        },
        // 电脑设备事件
        mouseMove (ev) {
            ev = ev || event
            ev.preventDefault()
            if (this.isDown) {
                let obj = {
                    x: ev.offsetX,
                    y: ev.offsetY
                }
                this.moveY = obj.y
                this.moveX = obj.x
                this.canvasTxt.beginPath()
                this.canvasTxt.moveTo(this.startX, this.startY)
                this.canvasTxt.lineTo(obj.x, obj.y)
                this.canvasTxt.stroke()
                this.canvasTxt.closePath()
                this.startY = obj.y
                this.startX = obj.x
                this.points.push(obj)
            }
        },
        // 移动设备事件
        touchMove (ev) {
            ev = ev || event
            ev.preventDefault()
            if (ev.touches.length === 1) {
                let obj = {
                    x: ev.targetTouches[0].clientX,
                    y: ev.targetTouches[0].clientY - 48
                }
                this.moveY = obj.y
                this.moveX = obj.x
                this.canvasTxt.beginPath()
                this.canvasTxt.moveTo(this.startX, this.startY)
                this.canvasTxt.lineTo(obj.x, obj.y)
                this.canvasTxt.stroke()
                this.canvasTxt.closePath()
                this.startY = obj.y
                this.startX = obj.x
                this.points.push(obj)
            }
        },
        // 电脑设备事件
        mouseUp (ev) {
            ev = ev || event
            ev.preventDefault()
            if (1 !== 2) {
                let obj = {
                    x: ev.offsetX,
                    y: ev.offsetY
                }
                this.canvasTxt.beginPath()
                this.canvasTxt.moveTo(this.startX, this.startY)
                this.canvasTxt.lineTo(obj.x, obj.y)
                this.canvasTxt.stroke()
                this.canvasTxt.closePath()
                this.points.push(obj)
                this.points.push({x: -1, y: -1})
                this.isDown = false
            }
        },
        // 移动设备事件
        touchEnd (ev) {
            ev = ev || event
            ev.preventDefault()
            if (ev.touches.length === 1) {
                let obj = {
                    x: ev.targetTouches[0].clientX,
                    y: ev.targetTouches[0].clientY - 48
                }
                this.canvasTxt.beginPath()
                this.canvasTxt.moveTo(this.startX, this.startY)
                this.canvasTxt.lineTo(obj.x, obj.y)
                this.canvasTxt.stroke()
                this.canvasTxt.closePath()
                this.points.push(obj)
                this.points.push({x: -1, y: -1})
            }
        },
        // 重写
        overwrite () {
            this.canvasTxt.clearRect(0, 0, this.$refs.canvasF.width, this.$refs.canvasF.height)
            this.points = []
        },
        isCanvasBlank (canvas) {
            var blank = document.createElement('canvas');// 系统获取一个空canvas对象
            blank.width = canvas.width
            blank.height = canvas.height
            return canvas.toDataURL() === blank.toDataURL();// 比较值相等则为空
        },
        saveSign () {
            let canvas = this.$refs.canvasF
            if (this.isCanvasBlank(canvas)) {
                this.$vux.toast.show({
                    type: 'text',
                    text: '请绘制落款'
                })
            } else {
                if (this.$route.query.ps) {
                    this.loadingShow = true
                    this.$post('api/my/signature_up', {
                        pwd: this.$route.query.ps,
                        repwd: this.$route.query.cps,
                        img: canvas.toDataURL()
                    }).then((res) => {
                        this.loadingShow = false
                        if (res.data.data && res.data.data.res === 1) {
                            this.$vux.alert.show({
                                title: '提示',
                                content: '操作成功'
                            })
                            this.$router.replace({name: 'my-sign'})
                        } else {
                            this.$vux.alert.show({
                                title: '提示',
                                content: res.data.msg || '操作失败'
                            })
                        }
                    })
                } else {
                    this.loadingShow = true
                    this.$post('api/my/signature_change', {
                        img: canvas.toDataURL()
                    }).then((res) => {
                        this.loadingShow = false
                        if (res.data.data && res.data.data.res === 1) {
                            this.$vux.alert.show({
                                title: '提示',
                                content: '操作成功'
                            })
                            this.$router.replace({name: 'my-sign'})
                        } else {
                            this.$vux.alert.show({
                                title: '提示',
                                content: res.data.msg || '操作失败'
                            })
                        }
                    })
                }
            }
        }
    }
}
</script>
<style scoped>
    .signatureBox{ position: absolute; top: 45px; left: 0; width: 100%; height: 92%; box-sizing: border-box; overflow: hidden; background: #fff; z-index: 100;}
    .canvasBox{ padding: 15px; box-sizing: border-box; height: 92%;}
    canvas{ border: 1px solid #0094eb; width: 100%; height: 100%;}
    .btnBox{ height: 30px; padding: 5px; text-align: right; line-height: 30px;}
    .btnBox span{ font-size: 14px; color: red; margin-right: 20px;}
    .btnBox button:first-of-type{ border: 1px solid #0094eb; background: transparent; border-radius: 4px; padding: 5px 10px;}
    .btnBox button:last-of-type{ border: 1px solid #0094eb; background: #0094eb; color: #fff; border-radius: 4px; padding: 5px 10px;}
</style>
