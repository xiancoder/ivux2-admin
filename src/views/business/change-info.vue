<template>
    <div>
        <x-header :left-options="{backText: ''}" style="background-color: #0094eb" class="header_fix">变更/补充审批详情</x-header>
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
                    <tr>
                        <td>原合同编号</td>
                        <td>{{info.sourceNum || '-'}}</td>
                    </tr>
                    <tr>
                        <td>原合同名称</td>
                        <td>{{info.contractName || '-'}}</td>
                    </tr>
                    <tr>
                        <td>合同流程类型</td>
                        <td>
                            <span v-show="info.type === 1">变更合同</span>
                            <span v-show="info.type === 2">补充合同</span>
                        </td>
                    </tr>
                    <tr>
                        <td>附加合同名称</td>
                        <td>{{info.changecontractName || '-'}}</td>
                    </tr>
                    <tr>
                        <td>合同金额</td>
                        <td>{{info.contractPrice || '-'}}</td>
                    </tr>
                    <tr>
                        <td>合同开始时间</td>
                        <td>{{info.contractBegin || '-'}}</td>
                    </tr>
                    <tr>
                        <td>合同结束时间</td>
                        <td>{{info.contractEnd || '-'}}</td>
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
import { XHeader } from 'vux'
import ccInfo from '../components/ccInfo.vue'
import nodeInfo from '../components/nodeInfo.vue'
export default {
    name: 'change-info',
    components: { // 组件声明
        XHeader,
        ccInfo,
        nodeInfo
    },
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
            this.$get('api/workflow/change', {
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
