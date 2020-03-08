<template>
    <div>
        <x-header :left-options="{showBack: false}" class="header_box">
            <span class="header_title">用户登录</span>
        </x-header>
        <div style="height:40px;"></div>
        <div class="login_box">
            <div class="login_logo">
                <div><img src="/static/img.logo/gs.png"/></div>
                移动端资料库
            </div>
            <div v-show="checkError" class="login_error">
                {{['登录失败','qq未绑定','非法请求','用户名或密码错误'][checkError]}}
            </div>
            <group class="user_name" :class="{'input_active':userInputClass}">
                <x-input v-model="frm.userName" type="text" placeholder="用户名"
                    style="font-size: 14px" @on-focus="userInputClass=true;" @on-blur="userInputClass=false">
                    <i slot="label" class="fa fa-user login_icon" :class="{'icon_focus':userInputClass}"></i>
                </x-input>
            </group>
            <group class="user_password" :class="{'input_active':passwordInputClass}">
                <x-input v-model="frm.password" type="password"
                    onpaste="return false" placeholder="登录密码"
                    style="font-size: 14px" @on-focus="passwordInputClass=true;" @on-blur="passwordInputClass=false">
                    <i slot="label" class="fa fa-lock login_icon" :class="{'icon_focus':passwordInputClass}"></i>
                </x-input>
            </group>
            <div class="login_options">
                <check-icon class="login_options_left" :value.sync="frm.rememberMe">
                    <span>记住用户名</span>
                </check-icon>
                <span class="login_options_right" @click="show = true">忘记密码</span>
                <alert v-model="show" title="提示">请联系管理员进行重置密码</alert>
            </div>
            <x-button class="login_button" @click.native="handleLoginSubmit">
                登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录
            </x-button>
            <x-button class="login_button login_button_weixin" @click.native="handleLoginSubmit">
                微信登录
            </x-button>
        </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie'
import '@/plugins/vux-from'
export default {
    name: 'login',
    data () {
        return {
            frm: {
                userName: '',
                password: '',
                rememberMe: false // 记住用户名
            },
            checkError: '', // 登录后的报错信息
            userInputClass: '', // 用户名输入框的样式控制
            passwordInputClass: '', // 密码输入框的样式控制

            userBorder: '',
            passwordBorder: '',
            userActive: '',
            passwordActive: '',
            show: false,
            userName: '',
            password: '',
            url: 'http:// oa.yunxi.cn/Login/QQConnect ? t=' + Math.ceil(Math.random() * 100)
        }
    },
    methods: {
        handleLoginSubmit () { // 点击登录
            if (Math.random() * 10 > 3) { // 伪造出错情况
                this.checkError = '3'
                return
            }
            this.$api.system.login(this.frm).then(res => {
                if (res) {
                    if (this.frm.rememberMe === true) {
                        Cookies.set('userName', this.userName)
                    }
                    this.$router.push({name: 'home_index'})
                } else {
                    this.checkError = '3'
                }
            })
        }
    },
    mounted () {
        if (Cookies.get('userName')) {
            this.userName = Cookies.get('userName')
            this.frm.rememberMe = true
        }
        this.checkError = window.location.href.substr(-1)
    }
}
</script>
<style lang="less" scoped>
.login_box{
    padding: 0 15%; text-align: center;
    .login_logo{
        padding: 40px 0 20px 0; font-size: 18px; color: #9A9A9A;
        img{ width: 30%;max-height:100px;margin-bottom: 10px;}
    }
    .login_error{
        color: red;font-size: 12px;text-align: left;padding: 0 10px;
    }
    .user_name .weui-cells{
        margin-top: 0;
        &:before{ border: none; }
    }
    .user_password .weui-cells{
        &:before{ border: none; }
    }
    .input_active .weui-cells:after{ border-color: #2599e4; }
    .icon_focus{ color: #2599e4; }
    .login_icon{ margin-right: 10px; }
    .login_options{
        font-size: 13px; height: 40px; line-height: 40px;
        .weui-icon-circle{ font-size: 18px; }
        .weui-icon-success{ font-size: 18px; }
        .login_options_left{ display: inline-block;float: left;}
        .login_options_right{ display: inline-block;float: right; }
        span{color: #9A9A9A;}
    }
    .login_button{
        margin-top: 20px; background-color: #0094eb;
        line-height: 36px; border-radius: 18px; color: #ffffff;
    }
    .login_button_weixin{
        background-color: #4CAF50;
    }
}
</style>
