<template>
    <div>
        <x-header :left-options="{showBack:true,backText:'',preventGoBack:true}" class="header_box header_fix">
            <span class="header_title">基础数据</span>
            <span slot="right" @click="toAddQun(0)">添加推广群</span>
        </x-header>
        <div style="height:65px;"></div>
        <div class="total">共计创建{{groupTotal}}个群，已满 {{fullTotal}}个群，群总人数{{userTotal}}</div>
        <tab :select="2" :names="names"></tab>
        <load-more v-show="firstload" tip="loading"></load-more>
        <no-data v-if="response.list.length===0 && !firstload"></no-data>
        <scroller v-show="response.list.length>0" class="pad15" ref="scroll" lock-x :scroll-bottom-offst="200" @on-scroll-bottom="loadData()">
            <div>
                <x-table ref="tableGratified" :cell-bordered="false" :content-bordered="false">
                    <thead>
                        <tr style="background-color: #F7F7F7">
                            <th :style="{width:phoneWidth*0.7 + 'px'}" style="text-align: left;">&nbsp;&nbsp;群名称</th>
                            <th>上限</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in response.list" :key="row.id">
                            <td class="nameDiv" :style="{width:phoneWidth*0.7 + 'px'}" style="text-align: left;">&nbsp;&nbsp;{{row.crowdName || '-'}}</td>
                            <td>{{row.crowdCount}}</td>
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
import tab from '@/components/tab'
import noData from '@/components/no-data'
import menuBottom from '@/components/menu-bottom.vue'
import {XHeader, XTable, Scroller, LoadMore, Divider} from 'vux'

export default {
    components: {
        tab, XHeader, XTable, Scroller, noData, LoadMore, menuBottom, Divider
    },
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
            loadOne: 0, // 解决下拉触发多次
            phoneWidth: null // 手机宽度
        }
    },
    methods: {
        getList () {
            this.$get('api/qun/realtime_list', {
                type: 2,
                pageIndex: this.pageIndex,
                pageSize: 15
            }).then(res => {
                this.first++
                if (this.first === 2) {
                    this.firstload = false
                }
                let data = res.data.data.list
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
        toAddQun (val) {
            if (val === 0) {
                this.$router.push({path: '/editQun'})
            } else {
                this.$router.push({path: '/editQun', query: {id: val}})
            }
        },
        toCode () {
            this.$router.push({name: 'login'});
        }
    },
    created () {
        this.$get('api/qun/totol').then(res => {
            this.groupTotal = res.data.data.groupTotal
            this.fullTotal = res.data.data.fullTotal
            this.userTotal = res.data.data.userTotal
        })
        this.phoneWidth = sessionStorage.getItem('phoneWidth') * 1
    },
    mounted () {
        this.getList()
    },
    beforeRouteLeave (to, from, next) {
        console.log(123)
        next() // 必须
    }
}
</script>
<style scoped>
    .nameDiv{ width: 70%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; padding-left: 4px; }
    .total{ margin-top: 15px; padding: 0 15px; }
    .vux-table.vux-table-no-content-bordered tr:last-child td:before { border-bottom-width: 0; }
</style>
