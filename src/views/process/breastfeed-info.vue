<template>
    <div>
        <div v-show="!bigImg">
            <x-header @on-click-back="toList" :left-options="{backText: '', preventGoBack: true}" class="header_fix">哺乳假详情</x-header>
            <div class="header_blank"></div>
            <div class="applicantInfoNode">
                <div class="applicant">
                    <img class="applicant_portrait" :src="info.userPhoto" v-if="info.userPhoto" />
                    <span class="applicant_portrait" v-else>{{info.userName | firstName}}</span>
                    <span >{{info.userName}}</span>
                </div>
                <div class="applicant_data">
                    <table>
                        <tbody>
                            <tr>
                                <td>所在部门</td>
                                <td>{{info.deptName || '-'}}</td>
                            </tr>
                            <tr>
                                <td>所在职位</td>
                                <td>{{info.postName || '-'}}</td>
                            </tr>
                            <tr class="hei10"></tr>
                            <tr>
                                <td>提交时间</td>
                                <td>{{info.createdTimeStr || '-'}}</td>
                            </tr>
                            <tr>
                                <td>请假日期</td>
                                <td>{{info.begin || '-'}} 至 {{info.end || '-'}}</td>
                            </tr>
                            <tr>
                                <td>请假时间</td>
                                <td>{{info.beginHour || '-'}} - {{info.endHour || '-'}}</td>
                            </tr>
                            <tr>
                                <td>图片证明</td>
                                <td style="padding-top: 6px;"><img style="width: 100px;" :src="info.img" alt="" @click="bigShow"></td>
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
            <div style="height: 50px;" v-if="refuseShow"></div>
            <div class="buttons" v-if="refuseShow">
                <div @click="rejectShow=true">拒绝</div>
                <div @click="agreeShow=true">同意</div>
            </div>
        </div>
        <div class="imgDiv" v-show="bigImg" @click="back">
            <img class="bigImage" :src="info.img" alt="" >
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
import {XHeader, Confirm, XTextarea, Group} from 'vux'
import ccInfo from '../components/ccInfo.vue'
import nodeInfo from '../components/nodeInfo.vue'
export default {
    name: 'breastfeed-info',
    components: {XHeader, ccInfo, nodeInfo, Confirm, XTextarea, Group},
    data () {
        return {
            rejectShow: false, // 驳回弹框显示
            rejectReason: null, // 审批驳回理由
            agreeShow: false, // 同意弹框显示
            agreeReason: null, // 同意驳回理由
            info: {
                userName: '', // 申请人名字
                userPhoto: null, // 申请人头像
                deptName: null, // 申请人部门  只展示主要职位对应部门
                postName: null, // 申请人职位 - 只展示主要职位
                createdTime: null, // 请假单提交时间
                createdTimeStr: null, // 请假单提交时间
                begin: null, // 开始日期
                end: null, // 结束日期
                beginHour: null, // 开始时间点
                endHour: null, // 结束时间点
                img: null, // 图片证明
                approverList: [{ // 审批人列表
                    approverUserName: '', // 审批人姓名
                    userPhoto: null, // 审批人头像地址
                    createdTimeStr: null, // 审批时间
                    status: null // 审批状态 0：审批中 1：驳回 2：通过
                }],
                correlation: [{ // 抄送人列表
                    correlationUserName: '', // 抄送人名字
                    userPhoto: null // 抄送人头像
                }],
                status: null, // 0：审批中 1：驳回 2：通过
                isCurrent: true // true false 是否是当前审批人
            },
            approvalList: 0, // 从审批列表转入 0 不是 1 是
            mId: 0, // 流程ID
            onlyOne: false
        }
    },
    computed: {
        refuseShow: function () {
            return this.info.isCurrent && this.info.status === 0 && this.approvalList === 1
        },
        bigImg: function () {
            return !this.$route.query.id
        }
    },
    methods: {
        init () { // 初始化 列表
            this.mId = this.$route.query.id
            this.approvalList = this.$route.query.type ? this.$route.query.type * 1 : 0
            this.$get('api/workflow/breastfeed_info', {
                mId: this.mId
            }).then(res => {
                this.info = res.data.data
            })
        },
        bigShow (val) {
            // 用改变router的方式实现大图的切换的原因：保证用手机的回退键时大图回退到详情页面
            this.$router.push({name: 'breastfeed-info'})
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
        back () {
            this.$router.go(-1)
        },
        agree () {
            this.$post('api/workflow/vacation_pass', {
                mId: this.mId,
                type: 1,
                agreeReason: this.agreeReason
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
            this.$post('api/workflow/vacation_refuse', {
                mId: this.mId,
                type: 1,
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
<style scoped>
    .hei10{ height: 10px; background: #f5f6f8;}
    .copier{ color: #666; font-size: 14px; width: 90%; margin: 0 auto; border-top: 1px solid #f0f0f0; padding-top: 10px;}
    .imgDiv{ position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: #000;}
    .bigImage{ width: 100%; position: absolute; top: 0; right: 0; bottom: 0; left: 0; margin: auto;}
</style>
