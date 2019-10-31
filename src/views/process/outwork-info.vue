<style scoped>
    .hei10{ height: 10px; background: #f5f6f8;}
</style>
<template>
    <div>
        <x-header @on-click-back="toList" :left-options="{backText: '', preventGoBack: true}" class="header_fix">外出详情</x-header>
        <div class="header_blank"></div>
        <div class="applicantInfoNode">
            <div class="applicant">
                <img class="applicant_portrait" :src="info.userPhoto" v-if="info.userPhoto" />
                <span class="applicant_portrait" v-else>{{info.userName | firstName}}</span>{{info.userName}}
            </div>
            <div class="applicant_data">
                <table>
                    <tbody>
                        <tr>
                            <td>提交时间</td>
                            <td>{{info.createdTimeStr || '-'}}</td>
                        </tr>
                        <tr>
                            <td>所在部门</td>
                            <td>{{info.departments || '-'}}</td>
                        </tr>
                        <tr>
                            <td>所在职位</td>
                            <td>{{info.postName || '-'}}</td>
                        </tr>
                        <tr class="hei10"></tr>
                        <tr>
                            <td>外出时间</td>
                            <td>{{info.outTime || '-'}}</td>
                        </tr>
                        <tr>
                            <td>是否返回</td>
                            <td>{{info.back || '-'}}</td>
                        </tr>
                        <tr>
                            <td>返回时间</td>
                            <td>{{info.backTime || '-'}}</td>
                        </tr>
                        <tr>
                            <td>外出事由</td>
                            <td>{{info.reason || '-'}}</td>
                        </tr>
                        <tr>
                            <td>外出地点</td>
                            <td>{{info.place || '-'}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="hei10"></div>
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
import {XHeader, XButton, Confirm, XTextarea, Group} from 'vux'
import ccInfo from '../components/ccInfo.vue'
import nodeInfo from '../components/nodeInfo.vue'
export default {
    name: 'overtime-info',
    components: {XHeader, XButton, ccInfo, nodeInfo, Confirm, XTextarea, Group},
    data () { // 参数声明
        return {
            rejectShow: false, // 驳回弹框显示
            rejectReason: null, // 审批驳回理由
            agreeShow: false, // 同意弹框显示
            agreeReason: null, // 审批审批意见
            info: {
                userName: '', // 申请人名字
                userPhoto: null, // 申请人头像
                createdTimeStr: null, // 外出单创建时间
                departments: null, // 申请人部门列表 字符串，以逗号隔开。
                postName: null, // 申请人所在职位 字符串，以逗号隔开。
                outTime: null, // 外出日期
                back: null, // 是否返回
                backTime: null, // 返回日期
                reason: null, // 外出原因
                place: null, // 外出地点
                approverList: null,
                correlation: [], // 抄送人列表
                status: 0 // 0 正常 1 驳回 2 通过
            },
            approvalList: 0, // 从审批列表转入 0 不是 1 是
            isCurrent: false, // 是否是当前审批人
            mId: 0, // 流程ID
        }
    },
    methods: {
        init () { // 初始化 列表
            this.mId = this.$route.query.id
            if (this.$route.query.type) {
                this.approvalList = this.$route.query.type
            }
            this.$get('api/workflow/outwork_info', {
                mId: this.mId
            }).then(res => {
                let allData = res.data.data
                this.info.userName = allData.userName
                this.info.userPhoto = allData.userPhoto
                this.info.createdTimeStr = allData.createdTimeStr
                this.info.departments = allData.deptName
                this.info.postName = allData.postName
                this.info.outTime = allData.outTimeStr
                this.info.back = allData.back ? '是' : '否'
                this.info.backTime = allData.backTimeStr
                this.info.reason = allData.reason
                this.info.place = allData.outAddr
                this.info.approverList = allData.approverList
                this.isCurrent = allData.isCurrent; // 是否为当前审批人
                this.info.status = allData.status; // 0 正常 1 驳回 2 通过
                this.info.correlation = allData.correlation; // 抄送人列表
            })
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
            this.$post('api/workflow/outwork_pass', {
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
            this.$post('api/workflow/outwork_refuse', {
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
