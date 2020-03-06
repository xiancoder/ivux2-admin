<template>
    <div>
        <x-header :left-options="{showBack:true,backText:''}" class="header_box">
            <span class="header_title">UI组件预览</span>
        </x-header>
        <div style="height:50px;"></div>
        <group title="基本尝试">
            <x-switch title="基本" v-model="show1"></x-switch>
            <actionsheet
                v-model="show1" :menus="menus1"
                @on-click-menu="click"
                @on-after-hide="log('打开')" @on-after-show="log('关闭')">
            </actionsheet>

            <x-switch title="Android风格" v-model="show7"></x-switch>
            <actionsheet
                v-model="show7" :menus="menus1" theme="android"
                @on-click-menu="click"
                @on-after-hide="log('打开')" @on-after-show="log('关闭')">
            </actionsheet>

            <x-switch title="显示取消按钮" v-model="show2"></x-switch>
            <actionsheet v-model="show2" :menus="menus2"
                @on-click-menu="click" show-cancel
                @on-after-hide="log('打开')" @on-after-show="log('关闭')">
            </actionsheet>

            <x-switch title="花样菜单" v-model="show5"></x-switch>
            <actionsheet v-model="show5" :menus="menus5"
                @on-click-menu="click5" show-cancel>
            </actionsheet>

            <x-switch title="点击遮罩不关闭" v-model="show4"></x-switch>
            <actionsheet v-model="show4" :menus="menus1"
                :close-on-clicking-mask="false"
                show-cancel @on-click-mask="console('点了没用')">
            </actionsheet>

            <x-switch title="数据写入事件" v-model="show3"></x-switch>
            <actionsheet v-model="show3" :menus="menus3"
                @on-click-menu="click" show-cancel
                @on-click-menu-delete="showSuccess=true">
            </actionsheet>
            <toast v-model="showSuccess">Deleted~</toast>

            <x-switch title="手动关闭" v-model="show8"></x-switch>
            <actionsheet v-model="show8"
                :menus="menus8" @on-click-menu="demo8doClose"
                :close-on-clicking-mask="false" :close-on-clicking-menu="false">
            </actionsheet>
        </group>
    </div>
</template>
<script>
import { Actionsheet, Group, XSwitch, Toast } from 'vux'
export default {
    components: {
        Actionsheet,
        Group,
        XSwitch,
        Toast
    },
    data () {
        return {
            show1: false,
            menus1: {
                menu1: '北京烤鸭',
                menu2: '陕西油泼面',
                menu3: '西安肉夹馍'
            },
            show2: false,
            menus2: {
                menu1: 'Take Photo',
                menu2: 'Choose from photos'
            },
            show3: false,
            show4: false,
            show5: false,
            show6: false,
            show7: false,
            show8: false,
            menus5: [
                { label: '普通', type: 'info' },
                { label: '预制', type: 'primary', value: 'primary', otherProp: 'hey' },
                { label: '警报', type: 'warn' },
                { label: '禁用', type: 'disabled' },
                { label: '默认' }
            ],
            menu7: {
                menu1: '北京烤鸭',
                menu2: '陕西油泼面',
                menu3: '西安肉夹馍'
            },
            showSuccess: false,
            menus3: {
                menu1: '北京烤鸭',
                menu2: '陕西油泼面',
                delete: '<span style="color:red">Delete</span>'
            },
            menus8: {
                menu1: 'Close me',
                menu2: 'Close me'
            }
        }
    },
    methods: {
        log (str) {
            console.log(str)
        },
        demo8doClose () {
            this.$vux.loading.show({
                text: 'processing'
            })
            setTimeout(() => {
                this.$vux.loading.hide()
                this.show8 = false
            }, 1000)
        },
        console (msg) {
            console.log(msg)
        },
        click (key) {
            console.log(key)
        },
        click5 (key, item) {
            console.log(key, item)
        }
    }
}
</script>
<style>
</style>
