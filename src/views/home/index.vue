<template>
    <div>
        <x-header :left-options="{showBack: false, preventGoBack: true}" class="header_box">
            <span class="header_title">用户登录</span>
        </x-header>
        <div style="height:50px;"></div>
        <scroller v-show="response.list.length>0" class="pad15" ref="scroll" height="-105"
            lock-x :scroll-bottom-offst="200" @on-scroll-bottom="loadData()">
            <div>
                <div v-if="!response.list.length" style="color: #9a9a9a;margin-top: 100px;text-align: center;">
                    <p> 暂无数据</p>
                </div>
                <x-table :cell-bordered="false" :content-bordered="true">
                    <thead>
                        <tr style="background-color: #F7F7F7">
                            <th style="text-align: left;">&nbsp;&nbsp;路由</th>
                            <th style="width:60px;text-align: right;">操作&nbsp;&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row) in response.list" :key="row.id">
                            <td style="text-align: left;"> &nbsp;&nbsp;{{row.title || '-'}} <!-- <span style="font-size:12px;">({{row.name || '-'}})</span> --> </td>
                            <td style="text-align: right;"> <span @click="gotoPage(row.path)" style="color: #4A8BFF;">跳转</span>&nbsp;&nbsp; </td>
                        </tr>
                    </tbody>
                </x-table>
                <load-more v-show="loading" tip="loading"></load-more>
                <divider v-show="noMore && response.list.length>0">没有更多数据</divider>
            </div>
        </scroller>
        <menu-bottom :select="1"></menu-bottom>
    </div>
</template>
<script>
import noData from '@/components/no-data'
import router from '@/router/routers.home'
import exp from '@/router/routers.exp'
import menuBottom from '@/components/menu-bottom.vue'
import '@/plugins/vux-table'
export default {
    components: { noData, menuBottom },
    data () {
        return {
            groupTotal: 0, // 总群数
            fullTotal: 0, // 已满群数
            userTotal: 0, // 群总人数
            names: [
                {name: '实时群', path: '/realTimeQun'},
                {name: '已满群', path: '/gratifiedQun'}
            ],
            pageIndex: 1,
            response: {
                list: [],
                rowcount: null
            },
            first: 1, // 是否首次加载
            firstload: true, // 首次加载loading
            loading: false,
            noMore: false,
            loadOne: 0 // 解决下拉触发多次
        }
    },
    methods: {
        getList () {
            return false
            this.$get('api/system/realTime_list', {
                type: 1,
                pageIndex: this.pageIndex,
                pageSize: 15
            }).then(res => {
                this.first++
                if (this.first === 2) {
                    this.firstload = false
                }
                let data = res.data.data.list;
                this.response.list = [...this.response.list, ...data]
                this.response.rowcount = res.data.data.rowcount
                this.loading = false
                if (this.pageIndex * 15 >= this.response.rowcount) {
                    this.loadOne = 1
                    this.noMore = true
                } else {
                    this.loadOne = 0
                }
                this.$nextTick(() => {
                    if (this.pageIndex > 1) {
                        this.$refs.scroll.reset()
                    }
                })
            })
        },
        // 下拉刷新
        loadData () {
            if (++this.loadOne === 1) {
                this.loading = true
                this.pageIndex++
                this.getList()
            }
        },
        // 删除
        del (index, id) {
            const that = this
            this.$vux.confirm.show({
                content: '<strong>确定要删除该群吗？</strong>',
                onConfirm () {
                    that.$get('api/system/realTime_del', {id: id}).then(res => {
                        if (res.data.data === 1) {
                            that.$vux.alert.show({ content: '操作成功' })
                            that.response.list.splice(index, 1)
                        } else {
                            that.$vux.alert.show({ content: res.data.msg || '操作失败' })
                        }
                    })
                }
            })
        },
        toAddQun (val) {
            if (val === 0) {
                this.$router.push({path: '/editQun'})
            } else {
                this.$router.push({path: '/editQun', query: {id: val}})
            }
        },

        gotoPage (path) {
            this.$router.push({path})
        }
    },
    mounted () {
        this.response.list = [...router.children, ...exp.children]
        this.response.rowcount = this.response.list.length
        this.loading = false
        this.noMore = true
    }
}
</script>
<style scoped>
    .total{
        margin-top: 15px;
        padding: 0 15px;
    }
    .vux-table.vux-table-no-content-bordered tr:last-child td:before {
        border-bottom-width: 0;
    }
</style>
