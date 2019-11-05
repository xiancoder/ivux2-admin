<template>
    <div>
        <x-header :left-options="{backText: ''}" class="header_fix">请假申请<a slot="right" style="color: #fff" @click="checkForm">提交</a></x-header>
        <div class="header_blank"></div>
        <div v-for="(modal, index) in applyList" :key="index">
            <div class="divide">
                请假类型及时间
                <img src="../../img/delete.png" class="fr" @click="removeApply(index)" v-show="applyList.length > 1">
            </div>
            <group gutter="0" class="info_container">
                <cell primary="content">
                    <div slot="title"><span class="red">* </span>请假类型</div>
                    <popup-picker placeholder="请选择请假类型" :data="leaveAllType" @on-change="listenType(index)" :show-name="true" :columns="3" v-model="modal.types" ref="picker"></popup-picker>
                </cell>
                <cell primary="content" :is-link="true">
                    <div slot="title"><span class="red">* </span>开始时间</div>
                    <span v-show="!modal.begin" @click="beginSelect(index)">选择开始时间</span>
                    <span v-show="modal.begin" @click="beginSelect(index)">{{modal.begin}}</span>
                </cell>
                <cell primary="content" :is-link="true">
                    <div slot="title"><span class="red">* </span>结束时间</div>
                    <span v-show="!modal.end" @click="endSelect(index)">选择结束时间</span>
                    <span v-show="modal.end" @click="endSelect(index)">{{modal.end}}</span>
                </cell>
                <cell primary="content">
                    <div slot="title"><span class="red">* </span>时长</div>
                    <input type="text" v-model="modal.day" class="timeSelect">天
                    <input type="text" v-model="modal.hour" class="timeSelect">小时
                </cell>
            </group>
        </div>
        <div style="padding: 16px 0px 16px 0px;font-size: 12px;text-align: center;border-top: 1px solid #f1f1f1;">提示：请假时长以半小时为单位, 若有误请自行修改</div>
        <div class="divide textCen blue" @click="addApply" v-show="applyList.length === 1">+ 添加请假类型</div>
        <div class="grey_line" v-show="applyList.length === 2"></div>
        <group gutter="0">
            <x-textarea v-model="reason" placeholder="请输入请假事由" :max="50" style="font-size: 14px">
                <div slot="label" style="padding-right: 10px" class="color333"><span class="red">* </span>请假事由</div>
            </x-textarea>
        </group>
        <!-- 图片证明根据当前存在的申请类型来判断展示与否 -->
        <div class="grey_line" v-show="showImgProve"></div>
        <group gutter="0" class="info_container" v-show="showImgProve">
            <cell primary="content">
                <div slot="title"><span class="red">* </span>图片证明</div>
            </cell>
            <div style="margin: 0px 0px 20px 28px;">
                <upImage :imgProve="imgProve" v-on: change-img="changeImg"></upImage>
                <div slot="title" style="margin-top: 16px;font-size: 12px;">提示：请将证件复印件交给前台</div>
            </div>
        </group>
        <confirm v-model="showConfirm"
            title="提示"
            @on-confirm="subData">
            <p style="text-align: center;">您的请假申请流程不完善，不符合法律以及公司规定标准，您确定提交吗？</p>
        </confirm>
        <div class="grey_line"></div>
        <!--<group gutter="0" class="info_container">-->
            <!--<cell primary="content" :is-link="true">-->
                <!--<div slot="title"><span class="red">* </span>工作接收人</div>-->
                <!--<span v-show="!receiverId" @click="addJobReceiver()">选择工作接收人</span>-->
                <!--<span v-show="receiverId" @click="addJobReceiver()">{{receiverName}}</span>-->
            <!--</cell>-->
        <!--</group>-->
        <!--<group gutter="0" class="info_container">-->
            <!--<popup v-model="showReceiver" position="bottom" height="315px" class="margin_style">-->
                <!--<search class="searchInput" @on-result-click="resultJobReceiver" @on-change="getResultJobReceiver" @on-cancel="showReceiver=false;" :results="jobReceiver" v-model="jobReceiverSearch"-->
                    <!--: auto-fixed="false" placeholder="搜索并添加工作接收人"></search>-->
            <!--</popup>-->
        <!--</group>-->
        <div class="grey_line"></div>
        <!-- 请假审批人全部流程 -->
        <div class="scroll_container">
            <div style="padding: 10px 15px">审批人</div>
            <div class="node_error red textCen" v-if="!this.nodeStatus">
                <div>请联系人事配置审批流程</div>
                <div class="hei20"></div>
            </div>
            <div style="width: 100%;overflow: hidden;" v-else v-for="(row, index) in approvalNode" :key="index">
                <div style="padding: 10px 15px">{{row.dayName}}</div>
                <nav class="scroll_list">
                    <div class="inline_block nodeDiv" :class="row2.length>1 ? 'padR54' : ''" v-for="(row2, index2) in row.users" :key="index2">
                        <div :class="row2.length>1 ? 'nodeBorder' : ''" style="display: flex;">
                            <div class="node2 textCen"  v-for="(row3, index3) in row2" :key="index3" >
                                <img :src="row3.photo" v-show="row3.photo !== ''" class="photo_img">
                                <span class="first_name" v-show="row3.photo === ''">{{row3.userName | firstName}}</span>
                                <br>{{row3.userName}}
                            </div>
                        </div>
                        <img class="node_to2" :class="row2.length>1 ? 'posTop22' : ''" src="../../img/rBuleArrow.png" v-show="index2 !== row.users.length - 1">
                    </div>
                </nav>
            </div>
        </div>
        <div class="grey_line"></div>
        <copy-person v-model="ccData" :userList="userList" :ccList="ccList"></copy-person>
        <loading :show="loadingShow === '1'" text="Loading"></loading>
    </div>
</template>
<script>
import {Group, Cell, Loading, Datetime, Popup, Search, Icon, XTextarea, PopupPicker, Confirm} from 'vux'
import copyPerson from '../components/copy-person.vue'
import upImage from '../components/up-imgNoCut.vue'
export default {
    name: 'vacation-apply',
    components: {Group, Cell, Popup, Search, Loading, Datetime, Icon, XTextarea, copyPerson, PopupPicker, upImage, Confirm},
    data () {
        return {
            showConfirm: false, // 是否确认提交
            userList: [], // 抄送人列表
            imgProve: '', // 图片证明
            showImgProve: false, // 图片证明是否展示
            leaveAllType: [], // 所有请假类型
            approvalNode: [], // 审批人全部节点
            // jobReceiver: [], // 工作接收人结果
            // receiverName: '', // 工作接收人name
            // receiverId: '', // 工作接收人Id
            // showReceiver: false, // 显示搜索工作接收人弹框
            // jobReceiverSearch: '', // 工作接收人搜索 input value 显示
            applyList: [
                {
                    types: [], // 请假类型绑定
                    begin: '', // 开始时间
                    end: '', // 结束时间
                    day: '', // 天数
                    hour: '' // 时长
                }
            ],
            reason: '', // 事由
            nodeStatus: true, // 节点是否异常
            ccList: [], // 抄送人所有列表
            ccData: [], // 当前抄送人列表
            loadingShow: ''
        }
    },
    methods: {
        // 初始化方法
        init () {
            // 获取所有的员工列表
            this.$get('api/task/allusers', {
            }).then((res) => {
                this.userList = res.data.data.list
            })
            // 获取上次工作接收人
            // this.$get('api/workflow/vacation_lastreceiveuser', {
            // }).then((res) => {
            //     this.receiverId = res.data.data.lastreceiveuser.id
            //     this.receiverName = res.data.data.lastreceiveuser.name
            // })
            // 获取所有的请假类型
            this.$get('api/workflow/vacation_menu', {
            }).then((res) => {
                for (let x = 0; x < res.data.data.length; x++) {
                    // 剔除哺乳假
                    res.data.data[x].value = res.data.data[x].value.toString()
                    if (res.data.data[x].name === '哺乳假') {
                        res.data.data.splice(x, 1)
                    }
                }
                this.leaveAllType = res.data.data
            })
            // 获取请假的全部请假节点和审批人列表
            this.$get('api/workflow/vacation_node', {
                wId: 7
            }).then((res) => {
                this.nodeStatus = res.data.data.status
                if (this.nodeStatus) {
                    this.approvalNode = res.data.data.node
                }
                this.ccList = res.data.data.list
            })
        },
        // 弹出工作接收人
        // addJobReceiver () {
        //     this.showReceiver = true
        //     this.jobReceiverSearch = ''
        //     this.jobReceiver = []
        // },
        // getResultJobReceiver (val) {
        //     this.jobReceiver = val ? this.sStaff(val) : []
        // },
        // 搜索公司职员
        // sStaff (val) {
        //     let rs = []
        //     for (let i = 0; i < this.userList.length; i++) {
        //         if (this.userList[i].userName.indexOf(val) !== -1) {
        //             rs.push({
        //                 title: this.userList[i].userName,
        //                 value: this.userList[i].userId,
        //             })
        //         }
        //     }
        //     if (rs.length === 0) {
        //         return [{title: '无匹配数据', value: -1}]
        //     } else {
        //         return rs
        //     }
        // },
        // 选中某一 员工 ( 工作接收人 )
        // resultJobReceiver (item) {
        //     if (item.value !== -1) {
        //         this.showReceiver = false
        //         this.receiverId = item.value
        //         this.receiverName = item.title
        //     }
        // },
        // 校验开始结束时间并计算时长
        checkTime (index, begin, end) {
            if (begin && end) {
                // 获取开始时间的时间戳
                let b = begin.replace(/-/g, '/')
                let bStr = new Date(b).getTime()
                // 获取结束时间的时间戳
                let e = end.replace(/-/g, '/')
                let eStr = new Date(e).getTime()
                if (bStr >= eStr) {
                    this.$vux.toast.show({
                        type: 'cancel',
                        text: '开始时间小于结束时间'
                    })
                    return false
                }
                this.applyList[index].begin = begin
                this.applyList[index].end = end
                this.listenData(index)
            } else {
                this.applyList[index].begin = begin
                this.applyList[index].end = end
            }
        },
        // 图片传参
        changeImg (data) {
            this.imgProve = data
        },
        // 开始时间选择
        beginSelect (index) {
            let self = this
            this.$vux.datetime.show({
                cancelText: '取消',
                confirmText: '确定',
                format: 'YYYY-MM-DD HH: mm',
                minHour: 8, // 最小小时
                maxHour: 18, //  最大小时
                value: self.applyList[index].begin,
                yearRow: '{value}年',
                monthRow: '{value}月',
                dayRow: '{value}日',
                hourRow: '{value}时',
                minuteRow: '{value}分',
                onConfirm (val) {
                    self.checkTime(index, val, self.applyList[index].end)
                }
            })
        },
        // 结束时间选择
        endSelect (index) {
            let self = this
            this.$vux.datetime.show({
                cancelText: '取消',
                confirmText: '确定',
                format: 'YYYY-MM-DD HH: mm',
                minHour: 8, // 最小小时
                maxHour: 18, //  最大小时
                value: self.applyList[index].end,
                yearRow: '{value}年',
                monthRow: '{value}月',
                dayRow: '{value}日',
                hourRow: '{value}时',
                minuteRow: '{value}分',
                onConfirm (val) {
                    self.checkTime(index, self.applyList[index].begin, val)
                }
            })
        },
        // 添加删除模块
        addApply () {
            if (this.applyList.length >= 2) {
                this.$vux.alert.show({
                    title: '提示',
                    content: '最多添加两条信息'
                })
                return false
            } else {
                let empty = {
                    types: [],
                    begin: '',
                    end: '',
                    day: '',
                    hour: ''
                }
                this.applyList.push(empty)
                this.listenType()
            }
        },
        // 删除某个类型
        removeApply (index) {
            this.applyList.splice(index, 1)
            this.listenType()
        },
        // 提交错误提示
        checkFail () {
            this.$vux.alert.show({
                title: '提示',
                content: '请将信息填写完善'
            })
        },
        // 监听日期是否填完
        listenData (e) {
            if (this.applyList[e].begin && this.applyList[e].end && this.applyList[e].types[0] && this.applyList[e].types[0].length) {
                // 这里是获取时间相差的日期。 (单位 xx 天 xx 小时 )
                // 条件是，开始结束包括请假的类型都有才进行计算。
                this.$get('api/workflow/vacation_select', {
                    begin: this.applyList[e].begin,
                    end: this.applyList[e].end,
                    type: this.applyList[e].types[0] // 传入请假类型 请假类型有的不排除周末和节假日
                }).then((res) => {
                    if (res.data.data) {
                        this.applyList[e].day = res.data.data.day
                        this.applyList[e].hour = res.data.data.hour
                    } else {
                        this.$vux.toast.show({
                            type: 'cancel',
                            text: res.data.msg
                        })
                        if (res.data.msg === '结束时间是假期') {
                            this.applyList[e].end = ''
                        } else if (res.data.msg === '开始时间是假期') {
                            this.applyList[e].begin = ''
                        }
                    }
                })
            }
        },
        // 监听类型切换 ( 类型切换  添加/删除信息都要判断 )
        listenType (e) {
            // 如果是手动选择切换类型
            // 如果是手动切换类型，也要重新获取请假时间
            if (arguments.length) {
                this.listenData(e)
            }
            for (let x = 0; x < this.applyList.length; x++) {
                // 如果类型等于哪些展示图片上传的类型，就让图片上传展示出来。
                // 只要这个有一个类型有问题就显示图片上传。
                let y = this.applyList[x].types[0]
                if (y === '5' || y === '6' || y === '7' || y === '8' || y === '9') {
                    this.showImgProve = true
                    return false
                }
            }
            this.showImgProve = false
            this.imgProve = ''; // 没有需要填写图片类型
        },
        // 校验请假跨考勤周期
        checkOver (begin, end) {
            let beginMonth = parseInt(begin.substr(5, 2))
            let endMonth = parseInt(end.substr(5, 2))
            let beginDay = parseInt(begin.substr(8, 2))
            let endDay = parseInt(end.substr(8, 2))
            if (beginMonth === endMonth) {
                return beginDay < 26 && endDay >= 26
            } else if (endMonth - beginMonth === 1 || endMonth - beginMonth === -11) {
                return !(beginDay >= 26 && endDay < 26)
            } else {
                return true
            }
        },
        // 必填项是否填写完全
        checkForm () {
            // 判断时间类型是否填写完整
            for (let i = 0; i < this.applyList.length; i++) {
                if (this.applyList[i].begin.length === 0 || this.applyList[i].end.length === 0 || !this.applyList[i].types[0]) {
                    this.checkFail()
                    return false
                }
            }
            // 判断假期时长是否有问题。
            for (let v = 0; v < this.applyList.length; v++) { // 只要有一个填了就继续往下走。
                if (this.applyList[v].types[0] !== '8' && this.checkOver(this.applyList[v].begin, this.applyList[v].end)) {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '不可跨考勤周期请假'
                    })
                    return false
                }
                if (this.applyList[v].day || this.applyList[v].hour) {
                    // 如果天数存在，那么久判断是否为正整数
                    if (this.applyList[v].day) {
                        if (!/^[1-9]\d*$/.test(this.applyList[v].day)) {
                            this.$vux.alert.show({
                                title: '提示',
                                content: '天数请填写正整数'
                            })
                            return false
                        }
                    }
                    // 如果只填写了小时，那么就判断小时是否为正数，是否整除0.5 是否小于8 .
                    if (this.applyList[v].hour) {
                        let reg = /^(0|[1-9][0-9]*)(\.\d+) ? $/
                        // 用户填写的日期异常
                        if (!reg.test(this.applyList[v].hour.toString()) || this.applyList[v].hour % 0.5 !== 0) {
                            this.$vux.alert.show({
                                title: '提示',
                                content: '请假时长以半小时为单位'
                            })
                            return false
                        }
                        // 用户填写的日期超过等于8 小时
                        if (this.applyList[v].hour >= 8) {
                            this.$vux.alert.show({
                                title: '提示',
                                content: '请输入8以内的数字'
                            })
                            return false
                        }
                    }
                } else {
                    this.checkFail()
                    return false
                }
            }
            // 原因，工作接收人是否都填写完整
            if (this.reason === '') {
                this.checkFail()
                return false
            }
            // 要判断图片是否需要上传，并且判断丧假的提示信息。
            if (!this.nodeStatus) {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请联系人事配置审批流程'
                })
                return false
            }
            // 图片证明需要上传
            if (this.showImgProve) {
                let funeral = false; // 是否有丧假类型
                for (let y = 0; y < this.applyList.length; y++) {
                    if (this.applyList[y].types[0] === '6') { // 存在丧假
                        funeral = true
                    }
                }
                // 如果类型中有丧假并且图片没有上传
                if (funeral && !this.imgProve) {
                    this.showConfirm = true
                    return false
                } else if (!funeral && !this.imgProve) { // 如果没有丧假（但是有其他需要上传图片的类型）也没有上传图片
                    this.checkFail()
                    return false
                }
            }
            // 都通过之后提交
            this.subData()
        },
        // 提交申请
        subData () {
            let dataList = []
            for (let x = 0; x < this.applyList.length; x++) {
                let obj = {}
                obj.type = this.applyList[x].types[0]
                obj.begin = this.applyList[x].begin
                obj.end = this.applyList[x].end
                obj.day = this.applyList[x].day ? this.applyList[x].day : 0
                obj.hour = this.applyList[x].hour ? this.applyList[x].hour : 0
                dataList.push(obj)
            }
            let pam = {
                reason: this.reason, // 原因
                img: this.imgProve, // 图片证明 无图就空字符串
                // receiveUser: this.receiverId, // 工作接收人ID
                list: dataList, // 请假信息 最多两条数据，不限类型
                correlation: this.ccData // 抄送人列表
            }
            this.$post('api/workflow/vacation_apply', pam).then((res) => {
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
    },
    mounted () {
        this.init()
    },
    filters: {
        firstName: function (value) { // 截取字符串的第一个
            return value.substr(0, 1)
        }
    }
}
</script>
<style scoped>
    .timeSelect{ width: 40px; height: 25px; border-top: 0; border-right: 0; border-left: 0; border-bottom: 1px solid #ccc; text-align: center; outline: 0;}
    .nodeDiv{ position: relative; padding-right: 44px;}
    .nodeBorder{ border: 1px dashed rgb(3, 149, 236); padding: 6px; margin-left: 16px;}
    .node2{ flex: 1; padding: 0 15px; width: 45px;}
    .node_to2{ position: absolute; right: 14px; top: 15px; width: 20px;}
    .posTop22{ top: 22px; right: 10px;}
</style>
