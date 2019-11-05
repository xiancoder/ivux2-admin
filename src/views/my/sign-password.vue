<template>
    <div>
        <x-header :left-options="{backText: ''}" style="background-color: #0094eb">修改授权密码<a slot="right" style="color: #fff" @click="savePsd">保存</a></x-header>
        <div class="sign" style="padding-right: 15px">
            <group>
                <cell title="旧授权密码"><x-input type="text" :is-type="password" placeholder="请输入当前密码" v-model="oldPsd" required ref="tel" :min="6" :max="6"  text-align="right"></x-input></cell>
                <cell title="新授权密码"><x-input type="text" :is-type="password"  placeholder="6位数字" v-model="newPsd" required ref="tel" :min="6" :max="6" text-align="right"></x-input></cell>
                <cell title="新密码确认"><x-input type="text" :is-type="password"  placeholder="请再次输入新密码" v-model="confirmPsd" required ref="tel" :min="6" :max="6" text-align="right" style="max-width: 150px"></x-input></cell>
                <cell></cell>
            </group>
        </div>
        <div style="padding: 0 15px">说明：授权密码非登录密码，使用落款时可使用授权密码进行授权。</div>
    </div>
</template>
<script>
import {Group, Cell, XInput} from 'vux'
export default {
    name: 'modify-password',
    components: {Group, Cell, XInput},
    data () {
        return {
            oldPsd: '',
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
            if (this.oldPsd === '' || this.newPsd === '' || this.confirmPsd === '') {
                this.$vux.alert.show({
                    title: '提示',
                    content: '密码不能为空！'
                })
            } else if (!this.$refs.tel.valid) {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请检查密码格式！'
                })
            } else if (this.newPsd !== this.confirmPsd) {
                this.$vux.alert.show({
                    title: '提示',
                    content: '两次输入的新密码不一致！'
                })
            } else {
                this.$post('api/my/signature_change_pwd', {
                    oldPwd: this.oldPsd,
                    newPwd: this.newPsd,
                    affirmPwd: this.confirmPsd
                }).then((res) => {
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
</script>
<style scoped>
    .sign .weui-cells{ font-size: 16px; margin-top: 0;}
    .sign .weui-cell{ height: 35px; padding-right: 0;}
    .sign .weui-cells:after{ border: none;}
    .sign .vux-cell-primary{ color: #333;}
    .sign .weui-cell__ft{ color: #666;}
</style>
