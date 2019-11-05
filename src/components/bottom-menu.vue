<template>
    <div>
        <tabbar style="position: fixed" class="bottomTab">
            <tabbar-item :link="{path:'/home',replace: true}">
                <img slot="icon" :src="select===1?require('../img/home-active.png'):require('../img/home.png')">
                <span slot="label" :class="computeClass(1)">首页</span>
            </tabbar-item>
            <tabbar-item :link="{path:'/notice/list',replace: true}" :badge="unReadNum">
                <img slot="icon" :src="select===2?require('../img/notice-active.png'):require('../img/notice.png')">
                <span slot="label" :class="computeClass(2)">通知</span>
            </tabbar-item>
            <tabbar-item :link="{path:'/tel/list',replace:true}">
                <!-- <img slot="icon" :src="computeImg(3, '../img/telBook.png')"> -->
                <img slot="icon" :src="select===3?require('../img/telBook-active.png'):require('../img/telBook.png')">
                <span slot="label" :class="computeClass(3)">通讯录</span>
            </tabbar-item>
            <tabbar-item :link="{path:'/my',replace:true}">
                <img slot="icon" :src="select===4?require('../img/my-active.png'):require('../img/my.png')">
                <span slot="label" :class="computeClass(4)">我的</span>
            </tabbar-item>
        </tabbar>
    </div>
</template>
<script>
import {Tabbar, TabbarItem} from 'vux'
export default {
    // dsf-2019-10-21 底部菜单组件
    name: 'button-menu',
    components: {Tabbar, TabbarItem},
    data () {
        return { }
    },
    props: {
        select: { type: Number, default: () => null },
        unReadNum: { type: String, default: () => '' }
    },
    methods: {
        computeImg (num, url) {
            if (this.select === num) { url = url.replace('.png', '-active.png') }
            return require('' + url)
        },
        computeClass (num) {
            return this.select === num ? 'blue' : 'color999'
        }
    }
}
</script>
