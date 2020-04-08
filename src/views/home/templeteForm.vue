<template>
    <div>
        <x-header :left-options="{showBack:true,backText:''}" class="header_box header_fix">
            <span class="header_title">表单页模版01</span>
        </x-header>
        <div style="height:50px;"></div>
        <group title="静态文本">
            <cell title="账号" :value="'胜利和誓约'" @click.native="onClick"></cell>
            <cell title="余额 (加载效果)" :is-loading="!money" :value="money" @click.native="onClick"></cell>
            <cell title="提现 (禁用样式)" disabled is-link></cell>
            <cell>
                <span slot="title" style="color:green;">
                    <span style="vertical-align:middle;">自定义格式</span>
                    <badge text="1"></badge>
                </span>
                <div>
                    <span style="color: green;vertical-align:middle;">自定义格式</span>
                </div>
            </cell>
        </group>
        <group label-width="5em" title="label宽度可调">
            <cell title="默认" primary="content" value="long long long longlong longlong longlong longlong longlong longlong longlong longlong long"></cell>
            <cell title="顶对齐" align-items="flex-start" value="long long long longlong longlong longlong longlong longlong longlong longlong longlong long"></cell>
        </group>
        <group title="折叠">
            <cell
                title="折叠内容" is-link :border-intent="false" :arrow-direction="showContent002 ? 'up' : 'down'"
                @click.native="showContent002 = !showContent002">
            </cell>
            <template v-if="showContent002">
                <cell-form-preview :border-intent="false" :list="list"></cell-form-preview>
            </template>
        </group>
        <group title="链接">
            <cell title="跳转" link="/component/radio" inline-desc='link="/component/radio"'></cell>
        </group>

        <group title="多选">
            <cell title="多选" :value="demo4" is-link @click.native="showPopup=true"></cell>
            <div v-transfer-dom>
                <popup v-model="showPopup" class="checker-popup">
                    <div style="padding:10px 10px 40px 10px;">
                        <p style="padding: 5px 5px 5px 2px;color:#888;">Colors</p>
                        <checker v-model="demo4" default-item-class="demo4-item" selected-item-class="demo4-item-selected"
                            disabled-item-class="demo4-item-disabled">
                            <checker-item :value="'花跟叶'" @on-item-click="onItemClick"> 花跟叶 </checker-item>
                            <checker-item :value="'鸟与树'" @on-item-click="onItemClick"> 鸟与树 </checker-item>
                            <checker-item :value="'我和你'" @on-item-click="onItemClick"> 我和你 </checker-item>
                            <checker-item :value="'全套礼品装'" disabled @on-item-click="onItemClick"> 全套礼品装 </checker-item>
                        </checker>
                    </div>
                </popup>
            </div>
            <cell title="单选常见例子">
            </cell>
            <div style=" padding: 5px 6px; ">
                <checker v-model="demo5" default-item-class="demo5-item"
                    selected-item-class="demo5-item-selected" >
                    <checker-item v-for="i in [1, 2, 3]" :key="i" :value="i">￥{{i*300}}</checker-item>
                </checker>
            </div>
            <cell title="多选常见例子"></cell>
            <div style=" padding: 5px 6px; ">
                <checker v-model="demo6" type="checkbox" default-item-class="demo5-item"
                    selected-item-class="demo5-item-selected" >
                    <checker-item v-for="i in [1, 2, 3]" :key="i" :value="i">{{['good', 'nice','awesome'][i - 1]}}</checker-item>
                </checker>
            </div>
        </group>

        <group title="基本尝试">
            <x-switch title="基本" v-model="show1"></x-switch>
            <actionsheet
                v-model="show1" :menus="menus1"
                @on-click-menu="click"
                @on-after-hide="log('打开')" @on-after-show="log('关闭')">
            </actionsheet>
        </group>
    </div>
</template>
<script>
import {
    Cell, Actionsheet, Group, XSwitch, Toast, Badge, CellFormPreview, Popup, TransferDom,
    Checker, CheckerItem
} from 'vux'
export default {
    directives: {
        TransferDom
    },
    components: {
        Cell,
        Actionsheet,
        Group,
        XSwitch,
        Toast,
        Badge,
        CellFormPreview,
        Popup,
        Checker, CheckerItem
    },
    data () {
        return {
            money: '', // 余额
            showContent002: false, // 折叠内容
            list: [{ label: 'Apple', value: '3.29' }, { label: 'Banana', value: '1.04' }, { label: 'Fish', value: '8.00' }],
            showPopup: false, // 多选弹框
            demo4: [], // 多选
            demo5: '', // 单选
            demo6: [], // 多选


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
        onItemClick (value, disabled) {
            if (!this.disabled) {
                this.showPopup = false
            }
        },
        onClick (str) {
            this.$vux.loading.show({
                text: 'processing'
            })
            setTimeout(() => {
                this.$vux.loading.hide()
                this.show8 = false
            }, 1000)
        },
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
    .demo4-item { background-color: #ddd; color: #222; font-size: 14px; padding: 5px 10px; margin: 0 5px 5px 0; line-height: 18px; border-radius: 15px; }
    .demo4-item-selected { background-color: #FF3B3B; color: #fff; }
    .demo4-item-disabled { color: #999; }

    .demo5-item { width: 100px; height: 26px; line-height: 26px; text-align: center; border-radius: 3px; border: 1px solid #ccc; background-color: #fff; margin-right: 6px; }
    .demo5-item-selected { background: #ffffff; border-color: #ff4a00; }
</style>
