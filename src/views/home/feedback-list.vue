<template>
    <div>
        <x-header :left-options="{backText: ''}" class="header_fix">反馈意见</x-header>
        <div class="header_blank"></div>
        <group class="my-group">
            <div style="padding: 0 15px;">
                <scroller lock-x  @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="26" height="-46">
                    <x-table :cell-bordered="false">
                        <tbody>
                        <tr v-show="listData.length===0||listData==null">
                            <td colspan="3">无数据</td>
                        </tr>
                        <tr v-show="listData.length>0" v-for="(item, index) in listData" :key="index">
                            <td style="text-align: left;line-height: 22px;">
                                <div style="font-size: 14px;word-break: break-all;margin-bottom: 5px">
                                    <span v-if="item.typeName === '功能建议'" class="task_timeout">功能建议</span>
                                    <span v-if="item.typeName === '用户体验'" class="task_overtime">用户体验</span>
                                    <span v-if="item.typeName === '页面设计'" class="task_overtime" style="color: #0094eb;border-color: #0094eb">页面设计</span>
                                    <span v-if="item.typeName === '其他'" class="task_overtime" style="color: #f56a00;border-color: #f56a00">其他</span>
                                    <span>{{item.userName}}</span>
                                    <span class="fr" style="color: #999">{{item.comeFrom}}</span>
                                </div>
                                <div style="color: #666666;font-size: 14px;word-break: break-all" v-if="item.msgType === '0' || !item.msgType">{{item.content}}</div>
                                <div v-if="item.msgType === '1'">
                                    <img :src="item.content" style="max-width: 100%">
                                </div>
                                <div v-if="item.msgType === '2'">
                                    <audio controls style="max-width: 100%">
                                        <source :src="item.content"/>
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </x-table>
                    <load-more v-show="loading" tip="loading"></load-more>
                    <divider v-show="noMore">没有更多数据</divider>
                </scroller>
            </div>
        </group>
    </div>
</template>
<script>
import {XHeader, XTable, LoadMore, Scroller, Divider, Group} from 'vux'
export default {
    name: 'feedback-list',
    components: {
        XHeader, XTable, LoadMore, Scroller, Divider, Group
    },
    data () {
        return {
            listData: [],
            loading: false,
            noMore: false,
            currentCount: 30
        }
    },
    methods: {
        init () {
            this.getList()
        },
        getList () {
            this.loading = true
            this.$get('api/system/getfeedback', {
                pageIndex: 1,
                page_size: 15
            }).then((res) => {
                this.listData = res.data.data.list
                this.loading = false
            })
        },
        onScrollBottom () {
            if (this.loading || this.listData.length === 0) {
                console.log('???')
            } else {
                if (!this.noMore) {
                    this.loading = true
                    setTimeout(() => {
                        this.$get('api/system/getfeedback', {
                            pageIndex: 1,
                            page_size: this.currentCount
                        }).then((res) => {
                            this.listData = res.data.data.list
                            if (this.currentCount < res.data.data.rowcount) {
                                this.currentCount = this.currentCount + 15
                            } else {
                                this.noMore = true
                            }
                            this.loading = false
                        })
                    }, 1000)
                }
            }
        }
    },
    mounted () {
        this.init()
    }
}
</script>
