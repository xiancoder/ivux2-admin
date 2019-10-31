<template>
    <div>
    <!-- 循环抄送人 -->
    <p class="copier" v-show="cclist.length > 0">抄送人</p>
    <div class="scroll_container">
        <div class="loopSendOut scroll_list">
            <div v-for="(row, index) in cclist" :key="index" class="cc_model">
                <img class="members_portrait" style="float: none" v-if="row.userPhoto" :src="row.userPhoto" />
                <span class="members_portrait" style="float: none;margin-bottom: 6px" v-if="!row.userPhoto">{{row.correlationUserName | firstName}}</span>
                <span class="CCName">{{row.correlationUserName}}</span>
            </div>
        </div>
    </div>
    </div>
</template>
<script>
import { Icon, Popup, Search } from 'vux'
export default {
    // 详情-抄送人 组件
    name: 'ccInfo',
    components: { Icon, Popup, Search},
    props: {
        cclist: Array
    },
    data () {
        return {
        }
    },
    filters: {
        firstName: function (value) { // 截取字符串的第一个
            return value.substr(0, 1)
        }
    },
    methods: {
    },
    mounted () {
    }
}
</script>
<style lang="less">
    @import '../main.less';
</style>
<style scoped>
.copier{ color: #666; font-size: 14px; width: 90%; margin: 0 auto; border-top: 1px solid #f0f0f0; padding-top: 10px;}
</style>
