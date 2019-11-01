<template>
    <div>
        <div class="login_container">
            <div class="logo_container">
                <div style="margin-bottom: 10px"><img src="../../img/logo.png"/></div>
                云袭移动OA
            </div>
        </div>
        <a class="download_button" target="frame" href="http:// oa.yunxi.cn/file/app/android/yunxioa.apk" download="" @click="weChat">点击下载APK</a>
        <iframe name="frame" style="display: none"></iframe>
    </div>
</template>
<script>
export default {
    name: 'download',
    methods: {
        isWx () {// 判断是否为微信
            var ua = window.navigator.userAgent.toLowerCase()
            return ua.match(/MicroMessenger/i) === 'micromessenger'
        },
        weChat () {
            if (this.isWx()) {// 判断浏览器是否微信
                alert('请点击右上角选择在浏览器中打开')
            }
        },
        type () {
            var ua = navigator.userAgent.toLowerCase()
            if (ua.match(/iPhone\sOS/i) === 'iphone os' || ua.match(/iPad/i) == 'ipad') {// ios
                window.location.href = 'http:// oa-wap.yunxi.cn/#/login'
            }
        }
    },
    mounted () {
        this.type()
    }
}
</script>
<style scoped>
    .login_container{ padding: 15%; text-align: center;}
    .logo_container{ padding: 40px 0 20px 0; font-size: 18px; color: #9A9A9A;}
    .logo_container img{ width: 30%;}
    .download_button{display: block; width: 80%; text-align: center; margin: 0 auto; height: 50px; line-height: 50px; border-radius: 25px; font-size: 18px; color: #ffffff; background-color: #0094eb;}
</style>
