<template>
    <div>
        <x-header :left-options="{showBack:true,backText:''}" class="header_box">
            <span class="header_title">UI组件预览</span>
        </x-header>
        <div style="height:50px;"></div>
        <group title="基本尝试">
            <x-switch title="基本" v-model="show"></x-switch>
            <confirm v-model="show"
                :title="'普通弹框'"
                @on-cancel="onCancel" @on-confirm="onConfirm"
                @on-show="onShow" @on-hide="onHide">
                <p style="text-align:center;">Are you sure?</p>
            </confirm>

            <x-switch :title="'要求输入数字'" v-model="show3"></x-switch>
            <confirm v-model="show3" show-input
                :title="'请输入数字'" :input-attrs="{type: 'number'}"
                @on-cancel="onCancel" @on-confirm="onConfirm"
                @on-show="onShow" @on-hide="onHide">
            </confirm>

            <x-switch title="可以通过设置ref" v-model="show5"></x-switch>
            <confirm v-model="show5" show-input ref="confirm5"
                :title="'来手动复制'"
                @on-cancel="onCancel" @on-confirm="onConfirm5"
                @on-show="onShow5" @on-hide="onHide">
            </confirm>

            <x-switch :title="'安卓主题'" v-model="show2"></x-switch>
            <confirm v-model="show2" theme="android"
                title="安卓主题"
                @on-cancel="onCancel" @on-confirm="onConfirm"
                @on-show="onShow" @on-hide="onHide">
                <p style="text-align:center;">I miss u sunyi</p>
            </confirm>

            <x-switch :title="'手动关闭'" v-model="show4"></x-switch>
            <confirm v-model="show4"
                title="手动关闭" :close-on-confirm="false"
                @on-confirm="onConfirm4">
                <p style="text-align:center;">Are you sure?</p>
            </confirm>
        </group>
        <br>
        <div style="padding:15px;">
            <x-button @click.native="showPlugin" type="primary">显示</x-button>
        </div>
        <div style="padding:15px;">
            <x-button @click.native="showPlugin2" type="primary">挂载使用</x-button>
        </div>
        <div style="padding:15px;">
            <x-button @click.native="showPlugin3" type="primary">挂载使用2</x-button>
        </div>
    </div>
</template>

<script>
import { Confirm, Group, XSwitch, XButton, TransferDomDirective as TransferDom } from 'vux'
export default {
    directives: {
        TransferDom
    },
    components: {
        Confirm,
        Group,
        XSwitch,
        XButton
    },
    data () {
        return {
            show: false,
            show2: false,
            show3: false,
            show4: false,
            show5: false,
            show6: false
        }
    },
    methods: {
        onCancel () {
            console.log('on cancel')
        },
        onConfirm (msg) {
            console.log('on confirm')
            if (msg) {
                alert(msg)
            }
        },
        onConfirm4 () {
            console.log('on confirm')
            this.$vux.loading.show({
                transition: '',
                text: 'processing'
            })
            setTimeout(() => {
                this.$vux.loading.hide()
                this.show4 = false
            }, 1000)
        },
        onHide () {
            console.log('on hide')
        },
        onShow () {
            console.log('on show')
        },
        onShow5 () {
            this.$refs.confirm5.setInputValue('default')
        },
        onConfirm5 (value) {
            this.$refs.confirm5.setInputValue('')
            this.$vux.toast.text('input value: ' + value)
        },
        showPlugin () {
            this.$vux.confirm.show({
                title: 'Title',
                content: 'Content',
                onShow () {
                    console.log('plugin show')
                },
                onHide () {
                    console.log('plugin hide')
                },
                onCancel () {
                    console.log('plugin cancel')
                },
                onConfirm () {
                    console.log('plugin confirm')
                }
            })
        },
        showPlugin2 () {
            this.showPlugin()
        },
        showPlugin3 () {
            const _this = this
            this.$vux.confirm.prompt('123', {
                title: 'Title',
                onShow () {
                    console.log('promt show')
                    _this.$vux.confirm.setInputValue('set input value')
                },
                onHide () {
                    console.log('prompt hide')
                },
                onCancel () {
                    console.log('prompt cancel')
                },
                onConfirm (msg) {
                    alert(msg)
                }
            })
        }
    },
    mounted () {
    },
    beforeDestroy () {
    }
}
</script>
