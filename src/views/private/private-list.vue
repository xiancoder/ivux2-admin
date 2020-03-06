<template>
    <group class="my-group">
        <x-header @on-click-back="goHome" :left-options="{backText: '', preventGoBack: true}" style="background-color: #0094eb">我的客户<a @click="gotoAdd" style="color: white" slot="right">添加</a></x-header>
        <div class="my-search-form">
            <div class="filter-left" @click="show9=true, changeSelection(1)">
                <!-- <i class="fa fa-filter" @click="show9=true, changeSelection(1)"></i> -->
                <img style="width: 20px" src="../../img/filter.png"/>
                <div style="font-size: 11px; color: #999999;">筛选</div>
            </div>
            <search v-model="searchValue" style="width: 90%" class="searchInput"
            cancel-text @on-change="serach()" :auto-fixed="autoFixed" @on-cancel="serach()"
            @on-clear="serach()"
            placeholder="请输入客户名称、关键词"></search>
        </div>
        <!-- <x-switch title="right" v-model="show9"></x-switch> -->
        <div >
            <popup class="search-pop" v-model="show9" position="right" >
                <div style="width: 300px;">
                    <!-- <group title="筛选"></group> -->
                    <div class="pop-title">筛选</div>
                    <div class="pop-left">
                        <div :class="stype==1 ? 'left-item-active' : 'left-item'" @click="changeSelection(1)">项目</div>
                        <div :class="stype==2 ? 'left-item-active' : 'left-item'" @click="changeSelection(2)">客户类型</div>
                        <div :class="stype==3 ? 'left-item-active' : 'left-item'" @click="changeSelection(3)">客户级别</div>
                        <div :class="stype==4 ? 'left-item-active' : 'left-item'" @click="changeSelection(4)">合作状态</div>
                    </div>
                    <div class="pop-right" v-show="stype==1">
                        <div>
                            <div style="padding: 10px 20px" v-show="pdata.length==0">无数据</div>
                            <span v-show="pdata.length > 0">
                                <!-- <div v-for="i in pdata">{{i.name}}</div> -->
                                <checker class="my-check-item" radio-required  v-model="search.projectType" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
                                    <checker-item  value="-1">不限</checker-item>
                                    <checker-item  v-for="i in pdata" :value="i.id" :key="i.id">{{i.name}}</checker-item>
                                </checker>
                            </span>
                            </div>
                    </div>
                    <div class="pop-right" v-show="stype==2">
                        <checker class="my-check-item" radio-required  v-model="search.cusType" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
                            <checker-item value="-1">不限</checker-item>
                            <checker-item value="1">渠道</checker-item>
                            <checker-item value="2">广告主</checker-item>
                            <checker-item value="3">城市合伙人</checker-item>
                            <checker-item value="4">直接客户</checker-item>
                        </checker>
                    </div>
                    <div class="pop-right" v-show="stype==3">
                        <checker class="my-check-item" radio-required v-model="search.cusLevel" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
                            <checker-item value="-1">不限</checker-item>
                            <checker-item value="1">A</checker-item>
                            <checker-item value="2">B</checker-item>
                            <checker-item value="3">C</checker-item>
                            <checker-item value="4">D</checker-item>
                        </checker>
                    </div>
                    <div class="pop-right" v-show="stype==4">
                        <checker class="my-check-item" radio-required v-model="search.teamWorkStatus" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
                            <checker-item value="-1">不限</checker-item>
                            <checker-item value="0">未合作</checker-item>
                            <checker-item value="1">已合作</checker-item>
                            <checker-item value="3">已终止</checker-item>
                        </checker>
                    </div>
                    <div class="pop-footer">
                        <div class="fir-btn" @click="clearPopSearch()">重置</div>
                        <div class="sec-btn" @click="submitPopSearch()">确定</div>
                    </div>
                </div>
            </popup>
        </div>
        <div style="padding: 0 15px;">
            <scroller lock-x  @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="200" height="-120">
                <x-table :cell-bordered="false"  >
                    <tbody>
                    <tr v-show="listData.length==0||listData==null">
                        <td colspan="3">无数据</td>
                    </tr>
                    <tr @click="toInfo(item.id)" v-show="listData.length>0" v-for="item in listData">
                        <td style="  line-height: 20px;  width: 24px;">
                            <img style="height: 36px" v-show="item.cusLevel=='A'" src="../../img/LA.png"/>
                            <img style="height: 36px" v-show="item.cusLevel=='B'" src="../../img/LB.png"/>
                            <img style="height: 36px" v-show="item.cusLevel=='C'" src="../../img/LC.png"/>
                            <img style="height: 36px" v-show="item.cusLevel=='D'" src="../../img/LD.png"/>
                        </td>
                        <td style="text-align: left;padding-left: 8px;line-height: 22px;">
                            <div style="font-size: 16px; word-break: break-all;">{{item.busName}}</div>
                            <div style="color: #666666;font-size: 14px">{{item.cusType}}</div>
                        </td>
                        <td style="line-height: 20px;"><img style="height: 24px;"  src="../../img/more.png" /></td>
                    </tr>
                    </tbody>
                </x-table>
                <load-more v-show="bottomCount<=rowcount&&listData.length!=0" tip="loading"></load-more>
                <div style="height: 20px"></div>
                <divider v-show="bottomCount>rowcount&&listData.length!=0">没有更多数据</divider>
            </scroller>
    </div>
    </group>
</template>
<script>
import {Popup, Checker, XTable, LoadMore, Scroller, CheckerItem, Group, Cell, Divider, XButton, XSwitch, Search} from 'vux'
export default {
    components: {XTable, LoadMore, Scroller, Divider, Popup, Group, Cell, XSwitch, XButton, Search, Checker, CheckerItem},
    data () {
        return {
            showdiver: false,
            scrollTop: 0,
            onFetching: false, bottomCount: 15,
            search: {
                'projectType': '-1', // 项目，null 不限制1：网维；2：云袭广告；3：加客
                'cusType': '-1', // 客户类型，null 不限制
                'cusLevel': '-1', // 客户级别，null 不限制
                'teamWorkStatus': '-1' // 合作状态，null不限制
            },
            listData: [],
            searchValue: null,
            demo1: '',
            demo1Required: '',
            demo1Checkbox: [2, 1],
            demo1CheckboxMax: ['2', '3'],
            autoFixed: false,
            results: [],
            show9: false,
            value: 'test',
            stype: 1,
            pdata: [],
            rowcount: 0
        }
    },
    mounted: function () {
        this.getList('', 1)
        this.$nextTick(() => {
            this.$refs.scrollerBottom.reset({top: 0})
        })
        // this.onFetching = false
    },
    methods: {
        goHome () {
            this.$router.replace({name: 'home_index'})
        },
        gotoAdd (id) {
            sessionStorage.setItem('listType', '1')
            this.$router.push({name: 'add-customer'})
        },
        toInfo (id) {
            sessionStorage.setItem('listType', '1')
            this.$router.push({name: 'private-info', query: {companyId: id}})
        },
        onScrollBottom () {
            if (this.onFetching) {
                // do nothing
            } else {
                this.onFetching = true
                setTimeout(() => {
                    if (this.bottomCount >= this.rowcount) {
                        this.showdiver = true
                        return false
                    }
                    this.bottomCount += 15
                    this.getList(this.bottomCount)
                    this.$nextTick(() => {
                        this.$refs.scrollerBottom.reset()
                    })
                    this.onFetching = false
                    this.showdiver = false
                }, 2000)
            }
        },
        submitPopSearch () {
            this.getList('', 1)
            this.show9 = false
            this.bottomCount = 15
            // this.onFetching = false
            this.$nextTick(() => {
                this.$refs.scrollerBottom.reset({top: 0})
            })
        },
        clearPopSearch () {
            this.bottomCount = 15
            this.search = {
                'projectType': '-1', // 项目，null 不限制1：网维；2：云袭广告；3：加客
                'cusType': '-1', // 客户类型，null 不限制
                'cusLevel': '-1', // 客户级别，null 不限制
                'teamWorkStatus': '-1' // 合作状态，null不限制
            }
            this.show9 = false
            // this.onFetching = false
            this.$nextTick(() => {
                this.$refs.scrollerBottom.reset({top: 0})
            })
            this.getList('', 1)
        },
        serach: function () {
            this.bottomCount = 15
            this.$nextTick(() => {
                this.$refs.scrollerBottom.reset({top: 0})
            })
            this.getList('', 1)
        },
        getList: function (pagesize, v) {
            if (v === 1) {
                this.onFetching = true
            }
            let pa = {
                'projectType': this.search.projectType === -1 ? null : this.search.projectType, // 项目，null 不限制1：网维；2：云袭广告；3：加客
                'cusType': this.search.cusType === -1 ? null : this.search.cusType, // 客户类型，null 不限制
                'cusLevel': this.search.cusLevel === -1 ? null : this.search.cusLevel, // 客户级别，null 不限制
                'teamWorkStatus': this.search.teamWorkStatus === -1 ? null : this.search.teamWorkStatus, // 合作状态，null不限制
                'keyword': this.searchValue, // 关键字，null不限制
                'page_index': 1,
                'page_size': 15
            }
            if (pagesize) {
                pa.page_size = pagesize
            }
            this.$get('api/customer/get_list_private', pa).then((res) => {
                this.listData = res.data.data.list
                this.rowcount = res.data.data.rowcount
                this.onFetching = false
            })
        },
        onSubmit () {
            this.$refs.search.setBlur()
            this.$vux.toast.show({
                type: 'text', position: 'top',
                text: 'on submit'
            })
        },
        changeSelection (val) {
            this.stype = val
            if (val === 1) {
                this.$get('api/sys/project_list').then((res) => {
                    this.pdata = res.data.data.list
                })
            }
        }
    }
}
</script>
