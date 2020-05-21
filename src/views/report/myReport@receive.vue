<template>
    <div class="orderList">
        <group class="my-group">
            <x-header class="header_div" @on-click-back="goHome" :left-options="{backText: '',preventGoBack: true}">
                <span class="header_title">日报周报</span>
                <img style="width:25px;" @click="toRelease()" src="../../img/add-new.png" slot="right" alt="">
            </x-header>
            <div style="height:47px"></div>
            <tab :select="1" :names="names"></tab>
            <div class="my-search-form" style="padding-top:0;border: none">
                <div class="filter-left" @click="openScreen()">
                    <img src="../../img/filter-new.png"/>
                </div>
                <search class="searchInput" style="width:90%" v-model="keyword" :auto-fixed="false"  placeholder="标题、内容、发送人" @on-change="debounceSearch" @on-submit="submiting()"></search>
            </div>
            <div>
                <popup class="search-pop" v-model="screen" position="left">
                    <div style="width:300px">
                        <div class="pop-title">筛选</div>
                        <div class="pop-left">
                            <div :class="condition === 1?'left-item-active':'left-item'" @click="condition = 1">类型</div>
                            <div :class="condition === 2?'left-item-active':'left-item'" @click="condition = 2">起止时间</div>
                        </div>
                        <div class="pop-right" v-if="condition === 1">
                            <checker class="my-check-item" radio-required  v-model="search.workType" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
                                <checker-item v-for="row in workTypeList" :value='row.value' :key="row.value">{{row.name}}</checker-item>
                            </checker>
                        </div>
                        <div class="pop-right" v-if="condition === 2">
                            <datetime inline-desc="开始日期" v-model="search.begin" placeholder="请选择"></datetime>
                            <datetime inline-desc="结束日期" v-model="search.end" placeholder="请选择"></datetime>
                        </div>
                        <div class="pop-footer">
                            <div class="fir-btn" @click="reset()">重置</div>
                            <div class="sec-btn" @click="ok()">确定</div>
                        </div>
                    </div>
                </popup>
            </div>
        </group>
        <div>
            <no-data v-if="dataArr.length===0 && !firstload"></no-data>
            <scroller ref="scroll" class="pad15" lock-x :scroll-bottom-offst="200" @on-scroll-bottom="loadData()">
                <div>
                    <x-table :cell-bordered="false" class="myprocessTable">
                        <tbody>
                            <tr v-show="firstload"><load-more tip="loading"></load-more></tr>
                            <tr v-for="(row,index) in dataArr" :key="index" @click="toDetail(row.id)">
                                <td style="padding-top:6px;text-align:left;">
                                    <div :style="{width:tdWidth + 'px'}" style="display:flex;display:-webkit-flex;" class="overhide">
                                        <div class="circular" v-if="row.isRead === 0"></div>
                                        <p class="pName overhide">{{row.sendName}}</p>
                                        <p class="pDate color999">{{row.createdTimeStr}}</p>
                                    </div>
                                    <div style="height:8px;"></div>
                                    <div :style="{width:tdWidth + 'px'}">
                                        <span class="order_typeColor" :class="row.typeStyle">{{row.workTypeName}}</span>
                                        <strong class="overhide" style="max-width: 60%">{{row.workName}}</strong>
                                        <span class="secret_icon vt1" v-if="row.isSecret === 1">密</span>
                                        <span class="receiver_icon vt1" v-if="row.isImplement === 1">收</span>
                                        <span class="correlation_icon vt1" v-if="row.isCorrelation === 1">抄</span>
                                    </div>
                                    <div v-if="row.workContent" :style="{width:tdWidth + 'px'}" class="overhide color999">{{row.workContent}}</div>
                                    <div class="lineDiv" v-if="row.repleName"></div>
                                    <div class="overhide" :style="{width:tdWidth + 'px'}" v-if="row.repleName">最新回复：{{row.repleName}}</div>
                                </td>
                            </tr>
                        </tbody>
                    </x-table>
                    <load-more v-show="loading" tip="loading"></load-more>
                    <divider v-show="noMore && dataArr.length > 0">没有更多数据</divider>
                </div>
            </scroller>
        </div>
    </div>
</template>
<script>
    import tab from '../process/tab.vue'
    import noData from '../order/no-data'
    import {Group,XHeader,Tab,TabItem,XTable,Scroller,LoadMore,Divider,Search,Popup,Checker,CheckerItem,Datetime,debounce} from 'vux'
    export default {
        name: "process-my",
        components: {Group,XHeader,Tab,TabItem,XTable,Scroller,LoadMore,Divider,Search,Popup,Checker,CheckerItem,Datetime,tab,noData},
        data () {
            return {
                names: [
                    {name: '已接收', router: 'report-receive'},
                    {name: '已发送', router: 'report-send'},
                    {name: '草稿箱', router: 'report-draft'},
                    {name: '已删除', router: 'report-delete'},
                ],
                workTypeList: [{name: '全部类型', value: -1}, {name: '日报', value: 1}, {name: '周报', value: 2}, {name: '月报', value: 3}],
                debounceSearch: '',
                dataArr: [],
                pageSize: 10,
                rowcount: null,
                noMore: false,
                loading: false,
                firstload: true,
                first: 0,
                tdWidth: document.body.clientWidth - 50,
                keyword: '',
                screen: false,
                condition: 1,
                search:{
                    begin: '',
                    end: '',
                    workType: -1,
                    pageIndex: 1,
                },
                loadOne: 0//解决下拉触发多次
            }
        },
        methods: {
            init () {
                const scrollHei= sessionStorage.getItem('phoneHeight')*1 - 154.5;
                this.$refs.scroll.styles.height= scrollHei + 'px';
                if (this.$route.query.pageSize) {
                    this.keyword = this.$route.query.keyword;
                    this.pageSize = parseInt(this.$route.query.pageSize);
                    this.search.begin = this.$route.query.begin;
                    this.search.end = this.$route.query.end;
                    this.search.workType = parseInt(this.$route.query.workType);
                    this.$nextTick( res => {
                        const scrollHei= sessionStorage.getItem('report_transform');
                        if (scrollHei) {
                            const scrollDom= document.querySelector('.xs-container');
                            scrollDom.style.transform= scrollHei;
                        }
                    });
                }
                this.getList();
                this.debounceSearch = debounce(this.submiting, 500);
            },
            goHome () {
                this.$router.replace({name: 'home_index'})
            },
            toRelease () {
                this.$router.push({name: 'report-edit'})
            },
            openScreen () {
                this.screen = true;
            },
            getList (val) {
                let para = {
                    "type": 2,
                    "begin": this.search.begin  === '' ? null : this.search.begin,
                    "end": this.search.end === '' ? null : this.search.end,
                    "workType": this.search.workType === -1 ? null : this.search.workType,
                    "keyword": this.keyword,
                    "pageIndex": this.search.pageIndex,
                    "pageSize": this.pageSize
                };
                this.$get('api/report/report_list',para).then(res=>{
                    this.first++;
                    if(this.first===1){
                        this.firstload= false;
                    }
                    let data= res.data.data.list;
                    if(data.length > 0){
                        for(let i = 0; i < data.length; i++){
                            switch(data[i].workType){
                                case 1:
                                    data[i].workTypeName= "日报";
                                    data[i].typeStyle= "color1";
                                    break;
                                case 2:
                                    data[i].workTypeName= "周报";
                                    data[i].typeStyle= "color2";
                                    break;
                                case 3:
                                    data[i].workTypeName= "月报";
                                    data[i].typeStyle= "color3";
                                    break;
                                default:
                                    data[i].workTypeName= "";
                                    data[i].typeStyle= "";
                            }
                        }
                    }
                    // if (val === 2) {
                    //     this.dataArr = [...this.dataArr,...data];
                    // } else {
                        this.dataArr = data;
                    // }
                    this.rowcount = res.data.data.rowcount;
                    this.loading = false;
                    this.$nextTick(()=>{
                        this.$refs.scroll.reset();
                    });
                    if (this.pageSize >= this.rowcount) {
                        this.loadOne = 1;
                        this.noMore = true;
                    } else {
                        this.loadOne = 0;
                    }
                    window.location.replace('#/order/report-receive?&keyword=' + this.keyword + '&pageSize=' + this.pageSize
                        + '&begin=' + this.search.begin + '&end=' + this.search.end + '&workType=' + this.search.workType);
                })
            },
            compare (date1,date2) {
                let begin = new Date(date1);
                let end = new Date(date2);
                return begin.getTime() > end.getTime();
            },
            reset () {
                this.search = {
                    begin: '',
                    end: '',
                    workType: -1,
                    pageIndex: 1,
                };
                this.pageSize = 10;
                this.first = 0;
                this.firstload = true;
                this.noMore = false;
                this.loadOne = 1;
                this.dataArr = [];
                this.getList();
                this.screen = false;
                this.$nextTick( ()=> {
                    this.$refs.scroll.reset({top:0,});
                })
            },
            ok () {
                this.pageSize = 10;
                if (this.compare(this.search.begin,this.search.end)) {
                    this.$vux.toast.show({
                        type: 'cancel',
                        text: '开始日期大于结束时间'
                    });
                    return false;
                }
                this.screen = false;
                this.first = 0;
                this.firstload = true;
                this.noMore = false;
                this.loadOne = 1;
                this.dataArr = [];
                this.getList();
                this.$nextTick(()=> {
                    this.$refs.scroll.reset({top:0,});
                })
            },
            submiting () {
                this.pageSize = 10;
                this.first = 0;
                this.firstload = true;
                this.noMore = false;
                this.loadOne = 1;
                this.dataArr = [];
                this.getList();
                this.$nextTick(()=> {
                    this.$refs.scroll.reset({top:0,});
                })
            },
            loadData () {
                if (++this.loadOne === 1) {
                    this.loading = true;
                    this.pageSize = this.pageSize + 10;
                    this.getList(2);
                }
            },
            toDetail (id) {
                const scrollDom = document.querySelector('.xs-container');
                sessionStorage.setItem('report_transform', scrollDom.style.transform);
                this.$router.push({name:'report-info',query:{id: id, notice: '0'}})
            },
        },
        mounted () {
            this.init();
        },
    }
</script>
<style scoped>
    .myprocessTable tr td:before{
        border:none;
    }
    table tr{
        border-bottom: 1px solid #e0e0e0;
    }
    .pad15{
        box-sizing:border-box;
        padding: 0 15px;
    }
    .textLef{
        text-align:left;
    }
    .textRig{
        text-align:right;
    }
    table tr td{
        line-height:24px;
    }
    .overhide{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
    }
    tbody tr td{
        border:none;
    }
    .color999{
        color:#999;
    }
    .wid50{
        display:inline-block;
        width:50%;
    }
    .wid48{
        display:inline-block;
        width:48%;
    }
    .wid100{
        width:100%;
    }
    .statusClass{
        width:50px;
        height: 18px;
        margin-top: 4px;
        line-height:18px;
        vertical-align: top;
        text-align: center;
        color:#fff;
        border-radius:24px;
        padding: 0 2px;
        font-size:12px;
    }
    .color1{
        background:#4A8BFF;
    }
    .color2{
        background:#1aad19;
    }
    .color3{
        background:#FF5454;
    }
</style>
