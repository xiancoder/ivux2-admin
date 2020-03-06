<template>
    <div>
        <x-header :left-options="{backText: ''}" style="background-color: #0094eb">跟进记录</x-header>
        <div class="follow_search">
            <search v-model="keyWord" cancel-text @on-change="searchFollow()"
                    :auto-fixed="false" @on-cancel="searchFollow()" @on-clear="searchFollow()" placeholder="请输入商务姓名"></search>
        </div>
        <scroller lock-x  @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="100" height="-100">
            <div style="padding: 0 15px 0 25px">
                <div class="no_follow" v-show="noFollow">
                    <div><img src="../../img/no_follow.png"></div>
                    亲，暂时没有跟进记录哦！
                </div>
                <div class="follow_container" v-show="!noFollow">
                    <div class="follow_modal" v-for="(follow, index) in followList" :key="index" :class="index === 0 ? 'bn' : ''" @click="toDetail(follow.id)">
                        <div class="follow_method">
                            <img src="../../img/tel_active.png" v-show="follow.wayName === '电话'">
                            <img src="../../img/wechat_active.png" v-show="follow.wayName === '微信'">
                            <img src="../../img/qq_active.png" v-show="follow.wayName === 'qq'">
                            <img src="../../img/mail_active.png" v-show="follow.wayName === '邮件'">
                            <img src="../../img/face_active.png" v-show="follow.wayName === '面谈'">
                        </div>
                        <div class="follow_title">
                            <img src="../../img/todo.png">
                            {{follow.createAt}}
                            <span class="text_overflow" style="max-width: 100px">{{follow.busName}}</span>
                        </div>
                        <div class="follow_content">
                            {{follow.content}}
                        </div>
                        <div>
                            <div class="follow_img" v-for="(img, index) in follow.image" :key="index">
                                <img :src="img">
                            </div>
                            <div class="follow_img" v-show="follow.file.length > 0">
                                <img src="../../img/file.png">
                            </div>
                        </div>
                        <div class="follow_member text_overflow" style="max-width: 200px">
                            {{follow.operateBy}} | 联系人 : {{follow.contact || '-'}}
                        </div>
                    </div>
                </div>
            </div>
            <load-more v-show="loading" tip="loading"></load-more>
            <divider v-show="noMore">没有更多数据</divider>
        </scroller>
    </div>
</template>
<script>
import {Scroller, LoadMore, Divider, Search} from 'vux'
export default {
    name: 'follow-list',
    components: {Scroller, LoadMore, Divider, Search},
    data () {
        return {
            noFollow: false,
            keyWord: null,
            currentCount: 30,
            loading: false,
            noMore: false,
            followList: [
                {
                    operateBy: '',
                    content: '',
                    busName: '',
                    createAt: '',
                    wayName: '',
                    contact: '',
                    file: [],
                    image: []
                }
            ]
        }
    },
    methods: {
        init () {
            this.getList()
        },
        getList () {
            this.$get('api/customer/followuplog_cus', {
                keyword: this.keyWord === '' ? null : this.keyWord,
                cusId: this.$route.query.cusId,
                page_index: 1,
                page_size: 15
            }).then((res) => {
                this.followList = res.data.data.list
                this.loading = false
                this.noFollow = this.followList.length === 0
            })
        },
        searchFollow () {
            this.currentCount = 30
            this.noMore = false
            this.loading = true
            this.getList()
            this.$nextTick(() => {
                this.$refs.scrollerBottom.reset({top: 0})
            })
        },
        toDetail (id) {
            this.$router.push({name: 'follow-detail', query: {followId: id}})
        },
        onScrollBottom () {
            if (this.loading || this.noFollow) {
                console.log(' ? ? ? ')
            } else {
                if (!this.noMore) {
                    this.loading = true
                    setTimeout(() => {
                        this.$get('api/customer/followuplog_cus', {
                            keyword: this.keyWord,
                            cusId: this.$route.query.cusId,
                            page_index: 1,
                            page_size: this.currentCount
                        }).then((res) => {
                            this.followList = res.data.data.list
                            if (this.currentCount < res.data.data.rowCount) {
                                this.currentCount = this.currentCount + 15
                            } else {
                                this.noMore = true
                            }
                            this.loading = false
                        })
                    }, 2000)
                }
            }
        }
    },
    mounted () {
        this.init()
    }
}
</script>
