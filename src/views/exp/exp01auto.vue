<template>
   <div class="exp-container">
        <x-header :left-options="{showBack:true,backText:''}" class="header_box header_fix">
            <span class="header_title">测试视频组件</span>
        </x-header>
        <div style="height:65px;"></div>
        <video src="/static/video.rain/1.mp4" style="width:100%" id="autovideo123"
            controls="controls" loop="loop"
            poster="/static/logo/gs.png">
            your browser does not support the video tag
        </video>
        <audio src="/static/video.rain/0.m4a" style="width:100%;" id="autoaudio123"
            controls="controls" loop="loop">
            Your browser does not support the audio element.
        </audio>
        <hr />
        <p></p>
        <p>切换浏览器到后台后 音频控件可以继续播放 视频控件会默认暂停 并触发暂停回调</p>
        <p>video标签可以设置自动播放，只需在标签设置autoplay即可。但是，设置自动播放是会有兼容性问题的，并不是所有机型都可以。</p>
        <p>1.我所遇到的，设置了autoply ios基本可以实现自动播放，但是要设置静音，即：没音频轨道，或者设置了muted属性。</p>
        <p>2.安卓的话，只有部分机型可以自动播放。而且不能模拟自动播放，一定要有用户行为才可以触发播放。</p>
        <hr />
        <pre>
            获取video对象
            Media = document.getElementById("media")
            Media方法和属性：
            HTMLVideoElement和HTMLAudioElement 均继承自HTMLMediaElement
            Media.error; //null:正常
            Media.error.code; //1.用户终止 2.网络错误 3.解码错误 4.URL无效
            //网络状态
            - Media.currentSrc; //返回当前资源的URL
            - Media.src = value; //返回或设置当前资源的URL
            - Media.canPlayType(type); //是否能播放某种格式的资源
            - Media.networkState; //0.此元素未初始化 1.正常但没有使用网络 2.正在下载数据 3.没有找到资源
            - Media.load(); //重新加载src指定的资源
            - Media.buffered; //返回已缓冲区域，TimeRanges
            - Media.preload; //none:不预载 metadata:预载资源信息 auto:
            //准备状态
            - Media.readyState;//1:HAVE_NOTHING 2:HAVE_METADATA 3.HAVE_CURRENT_DATA 4.HAVE_FUTURE_DATA 5.HAVE_ENOUGH_DATA
            - Media.seeking; //是否正在seeking
            //回放状态
            Media.currentTime = value; //当前播放的位置，赋值可改变位置
            Media.startTime; //一般为0，如果为流媒体或者不从0开始的资源，则不为0
            Media.duration; //当前资源长度 流返回无限
            Media.paused; //是否暂停
            Media.defaultPlaybackRate = value;//默认的回放速度，可以设置
            Media.playbackRate = value;//当前播放速度，设置后马上改变
            Media.played; //返回已经播放的区域，TimeRanges，关于此对象见下文
            Media.seekable; //返回可以seek的区域 TimeRanges
            Media.ended; //是否结束
            Media.autoPlay; //是否自动播放
            Media.loop; //是否循环播放
            Media.play(); //播放
            Media.pause(); //暂停
            //视频控制
            Media.controls;//是否有默认控制条
            Media.volume = value; //音量
            Media.muted = value; //静音
            TimeRanges(区域)对象
            TimeRanges.length; //区域段数
            TimeRanges.start(index) //第index段区域的开始位置
            TimeRanges.end(index) //第index段区域的结束位置
            //相关事件
            var eventTester = function(e){
                Media.addEventListener(e,function(){
                    console.log((new Date()).getTime(),e)
                },false)
            }
            eventTester("loadstart"); //客户端开始请求数据
            eventTester("progress"); //客户端正在请求数据
            eventTester("suspend"); //延迟下载
            eventTester("abort"); //客户端主动终止下载（不是因为错误引起）
            eventTester("loadstart"); //客户端开始请求数据
            eventTester("progress"); //客户端正在请求数据
            eventTester("suspend"); //延迟下载
            eventTester("abort"); //客户端主动终止下载（不是因为错误引起），
            eventTester("error"); //请求数据时遇到错误
            eventTester("stalled"); //网速失速
            eventTester("play"); //play()和autoplay开始播放时触发
            eventTester("pause"); //pause()触发
            eventTester("loadedmetadata"); //成功获取资源长度
            eventTester("loadeddata"); //
            eventTester("waiting"); //等待数据，并非错误
            eventTester("playing"); //开始回放
            eventTester("canplay"); //可以播放，但中途可能因为加载而暂停
            eventTester("canplaythrough"); //可以播放，歌曲全部加载完毕
            eventTester("seeking"); //寻找中
            eventTester("seeked"); //寻找完毕
            eventTester("timeupdate"); //播放时间改变
            eventTester("ended"); //播放结束
            eventTester("ratechange"); //播放速率改变
            eventTester("durationchange"); //资源长度改变
            eventTester("volumechange"); //音量改变
        </pre>
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
        const Video = document.getElementById('autovideo123')
        const Audio = document.getElementById('autoaudio123')
        let x = 0
        const doPlay = function () {
            x++
            if (x >= 2) { Video.play() } // 播放
        }
        Video.addEventListener('canplaythrough', function () {
            doPlay()
        }, false)
        Audio.addEventListener('canplaythrough', function () {
            doPlay()
        }, false)
        Video.addEventListener('play', function () {
            console.log((new Date()).getTime(), 'play')
            Audio.play()
        }, false)
        Video.addEventListener('pause', function () {
            console.log((new Date()).getTime(), 'pause')
            Audio.pause()
        }, false)
    }
}
</script>
<style scoped>
</style>
