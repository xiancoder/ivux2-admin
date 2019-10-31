<template>
    <div>
        <x-header @on-click-back="toList" :left-options="{backText: '', preventGoBack: true}" class="header_fix">出差详情</x-header>
        <div class="header_blank"></div>
        <div class="applicantInfoNode">
            <div class="applicant">
                <img class="applicant_portrait" :src="info.userPhoto" v-if="info.userPhoto" />{{info.userName}}
                <span class="applicant_portrait" v-if="!info.userPhoto">{{info.userName | firstName}}</span>
            </div>
            <div class="applicant_data">
                <table>
                    <tr>
                        <td>提交时间</td>
                        <td>{{info.createdTime}}</td>
                    </tr>
                    <tr>
                        <td>所在部门</td>
                        <td>{{info.deptName}}</td>
                    </tr>
                    <tr>
                        <td>所在职位</td>
                        <td>{{info.postName}}</td>
                    </tr>
                </table>
                <table style="margin-top: 10px">
                    <tr>
                        <td>事由</td>
                        <td>{{info.reason}}</td>
                    </tr>
                    <tr>
                        <td>出发时间</td>
                        <td>{{info.outTime}}</td>
                    </tr>
                    <tr>
                        <td>返回时间</td>
                        <td>{{info.backTime}}</td>
                    </tr>
                    <tr>
                        <td>出差天数</td>
                        <td>{{info.days}}</td>
                    </tr>
                    <tr>
                        <td>出行方式</td>
                        <td>{{info.tripType}}</td>
                    </tr>
                    <tr>
                        <td>目的地</td>
                        <td>{{info.destination.join('，')}}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="grey_line"></div>
        <!-- 循环审批人 -->
        <node-info :info="info"></node-info>
        <!-- 循环抄送人 -->
        <cc-info :cclist="info.correlation"></cc-info>
        <div style="height: 50px;"></div>
        <div class="buttons" v-if="info.isCurrent && info.status === 0 && approvalList">
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
    <!-- 弹框提示已撤回使用 XDialog 组件 -->
</template>
<script>
import { XHeader, XButton, Confirm, XTextarea, Group} from 'vux'
import ccInfo from '../components/ccInfo.vue'
import nodeInfo from '../components/nodeInfo.vue'
export default {
    name: 'busTrip-info',
    components: {XHeader, XButton, ccInfo, nodeInfo, Confirm, XTextarea, Group},
    data () { // 参数声明
        return {
            rejectShow: false, // 驳回弹框显示
            rejectReason: null, // 审批驳回理由
            agreeShow: false, // 同意弹框显示
            agreeReason: null, // 审批审批意见
            mId: 0, // 流程ID
            info: {
                userName: '',
                userPhoto: '',
                createdTime: '',
                deptName: '',
                postName: '',
                outTIme: '',
                backTime: '',
                days: 0,
                reason: '',
                destination: [],
                approverList: [{
                    approverUserName: '',
                    approverImg: '',
                    createdTime: '',
                    status: 1 // 审批状态 1 待审批 2 已同意 3 已驳回
                }],
                correlation: [{
                    correlationUserName: '',
                    userPhoto: ''
                }],
                isCurrent: false, // 是否是当前审批人
                status: 0 // 0 正常 1 驳回 2 通过
            },
            approvalList: 0, // 从审批列表转入 0 不是 1 是
            approvalNode: 0 // 待审批的当前节点 同意 拒绝则没有。
        }
    },
    methods: {
        init () { // 初始化 列表
            this.mId = this.$route.query.id
            if (this.$route.query.type) {
                this.approvalList = this.$route.query.type
            }
            this.$get('api/workflow/bus_trip_info', {
                mId: this.$route.query.id
            }).then(res => {
                this.info = res.data.data.info
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
            this.$post('api/workflow/bus_trip_pass', {
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
            this.$post('api/workflow/bus_trip_refuse', {
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
<style lang="less">
    @import '../main.less';
</style>
