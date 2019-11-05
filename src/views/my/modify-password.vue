<template>
    <div>
        <x-header :left-options="{backText: ''}" style="background-color: #0094eb">修改密码<a slot="right" style="color: #fff" @click="savePsd">保存</a></x-header>
        <div class="tel" style="padding-right: 15px">
            <group>
                <cell title="旧密码"><x-input type="password" placeholder="请输入当前密码" v-model="oldPsd" required ref="tel" text-align="right"></x-input></cell>
                <cell title="新密码"><x-input type="password" :is-type="password"  placeholder="8-20位字母+数字" v-model="newPsd" required ref="tel" :min="8" :max="20" text-align="right"></x-input></cell>
                <cell title="新密码确认"><x-input type="password" :is-type="password"  placeholder="请再次输入新密码" v-model="confirmPsd" required ref="tel" :min="8" :max="20" text-align="right" style="max-width: 150px"></x-input></cell>
                <cell></cell>
            </group>
        </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie'
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
                let num = /^( ? ![0-9]+$)( ? ![a-zA-Z]+$)[0-9A-Za-z]{8, 20}$/
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
                this.$post('api/my/pwd_modify', {
                    oldPwd: this.oldPsd,
                    newPwd: this.newPsd,
                    affirmPwd: this.confirmPsd
                }).then((res) => {
                    if (res.data.data.res === 1) {
                        this.$vux.alert.show({
                            title: '提示',
                            content: '操作成功'
                        })
                        this.$get('api/system/loginout', {
                        }).then((res) => {
                            if (res.data.data.res === 1) {
                                if (Cookies.get('type')) {
                                    window.$App.gologin()
                                } else {
                                    this.$router.replace({name: 'login'})
                                }
                            }
                        })
                    } else if (res.data.data.res === 0) {
                        this.$vux.alert.show({
                            title: '提示',
                            content: '操作失败'
                        })
                    } else {
                        this.$vux.alert.show({
                            title: '提示',
                            content: res.data.data
                        })
                    }
                })
            }
        }
    }
}
</script>
<style scoped>
    .tel .weui-cells{ font-size: 16px; margin-top: 0;}
    .tel .weui-cell{ height: 35px; padding-right: 0;}
    .tel .weui-cells:after{ border: none;}
    .tel .vux-cell-primary{ color: #333;}
    .tel .weui-cell__ft{ color: #666;}
</style>
