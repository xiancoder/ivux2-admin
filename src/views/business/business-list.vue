<template>
    <group class="my-group">
        <x-header @on-click-back="goHome" :left-options="{backText: '', preventGoBack: true}" style="background-color: #0094eb">商务流程</x-header>
        <div class="my-search-form">
            <div class="filter-left" @click="openScreen()">
                <img style="width: 20px" src="../../img/filter.png"/>
                <div style="font-size: 11px; color: #999999;">筛选</div>
            </div>
            <search class="searchInput" style="width: 90%" v-model="keyword" :auto-fixed="false"  placeholder="请输入流程单号" @on-change="debounceSearch" @on-cancel="cancel" @on-submit="submiting()"></search>
        </div>
        <div>
            <popup class="search-pop" v-model="screen" position="right">
                <div style="width: 300px">
                    <div class="pop-title">筛选</div>
                    <div class="pop-left">
                        <div :class="condition === 1 ? 'left-item-active' : 'left-item'" @click="condition=1">日期</div>
                        <div :class="condition === 2 ? 'left-item-active' : 'left-item'" @click="condition=2">所属项目</div>
                        <div :class="condition === 3 ? 'left-item-active' : 'left-item'" @click="condition=3">流程名称</div>
                        <div :class="condition === 4 ? 'left-item-active' : 'left-item'" @click="condition=4">合同主体</div>
                        <div :class="condition === 5 ? 'left-item-active' : 'left-item'" @click="condition=5">审核状态</div>
                    </div>
                    <div class="pop-right" v-show="condition === 1">
                        <datetime inline-desc="开始日期" v-model="search.begin" placeholder="请选择"></datetime>
                        <datetime inline-desc="结束日期" v-model="search.end" placeholder="请选择"></datetime>
                    </div>
                    <div class="pop-right" v-show="condition === 2">
                        <checker v-model="search.projectId" class="my-check-item" radio-required default-item-class="demo1-item" selected-item-class="demo1-item-selected" >
                            <checker-item v-for="(row, index) in projects" :value='row.id' :key="index">{{row.name}}</checker-item>
                        </checker>
                    </div>
                    <div class="pop-right" v-show="condition === 3">
                        <checker v-model="search.processId" class="my-check-item" radio-required default-item-class="demo1-item" selected-item-class="demo1-item-selected" >
                            <checker-item v-for="(row, index) in process" :value='row.id' :key="index">{{row.procedureName}}</checker-item>
                        </checker>
                    </div>
                    <div class="pop-right" v-show="condition === 4">
                        <checker v-model="search.companyId" class="my-check-item" radio-required default-item-class="demo1-item" selected-item-class="demo1-item-selected" >
                            <checker-item v-for="(row, index) in companys" :value='row.id' :key="index">{{row.name}}</checker-item>
                        </checker>
                    </div>
                    <div class="pop-right" v-show="condition === 5">
                        <checker v-model="search.statusId" class="my-check-item" radio-required default-item-class="demo1-item" selected-item-class="demo1-item-selected" >
                            <checker-item v-for="(row, index) in status" :value='row.id' :key="index">{{row.name}}</checker-item>
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
            <scroller ref="scroll" lock-x  :scroll-bottom-offst="200" @on-scroll-bottom="loadData()">
                <div >
                    <x-table :cell-bordered="false" class="myprocessTable">
                        <tbody>
                            <tr><load-more v-show="firstload" tip="loading"></load-more></tr>
                            <tr v-if="dataArr.length === 0 && !firstload">
                                <td>无数据</td>
                            </tr>
                            <tr v-else v-for="(row, index) in dataArr" :key="index" @click="toDetail(row.id, row.wId)">
                                <td class="textLef overhide" :width="tdWidth" style="padding: 10px 0;">
                                    <div class="wid100">
                                        <p class="wid70 textLef">流程名称：{{row.procedureName || '-'}}</p>
                                        <p class="wid28 textRig" :class="row.statusColor">{{row.statusName}}</p>
                                    </div>
                                    <div class="wid100 overhide">流程单号：{{row.workflowNum || '-'}}</div>
                                    <div class="wid100 overhide">申请人：{{row.userName || '-'}}&nbsp;（{{row.createdTime}}）</div>
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
import {Group, XHeader, XTable, Scroller, LoadMore, Divider, Search, Popup, Checker, CheckerItem, Datetime, debounce} from 'vux'
export default {
    name: 'business-list',
    components: {Group, XHeader, XTable, Scroller, LoadMore, Divider, Search, Popup, Checker, CheckerItem, Datetime},
    data () {
        return {
            debounceSearch: '',
            projects: [], // 项目
            process: [], // 流程类型
            companys: [], // 合同主体
            status: [
                {id: -1, name: '不限'},
                {id: 0, name: '审批中'},
                {id: 1, name: '已驳回'},
                {id: 2, name: '已通过'},
                {id: 3, name: '已审阅'}
            ],
            search: {
                begin: null,
                end: null,
                projectId: -1,
                processId: -1,
                companyId: -1,
                statusId: -1,
                pageIndex: 1
            },
            keyword: null,
            load: false,
            dataArr: [],
            rowcount: null,
            noMore: false,
            loading: false,
            firstload: true,
            first: 0,
            tdWidth: document.body.clientWidth - 30,
            screen: false,
            condition: 1,
            firstClick: 0
        }
    },
    methods: {
        init () {
            const scrollHei = sessionStorage.getItem('phoneHeight') * 1 - 110.5
            this.$refs.scroll.styles.height = scrollHei + 'px'
            this.getList()
            this.debounceSearch = debounce(this.submiting, 500)
        },
        goHome () {
            this.$router.replace({name: 'home_index'})
        },
        openScreen () {
            this.screen = true
            this.firstClick++
            if (this.firstClick === 1) {
                this.$get('api/sys/project_list').then((res) => {
                    this.projects = res.data.data.list
                    this.projects.unshift({id: -1, name: '不限'})
                })
                this.$get('api/workflow/wapgetname', {id: 4}).then((res) => {
                    this.process = res.data.data.list
                    this.process.unshift({id: -1, procedureName: '不限'})
                })
                this.$get('api/contract/wapcompanylist').then((res) => {
                    this.companys = res.data.data.list
                    this.companys.unshift({id: -1, name: '不限'})
                })
            }
        },
        getList () {
            let getData = () => {
                let para = {
                    'begin': this.search.begin,
                    'end': this.search.end,
                    'projectType': this.search.projectId === -1 ? null : this.search.projectId,
                    'workflowType': this.search.processId === -1 ? null : this.search.processId,
                    'companyId': this.search.companyId === -1 ? null : this.search.companyId,
                    'status': this.search.statusId === -1 ? null : this.search.statusId,
                    'keyword': this.keyword,
                    'pageIndex': this.search.pageIndex,
                    'page_size': 15
                }
                this.$get('api/workflow/getallworklist', para).then(res => {
                    this.first++
                    if (this.first === 1) {
                        this.firstload = false
                    }
                    let data = res.data.data.list
                    if (data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            switch (data[i].status) {
                                case 0:
                                    data[i].statusName = '审核中'
                                    data[i].statusColor = 'color1'
                                    break
                                case 1:
                                    data[i].statusName = '被驳回'
                                    data[i].statusColor = 'color3'
                                    break
                                case 2:
                                    data[i].statusName = '已通过'
                                    data[i].statusColor = 'color2'
                                    break
                                case 3:
                                    data[i].statusName = '已审阅'
                                    data[i].statusColor = ''
                                    break
                                default:
                                    data[i].statusName = ''
                                    data[i].statusColor = ''
                            }
                            switch (data[i].wId) {
                                case 1:
                                    data[i].processName = '广告上线申请'
                                    break
                                case 2:
                                    data[i].processName = '合同前置条件申请'
                                    break
                                case 3:
                                    data[i].processName = '商务合同申请'
                                    break
                                case 4:
                                    data[i].processName = '框架协议申请'
                                    break
                                case 5:
                                    data[i].processName = '变更/补充合同申请'
                                    break
                                case 6:
                                    data[i].processName = '发票申请'
                                    break
                            }
                        }
                    }
                    this.dataArr = [...this.dataArr, ...data]
                    this.rowcount = res.data.data.rowcount
                    if (this.search.pageIndex * 15 >= this.rowcount) {
                        this.noMore = true
                        this.load = true
                        this.loading = false
                    }
                })
            }
            if (this.$route.query.keyword !== undefined) {
                this.search.begin = this.$route.query.begin
                this.search.end = this.$route.query.end
                this.search.projectId = this.$route.query.projectId * 1
                this.search.processId = this.$route.query.processId * 1
                this.search.companyId = this.$route.query.companyId * 1
                this.search.statusId = this.$route.query.statusId * 1
                this.keyword = this.$route.query.keyword
                getData()
                return false
            }
            getData()
        },
        compare (date1, date2) {
            let begin = new Date(date1)
            let end = new Date(date2)
            return begin.getTime() > end.getTime()
        },
        reset () {
            this.search = {
                begin: null,
                end: null,
                projectId: -1,
                processId: -1,
                companyId: -1,
                statusId: -1,
                pageIndex: 1
            }
            this.first = 0
            this.firstload = true
            this.noMore = false
            this.load = true
            this.dataArr = []
            if (this.$route.query.keyword !== undefined) {
                this.$router.replace({name: 'business-list'})
            }
            this.getList()
            this.screen = false
            this.$nextTick(() => {
                this.$refs.scroll.reset({top: 0})
                this.load = false
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
            this.load = true
            this.dataArr = []
            if (this.$route.query.keyword !== undefined) {
                this.$router.replace({name: 'business-list'})
            }
            this.getList()
            this.$nextTick(() => {
                this.$refs.scroll.reset({top: 0})
                this.load = false
            })
        },
        cancel () {
            if (this.keyword) {
                this.keyword = null
                this.search.pageIndex = 1
                this.first = 0
                this.firstload = true
                this.noMore = false
                this.load = true
                this.dataArr = []
                if (this.$route.query.keyword !== undefined) {
                    this.$router.replace({name: 'business-list'})
                }
                this.getList()
                this.$nextTick(() => {
                    this.$refs.scroll.reset({top: 0})
                    this.load = false
                })
            }
        },
        submiting () {
            this.search.pageIndex = 1
            this.first = 0
            this.firstload = true
            this.noMore = false
            this.load = true
            this.dataArr = []
            if (this.$route.query.keyword !== undefined) {
                this.$router.replace({name: 'business-list'})
            }
            this.getList()
            this.$nextTick(() => {
                this.$refs.scroll.reset({top: 0})
                this.load = false
            })
        },
        loadData () {
            if (this.load) {
                console.log('???')
            } else {
                this.load = true
                this.loading = true
                setTimeout(() => {
                    this.load = false
                    this.loading = false
                    this.search.pageIndex++
                    this.getList()
                    this.$nextTick(() => {
                        this.$refs.scroll.reset()
                    })
                }, 2000)
            }
        },
        toDetail (id, wId) {
            this.$router.replace({name: 'business-list',
                query: {
                    begin: this.search.begin,
                    end: this.search.end,
                    projectId: this.search.projectId,
                    processId: this.search.processId,
                    companyId: this.search.companyId,
                    statusId: this.search.statusId,
                    keyword: this.keyword
                }
            })
            switch (wId) {
                case 1:
                    this.$router.push({name: 'advertisement-info', query: {id: id}})
                    break
                case 2:
                    this.$router.push({name: 'prepose-info', query: {id: id}})
                    break
                case 3:
                    this.$router.push({name: 'contract-info', query: {id: id}})
                    break
                case 4:
                    this.$router.push({name: 'frame-info', query: {id: id}})
                    break
                case 5:
                    this.$router.push({name: 'change-info', query: {id: id}})
                    break
                case 6:
                    this.$router.push({name: 'invoice-info', query: {id: id}})
                    break
                case 13:
                    this.$router.push({name: 'maintain-info', query: {id: id}})
                    break
            }
        }
    },
    mounted () {
        this.init()
    }
}
</script>
<style scoped>
    .myprocessTable tr td:before{ border: none;}
    .myprocessTable tr td{ line-height: 24px;}
    table tr{ border-bottom: 1px solid #e0e0e0;}
    .pad15{ box-sizing: border-box; padding: 0 15px;}
    .textLef{ text-align: left;}
    .textRig{ text-align: right;}
    table tr td{ line-height: 26px;}
    .overhide{ overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
    tbody tr td{ border: none;}
    .color999{ color: #999;}
    .wid28{display: inline-block; width: 28%;}
    .wid70{display: inline-block; width: 70%;}
    .wid100{ width: 100%;}
    .color1{ color: rgb(3, 149, 236);}
    .color2{ color: rgb(36, 177, 136);}
    .color3{ color: red;}
</style>
