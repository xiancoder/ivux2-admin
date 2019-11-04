<template>
    <div>
        <x-header :left-options="{backText: ''}" style="background-color: #0094eb" class="header_fix">广告维护审批详情</x-header>
        <div class="header_blank"></div>
        <div class="applicantInfoNode">
            <div class="applicant">
                <img class="applicant_portrait" :src="info.userPhoto" v-if="info.userPhoto" />{{info.userName}}
                <span class="applicant_portrait" v-if="!info.userPhoto">{{info.userName[0]}}</span>
                <span class="fr" style="font-size: 12px;font-weight: 300;line-height: 20px;margin-top: 30px">流程单号：{{info.workflowNum}}</span>
            </div>
            <div class="applicant_data">
                <table>
                    <tr>
                        <td>所在部门</td>
                        <td>{{info.department}}</td>
                    </tr>
                    <tr>
                        <td>所属职位</td>
                        <td>{{info.post}}</td>
                    </tr>
                    <tr>
                        <td>申请时间</td>
                        <td>{{info.createdTime}}</td>
                    </tr>
                </table>
                <table style="margin-top: 10px" v-show="showAll === 1">
                    <tr v-if="info.oldUrl">
                        <td>原链接</td>
                        <td>{{info.oldUrl}}</td>
                    </tr>
                    <tr v-if="info.newUrl">
                        <td>新链接</td>
                        <td>{{info.newUrl}}</td>
                    </tr>
                    <tr v-if="info.oldPrice">
                        <td>原单价</td>
                        <td>{{info.oldPrice}}</td>
                    </tr>
                    <tr v-if="info.newPrice">
                        <td>新单价</td>
                        <td>{{info.newPrice}}</td>
                    </tr>
                    <tr v-if="info.oldPaymentType || info.oldPaymentType === 0">
                        <td>原收款方式</td>
                        <td>{{info.oldPaymentType === 1 ? '对私' : '对公'}}</td>
                    </tr>
                    <tr v-if="info.newPaymentType || info.newPaymentType === 0">
                        <td>新收款方式</td>
                        <td>{{info.newPaymentType === 1 ? '对私' : '对公'}}</td>
                    </tr>
                    <tr v-if="info.oldSettleTypeName">
                        <td>原结算周期</td>
                        <td>{{info.oldSettleTypeName}}</td>
                    </tr>
                    <tr v-if="info.newSettleTypeName">
                        <td>新结算周期</td>
                        <td>{{info.newSettleTypeName}}</td>
                    </tr>
                    <tr v-if="info.oldAccount">
                        <td>原后台账号</td>
                        <td>{{info.oldAccount}}</td>
                    </tr>
                    <tr v-if="info.newAccount">
                        <td>新后台账号</td>
                        <td>{{info.newAccount}}</td>
                    </tr>
                    <tr v-if="info.oldPassword">
                        <td>原后台密码</td>
                        <td>{{info.oldPassword}}</td>
                    </tr>
                    <tr v-if="info.newPassword">
                        <td>新后台密码</td>
                        <td>{{info.newPassword}}</td>
                    </tr>
                    <tr>
                        <td>维护说明</td>
                        <td>{{info.adDesc || '-'}}</td>
                    </tr>
                    <tr>
                        <td>维护人</td>
                        <td>{{info.userName || '-'}}</td>
                    </tr>
                    <tr>
                        <td>维护时间</td>
                        <td>{{info.createdTime || '-'}}</td>
                    </tr>
                    <tr>
                        <td>投放渠道</td>
                        <td>{{info.whChannel || '-'}}</td>
                    </tr>
                </table>
                <p style="margin-top: 10px;" class="showAll" @click="showAllFun">
                    {{showAll === 1 ? '收起' : '展开'}}
                    <img style="width: 16px;height: 16px;margin-left: 10px;" :class="showAll ? '' : 'tfm180'" src="../../img/showArrow.png" />
                </p>
            </div>
        </div>
        <div style="width: 100%;height: 10px;background: #f5f6f8;"></div>
        <!-- 循环审批人 -->
        <node-info :info="info"></node-info>
        <!-- 循环抄送人 -->
        <cc-info :cclist="info.correlation"></cc-info>
    </div>
</template>
<script>
// 引入组件

import ccInfo from '../components/ccInfo.vue'
import nodeInfo from '../components/nodeInfo.vue'
export default {
    name: 'maintain-info',
    components: { ccInfo, nodeInfo }, // 组件声明
    data () { // 参数声明
        return {
            info: {
                userName: '',
                approverList: [],
                correlation: []
            },
            showAll: 0 // 展示全部 0 不展示全部 1 展示全部
        }
    },
    methods: {
        init () { // 初始化 列表
            this.$get('api/workflow/maintain', {
                id: parseInt(this.$route.query.id)
            }).then(res => {
                this.info = res.data.data.info
                this.info.createdTimeStr = this.info.createdTime
                let list = this.info.approver
                this.info.approverList = list.map(this.arraySwitch)
            })
        },
        arraySwitch (value) {
            let arr = []
            arr.push(value)
            return arr
        },
        showAllFun () {
            this.showAll = 1 - this.showAll
        }
    },
    mounted () {
        this.init()
    }
}
</script>
