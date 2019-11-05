<template>
    <div class="tab_div">
        <div v-for="(row, index) in names" :key="row.name" @click="go(row.router)">
            <span :class="select === index+1 ? 'select' : ''">{{row.name}}</span>
        </div>
    </div>
</template>
<script>
import {removeOrder} from '../../libs/common.js'
export default {
    // dsf-2019-10-25 tab切换组件
    name: 'tab',
    props: {
        select: { type: Number, default: () => null },
        names: { type: Array, default: () => [] }
    },
    data () {
        return {
            newNotice: ''
        }
    },
    methods: {
        go (name) {
            removeOrder()
            this.$router.replace(name)
        }
    },
    mounted () {
    }
}
</script>
<style scoped lang="less">
    .tab_div{ line-height: 50px;display: flex;display: -webkit-flex; color: #333; font-size: 14px;
        div{ flex: 1; text-align: center;
            .select{display: inline-block; padding: 1px 8px 0 8px; background: #4A8BFF; border-radius: 18px; line-height: 20px; color: #fff;}
        }
    }
</style>
