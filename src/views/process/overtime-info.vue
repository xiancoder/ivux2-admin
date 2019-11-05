<template>
    <div>
        <x-header @on-click-back="toList" :left-options="{backText: '', preventGoBack: true}" class="header_fix">加班详情</x-header>
        <div class="header_blank"></div>
        <div class="applicantInfoNode">
            <div class="applicant">
                <img class="applicant_portrait" :src="info.userPhoto" v-if="info.userPhoto" />{{info.userName}}
                <span class="applicant_portrait" v-if="!info.userPhoto">{{info.userName | firstName}}</span>
            </div>
            <div class="applicant_data">
                <table>
                    <tr> <td>提交时间</td> <td>{{info.createdTimeStr}}</td> </tr>
                    <tr> <td>所在部门</td> <td>{{info.departments}}</td> </tr>
                    <tr> <td>所在职位</td> <td>{{info.postName}}</td> </tr>
                </table>
                <table style="margin-top: 10px">
                    <tr> <td>加班日期</td> <td>{{info.overTimeDate}}</td> </tr>
                    <tr> <td>事由</td> <td>{{info.reason}}</td> </tr>
                </table>
                <table style="margin-top: 10px;">
                    <tr> <td>加班人</td> <td>{{info.leaveList[0].userName | arrToString}}</td> </tr>
                    <tr> <td>加班时间</td> <td>{{info.leaveList[0].date}}</td> </tr>
                    <tr> <td>时长(小时)</td> <td>{{info.leaveList[0].time}}</td> </tr>
                </table>
                <table v-for="(row, index) in info.leaveList" :key="index" v-if="index !== 0 && showAll === 1">
                    <tr> <td>加班人</td> <td>{{row.userName | arrToString}}</td> </tr>
                    <tr> <td>加班时间</td> <td>{{row.date}}</td> </tr>
                    <tr> <td>时长(小时)</td> <td>{{row.time}}</td> </tr>
                </table>
                <p v-if="info.leaveList.length !== 1" style="margin-top: 10px;" class="showAll" @click="showAllFun">
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
        <div style="height: 50px;"></div>
        <div class="buttons" v-if="isCurrent && info.status === 0 && approvalList">
            <div @click="rejectShow=true">拒绝</div>
            <div @click="agreeShow=true">同意</div>
        </div>
        <confirm v-model="rejectShow" title="确定驳回吗？" @on-confirm="refuse" @on-cancel="rejectReason=null">
            <group>
                <x-textarea style="color: #000" v-model="rejectReason" :max="50" show-counter autosize placeholder="请输入驳回理由"></x-textarea>
            </group>
        </confirm>
        <confirm v-model="agreeShow" title="确定同意吗？" @on-confirm="agree" @on-cancel="agreeReason=null">
            <group>
                <x-textarea style="color: #000" v-model="agreeReason" :max="50" show-counter autosize placeholder="可输入审批意见"></x-textarea>
            </group>
        </confirm>
    </div>
</template>
<script>
// 引入组件
import {XButton, Confirm, XTextarea, Group} from 'vux'
import ccInfo from '../components/ccInfo.vue'
import nodeInfo from '../components/nodeInfo.vue'
export default {
    name: 'overtime-info',
    components: {XButton, ccInfo, nodeInfo, Confirm, XTextarea, Group},
    data () { // 参数声明
        return {
            rejectShow: false, // 驳回弹框显示
            rejectReason: null, // 审批驳回理由
            agreeShow: false, // 同意弹框显示
            agreeReason: null, // 审批审批意见
            info: {
                userName: '', // 申请人名字
                userPhoto: '', // 申请人头像
                createdTimeStr: '', // 加班单创建时间
                departments: '', // 申请人部门列表 字符串，以逗号隔开。
                postName: '', // 申请人所在职位 字符串，以逗号隔开。
                overTimeDate: '', // 加班日期
                reason: '', // 请假事由
                leaveList: [{ // 多个加班员工就多一条数据
                    userName: [], // 加班人员
                    date: '', // 加班时间
                    time: ''// 加班时长 小时
                }],
                approverList: [{ // 审批人列表  审批人第一位是 “工作接收人”
                    approverName: '', // 审批人姓名
                    approverImg: '', // 审批人头像地址
                    createdTime: '', // 审批时间
                    status: 1 // 审批状态 1 待审批 2 已同意 3 已驳回
                }],
                correlation: [{ // 抄送人列表
                    correlationUserName: '', // 抄送人名字
                    userPhoto: null // 抄送人头像
                }],
                status: 0 // 0 正常 1 驳回 2 通过
            },
            showAll: 0, // 展示全部 0 不展示全部 1 展示全部
            mId: 0, // 流程ID
            isCurrent: false, // 是否是当前审批人
            approvalList: 0 // 从审批列表转入 0 不是 1 是
        }
    },
    methods: {
        init () { // 初始化 列表
            this.mId = this.$route.query.id
            if (this.$route.query.type) {
                this.approvalList = this.$route.query.type
            }
            this.$get('api/workflow/overtime_info', {
                mId: this.$route.query.id
            }).then(res => {
                let allData = res.data.data
                this.info.postName = allData.postName; // 职位
                this.info.userPhoto = allData.userPhoto; // 申请人头像
                this.info.departments = allData.deptName; // 部门
                this.info.reason = allData.reason; // 加班原因
                this.info.createdTimeStr = allData.createdTimeStr; // 加班申请时间
                this.info.userName = allData.userName; // 申请人name
                this.isCurrent = allData.isCurrent; // 是否为当前审批人
                this.info.status = allData.status; // 0 正常 1 驳回 2 通过
                this.info.correlation = allData.correlation; // 抄送人列表
                this.info.approverList = allData.approverList; // 审批人列表
                this.info.leaveList = allData.leaveList; // 加班人员列表
                this.info.overTimeDate = allData.overTimeDate; // 加班人员列表
            })
        },
        showAllFun (e) {
            this.showAll = 1 - this.showAll
        },
        toList () {
            if (this.$route.query.role === '1') {
                this.$router.push({name: 'process-my'})
            } else if (this.$route.query.role === '2') {
                this.$router.push({name: 'process-notexamine'})
            } else if (this.$route.query.role === '3') {
                this.$router.push({name: 'process-examined'})
            } else if (this.$route.query.role === '4') {
                this.$router.push({name: 'process-send'})
            } else {
                this.$router.push({name: 'notice-list'})
            }
        },
        agree () {
            this.$post('api/workflow/overtime_pass', {
                mId: this.mId,
                opinion: this.agreeReason
            }).then(res => {
                if (res.data.data && res.data.data.res === 1) {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '操作成功'
                    })
                    this.$router.replace({name: 'process-notexamine'})
                } else {
                    this.$vux.alert.show({
                        title: '提示',
                        content: res.data.msg || '操作失败'
                    })
                }
            })
        },
        refuse () {
            this.$post('api/workflow/overtime_refuse', {
                mId: this.mId,
                rejectReason: this.rejectReason
            }).then(res => {
                if (res.data.data && res.data.data.res === 1) {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '操作成功'
                    })
                    this.$router.replace({name: 'process-notexamine'})
                } else {
                    this.$vux.alert.show({
                        title: '提示',
                        content: res.data.msg || '操作失败'
                    })
                }
            })
        }
    },
    mounted () {
        this.init()
    },
    filters: {
        arrToString: function (value) { // 数组转字符串
            return value.join('，')
        },
        firstName: function (value) { // 截取字符串的第一个
            return value.substr(0, 1)
        }
    },
    destroyed () {
        this.rejectShow = false
        this.$vux.confirm.hide()
    }
}
</script>
