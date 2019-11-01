<style>
    @import '../main.less';
</style>
<style scoped>
    .color999{ color: #999;}
</style>
<template>
    <div>
        <tabbar style="position: fixed" class="bottomTab">
            <tabbar-item :link="{path: '/home', replace: true}">
                <img slot="icon" :src="select === 1 ? require('../../img/home-active.png') : require('../../img/home.png')">
                <span slot="label" :class="select === 1 ? 'blue' : 'color999'">首页</span>
            </tabbar-item>
            <tabbar-item :link="{path: '/notice/list', replace: true}" :badge="unReadNum">
                <img slot="icon" :src="select === 2 ? require('../../img/notice-active.png') : require('../../img/notice.png')">
                <span slot="label" :class="select === 2 ? 'blue' : 'color999'">通知</span>
            </tabbar-item>
            <tabbar-item :link="{path: '/tel/list', replace: true}">
                <img slot="icon" :src="select === 3 ? require('../../img/telBook-active.png') : require('../../img/telBook.png')">
                <span slot="label" :class="select === 3 ? 'blue' : 'color999'">通讯录</span>
            </tabbar-item>
            <tabbar-item :link="{path: '/my', replace: true}">
                <img slot="icon" :src="select === 4 ? require('../../img/my-active.png') : require('../../img/my.png')">
                <span slot="label" :class="select === 4 ? 'blue' : 'color999'">我的</span>
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
    props: {
        select: {
            type: Number,
            default: () => null
        },
        unReadNum: {
            type: String,
            default: () => ''
        }
    },
    data () {
        return {
            newNotice: ''
        }
    }
}
</script>
