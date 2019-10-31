<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
import { Loading } from 'vux'
import { mapState } from 'vuex'
export default {
    name: 'app',
    components: {
        Loading
    }
}
</script>
<style lang="less">
    @import '~vux/src/styles/reset.less';
    @import '~vux/src/styles/1px.less';
</style>
