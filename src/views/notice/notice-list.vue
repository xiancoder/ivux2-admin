<template>
    <div>
        <x-header :left-options="{showBack: false}" class="header_white"><span class="header_title">通知</span></x-header>
        <div class="header_blank" style="border-bottom: 1px solid #d7d7d7"></div>
        <div class="grey_search">
            <search v-model="keyword" cancel-text @on-change="searchNotice()"
                    :auto-fixed="false" placeholder="搜索消息标题、内容"></search>
        </div>
        <div class="no_follow" v-show="noticeList.length === 0 && mark">
            <div><img src="../../img/no_follow.png"></div>
            没有通知
        </div>
        <scroller lock-x  @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="154" height="-154">
            <div style="padding-left: 75px">
                <div class="notice_model" v-for="(notice, index) in noticeList" :key="index" @click="toInfo(notice.appJumpUrl, notice.id, notice.megTitel)">
                    <div class="notice_icon orderMsg">
                        <img src="../../img/notice-order.png" v-if="notice.megTitel === '工单消息'">
                        <img src="../../img/notice-vacation.png" v-else-if="isProcess(notice.megTitel)">
                        <img src="../../img/notice-invoice.png" v-else-if="notice.megTitel === '发票领取'">
                        <img src="../../img/notice-other.png" v-else>
                    </div>
                    <span class="notice_status" v-if="!notice.isRead"></span>
                    <div class="notice_msg">
                        <span style="font-weight: bold">
                            {{notice.megTitel}}
                        </span>
                        <span style="float: right;font-size: 12px">{{notice.createdTime}}</span>
                    </div>
                    <div style="font-size: 13px;color: #999;margin-top: 3px">
                        {{notice.msgContent}}
                    </div>
                </div>
            </div>
            <load-more v-show="loading" tip="loading"></load-more>
            <divider v-show="noMore">没有更多数据</divider>
        </scroller>
    </div>
</template>
<script>
import Cookies from 'js-cookie'
import bottomMenu from '../components/bottom-menu.vue'
import { XHeader, Tabbar, TabbarItem, Scroller, LoadMore, Divider, Search } from 'vux'
import { setTimeout } from 'timers'
export default {
    name: 'notice-list',
    components: {
        XHeader,
        Tabbar,
        TabbarItem,
        Scroller,
        LoadMore,
        Divider, bottomMenu,
        Search
    },
    data () {
        return {
            mark: false,
            noticeList: [],
            currentCount: 15,
            loading: false,
            noMore: false,
            keyword: ''
        }
    },
    methods: {
        init () {
            if (this.$route.query.pageSize) {
                this.keyword = this.$route.query.keyword
                this.currentCount = parseInt(this.$route.query.pageSize)
            }
            this.getList()
            this.setUnRead()
        },
        setUnRead () {
            this.$get('api/message/have').then((res) => {
                const n = res.data.data.res
                const unReadNum = n === 0 ? '' : n + ''
                this.$store.commit('setUnReadNum', unReadNum)
            })
        },
        searchNotice () {
            this.currentCount = 15
            this.noMore = false
            this.loading = true
            this.getList()
            this.$nextTick(() => {
                this.$refs.scrollerBottom.reset({top: 0})
            })
        },
        getList () {
            this.$get('api/message/list', {
                keyword: this.keyword,
                page_index: 1,
                page_size: this.currentCount
            }).then((res) => {
                if (!this.mark) {
                    this.mark = true
                }
                this.noticeList = res.data.data.list
                this.loading = false
                // window.location.hash = '#/notice/list ? &keyword=' + this.keyword + '&pageSize=' + this.currentCount
                window.location.replace('#/notice/list ? &keyword=' + this.keyword + '&pageSize=' + this.currentCount)
            })
        },
        isProcess (name) {
            return name === '请假流程审批' || name === '加班流程审批' || name === '未打卡流程审批' || name === '外出流程审批' || name === '出差流程审批'
        },
        onScrollBottom () {
            if (this.loading || this.noticeList.length === 0) {
            } else {
                if (!this.noMore) {
                    this.loading = true
                    setTimeout(() => {
                        this.$get('api/message/list', {
                            keyword: this.keyword,
                            page_index: 1,
                            page_size: this.currentCount + 15
                        }).then((res) => {
                            this.noticeList = res.data.data.list
                            if (this.currentCount + 15 < res.data.data.rowcount) {
                                this.currentCount = this.currentCount + 15
                                window.location.hash = '#/notice/list ? &keyword=' + this.keyword + '&pageSize=' + this.currentCount
                            } else {
                                this.noMore = true
                                let n = this.currentCount + 15
                                window.location.hash = '#/notice/list ? &keyword=' + this.keyword + '&pageSize=' + n
                            }
                            this.loading = false
                        })
                    }, 2000)
                }
            }
        },
        toInfo (url, id, name) {
            this.$get('api/message/readed', {
                id: id
            }).then((res) => {
                if (url === '/#/notice/list') {
                    this.loading = true
                    setTimeout(() => {
                        this.$get('api/message/list', {
                            keyword: this.keyword,
                            page_index: 1,
                            page_size: this.currentCount
                        }).then((res) => {
                            this.noticeList = res.data.data.list
                            if (this.currentCount < res.data.data.rowcount) {
                                this.currentCount = this.currentCount + 15
                            } else {
                                this.noMore = true
                            }
                            this.loading = false
                        })
                    }, 2000)
                    this.setUnRead()
                }
            })
            if (url === '/#/notice/list') {
                if (name === '发票领取') {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '您有待领取的发票，请尽快到财务室领取。'
                    })
                } else {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '请登录PC端查看详情'
                    })
                }
            } else {
                this.$router.push({path: url})
            }
        }
    },
    mounted () {
        this.init()
        if (Cookies.get('type')) {
            window.$App.goMsg()
        }
    }
}
</script>
<style scoped>
    .notice_model{ position: relative; padding: 10px 15px 10px 0; border-bottom: 1px solid #e5e5e5;}
    .notice_status{display: inline-block; width: 10px; height: 10px; border-radius: 5px; background-color: #ff4f33; position: absolute; left: -24px; top: 10px;}
    .notice_icon{ position: absolute; left: -60px; top: 10px; width: 45px; height: 45px;}
    .notice_icon img{ width: 100%;}
    .notice_msg{ color: #333; font-size: 16px; height: 25px; line-height: 25px;}
</style>
