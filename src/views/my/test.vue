<!--suppress ALL -->
<template>
    <div>
        <x-header @on-click-back="goHome" :left-options="{backText: '', preventGoBack: true}" style="background-color: #0094eb">测试</x-header>
        <div class="tc" style="padding-top: 20px">
            <p style="margin-bottom: 20px">触发次数：{{debounceNum}}</p>
            <button @click="deNum" class="btn">debounce</button> <button @click="debounce" class="btn" style="background-color: #ec8b89">保存配置</button>
            <div class="check_container">
                <div style="line-height: 35px" class="color_333">等待延迟（ms）</div>
                <checker v-model="delay" type="radio" default-item-class="unSelect" selected-item-class="isSelect">
                    <checker-item value="500">500</checker-item>
                    <checker-item value="1500">1500</checker-item>
                    <checker-item value="3000">3000</checker-item>
                </checker>
                <div style="line-height: 35px" class="color_333">最大延迟（ms）</div>
                <checker v-model="maxDelay" @on-change="getMax" type="radio" default-item-class="unSelect" selected-item-class="isSelect">
                    <checker-item value="0">无</checker-item>
                    <checker-item value="1000">1000</checker-item>
                    <checker-item value="3000">3000</checker-item>
                </checker>
                <div style="line-height: 35px" class="color_333">触发时机</div>
                <checker v-model="point" @on-change="getOpt" type="radio" default-item-class="unSelect" selected-item-class="isSelect">
                    <checker-item value="0">延迟尾</checker-item>
                    <checker-item value="1">延迟头</checker-item>
                </checker>
            </div>
        </div>
        <div class="grey_line"></div>
        <div class="tc" style="padding-top: 20px">
            <p style="margin-bottom: 20px">触发次数：{{throttleNum}}</p>
            <button @click="thNum" class="btn">throttle</button> <button @click="throttle" class="btn" style="background-color: #ec8b89">保存配置</button>
            <div class="check_container">
                <div style="line-height: 35px" class="color_333">等待延迟（ms）</div>
                <checker v-model="thDelay" type="radio" default-item-class="unSelect" selected-item-class="isSelect">
                    <checker-item value="500">500</checker-item>
                    <checker-item value="1500">1500</checker-item>
                    <checker-item value="3000">3000</checker-item>
                </checker>
                <div style="line-height: 35px" class="color_333">触发时机</div>
                <checker v-model="pointTh" @on-change="getOptTh" type="radio" default-item-class="unSelect" selected-item-class="isSelect">
                    <checker-item value="0">延迟尾</checker-item>
                    <checker-item value="1">延迟头</checker-item>
                </checker>
            </div>
        </div>
    </div>
</template>
<script>
import { XHeader } from 'vux'
import { PopupPicker, debounce, throttle, Checker, CheckerItem, Qrcode } from 'vux'
export default {
    name: 'invoice',
    components: { XHeader, PopupPicker, Checker, CheckerItem, Qrcode },
    data () {
        return {
            debounceNum: 0,
            deNum: '',
            delay: '500',
            maxDelay: '0',
            point: '0',
            opt: {
                'leading': false,
                'trailing': true
            },
            throttleNum: 0,
            thNum: '',
            thDelay: '500',
            pointTh: '0',
            optTh: {
                'leading': false,
                'trailing': true
            }
        }
    },
    methods: {
        goHome () {
            this.$router.replace({name: 'home_index'})
        },
        init () {
        },
        getOpt (v) {
            if (v === '0') {
                this.opt = {
                    'leading': false,
                    'trailing': true
                }
            } else {
                this.opt = {
                    'leading': true,
                    'trailing': false
                }
            }
        },
        getMax (v) {
            if (v === '0') {
                delete this.opt.maxWait
            } else {
                this.opt.maxWait = parseInt(v)
            }
        },
        de () {
            this.debounceNum++
        },
        debounce () {
            this.deNum = debounce(this.de, parseInt(this.delay), this.opt)
            this.$vux.toast.show({
                text: 'OK'
            })
        },
        getOptTh (v) {
            if (v === '0') {
                this.optTh = {
                    'leading': false,
                    'trailing': true
                }
            } else {
                this.optTh = {
                    'leading': true,
                    'trailing': false
                }
            }
        },
        th () {
            this.throttleNum++
        },
        throttle () {
            this.thNum = throttle(this.th, parseInt(this.thDelay), this.optTh)
            this.$vux.toast.show({
                text: 'OK'
            })
        }
    },
    mounted () {
        this.deNum = debounce(this.de, parseInt(this.delay), this.opt)
        this.thNum = throttle(this.th, parseInt(this.thDelay), this.optTh)
        this.init()
    }
}
</script>
<style scoped>
    .btn{ line-height: 30px; background-color: #0094eb; color: #fff;font-size: 16px; padding: 8px; border: none; outline: none;}
    .check_container{ padding: 10px 15px 15px 15px; font-size: 14px;}
    .unSelect{ padding: 5px 10px; margin: 5px; border: 1px solid #666; color: #666;}
    .isSelect{ padding: 5px 10px; margin: 5px; border: 1px solid #0094eb; background-color: #0094eb; color: #fff;}
</style>
