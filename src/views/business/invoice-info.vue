<template>
    <div>
        <x-header :left-options="{backText: ''}" style="background-color: #0094eb" class="header_fix">发票申请审批详情</x-header>
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
                        <td>所属项目</td>
                        <td>{{info.projectName}}</td>
                    </tr>
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
                    <tr>
                        <td>合同主体</td>
                        <td>{{info.invoiceCompanyName || '-'}}</td>
                    </tr>
                    <tr>
                        <td>客户名称</td>
                        <td>{{info.customerName || '-'}}</td>
                    </tr>
                    <tr>
                        <td>客户类型</td>
                        <td>{{info.customerType || '-'}}</td>
                    </tr>
                    <tr>
                        <td>所属合同编号</td>
                        <td>{{info.contractNum || '-'}}</td>
                    </tr>
                    <tr>
                        <td>款项结算周期</td>
                        <td>
                        <span v-show="info.invoiceBeginStr">
                            {{info.invoiceBeginStr}} 至 {{info.invoiceEndStr}}
                        </span>
                            <span v-show="!info.invoiceBegin">-</span>
                        </td>
                    </tr>
                    <tr>
                        <td>发票金额</td>
                        <td>{{info.money}}元</td>
                    </tr>
                    <tr>
                        <td>发票类型</td>
                        <td>{{info.invoiceType === 1 ? '增值税普通发票' : '增值税专用发票'}}</td>
                    </tr>
                    <tr>
                        <td>大写金额</td>
                        <td>{{info.capMoney || '-'}}</td>
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
import {XHeader} from 'vux'
import ccInfo from '../components/ccInfo.vue'
import nodeInfo from '../components/nodeInfo.vue'
export default {
    name: 'invoice-info',
    components: { XHeader, ccInfo, nodeInfo }, // 组件声明
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
            this.$get('api/workflow/invoice', {
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
