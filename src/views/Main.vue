<template>
    <div>
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <bottom-menu :select="select+1" :unReadNum="$store.state.unReadNum" v-if="menu_show"></bottom-menu>
    </div>
</template>
<script>
import bottomMenu from './components/bottom-menu.vue'
export default {
    components: {bottomMenu},
    data () {
        return {
            show_list: ['home_index', 'notice-list', 'tel-book', 'my']
        }
    },
    computed: {
        menu_show: function () {
            return this.show_list.indexOf(this.$route.name) !== -1
        },
        select: function () {
            return this.show_list.indexOf(this.$route.name)
        }
    },
    mounted () {
        const phoneHei = document.documentElement.clientHeight || document.body.clientHeight
        sessionStorage.setItem('phoneHeight', phoneHei)
        const phoneWid = document.documentElement.clientWidth || document.body.clientWidth
        sessionStorage.setItem('phoneWidth', phoneWid)
        // 未读消息条数
        this.$get('api/message/have', {
        }).then((res) => {
            const n = res.data.data.res
            const unReadNum = n === 0 ? '' : n + ''
            this.$store.commit('setUnReadNum', unReadNum)
        })
    }
}
</script>
<style lang="less">
    @import '../style/main.less';
</style>
