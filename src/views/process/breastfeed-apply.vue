<template>
    <div>
        <x-header :left-options="{backText: ''}" class="header_fix">哺乳假申请<a slot="right" style="color: #fff" @click="applyPost">提交</a></x-header>
        <div class="header_blank"></div>
        <div>
            <group gutter="0" class="info_container">
                <cell primary="content" :is-link="true">
                    <div slot="title"><span class="red">* </span>开始日期</div>
                    <span v-show="!applyList.begin" @click="beginSelect()">选择开始日期</span>
                    <span v-show="applyList.begin" @click="beginSelect()">{{applyList.begin}}</span>
                </cell>
                <cell primary="content" :is-link="true">
                    <div slot="title"><span class="red">* </span>结束日期</div>
                    <span v-show="!applyList.end" @click="endSelect()">选择结束日期</span>
                    <span v-show="applyList.end" @click="endSelect()">{{applyList.end}}</span>
                </cell>
                <cell primary="content" :is-link="true">
                    <div slot="title"><span class="red">* </span>开始时间</div>
                    <span v-show="!applyList.beginHour" @click="beginHour()">选择开始时间</span>
                    <span v-show="applyList.beginHour" @click="beginHour()">{{applyList.beginHour}}</span>
                </cell>
                <cell primary="content" :is-link="true">
                    <div slot="title"><span class="red">* </span>结束时间</div>
                    <span v-show="!applyList.endHour" @click="endHour()">选择结束时间</span>
                    <span v-show="applyList.endHour" @click="endHour()">{{applyList.endHour}}</span>
                </cell>
            </group>
        </div>
        <div class="grey_line"></div>
        <group gutter="0" class="info_container">
            <cell primary="content">
                <div slot="title"><span class="red">* </span>图片证明</div>
            </cell>
            <div style="margin: 0px 0px 20px 28px;">
                <upImage :imgProve="imgProve" v-on: change-img="changeImg"></upImage>
                <div slot="title" style="margin-top: 16px;font-size: 12px;">提示：请将出生证明复印件交给前台</div>
            </div>
        </group>
        <div class="grey_line"></div>
        <!-- 请假审批人全部流程 -->
        <approver :data="approvalNode.users" :status="nodeStatus"></approver>
        <div class="grey_line"></div>
        <copy-person v-model="ccData" :userList="userList" :ccList="ccList"></copy-person>
    </div>
</template>
<script>
import {Group, Cell, Loading, Datetime, Popup, Search, Icon, PopupPicker} from 'vux'
import approver from '../components/approver.vue'
import copyPerson from '../components/copy-person.vue'
import upImage from '../components/up-imgNoCut.vue'
export default {
    name: 'breastfeed-apply',
    components: {
        Group, Cell, Popup, Search, Loading, Datetime, Icon, copyPerson, PopupPicker, upImage, approver
    },
    data () {
        return {
            userList: [], // 抄送人列表
            imgProve: '', // 图片证明
            approvalNode: [], // 审批人全部节点
            jobReceiver: [], // 工作接收人结果
            jobReceiverSearch: '', // 工作接收人搜索 input value 显示
            applyList: // 哺乳假信息
            {
                begin: '',
                end: '',
                beginHour: '',
                endHour: ''
            },
            keyWord: '',
            results: [],
            nodeStatus: true, // 节点是否异常
            ccList: [],
            ccData: []
        }
    },
    methods: {
        init () {
            // 获取所有的请假类型
            this.$get('api/task/allusers', {
            }).then((res) => {
                this.userList = res.data.data.list
            })
            // 获取请假的全部请假节点和审批人列表
            this.$get('api/workflow/vacation_node', {
                wId: 7
            }).then((res) => {
                this.nodeStatus = res.data.data.status
                if (res.data.data.status) {
                    this.approvalNode = res.data.data.node[0]; // 所有审批流程
                }
                this.ccList = res.data.data.list
            })
        },
        // 校验开始结束时间并计算时长
        checkTime (begin, end, type) {
            // 类型一是日，类型二是小时
            // 如果type 等于 就是日期选择（精确到日）
            if (type === 1) {
                if (begin && end) {
                    // 获取开始时间的时间戳 判断日期大小
                    let b = begin.replace(/-/g, '/')
                    let bStr = new Date(b).getTime()
                    // 获取结束时间的时间戳
                    let e = end.replace(/-/g, '/')
                    let eStr = new Date(e).getTime()
                    if (bStr <= eStr) {
                        this.applyList.begin = begin
                        this.applyList.end = end
                    } else {
                        this.$vux.toast.show({
                            type: 'cancel',
                            text: '开始时间需早于结束时间'
                        })
                    }
                } else {
                    this.applyList.begin = begin
                    this.applyList.end = end
                }
            } else {
                if (begin && end) {
                    // 前端判断开始时间和结束时间是否可以通过   单位：时分
                    let beginHour = begin.substr(0, 2)
                    let beginMin = begin.substr(3, 2)
                    let endHour = end.substr(0, 2)
                    let endMin = end.substr(3, 2)
                    let beginTime = parseInt(beginHour) * 60 + parseInt(beginMin)
                    let endTime = parseInt(endHour) * 60 + parseInt(endMin)
                    if (beginTime >= endTime) {
                        this.$vux.toast.show({
                            type: 'cancel',
                            text: '开始时间需早于结束时间'
                        })
                    } else {
                        this.applyList.beginHour = begin
                        this.applyList.endHour = end
                    }
                } else {
                    this.applyList.beginHour = begin
                    this.applyList.endHour = end
                }
            }
        },
        // 开始时间选择
        beginSelect () {
            let self = this
            this.$vux.datetime.show({
                cancelText: '取消',
                confirmText: '确定',
                format: 'YYYY-MM-DD',
                value: self.applyList.begin,
                yearRow: '{value}年',
                monthRow: '{value}月',
                dayRow: '{value}日',
                onConfirm (val) {
                    self.checkTime(val, self.applyList.end, 1)
                }
            })
        },
        // 图片传参
        changeImg (data) {
            this.imgProve = data
        },
        // 结束时间选择
        endSelect () {
            let self = this
            this.$vux.datetime.show({
                cancelText: '取消',
                confirmText: '确定',
                format: 'YYYY-MM-DD',
                value: self.applyList.end,
                yearRow: '{value}年',
                monthRow: '{value}月',
                dayRow: '{value}日',
                onConfirm (val) {
                    self.checkTime(self.applyList.begin, val, 1)
                }
            })
        },
        // 开始时间选择 (小时)
        beginHour () {
            let self = this
            this.$vux.datetime.show({
                cancelText: '取消',
                confirmText: '确定',
                format: 'HH: mm',
                value: self.applyList.beginHour,
                hourRow: '{value}时',
                minuteRow: '{value}分',
                onConfirm (val) {
                    self.checkTime(val, self.applyList.endHour, 2)
                }
            })
        },
        // 结束时间选择 (小时)
        endHour () {
            let self = this
            this.$vux.datetime.show({
                cancelText: '取消',
                confirmText: '确定',
                format: 'HH: mm',
                value: self.applyList.endHour,
                hourRow: '{value}时',
                minuteRow: '{value}分',
                onConfirm (val) {
                    self.checkTime(self.applyList.beginHour, val, 2)
                }
            })
        },
        // 以下是提交相关
        checkFail () {
            this.$vux.alert.show({
                title: '提示',
                content: '请将信息填写完善'
            })
        },
        checkF () {
            // 日期+图片
            if (this.applyList.begin === '' || this.applyList.end === '' || this.applyList.beginHour === '' || this.applyList.endHour === '' || this.imgProve === '') {
                this.checkFail()
                return false
            }
            if (!this.nodeStatus) {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请联系人事配置审批流程'
                })
                return false
            }
            return true
        },
        applyPost () {
            if (this.checkForm()) {
                this.$vux.loading.show({
                    text: 'Loading'
                })
                let pa = {
                    img: this.imgProve, // 图片证明
                    beginDate: this.applyList.begin, // 开始日期
                    endDate: this.applyList.end, // 开始日期
                    beginTime: this.applyList.beginHour, // 开始时间
                    endTime: this.applyList.endHour, // 开始时间
                    correlation: this.ccData
                }
                // 哺乳假就差这个问题了。
                this.$post('api/workflow/breastfeed_apply', pa).then((res) => {
                    this.$vux.loading.hide()
                    if (res.data.data && res.data.data.res === 1) {
                        this.$vux.alert.show({
                            title: '提示',
                            content: '提交成功'
                        })
                        this.$router.replace({name: 'process-my'})
                    } else {
                        this.$vux.alert.show({
                            title: '提示',
                            content: res.data.msg || '操作失败'
                        })
                    }
                })
            }
        }
    },
    mounted () {
        this.init()
    }
}
</script>
