<template>
    <div class="orderList">
        <x-header class="header_div" @on-click-back="goHome" :left-options="{backText: '', preventGoBack: true}">
            <span class="header_title">下属工单</span>
        </x-header>
        <div style="height: 47px"></div>
        <tab :select="2" :names="names"></tab>
        <div class="topping" @click="update"><img src="../../img/top.png" alt=""></div>
        <div class="grey_search tab_search">
            <search class="searchInput" style="width: 100%" v-model="request.keyword" :auto-fixed="false"  placeholder="标题、内容、姓名" @on-change="debSearch" @on-submit="submiting"></search>
        </div>
        <no-data v-if="response.list.length === 0 && !firstload"></no-data>
        <scroller v-show="response.list.length>0" class="pad15" ref="scroll" lock-x :scroll-bottom-offst="200" @on-scroll-bottom="loadData()">
            <div>
                <x-table :cell-bordered="false" class="myprocessTable">
                    <tbody>
                        <tr><load-more v-show="firstload" tip="loading"></load-more></tr>
                        <tr v-for="(row, index) in response.list" :key="row.id" @click="toDetail(row.id, index)">
                            <td style="padding-top: 6px;text-align: left;">
                                <div :style="{width: tdWidth + 'px'}" style="display: flex;display: -webkit-flex;" class="overhide">
                                    <p class="pName overhide">{{row.sendName}} 发 {{row.listName}}</p>
                                    <p class="pDate color999">{{row.updatedTimeStr}}</p>
                                </div>
                                <div style="height: 8px;"></div>
                                <div :style="{width: tdWidth + 'px'}" class="overhide"><span class="order_typeColor" :class="row.typeStyle">{{row.workTypeName}}</span><strong  style="line-height: 20px;">{{row.workName}}</strong></div>
                                <div v-if="row.workContent" :style="{width: tdWidth + 'px'}" class="overhide lineHei18 color999">{{row.workContent}}</div>
                            </td>
                        </tr>
                    </tbody>
                </x-table>
                <load-more v-show="loading" tip="loading"></load-more>
                <divider v-show="noMore && response.list.length>0">没有更多数据</divider>
            </div>
        </scroller>
    </div>
</template>
<script>
import tab from './tab'
import noData from './no-data'
import {setOrder, removeOrder} from '../../libs/common.js'
import {Group, Tab, TabItem, XTable, Scroller, LoadMore, Divider, Search, debounce} from 'vux'
export default {
    components: {Group, Tab, TabItem, XTable, Scroller, LoadMore, Divider, Search, tab, noData},
    data () {
        return {
            names: [
                {name: '未结工单', router: 'unEndSub-list'},
                {name: '已结工单', router: 'endSub-list'}
            ],
            request: {
                keyword: null,
                pageIndex: 1,
                page_size: 10
            },
            response: {
                list: [],
                rowcount: null
            },
            first: 0,
            firstload: true, // 第一次加载显示loading
            loadOne: 0, // 解决下拉触发多次
            noMore: false,
            loading: false,
            tdWidth: document.body.clientWidth - 50,
            debSearch: ''
        }
    },
    methods: {
        init () {
            const scrollHei = sessionStorage.getItem('phoneHeight') * 1 - 138
            this.$refs.scroll.styles.height = scrollHei + 'px'
            this.debSearch = debounce(this.submiting, 500)
            const orderList = JSON.parse(sessionStorage.getItem('order_list'))
            if (orderList) {
                this.loadOne = sessionStorage.getItem('order_loadOne')
                this.noMore = sessionStorage.getItem('order_noMore') === '1'
                this.firstload = false
                this.response.list = orderList
                this.request.pageIndex = parseInt(sessionStorage.getItem('order_pageIndex'))
                this.request.keyword = sessionStorage.getItem('order_keyword')
            } else {
                this.getList()
            }
        },
        goHome () {
            this.$router.replace({name: 'home_index'})
        },
        // 置顶更新数据
        update () {
            removeOrder()
            const scrollDom = document.querySelector('.xs-container')
            scrollDom.style.transform = 'translateY(0)'
            this.request = {
                keyword: this.request.keyword,
                pageIndex: 1,
                page_size: 10
            }
            this.first = 0
            this.firstload = true
            this.noMore = false
            this.loadOne = 1
            this.getList(2)
            this.$nextTick(() => {
                this.$refs.scroll.reset({top: 0})
            })
        },
        getList (val) {
            let para = {
                'workStatus': 1,
                'keyword': this.request.keyword,
                'pageIndex': this.request.pageIndex,
                'page_size': this.request.page_size
            }
            this.$get('api/order/order_sub_list', para).then(res => {
                this.first++
                if (this.first === 1) {
                    this.firstload = false
                }
                let data = res.data.data.list
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        switch (data[i].workType) {
                            case 1:
                                data[i].workTypeName = '工作'
                                data[i].typeStyle = 'order_color1'
                                break
                            case 2:
                                data[i].workTypeName = '周报日报'
                                data[i].typeStyle = 'order_color2'
                                break
                            case 3:
                                data[i].workTypeName = '通知公告'
                                data[i].typeStyle = 'order_color3'
                                break
                            case 4:
                                data[i].workTypeName = '温馨提示'
                                data[i].typeStyle = 'order_color4'
                                break
                            default:
                                data[i].workTypeName = ''
                                data[i].typeStyle = ''
                        }
                    }
                }
                if (val === 2) {
                    this.response.list = data
                } else {
                    this.response.list = [...this.response.list, ...data]
                }
                this.response.rowcount = res.data.data.rowcount
                this.loading = false
                this.$nextTick(() => {
                    if (this.request.pageIndex > 1) {
                        this.$refs.scroll.reset()
                    }
                })
                if (this.request.pageIndex * 10 >= this.response.rowcount) {
                    this.loadOne = 1
                    this.noMore = true
                } else {
                    this.loadOne = 0
                }
            })
        },
        submiting () {
            removeOrder();// 清空工单缓存
            this.request.pageIndex = 1
            this.first = 0
            this.firstload = true
            this.noMore = false
            this.loadOne = 1
            this.response.list = []
            this.getList(2)
            this.$nextTick(() => {
                this.$refs.scroll.reset({top: 0})
            })
        },
        loadData () {
            if (++this.loadOne === 1) {
                this.loading = true
                this.request.pageIndex++
                this.getList()
            }
        },
        toDetail (id, index) {
            this.$router.push({name: 'order-info', query: {id: id, handle: 0, notice: 1}})
            sessionStorage.setItem('order_loadOne', this.loadOne)
            sessionStorage.setItem('order_noMore', this.noMore ? '1' : '0')
            this.response.list[index].isRead = 1
            const scrollDom = document.querySelector('.xs-container')
            const keyword = this.request.keyword ? this.request.keyword : ''
            const setData = [keyword, this.request.pageIndex, JSON.stringify(this.response.list), scrollDom.style.transform, index]
            setOrder(setData)
        }
    },
    mounted () {
        this.init()
        this.$nextTick(res => {
            const scrollHei = sessionStorage.getItem('order_scroll')
            if (scrollHei) {
                const scrollDom = document.querySelector('.xs-container')
                scrollDom.style.transform = scrollHei
            }
        })
    }
}
</script>
<style scoped lang='less'>
    .myprocessTable tr td:before{ border: none;}
</style>
