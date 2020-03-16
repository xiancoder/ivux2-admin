<template>
    <div class="exp-container">
        <x-header :left-options="{showBack:true,backText:''}" class="header_box header_fix">
            <span class="header_title">视频插件</span>
        </x-header>
        <div style="height:65px;"></div>
        <div class='demo'>
            <video-player class="video-player vjs-custom-skin" ref="videoPlayer"
                :playsinline="true"
                :options="playerOptions"
                 @play="onPlayerPlay($event)"
                 @pause="onPlayerPause($event)"
                 @ended="onPlayerEnded($event)"
                 @waiting="onPlayerWaiting($event)"
                 @playing="onPlayerPlaying($event)"
                 @loadeddata="onPlayerLoadeddata($event)"
                 @timeupdate="onPlayerTimeupdate($event)"
                 @canplay="onPlayerCanplay($event)"
                 @canplaythrough="onPlayerCanplaythrough($event)"

                 @statechanged="playerStateChanged($event)"
                 @ready="playerReadied">
            </video-player>
        </div>
        <p>这里需要注意，我们如果按照官网上的方式如上代码所示引入，会报错找不到video.js/dist/video-js.css。</p>
        <p>这里我们只需要将引入video-js.css的路径改为vue-video-player/node_modules/video.js/dist/video-js.css。</p>
    </div>
</template>
<script>
import '@/plugins/vue-video-player'

export default {
    data () {
        return {
            playerOptions: {
                // 播放速度
                playbackRates: [0.5, 1.0, 1.5, 2.0],
                // 如果true,浏览器准备好时开始回放。
                autoplay: false,
                //  默认情况下将会消除任何音频。
                muted: false,
                // 导致视频一结束就重新开始。
                loop: false,
                // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                preload: 'auto',
                language: 'zh-CN',
                // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。
                // 值应该代表一个比例 - 用冒号分隔的两个数字（例如'16:9'或'4:3'）
                aspectRatio: '16:9',
                // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                fluid: true,
                sources: [{
                    // 类型
                    type: 'video/mp4',
                    // url地址
                    src: '/static/video.rain/1.mp4'
                }],
                // 你的封面地址
                poster: '/static/img.logo/gs.png',
                width: document.documentElement.clientWidth, // 播放器宽度
                // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
                notSupportedMessage: '此视频暂无法播放，请稍后再试',
                controlBar: {
                    timeDivider: true,
                    durationDisplay: true,
                    remainingTimeDisplay: false,
                    // 全屏按钮
                    fullscreenToggle: true
                }
            }
        }
    },
    methods: {
        // listen event
        onPlayerPlay (player) {
            console.log('onPlayerPlay', player)
        },
        onPlayerPause (player) {
            console.log('onPlayerPause', player)
        },
        onPlayerEnded (player) {
            console.log('onPlayerEnded', player)
        },
        onPlayerWaiting (player) {
            console.log('onPlayerWaiting', player)
        },
        onPlayerPlaying (player) {
            console.log('onPlayerPlaying', player)
        },
        onPlayerLoadeddata (player) {
            console.log('onPlayerLoadeddata', player)
        },
        onPlayerTimeupdate (player) {
            console.log('onPlayerTimeupdate', player)
        },
        onPlayerCanplay (player) {
            console.log('onPlayerCanplay', player)
        },
        onPlayerCanplaythrough (player) {
            console.log('onPlayerCanplaythrough', player)
        },
        // or listen state event
        playerStateChanged (playerCurrentState) {
            console.log('playerStateChanged', playerCurrentState)
        },
        // player is ready
        playerReadied (player) {
            console.log('playerReadied', player)
        }
    }
}
</script>
<style scoped>
    .demo{ display: inline-block; width: 100%; height: auto; text-align: center; line-height: 100px; border: 1px solid transparent; border-radius: 4px; overflow: hidden; background: #fff; position: relative; box-shadow: 0 1px 1px rgba(0, 0, 0, .2); margin-right: 4px; }
    .demo:hover{ display: block; }
</style>
