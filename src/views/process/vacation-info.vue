<template>
    <div ref="screenDiv" v-bind:class="!bigImg ? 'posR' : ''">
        <div v-show="!bigImg">
            <x-header @on-click-back="toList" :left-options="{backText: '', preventGoBack: true}" class="header_fix">请假详情</x-header>
            <div class="header_blank" ></div>
            <div class="applicantInfoNode">
                <div class="applicant">
                    <img class="applicant_portrait" :src="info.userPhoto" v-if="info.userPhoto" />
                    <span class="applicant_portrait" v-else>{{info.userName | firstName}}</span>
                    <span>{{info.userName}}</span>
                </div>
                <div class="applicant_data">
                    <table>
                        <tbody>
                            <tr> <td>所在部门</td> <td>{{info.deptName || '-'}}</td> </tr>
                            <tr> <td>所在职位</td> <td>{{info.postName || '-'}}</td> </tr>
                            <tr class="hei10"></tr>
                            <tr> <td>提交时间</td> <td>{{vacationNew.createdTimeStr || '-'}}</td> </tr>
                            <tr> <td>事由</td> <td>{{vacationNew.reason || '-'}}</td> </tr>
                            <tr v-if="vacationNew.img">
                                <td>图片证明</td>
                                <td style="padding-top: 6px;"><img style="width: 100px;" :src="vacationNew.img" alt="" @click="bigShow(vacationNew.img)"></td>
                            </tr>
                        </tbody>
                        <tbody v-for="(row, index) in vacationNew.procedures" :key="index">
                            <tr>
                                <td>请假类型</td>
                                <td>{{row.type || '-'}}</td>
                            </tr>
                            <tr>
                                <td>请假时间</td>
                                <td>{{row.begin || '-'}} 至 {{row.end || '-'}}</td>
                            </tr>
                            <tr>
                                <td>时长</td>
                                <td>{{row.timeStr || '-'}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table v-show="showAll === 1">
                        <tbody>
                            <tr class="hei10"></tr>
                            <tr>
                                <td>提交时间</td>
                                <td>{{vacationOld.createdTimeStr || '-'}}</td>
                            </tr>
                            <tr>
                                <td>事由</td>
                                <td>{{vacationOld.reason || '-'}}</td>
                            </tr>
                            <tr v-if="vacationOld.img">
                                <td>图片证明</td>
                                <td style="padding-top: 6px;"><img style="width: 100px;" :src="vacationOld.img" alt="" @click="bigShow(vacationOld.img)"></td>
                            </tr>
                        </tbody>
                        <tbody v-for="(row, index) in vacationOld.procedures" :key="index">
                            <tr>
                                <td>请假类型</td>
                                <td>{{row.type || '-'}}</td>
                            </tr>
                            <tr>
                                <td>请假时间</td>
                                <td>{{row.begin || '-'}} 至 {{row.end || '-'}}</td>
                            </tr>
                            <tr>
                                <td>时长</td>
                                <td>{{row.timeStr || '-'}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p style="margin-top: 10px;" class="showAll" v-if="vacationOld.createdTime" @click="showAllFun">
                        {{['展开', '收起'][showAll]}}
                        <img class="down" :class="showAll ? '' : 'tfm180'" src="../../img/showArrow.png" />
                    </p>
                </div>
            </div>
            <div class="hei10"></div>
            <!-- 循环审批人 -->
            <div>
                <div class="loop_process" style="margin-top: 14px;">
                    <img class="members_portrait marginRight15" v-if="info.userPhoto" :src="info.userPhoto" />
                    <span class="members_portrait marginRight15" v-else>{{info.userName | firstName}}</span>
                    {{info.userName}}
                    <span style="margin-left: 4px;">发起申请</span>
                    <span class="time_right">{{vacationNew.createdTimeStr}}</span>
                    <img class="info_buleArrow" src="../../img/dGrayArrow.png" v-if="info.status === 4"/>
                    <img class="info_buleArrow" src="../../img/dBuleArrow.png" v-else/>
                </div>
                <div v-for="(row, index) in info.approverList" :key="index">
                    <div class="loop_process" v-if="row.length === 1" :class="(row[0].status === 1 || row[0].status === 2) && row[0].rejectReason ? 'hei_auto' : ''">
                        <img class="members_portrait marginRight15" v-if="row[0].userPhoto" :src="row[0].userPhoto" />
                        <span class="members_portrait marginRight15" v-else>{{row[0].approverName | firstName}}</span>
                        {{row[0].approverName}}
                        <span class="marL4" v-bind:class="info.status !== 4 ? 'colec' : ''" v-if="row[0].status === 0 && approvalNode === index">待审批</span>
                        <span class="marL4" v-bind:class="info.status !== 4 ? 'colcc' : ''" v-if="row[0].status === 0 && approvalNode !== index">待审批</span>
                        <span class="marL4" v-bind:class="info.status !== 4 ? 'col8' : ''" v-if="row[0].status === 2">已同意</span>
                        <span class="marL4" v-bind:class="info.status !== 4 ? 'colRed' : ''" v-if="row[0].status === 1">已驳回</span>
                        <span class="time_right" v-if="row[0].status !== 0">{{row[0].createdTimeStr}}</span>
                        <p v-if="(row[0].status === 1 || row[0].status === 2) && row[0].rejectReason" style="padding-left: 57px;line-height: 20px;" :class="row[0].status === 1 ? 'colRed' :'col8'">{{row[0].rejectReason}}</p>
                        <img v-if="info.approverList.length - 1 !== index && index<approvalNode && info.status !== 4" class="info_buleArrow" :class="(row[0].status === 1 || row[0].status === 2) && row[0].rejectReason ? 'top62' : ''" src="../../img/dBuleArrow.png" />
                        <img v-if="info.approverList.length - 1 !== index && index<approvalNode && info.status === 4" class="info_buleArrow" :class="(row[0].status === 1 || row[0].status === 2) && row[0].rejectReason ? 'top62' : ''" src="../../img/dGrayArrow.png" />
                        <img v-if="info.approverList.length - 1 !== index && index >= approvalNode" class="info_buleArrow" :class="(row[0].status === 1 || row[0].status === 2) && row[0].rejectReason ? 'top62' : ''" src="../../img/dGrayArrow.png" />
                    </div>
                    <div class="borderBlue loop_processComplex" v-if="row.length > 1">
                        <div style="padding: 5px;" v-for="(list, indexs) in row" :key="indexs">
                            <img class="members_portrait marginRight15" v-if="list.userPhoto" :src="list.userPhoto" />
                            <span class="members_portrait marginRight15" v-else>{{list.approverName | firstName}}</span>
                            {{list.approverName}}
                            <span class="marL4" v-bind:class="info.status !== 4 ? 'colec' : ''" v-if="list.status === 0 && approvalNode === index">待审批</span>
                            <span class="marL4" v-bind:class="info.status !== 4 ? 'colcc' : ''" v-if="list.status === 0 && approvalNode !== index">待审批</span>
                            <span class="marL4" v-bind:class="info.status !== 4 ? 'col8' : ''" v-if="list.status === 2">已同意</span>
                            <span class="marL4" v-bind:class="info.status !== 4 ? 'colRed' : ''" v-if="list.status === 1">已驳回</span>
                            <span class="time_right" v-if="list.status !== 0">{{list.createdTimeStr}}</span>
                            <p v-if="(list.status === 1 || list.status === 2) && list.rejectReason" style="padding-left: 57px;line-height: 20px;" :class="list.status === 1 ? 'colRed' :'col8'">{{list.rejectReason}}</p>
                        </div>
                        <img v-if="info.approverList.length - 1 !== index && index<approvalNode && info.status !== 4" class="info_buleArrowComplex" src="../../img/dBuleArrow.png" />
                        <img v-if="info.approverList.length - 1 !== index && index<approvalNode && info.status === 4" class="info_buleArrowComplex" src="../../img/dGrayArrow.png" />
                        <img v-if="info.approverList.length - 1 !== index && index >= approvalNode" class="info_buleArrowComplex" src="../../img/dGrayArrow.png" />
                    </div>
                    <div v-if="row.length > 1" style="height: 30px;"></div>
                </div>
            </div>
            <!-- 循环抄送人 -->
            <cc-info :cclist="info.correlation"></cc-info>
            <div style="height: 50px;" v-if="refuseShow || recallShow"></div>
            <div class="buttons" v-if="refuseShow">
                <div @click="rejectShow=true">拒绝</div>
                <div @click="agreeShow=true">同意</div>
            </div>
            <div class="buttons" v-if="recallShow" @click="recall">撤回</div>
            <div class="mask" v-if="info.status === 4"></div>
            <div class="recall" v-if="info.status === 4">已撤回</div>
        </div>
        <div class="imgDiv" v-show="bigImg" @click="back">
            <img class="bigImage" :src="imgSrc" alt="" >
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
import {Confirm, XTextarea, Group} from 'vux'
import ccInfo from '../components/ccInfo.vue'
export default {
    name: 'vacation-info',
    components: {ccInfo, Confirm, XTextarea, Group},
    data () {
        return {
            mId: 0, // 流程ID
            rejectShow: false, // 驳回弹框显示
            rejectReason: null, // 审批驳回理由
            agreeShow: false, // 同意弹框显示
            agreeReason: null, // 审批审批意见
            info: {
                userName: '', // 申请人名字
                userPhoto: null, // 申请人头像
                deptName: null, // 申请人部门  只展示主要职位对应部门
                postName: null, // 申请人职位 - 只展示主要职位
                vacationList: [ // 当前流程如有连续请假, 则把前面的请假信息一块都返回
                    {
                        createdTime: null, // 请假单提交时间
                        createdTimeStr: null, // 请假单提交时间
                        reason: null, // 请假事由
                        img: null, // 图片证明
                        procedures: [{ // 多个请假类型就多一条数据
                            begin: null, // 开始时间
                            end: null, // 结束时间
                            type: null, // 1.调休；2.转换年假；3.年假；4.事假；5.婚假；6.丧假；7.工伤；8.产假；9.陪产假
                            time: null, // 请假时长
                            timeStr: null
                        }]
                    }
                ],
                approverList: [{ // 审批人列表
                    approverName: '', // 审批人姓名
                    userPhoto: null, // 审批人头像地址
                    createdTimeStr: null, // 审批时间
                    status: null // 审批状态 0：审批中 1：驳回 2：通过
                }],
                correlation: [{ // 抄送人列表
                    correlationUserName: '', // 抄送人名字
                    userPhoto: null // 抄送人头像
                }],
                status: null, // 0：审批中 1：驳回 2：通过 4 已撤回
                isBack: null, // 1 可撤回 0不可撤回
                isCurrent: null // true false 是否是当前审批人
            },
            vacationNew: {}, // 当前申请单详情
            vacationOld: {}, // 以前申请单详情
            approvalList: 0, // 从审批列表转入 0 不是 1 是
            processMy: 0, // 从申请列表转入
            approvalNode: 0, // 待审批的当前节点 同意 拒绝则没有o
            showAll: 0, // 展示全部 0 不展示全部 1 展示全部
            imgSrc: null
        }
    },
    computed: {
        recallShow: function () {
            return this.info.isBack === 1 && (this.info.status === 0 || this.info.status === 2) && this.processMy === 1
        },
        refuseShow: function () {
            return this.info.isCurrent && this.info.status === 0 && this.approvalList === 1
        },
        bigImg: function () {
            return !this.$route.query.id
        }
    },
    methods: {
        init () {
            const hei = document.documentElement.clientHeight || document.body.clientHeight
            this.$refs.screenDiv.style.minHeight = hei + 'px'
            this.mId = this.$route.query.id
            this.approvalList = this.$route.query.type ? this.$route.query.type * 1 : 0
            this.processMy = this.$route.query.processMy ? this.$route.query.processMy * 1 : 0
            this.$get('api/workflow/vacation_info', {
                mId: this.mId
            }).then(res => {
                this.info = res.data.data
                // 请假类型
                const vacaLength = this.info.vacationList.length
                this.vacationNew = this.info.vacationList[0]
                this.vacationOld = vacaLength > 1 ? this.info.vacationList[vacaLength - 1] : {}
                // 判断流程到了哪个节点
                if (this.info.status === 0 || this.info.status === 1) {
                    for (let x = 0; x < this.info.approverList.length; x++) {
                        for (let y = 0; y < this.info.approverList[x].length; y++) {
                            if (this.info.approverList[x][y].status === 0 || this.info.approverList[x][y].status === 1) {
                                this.approvalNode = x
                                return
                            }
                        }
                    }
                } else {
                    this.approvalNode = this.info.approverList.length
                }
            })
        },
        bigShow (val) {
            // 用改变router的方式实现大图的切换的原因：保证用手机的回退键时大图回退到详情页面
            this.$router.push({name: 'vacation-info'})
            this.imgSrc = val
        },
        back () {
            this.$router.go(-1)
        },
        showAllFun () {
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
            this.$post('api/workflow/vacation_pass', {
                mId: this.mId,
                type: 2,
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
            this.$post('api/workflow/vacation_refuse', {
                mId: this.mId,
                type: 2,
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
        },
        recall () {
            const self = this
            this.$vux.confirm.show({
                content: '确认要撤回吗？',
                onCancel () {},
                onConfirm () {
                    self.$post('api/workflow/vacation_recall', {
                        mId: self.mId
                    }).then(res => {
                        if (res.data.data && res.data.data.res === 1) {
                            self.$vux.alert.show({
                                title: '提示',
                                content: '操作成功'
                            })
                            self.$router.replace({name: 'process-my'})
                        } else {
                            self.$vux.alert.show({
                                title: '提示',
                                content: res.data.msg || '操作失败'
                            })
                        }
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
    .hei_auto{ min-height: 70px; height: auto !important;}
    .top62{ top: 62% !important;}
    .posR{ position: relative;}
    .hei10{ height: 10px; background: #f5f6f8;}
    .marL4{ margin-left: 4px;}
    .colec{ color: #0395ec;}
    .colcc{ color: #cccccc;}
    .col8{ color: #24b188;}
    .colRed{ color: red;}
    .mask{ position: absolute; top: 0; right: 0; bottom: 0; left: 0; z-index: 999; background: #000; opacity: .2; /* 元素永远不会成为鼠标事件的target */ pointer-events: none;}
    .recall{ width: 130px; height: 130px; border: 1px solid #4a4848; border-radius: 100%; color: #4a4848; text-align: center; line-height: 130px; font-size: 28px; position: absolute; top: 64px; right: 24px;transform: rotate(30deg);}
    .copier{ color: #666; font-size: 14px; width: 90%; margin: 0 auto; border-top: 1px solid #f0f0f0; padding-top: 10px;}
    .down{ width: 16px; height: 16px; margin-left: 10px;}
    .imgDiv{ position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: #000;}
    .bigImage{ width: 100%; position: absolute; top: 0; right: 0; bottom: 0; left: 0; margin: auto;}
</style>
