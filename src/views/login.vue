<style>
    .user_name .weui-cells{ margin-top: 0;}
    .user_name .weui-cells:before{ border: none;}
    .user_password .weui-cells:before{ border: none;}
    .input_active .weui-cells:after{ border-color: #2599e4;}
    .options .weui-icon-circle{ font-size: 18px;}
    .options .weui-icon-success{ font-size: 18px;}
</style>
<template>
    <div>
        <x-header :left-options="{showBack: false}" style="background-color: #0094eb">用户登录</x-header>
        <div class="login_container">
            <div class="logo_container">
                <div style="margin-bottom: 10px"><img src="../img/logo.png"/></div>
                云袭移动OA
            </div>
            <div v-show="checkError === '3'" style="color: red;font-size: 12px;text-align: left;padding: 0 10px">用户名或密码错误</div>
            <div v-show="checkError === '0'" style="color: red;font-size: 12px;text-align: left;padding: 0 10px">登录失败</div>
            <div v-show="checkError === '1'" style="color: red;font-size: 12px;text-align: left;padding: 0 10px">qq未绑定</div>
            <div v-show="checkError === '2'" style="color: red;font-size: 12px;text-align: left;padding: 0 10px">非法请求</div>
            <group class="user_name" :class="userBorder">
                <x-input v-model="userName" type="text" placeholder="邮箱" style="font-size: 14px" @on-focus="emailFocus" @on-blur="emailBlur">
                    <i slot="label" class="fa fa-user login_icon" :class="userActive"></i>
                </x-input>
            </group>
            <group class="user_password" :class="passwordBorder">
                <x-input v-model="password" type="password" onpaste="return false" placeholder="登录密码（8-20位数字+字母）" style="font-size: 14px" @on-focus="passwordFocus" @on-blur="passwordBlur">
                    <i slot="label" class="fa fa-lock login_icon" :class="passwordActive"></i>
                </x-input>
            </group>
            <div class="options">
                <check-icon :value.sync="storeName" style="display: inline-block;float: left"><span style="color: #9A9A9A">记住用户名</span></check-icon>
                <span style="display: inline-block;float: right;color: #9A9A9A" @click="show = true">忘记密码</span>
                <alert v-model="show" title="提示">请联系管理员进行重置密码</alert>
            </div>
            <XButton class="login_button" @click.native="userLogin">登 录</XButton>
            <!--<div class="qq_login">-->
                <!--其他方式登录-->
                <!--<div style="margin-top: 15px"><a :href="url" style="display: inline-block;height: 50px"><img src="../img/qq.png"/></a></div>-->
            <!--</div>-->
        </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie'
import { axios } from './axiosTool'
import { XHeader, XInput, Group, XButton, CheckIcon, Alert} from 'vux'
export default {
    components: { XHeader, XInput, XButton, Group, CheckIcon, Alert},
    name: 'login',
    data () {
        return {
            checkError: '',
            userBorder: '',
            passwordBorder: '',
            userActive: '',
            passwordActive: '',
            storeName: false,
            show: false,
            userName: '',
            password: '',
            url: 'http:// oa.yunxi.cn/Login/QQConnect ? t=' + Math.ceil(Math.random() * 100)
        }
    },
    methods: {
        emailFocus () {
            this.userActive = 'icon_focus'
            this.userBorder = 'input_active'
        },
        emailBlur () {
            this.userActive = ''
            this.userBorder = ''
        },
        passwordFocus () {
            this.passwordActive = 'icon_focus'
            this.passwordBorder = 'input_active'
        },
        passwordBlur () {
            this.passwordActive = ''
            this.passwordBorder = ''
        },
        userLogin () {
            this.$post('api/system/login', {
                userName: this.userName,
                pwd: this.password
            }).then((res) => {
                if (res.data.data.res === 1) {
                    if (this.storeName === true) {
                        Cookies.set('userName', this.userName)
                    }
                    this.$router.push({
                        name: 'home_index'
                    })
                } else {
                    this.checkError = '3'
                }
            })
        },
        // qqLogin () {
        //     var url = 'http:// oa.yunxi.cn/Login/QQConnect ? t=' + Math.ceil(Math.random() * 100)
        //     QC.Login.showPopup({
        //         appId: '101368423',
        //         redirectURI: url
        //     })
        // }
    },
    mounted () {
        if (Cookies.get('userName')) {
            this.userName = Cookies.get('userName')
            this.storeName = true
        }
        this.checkError = window.location.href.substr(-1)
    }
}
</script>
<style lang="less" scoped>
    .login_container{ padding: 0 15%; text-align: center;}
    .logo_container{ padding: 40px 0 20px 0; font-size: 18px; color: #9A9A9A;}
    .logo_container img{ width: 30%;}
    .icon_focus{ color: #2599e4; }
    .login_icon{ margin-right: 10px;}
    .options{ font-size: 13px; height: 40px; line-height: 40px;}
    .login_button{ margin-top: 30px; background-color: #0094eb; line-height: 36px; border-radius: 18px; color: #ffffff;}
    .qq_login{ font-size: 13px; color: #9A9A9A; margin-top: 15px;}
    .qq_login img{ width: 50px;}
</style>
