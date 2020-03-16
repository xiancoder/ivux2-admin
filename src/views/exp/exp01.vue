<template>
   <div class="exp-container">
        <x-header :left-options="{showBack:true,backText:''}" class="header_box header_fix">
            <span class="header_title">测试视频组件</span>
        </x-header>
        <div style="height:65px;"></div>
        <video src="https://www.w3school.com.cn/i/movie.ogg" style="width:100%"
            controls="controls" poster="/static/logo.png">
            your browser does not support the video tag
        </video>
        <p>出现问题 使用外来链接 在手机端未播放前显示不出来</p>
        <video src="/static/rain1.mp4" style="width:100%"
            controls="controls" autoplay="autoplay" loop="loop"
            poster="/static/logo.png">
            your browser does not support the video tag
        </video>
        <audio src="/static/0.m4a" controls="controls" autoplay="autoplay">
            Your browser does not support the audio element.
        </audio>
    </div>
</template>
<script>
export default {
    data () {
        return {
        }
    },
    methods: {
    },
    mounted () {
    }
}
</script>
<style scoped>
</style>
