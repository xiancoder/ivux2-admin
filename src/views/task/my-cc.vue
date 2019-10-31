<template>
    <group class="my-group">
        <x-header @on-click-back="goHome" :left-options="{backText: '', preventGoBack: true}" style="background-color: #0094eb">我的任务<a @click="gotoAdd" style="color: white" slot="right">发布任务</a></x-header>
        <tab active-color="#0094eb" :animate="false">
            <tab-item @on-item-click="onItemClick">我发布的</tab-item>
            <tab-item @on-item-click="onItemClick">我负责的</tab-item>
            <tab-item @on-item-click="onItemClick">我执行的</tab-item>
            <tab-item selected @on-item-click="onItemClick">抄送我的</tab-item>
        </tab>
        <div class="my-search-form">
            <div class="filter-left" @click="show9=true, changeSelection(1)">
                <img style="width: 20px" src="../../img/filter.png"/>
                <div style="font-size: 11px; color: #999999;">筛选</div>
            </div>
            <search v-model="searchValue" style="width: 90%" class="searchInput" cancel-text @on-change="searchList()"
                    :auto-fixed="autoFixed" @on-cancel="searchList()" @on-clear="searchList()" placeholder="模糊搜索任务名称、任务编号">
            </search>
        </div>
        <div>
            <popup class="search-pop" v-model="show9" position="right" >
                <div style="width: 300px">
                    <div class="pop-title">筛选</div>
                    <div class="pop-left">
                        <div :class="stype === 1 ? 'left-item-active' : 'left-item'" @click="changeSelection(1)">优先级</div>
                        <div :class="stype === 2 ? 'left-item-active' : 'left-item'" @click="changeSelection(2)">状态</div>
                        <div :class="stype === 3 ? 'left-item-active' : 'left-item'" @click="changeSelection(3)">日期</div>
                        <div :class="stype === 4 ? 'left-item-active' : 'left-item'" @click="changeSelection(4)">任务类型</div>
                        <div :class="stype === 5 ? 'left-item-active' : 'left-item'" @click="changeSelection(5)">逾期情况</div>
                        <div :class="stype === 6 ? 'left-item-active' : 'left-item'" @click="changeSelection(6)">是否暂停</div>
                        <div :class="stype === 7 ? 'left-item-active' : 'left-item'" @click="changeSelection(7)">人员搜索</div>
                    </div>
                    <div class="pop-right" v-show="stype === 1">
                        <checker class="my-check-item" radio-required  v-model="search.taskPriority" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
                            <checker-item value=-1>全部</checker-item>
                            <checker-item value=0>一般</checker-item>
                            <checker-item value=1>重要</checker-item>
                            <checker-item value=2>紧急</checker-item>
                        </checker>
                    </div>
                    <div class="pop-right" v-show="stype === 2">
                        <checker class="my-check-item" radio-required  v-model="search.taskStatus" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
                            <checker-item value=-1>全部</checker-item>
                            <checker-item value=0>待接受</checker-item>
                            <checker-item value=1>执行中</checker-item>
                            <checker-item value=2>待验收</checker-item>
                            <checker-item value=3>已通过</checker-item>
                            <checker-item value=4>已废弃</checker-item>
                        </checker>
                    </div>
                    <div class="pop-right" v-show="stype === 3">
                        <datetime inline-desc="开始日期" v-model="search.begin" placeholder="请选择"></datetime>
                        <datetime inline-desc="结束日期" v-model="search.end" placeholder="请选择"></datetime>
                    </div>
                    <div class="pop-right" v-show="stype === 4">
                        <checker class="my-check-item" radio-required v-model="search.restart" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
                            <checker-item value=-1>全部</checker-item>
                            <checker-item value=0>普通</checker-item>
                            <checker-item value=1>重启</checker-item>
                        </checker>
                    </div>
                    <div class="pop-right" v-show="stype === 5">
                        <checker class="my-check-item" radio-required v-model="search.overdue" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
                            <checker-item value=-1>全部</checker-item>
                            <checker-item value=1>已逾期</checker-item>
                            <checker-item value=0>未逾期</checker-item>
                        </checker>
                    </div>
                    <div class="pop-right" v-show="stype === 6">
                        <checker class="my-check-item" radio-required v-model="search.pause" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
                            <checker-item value=-1>全部</checker-item>
                            <checker-item value=1>已暂停</checker-item>
                            <checker-item value=0>未暂停</checker-item>
                        </checker>
                    </div>
                    <div class="pop-right" v-show="stype === 7">
                        <popup  v-model="modalP" position="bottom" height="100%" class="margin_style" :is-transparent="true">
                            <search @result-click="resultClickP" @on-change="getResultP" :results="resultsP" v-model="valueP" class="searchInput"
                                    :auto-fixed="false" ref="searchP" placeholder="搜索并选择人员"></search>
                            <div class="popCancel" @click="modalP = false">取消</div>
                        </popup>
                        <cell title="发布人" primary="content">
                            <div @click="openP(1)" class="select_style">{{founderName}}<img src="../../img/arrow.png"/></div>
                        </cell>
                        <cell title="负责人" primary="content">
                            <div @click="openP(2)" class="select_style">{{personLiableName}}<img src="../../img/arrow.png"/></div>
                        </cell>
                        <cell title="执行人" primary="content">
                            <div @click="openP(3)" class="select_style">{{implementName}}<img src="../../img/arrow.png"/></div>
                        </cell>
                    </div>
                    <div class="pop-footer">
                        <div class="fir-btn" @click="clearPopSearch()">重置</div>
                        <div class="sec-btn" @click="submitPopSearch()">确定</div>
                    </div>
                </div>
            </popup>
        </div>
        <div style="padding: 0 15px;">
            <scroller lock-x  @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="200" height="-164">
                <x-table :cell-bordered="false">
                    <tbody>
                    <tr v-show="listData.length===0||listData==null">
                        <td colspan="3">无数据</td>
                    </tr>
                    <tr @click="toInfo(item.id)" v-show="listData.length>0" v-for="(item, index) in listData" :key="index">
                        <td style="text-align: left;padding-left: 8px;line-height: 22px;">
                            <div style="font-size: 16px;word-break: break-all;margin-bottom: 5px">
                                <span v-show="item.restart !== 0" class="task_restart">{{item.restart}}</span>
                                <span v-show="item.pause === true" class="task_timeout">暂停</span>
                                <span v-show="item.overdue > 0" class="task_overtime">逾期</span>
                                <span :class="item.taskStatus === '已废弃' ? 'grey' : ''">{{item.taskName}}</span>
                            </div>
                            <div style="color: #666666;font-size: 14px" :class="item.taskStatus === '已废弃' ? 'grey' : ''">{{item.completeTime}}</div>
                        </td>
                        <td style="text-align: right;padding-left: 8px;line-height: 22px;">
                            <div style="margin-bottom: 5px">
                                <span v-show="item.taskPriority === '重要'" class="task_priority" style="background-color: #f5a722;" :class="item.taskStatus === '已废弃' ? 'greyIcon' : ''">{{item.taskPriority}}</span>
                                <span v-show="item.taskPriority === '紧急'" class="task_priority" style="background-color: #ff635b;" :class="item.taskStatus === '已废弃' ? 'greyIcon' : ''">{{item.taskPriority}}</span>
                                <span v-show="item.taskPriority === '一般'" class="task_priority" style="background-color: #6ab1ff;" :class="item.taskStatus === '已废弃' ? 'greyIcon' : ''">{{item.taskPriority}}</span>
                            </div>
                            <div style="color: #666666;font-size: 14px;padding-right: 3px" :class="item.taskStatus === '已废弃' ? 'grey' : ''">{{item.taskStatus}}</div>
                        </td>
                    </tr>
                    </tbody>
                </x-table>
                <load-more v-show="bottomCount<rowcount&&listData.length !== 0" tip="loading"></load-more>
                <div style="height: 20px"></div>
                <divider v-show="bottomCount >= rowcount&&listData.length !== 0">没有更多数据</divider>
            </scroller>
        </div>
        <button id="btn" @click="cons" style="width: 50px;display: none"></button>
    </group>
</template>
<script>
import { Popup, Checker, XTable, LoadMore, Scroller, Tab, TabItem, Datetime, CheckerItem, Group, XHeader, Cell, Divider, XButton, Search } from 'vux'
export default {
    name: 'my-cc',
    components: { XTable, LoadMore, Scroller, Divider, Popup, XHeader, Group, Cell, XButton, Search, Checker, CheckerItem, Tab, TabItem, Datetime },
    data () {
        return {
            onFetching: false, bottomCount: 15,
            search: {
                taskPriority: '-1',
                taskStatus: '-1',
                begin: '',
                end: '',
                restart: '-1',
                overdue: '-1',
                pause: '-1'
            },
            listData: [],
            searchValue: null,
            autoFixed: false,
            show9: false,
            stype: 1,
            rowcount: 0,
            userList: [],
            modalP: false,
            valueP: '',
            resultsP: [],
            founder: '',
            founderName: '',
            personLiable: '',
            personLiableName: '',
            implement: '',
            implementName: '',
            popMark: ''
        }
    },
    methods: {
        goHome () {
            this.$router.replace({name: 'home_index'})
        },
        gotoAdd () {
            this.$router.push({name: 'task-release'})
        },
        onItemClick (index) {
            document.getElementById('btn').click()
            setTimeout(() => {
                switch (index) {
                    case 0: this.$router.replace({name: 'my-task'}); break
                    case 1: this.$router.replace({name: 'my-response'}); break
                    case 2: this.$router.replace({name: 'my-operate'}); break
                    case 3: this.$router.replace({name: 'my-cc'}); break
                }
            }, 500)
        },
        cons () {}, // 用于关闭输入法弹框
        toInfo (id) {
            this.$router.push({name: 'task-info', query: {taskId: id, role: '4'}})
        },
        openP (mark) {
            this.modalP = true
            this.valueP = ''
            this.resultsP = []
            this.popMark = mark
        },
        resultClickP (item) {
            if (this.popMark === 1) {
                this.founder = item.value
                this.founderName = item.title
            } else if (this.popMark === 2) {
                this.personLiable = item.value
                this.personLiableName = item.title
            } else if (this.popMark === 3) {
                this.implement = item.value
                this.implementName = item.title
            }
            this.modalP = false
        },
        getUserP (val) {
            let rs = []
            for (let i = 0; i < this.userList.length; i++) {
                if (this.userList[i].userName.indexOf(val) !== -1) {
                    rs.push({
                        title: this.userList[i].userName,
                        value: this.userList[i].userId
                    })
                }
            }
            if (rs.length === 0) {
                return [{title: '无匹配数据', value: -1}]
            } else {
                return rs
            }
        },
        getResultP (val) {
            this.resultsP = val ? this.getUserP(this.valueP) : []
        },
        onScrollBottom () {
            if (this.onFetching) {
                // do nothing
            } else {
                this.onFetching = true
                setTimeout(() => {
                    if (this.bottomCount >= this.rowcount) {
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
        },
        submitPopSearch () {
            this.getList('', 1)
            this.show9=false
            this.bottomCount=15
            // this.onFetching=false
            this.$nextTick(() => {
                this.$refs.scrollerBottom.reset({top: 0})
            })
        },
        clearPopSearch () {
            this.bottomCount=15
            this.search = {
                taskPriority: '-1',
                taskStatus: '-1',
                begin: '',
                end: '',
                restart: '-1',
                overdue: '-1',
                pause: '-1'
            }
            this.founder = ''
            this.founderName = ''
            this.personLiable = ''
            this.personLiableName = ''
            this.implement = ''
            this.implementName = ''
            this.show9=false
            // this.onFetching=false
            this.$nextTick(() => {
                this.$refs.scrollerBottom.reset({top: 0})
            })
            this.getList('', 1)
        },
        searchList () {
            this.bottomCount=15
            this.$nextTick(() => {
                this.$refs.scrollerBottom.reset({top: 0})
            })
            this.getList('', 1)
        },
        getList (page_size, v) {
            if (v === 1) {
                this.onFetching=true
            }
            let pa={
                'taskPriority': this.search.taskPriority === '-1' ? null : this.search.taskPriority,
                'taskStatus': this.search.taskStatus === '-1' ? null : this.search.taskStatus,
                'begin': this.search.begin,
                'end': this.search.end,
                'restart': this.search.restart === '-1' ? null : this.search.restart,
                'overdue': this.search.overdue === '-1' ? null : this.search.overdue,
                'pause': this.search.pause === '-1' ? null : this.search.pause,
                'taskName': this.searchValue,
                'founder': this.founder,
                'personLiable': this.personLiable,
                'implement': this.implement,
                'page_index': 1,
                'page_size': 15
            }
            if (page_size) {
                pa.page_size=page_size
            }
            this.$get('api/task/aboutme', pa).then((res) => {
                this.listData=res.data.data.list
                this.rowcount=res.data.data.rowcount
                this.onFetching=false
            })
        },
        changeSelection (val) {
            this.stype=val
        }
    },
    mounted () {
        this.getList ('', 1)
        this.$nextTick(() => {
            this.$refs.scrollerBottom.reset({top: 0})
        })
        this.$get('api/task/users', {
        }).then((res) => {
            this.userList = res.data.data.list
        })
    }
}
</script>
