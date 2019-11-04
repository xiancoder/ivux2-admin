<template>
    <div>
        <x-header :left-options="{backText: ''}" style="background-color: #0094eb">任务轨迹</x-header>
        <scroller lock-x  @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="200" height="-45">
            <div class="log_container">
                <div class="record_model" v-for="(log, index) in logList" :key="index">
                    <div style="margin-bottom: 5px;font-size: 14px;position: relative">
                        {{log.userName}}<span>{{log.opAt}}</span>
                        <img src="../../img/write.png" v-show="log.type === 1">
                        <img src="../../img/check.png" v-show="log.type === 0">
                    </div>
                    <div>{{log.content}}</div>
                </div>
            </div>
            <load-more v-show="bottomCount<rowCount&&logList.length !== 0" tip="loading"></load-more>
            <div style="height: 20px"></div>
            <divider v-show="bottomCount >= rowCount&&logList.length !== 0">没有更多数据</divider>
        </scroller>
    </div>
</template>
<script>
import {XTable, LoadMore, Scroller, Divider} from 'vux'
export default {
    name: 'log-list',
    components: { XTable, LoadMore, Scroller, Divider },
    data () {
        return {
            logList: [],
            onFetching: false, bottomCount: 15,
            rowCount: 0
        }
    },
    methods: {
        getList (page_size, v) {
            if (v === 1) {
                this.onFetching = true
            }
            let pa = {
                'taskId': this.$route.query.taskId,
                'page_index': 1,
                'page_size': 15
            }
            if (page_size) {
                pa.page_size = page_size
            }
            this.$get('api/task/tasklog', pa).then((res) => {
                this.logList = res.data.data.list
                this.rowCount = res.data.data.rowcount
                this.onFetching = false
            })
        },
        onScrollBottom () {
            if (this.onFetching) {
                // do nothing
            } else {
                this.onFetching = true
                setTimeout(() => {
                    if (this.bottomCount >= this.rowCount) {
                        return false
                    }
                    this.bottomCount += 15
                    this.getList(this.bottomCount)
                    this.$nextTick(() => {
                        this.$refs.scrollerBottom.reset()
                    })
                    this.onFetching = false
                }, 2000)
            }
        }
    },
    mounted () {
        this.getList('', 1)
        this.$nextTick(() => {
            this.$refs.scrollerBottom.reset({top: 0})
        })
    }
}
</script>
<style scoped>
    .log_container{ padding: 0 20px 0 65px;}
    .record_model{ font-size: 13px; border-bottom: 1px solid #e1e1e1; padding: 10px 0;}
    .record_model span{display: inline-block; margin-left: 20px; color: #999; font-size: 12px!important;}
    .record_model img{ position: absolute; top: 0; left: -50px; width: 30px; height: 30px;}
</style>
