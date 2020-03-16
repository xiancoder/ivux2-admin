<template>
    <div class="tab_div">
        <div v-for="(row,index) in names" :key="row.name" @click="go(row.path)">
            <span :class="select === index+1 ? 'select' : ''">{{row.name}}</span>
        </div>
    </div>
</template>
<script>
export default {
    // dsf-2020-02-19 tab切换组件
    name: 'tab',
    props: {
        select: {
            type: Number,
            default: null
        },
        names: {
            type: Array,
            default: () => {return []}
        }
    },
    data () {
        return {
            newNotice: ''
        }
    },
    methods: {
        go (val) {
            this.$router.replace({path: val})
        }
    },
    mounted () {
    }
}
</script>
<style scoped lang="less">
    .tab_div{
        line-height:50px;
        display:flex;
        display:-webkit-flex;
        color: #333;
        font-size: 14px;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06);
        margin-bottom: 2px;
        div{
            flex:1;
            text-align:center;
            .select{
                display: inline-block;
                padding: 1px 18px 0 18px;
                background: #4A8BFF;
                border-radius: 18px;
                line-height: 20px;
                color:#fff;
            }
        }
    }
</style>
