<style>
    .sign .weui-cells{ font-size: 16px; margin-top: 0;}
    .sign .weui-cell{ height: 35px; padding-right: 0;}
    .sign .weui-cells:after{ border: none;}
    .sign .vux-cell-primary{ color: #333;}
    .sign .weui-cell__ft{ color: #666;}
</style>
<template>
    <div>
        <x-header :left-options="{backText: ''}" style="background-color: #0094eb">设置授权密码<a slot="right" style="color: #fff" @click="savePsd">下一步</a></x-header>
        <div class="sign" style="padding-right: 15px">
            <group>
                <cell title="新授权密码"><x-input type="text" :is-type="password"  placeholder="6位数字" v-model="newPsd" required ref="tel" :min="6" :max="6" text-align="right" style="max-width: 150px"></x-input></cell>
                <cell title="新密码确认"><x-input type="text" :is-type="password"  placeholder="请再次输入新密码" v-model="confirmPsd" required ref="tel" :min="6" :max="6" text-align="right" style="max-width: 150px"></x-input></cell>
                <cell></cell>
            </group>
        </div>
        <div style="padding: 0 15px">说明：授权密码非登录密码，使用落款时可使用授权密码进行授权。</div>
    </div>
</template>
<script>
import { XHeader, Group, Cell, XInput } from 'vux'
export default {
    name: 'sign-setpass',
    components: {
        Group,
        Cell,
        XHeader,
        XInput
    },
    data () {
        return {
            newPsd: '',
            confirmPsd: '',
            password: function (value) {
                let num = /^[0-9]\d*$/
                return {
                    valid: num.test(value),
                    msg: '密码格式错误'
                }
            }
        }
    },
    methods: {
        savePsd () {
            if (this.newPsd === '' || this.confirmPsd === '') {
                this.$vux.toast.show({
                    text: '密码不能为空',
                    type: 'text'
                })
            } else if (!this.$refs.tel.valid) {
                this.$vux.toast.show({
                    text: '请检查密码格式',
                    type: 'text'
                })
            } else if (this.newPsd !== this.confirmPsd) {
                this.$vux.toast.show({
                    text: '两次输入的密码不一致',
                    type: 'text'
                })
            } else {
                this.$router.replace({name: 'sign-setting', query: {ps: this.newPsd, cps: this.confirmPsd}})
            }
        }
    }
}
</script>
