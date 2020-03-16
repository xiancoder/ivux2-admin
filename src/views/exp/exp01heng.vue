<template>
   <div class="exp-container">
        <div id="whatfuck">
            <video src="/static/rain1.mp4" style="width:100%"
                controls="controls" loop="loop"
                poster="/static/logo.png">
                your browser does not support the video tag
            </video>
        </div>
    </div>
</template>
<script>
/**
* 横竖屏
* @param {Object}
*/
function changeOrientation ($print) {
    var width = document.documentElement.clientWidth
    var height = document.documentElement.clientHeight
    $print.style.position = 'absolute'
    $print.style.background = 'red'
    if (width < height) {
        $print.style.width = height + 'px'
        $print.style.height = width + 'px'
        $print.style.top = 0
        $print.style.left = width + 'px'
        $print.style.transform = 'rotate(90deg)'
        $print.style.transformOrigin = '0 0'
    }
    var evt = 'onorientationchange' in window ? 'orientationchange' : 'resize'
    window.addEventListener(evt, function () {
        setTimeout(function () {
            var width = document.documentElement.clientWidth
            var height = document.documentElement.clientHeight
            // - ?
            if (width > height) {
                $print.style.width = width + 'px'
                $print.style.height = width + 'px'
                $print.style.top = 0
                $print.style.left = 0
                $print.style.transform = 'none'
                $print.style.transformOrigin = '0 0'
            } else {
                $print.style.width = height + 'px'
                $print.style.height = width + 'px'
                $print.style.top = 0
                $print.style.left = width + 'px'
                $print.style.transform = 'rotate(90deg)'
                $print.style.transformOrigin = '0 0'
            }
        }, 300)
    }, false)
}

export default {
    data () {
        return {
        }
    },
    methods: {
    },
    mounted () {
        changeOrientation(document.getElementById('whatfuck'))
    }
}
</script>
<style scoped>
</style>
