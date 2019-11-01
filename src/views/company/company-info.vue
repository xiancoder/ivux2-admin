<style lang='less'>
    @import '../main.less';
    .my-group .weui-cells{ margin-top: 0;}
    .detail_container .weui-cells{ font-size: 14px; margin-top: 0;}
    .detail_container{ padding-right: 15px;}
    .remark_content{ border-top: 0.6px solid #D9D9D9; margin: 3px 0px 0px 15px; padding: 10px 0; font-size: 15px; color: #333;}
    .remark_detail{ background-color: #f8f8f8; padding: 14px; margin: 10px 0; word-wrap: break-word; color: #666; }
    .detail-title{ margin: 15px; border-left: 2px solid rgb(0, 148, 235); padding: 0px 5px; font-size: 17px;}
    .title-back{ background-image: url('../../img/info-bg.png'); height: 185px; background-size: contain; text-align: center; color: white; }
    .title-back .center{ margin: 0px auto; font-size: 18px; padding: 20px 0px 15px 0; position: relative;}
    .title-back img{ width: 63px;}
    .bottom div{display: inline-block; width: 30%; border-right: 0.5px solid #ffffff;}
    .bottom{ line-height: 25px; font-size: 15px;}
    .title-back .center .vux-badge{ position: absolute; top: 13px; right: 128px; height: 20px; line-height: 20px; background-color: #FFBE2A;}
    .weui-cells .weui-cell__ft{ font-size: 14px; color: #666; word-break: break-all;}
    .my-group .weui-cells .vux-cell-primary p{ width: 160px;}
    .tabDiv .vux-button-group > a.vux-button-tab-item-first { border-top-left-radius: 6px; border-bottom-left-radius: 6px;}
    .tabDiv .vux-button-group > a.vux-button-tab-item-last { border-top-right-radius: 6px; border-bottom-right-radius: 6px;}
    .tabDiv .vux-button-group > a.vux-button-tab-item-last:after{ border-top-right-radius: 8px; border-bottom-right-radius: 8px;}
    .tabDiv .vux-button-group > a.vux-button-tab-item-first:after{ border-top-left-radius: 8px; border-bottom-left-radius: 8px;}
</style>
<style scoped>
    .tabDiv{ background-color: #0094EB; padding: 10px 50px; }
    .imgStyle{ width: 40px;}
    .fontStyle{ color: #9a9a9a;}
    .noData{ margin-top: 30%; text-align: center;}
</style>
<template>
    <group class="my-group">
        <x-header :left-options="{backText: ''}" class="header_fix">客户详细信息
            <a v-show="type==2 && tab==0" @click="gotoEdit" style="color: white" slot="right">编辑</a>
        </x-header>
        <div class="header_blank"></div>
        <div class="tabDiv">
            <button-tab v-model="tab">
                <button-tab-item @on-item-click="tab==0">客户基本信息</button-tab-item>
                <button-tab-item @on-item-click="tab==1">发票信息</button-tab-item>
            </button-tab>
        </div>
        <div v-show="tab==0">
            <div class="title-back">
                <div class="center">
                    <img src='../../img/jiake.png' v-show="info.projectType === '加客'"/>
                    <img src='../../img/renliyou.png' v-show="info.projectType === '任礼游'"/>
                    <img src='../../img/logo.png' v-show="info.projectType === '云袭广告'"/>
                    <p>{{info.projectType||'-'}}</p>
                    <badge :text="info.teamWorkStatusName"></badge>
                </div>
                <div class="bottom">
                    <div>
                        <p v-show="type!=2">前负责人</p>
                        <p v-show="type!=2">{{info.oldleaderName||'-'}}</p>
                        <p v-show="type==2">负责人</p>
                        <p v-show="type==2">{{info.leaderName||'-'}}</p>
                    </div>
                    <div style="width: 32%;">
                        <p>客户类型</p>
                        <p>{{info.cusTypeName||'-'}}</p>
                    </div>
                    <div style="border-right: none">
                        <p>客户级别</p>
                        <p>{{info.cusLevelName||'-'}}</p>
                    </div>
                </div>
            </div>
            <div class="info_title">
                <span class="info_blue"></span> 基本信息
            </div>
            <div class="detail_container">
                <cell title="客户名称" :value="info.busName||'-'"></cell>
                <cell title="关键词" :value="info.keyword||'-'"></cell>
                <cell title="所属行业" :value="info.industry||'-'"></cell>
                <cell title="企业法人" :value="info.corp||'-'"></cell>
                <cell title="联系电话" :value="info.tel||'-'" v-show="type === 2"></cell>
                <cell title="企业地址" :value="info.address||'-'"></cell>
                <cell title="成立时间" :value="info.foundDates||'-'"></cell>
                <cell title="企业规模" :value="info.scale||'-'"></cell>
                <cell title="企业网址" :value="info.website||'-'"></cell>
                <div class="remark_content">
                    备注
                    <div class="remark_detail">
                        {{info.mark}}
                    </div>
                </div>
            </div>
            <div style="height: 8px;background-color: #F5F7F9"></div>
            <div class="info_title">
                <span class="info_blue"></span> 系统信息
            </div>
            <div class="detail_container">
                <cell title="创建人" :value="info.createByName||'-'"></cell>
                <cell title="创建时间" :value="info.createAts||'-'"></cell>
                <cell v-show="type==2" title="前负责人" :value="info.oldleaderName||'-'"></cell>
                <cell title="最新转入日期" :value="info.followUpBys||'-'"></cell>
            </div>
        </div>
        <div v-show="tab==1">
            <div v-if="invo_no">
                <div>
                    <cell title="发票类型" :value="invoData.invoiceName||'-'"></cell>
                    <cell title="结算周期" :value="invoData.settleName||'-'"></cell>
                    <cell title="账期" :value="invoData.repaymentDate||'-'"></cell>
                    <cell title="发票抬头" :value="invoData.busName||'-'"></cell>
                    <cell title="纳税人识别号" :value="invoData.taxpayer||'-'"></cell>
                    <cell title="企业地址" :value="invoData.busAddress||'-'"></cell>
                    <cell title="联系电话" :value="invoData.busTel||'-'"></cell>
                    <cell title="开户行" :value="invoData.openBank||'-'"></cell>
                    <cell title="银行账户" :value="invoData.bankCard||'-'"></cell>
                </div>
                <div style="height: 8px;background-color: #F5F7F9"></div>
                <div class="info_title">
                    <span class="info_blue"></span> 邮寄发票信息
                </div>
                <div>
                    <cell title="邮寄地址" :value="invoData.mailAddress||'-'"></cell>
                    <cell title="收件人" :value="invoData.consignee||'-'"></cell>
                    <cell title="收件电话" :value="invoData.consigneeTel||'-'"></cell>
                    <cell title="邮编" :value="invoData.postalcode||'-'"></cell>
                    <cell title="备注" :value="invoData.invoiceRemark||'-'"></cell>
                </div>
            </div>
            <div class="noData" v-else>
                <img class="imgStyle" src="../../img/no_follow.png" alt="">
                <p class="fontStyle">暂无发票信息</p>
            </div>
        </div>
    </group>
</template>
<script>
import {Group, XHeader, Cell, Badge, ButtonTab, ButtonTabItem} from 'vux'
export default {
    components: { Group, XHeader, Cell, Badge, ButtonTab, ButtonTabItem },
    data () {
        return {
            type: this.$route.query.type,
            info: {
                'busName': '', // 企业客户名称
                'cusType': '', // 企业客户类型
                'cusTypeName': '', // 企业客户类型
                'cusLevel': '', // 企业客户级别
                'cusLevelName': '', // 企业客户级别
                'teamWorkStatus': '', // 合作状态
                'teamWorkStatusName': '', // 合作状态
                'tel': '', // 联系电话
                'industry': '', // 所属行业
                'corp': '', // 企业法人
                'address': '', // 企业地址
                'keyword': '', // 关键词
                'mark': '', // 备注
                'leader': '', // 负责人
                'oldleader': '', // 前负责人
                'createBy': '', // 创建人
                'createAts': '', // 创建时间
                'followUpBys': '', // 开始跟进日期/最新转入日期
                'projectType': '' // 所属项目
            },
            tab: 0,
            invo_no: true,
            invoData: {}
        }
    },
    methods: {
        gotoEdit () {
            this.$router.push({name: 'add-customer', query: {companyId: this.$route.query.companyId}})
        },
        getInfo () {
            this.$get('api/customer/detail', {id: this.$route.query.companyId}).then((res) => {
                this.info = res.data.data.result
                // this.showdiver = true
            })
        },
        getInvoice () {
            this.$get('api/customer/invoice_info', {cusId: this.$route.query.companyId}).then(res => {
                if (!res.data.data.exist) {
                    this.invo_no = false
                    return
                }
                this.invoData = res.data.data.result
                if (this.invoData.repaymentDate > 0 || this.invoData.repaymentDate === 0) {
                    this.invoData.repaymentDate = this.invoData.repaymentDate + '天'
                }
            })
        }
    },
    mounted: function () {
        this.getInfo()
        this.getInvoice()
    }
}
</script>
