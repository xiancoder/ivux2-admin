<style scoped>
    .pad15{ padding: 0 15px;}
    .textLef{ text-align: left;}
    .textRig{ text-align: right;}
    .overhide{ overflow: hidden; text-overflow: ellipsis; white-space: nowrap;display: inline-block;}
    .wid50{display: inline-block; width: 50%;}
    .wid48{display: inline-block; width: 48%;}
    .wid100{ width: 100%;}
    .lineH26{ line-height: 26px;}
</style>
<template>
    <group class="my-group">
        <x-header @on-click-back="goHome" :left-options="{backText: '', preventGoBack: true}" style="background-color: #0094eb">我的人事流程</x-header>
        <tab active-color="#0094eb" :animate="false">
            <tab-item  @on-item-click="onItemClick">我申请的</tab-item>
            <tab-item selected @on-item-click="onItemClick">待我审核的</tab-item>
            <tab-item @on-item-click="onItemClick">我已审核的</tab-item>
            <tab-item @on-item-click="onItemClick">抄送我的</tab-item>
        </tab>
        <div class="my-search-form">
            <div class="filter-left" @click="openScreen()">
                <img style="width: 20px" src="../../img/filter.png"/>
                <div style="font-size: 11px; color: #999999;">筛选</div>
            </div>
            <search class="searchInput" style="width: 90%" v-model="keyword" :auto-fixed="false"  placeholder="模糊搜索姓名" @on-change="debounceSearch" @on-submit="submiting()"></search>
        </div>
        <div>
            <popup class="search-pop" v-model="screen" position="left">
                <div style="width: 300px">
                    <div class="pop-title">筛选</div>
                    <div class="pop-left">
                        <div :class="condition === 2 ? 'left-item-active' : 'left-item'" @click="condition=2">申请类型</div>
                        <div :class="condition === 1 ? 'left-item-active' : 'left-item'" @click="condition=1">日期</div>
                        <div :class="condition === 3 ? 'left-item-active' : 'left-item'" @click="condition=3" v-if="search.process_type === 7">请假类型</div>
                    </div>
                    <div class="pop-right" v-show="condition === 1">
                        <datetime inline-desc="开始日期" v-model="search.begin" placeholder="请选择"></datetime>
                        <datetime inline-desc="结束日期" v-model="search.end" placeholder="请选择"></datetime>
                    </div>
                    <div class="pop-right" v-show="condition === 2">
                        <checker class="my-check-item" radio-required  v-model="search.process_type" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
                            <checker-item v-for="(row, index) in processTypes" :value='row.id' :key="row.id">{{row.name}}</checker-item>
                        </checker>
                    </div>
                    <div class="pop-right" v-show="condition === 3">
                        <checker class="my-check-item" radio-required  v-model="search.vacationType" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
                            <checker-item v-for="(row, index) in vacationList" :value='row.value' :key="row.value">{{row.name}}</checker-item>
                        </checker>
                    </div>
                    <div class="pop-footer">
                        <div class="fir-btn" @click="reset()">重置</div>
                        <div class="sec-btn" @click="ok()">确定</div>
                    </div>
                </div>
            </popup>
        </div>
        <div class="pad15">
            <scroller ref="scroll" lock-x :scroll-bottom-offst="200" @on-scroll-bottom="loadData()">
                <div>
                    <x-table :cell-bordered="false">
                        <tbody>
                            <tr><load-more v-show="firstload" tip="loading"></load-more></tr>
                            <tr v-if="dataArr.length==0 && !firstload">
                                <td colspan="2">无数据</td>
                            </tr>
                            <tr v-else v-for="(row, index) in dataArr" :key="index" @click="toDetail(row.id, row.type, row.wId, row.vacationType)">
                                <td class="textLef overhide lineH26" :width="tdWidth" style="padding: 5px 0;">
                                    <div class="wid100 ">
                                        <p class="wid50 textLef">{{row.name}}</p>
                                        <p class="wid48 textRig">{{row.date}}</p>
                                    </div>
                                    <div style="height: 4px;"></div>
                                    <div class="wid100 overhide" v-if="!row.vacationType">{{row.type}}：{{row.reason || '-'}}</div>
                                    <div class="wid100 overhide" v-if="row.vacationType">{{row.vacationType}}：{{row.reason || '-'}}</div>
                                </td>
                            </tr>
                        </tbody>
                    </x-table>
                    <load-more v-show="loading" tip="loading"></load-more>
                    <divider v-show="noMore && dataArr.length>0">没有更多数据</divider>
                </div>
            </scroller>
        </div>
    </group>
</template>
<script>
import {Group, XHeader, Tab, TabItem, XTable, Scroller, LoadMore, Divider, Search, Popup, Checker, CheckerItem, Datetime, debounce} from 'vux'
export default {
    name: 'process-notexamine',
    components: {Group, XHeader, Tab, TabItem, XTable, Scroller, LoadMore, Divider, Search, Popup, Checker, CheckerItem, Datetime},
    data () {
        return {
            debounceSearch: '',
            vacationList: [],
            dataArr: [],
            pageSize: 15,
            rowcount: null,
            noMore: false,
            loading: false,
            firstload: true,
            first: 0,
            tdWidth: document.body.clientWidth - 30,
            keyword: null,
            screen: false,
            condition: 2,
            processTypes: null,
            firstClick: 0,
            search: {
                vacationType: -1,
                process_type: -1,
                begin: null,
                end: null,
                pageIndex: 1
            },
            loadOne: 0, // 解决下拉触发多次
        }
    },
    methods: {
        init () {
            const scrollHei = sessionStorage.getItem('phoneHeight')*1 - 154.5
            this.$refs.scroll.styles.height = scrollHei + 'px'
            this.getList()
            this.debounceSearch = debounce(this.submiting, 500)
        },
        goHome () {
            this.$router.replace({name: 'home_index'})
        },
        onItemClick (index) {
            switch (index) {
                case 0: this.$router.replace({path: 'process-my'}); break
                case 1: this.$router.replace({path: 'process-notexamine'}); break
                case 2: this.$router.replace({path: 'process-examined'}); break
                case 3: this.$router.replace({path: 'process-send'}); break
            }
        },
        openScreen () {
            this.screen=true, this.firstClick++
            if (this.firstClick === 1) {
                this.$get('api/workflow/type', {typeId: 1}).then(res => {
                    this.processTypes = res.data.data.list
                    this.processTypes.unshift({id: -1, name: '不限'})
                })
                this.$get('api/workflow/vacation_menu', {
                }).then((res) => {
                    this.vacationList = res.data.data
                    this.vacationList.unshift({value: -1, name: '不限'})
                })
            }
        },
        getList (val) {
            let para={
                'begin': this.search.begin,
                'end': this.search.end,
                'vacationType': this.search.vacationType === -1 ? null : this.search.vacationType,
                'processType': this.search.process_type === -1 ? null : this.search.process_type,
                'keyword': this.keyword,
                'pageIndex': this.search.pageIndex,
                'pageSize': this.pageSize
            }
            this.$get('api/workflow/waitme', para).then(res => {
                this.first++
                if (this.first === 1) {
                    this.firstload = false
                }
                if (val === 2) {
                    this.dataArr = [...this.dataArr, ...res.data.data.list]
                } else {
                    this.dataArr = res.data.data.list
                }
                this.rowcount = res.data.data.rowcount
                this.loading = false
                this.$nextTick(() => {
                    this.$refs.scroll.reset()
                })
                if (this.search.pageIndex * 15 >= this.rowcount) {
                    this.loadOne = 1
                    this.noMore = true
                } else {
                    this.loadOne = 0
                }
            })
        },
        compare (date1, date2) {
            let begin = new Date(date1)
            let end = new Date(date2)
            return begin.getTime() > end.getTime()
        },
        reset () {
            this.search = {
                vacationType: -1,
                process_type: -1,
                begin: null,
                end: null,
                pageIndex: 1
            }
            this.first = 0
            this.firstload = true
            this.noMore = false
            this.loadOne = 1
            this.dataArr = []
            this.getList()
            this.screen = false
            this.$nextTick(() => {
                this.$refs.scroll.reset({top: 0})
            })
        },
        ok () {
            this.search.pageIndex = 1
            if (this.compare(this.search.begin, this.search.end)) {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: '开始日期大于结束时间'
                })
                return false
            }
            this.screen = false
            this.first = 0
            this.firstload = true
            this.noMore = false
            this.loadOne = 1
            this.dataArr = []
            this.getList()
            this.$nextTick(() => {
                this.$refs.scroll.reset({top: 0})
            })
        },
        submiting () {
            this.search.pageIndex = 1
            this.first = 0
            this.firstload = true
            this.noMore = false
            this.loadOne = 1
            this.dataArr = []
            this.getList()
            this.$nextTick(() => {
                this.$refs.scroll.reset({top: 0})
            })
        },
        loadData () {
            if (++this.loadOne === 1) {
                this.loading = true
                this.search.pageIndex++
                this.getList(2)
            }
        },
        toDetail (id, type, wId, vType) {
            switch (wId) {
                case 7:
                    if (vType === '哺乳假') {
                        this.$router.push({name: 'breastfeed-info', query: {id: id, type: 1, role: '2'}})
                    } else {
                        this.$router.push({name: 'vacation-info', query: {id: id, type: 1, role: '2'}})
                    }
                    break
                case 8:
                    this.$router.push({name: 'overtime-info', query: {id: id, type: 1, role: '2'}})
                    break
                case 9:
                    this.$router.push({name: 'noCheck-info', query: {id: id, type: 1, role: '2'}})
                    break
                case 11:
                    this.$router.push({name: 'outwork-info', query: {id: id, type: 1, role: '2'}})
                    break
                case 12:
                    this.$router.push({name: 'busTrip-info', query: {id: id, type: 1, role: '2'}})
                    break
            }
        }
    },
    mounted () {
        this.init()
    }
}
</script>
