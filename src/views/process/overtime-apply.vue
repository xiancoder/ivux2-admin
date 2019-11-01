<template>
    <div>
        <x-header :left-options="{backText: ''}" class="header_fix">加班申请<a slot="right" style="color: #fff" @click="applyPost">提交</a></x-header>
        <div class="header_blank"></div>
        <group gutter="0" class="info_container">
            <datetime v-model="date" placeholder="请选择加班日期" year-row="{value}年" month-row="{value}月" day-row="{value}日">
                <div slot="title"><span class="red">* </span>加班日期</div>
            </datetime>
        </group>
        <div v-for="(modal, index) in applyList" :key="index">
            <div class="divide">
                加班人员及时间
                <img src="../../img/delete.png" class="fr" @click="removeApply(index)" v-show="applyList.length > 1">
            </div>
            <group gutter="0" class="info_container">
                <cell primary="content" :is-link="true">
                    <div slot="title"><span class="red">* </span>加班人员</div>
                    <span @click="openPop(index)" v-show="modal.nameBox.length === 0">请选择加班人员</span>
                    <span @click="openPop(index)" v-show="modal.nameBox.length > 0">
                        <span v-for="(name, index) in modal.nameBox" :key="index" v-show="index < 5"><span v-show="modal.nameBox.length !== 1 && index !== 0">, </span>{{name}}</span>
                        <span v-show="modal.nameBox.length > 5">等</span>
                    </span>
                    <popup v-model="modal.popShow" position="bottom" height="100%" class="margin_style">
                        <div class="popTop">
                            <span @click="cancelPop(index)">取消</span>
                            <span style="float: right;color: #0094eb" @click="confirmPop(index)">确定</span>
                        </div>
                        <search @result-click="resultClick" @on-change="getResult" :results="results" v-model="keyWord" class="searchInput"
                                :auto-fixed="false" placeholder="搜索并选择加班人员"></search>
                        <div class="popResult" v-show="popNameBox.length > 0">
                            <span v-for="(co, index) in popNameBox" :key="index" @click="removeUser(index)">{{co}}<icon type="clear"></icon>&nbsp;&nbsp;</span>
                        </div>
                    </popup>
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
                    {{modal.time}}小时
                </cell>
            </group>
        </div>
        <div class="divide tc blue" @click="addApply">+ 添加加班人员及时间</div>
        <group gutter="0">
            <x-textarea v-model="reason" placeholder="请输入加班事由" :max="50" style="font-size: 14px">
                <div slot="label" style="padding-right: 10px" class="color_333"><span class="red">* </span>加班事由</div>
            </x-textarea>
        </group>
        <div class="grey_line"></div>
        <approver :data="nodeList" :status="nodeStatus"></approver>
        <div class="grey_line"></div>
        <copy-person v-model="ccData" :userList="userList" :ccList="ccList"></copy-person>
    </div>
</template>
<script>
import {XHeader, Group, Cell, Loading, Datetime, Popup, Search, Icon, XTextarea} from 'vux'
import approver from '../components/approver.vue'
import copyPerson from '../components/copy-person.vue'
export default {
    name: 'overtime-apply',
    components: {
        XHeader, Group, Cell, Popup, Search, Loading, Datetime, Icon, XTextarea, approver, copyPerson
    },
    data () {
        return {
            id: 0,
            userList: [],
            date: '',
            applyList: [
                {
                    popShow: false,
                    users: [],
                    nameBox: [],
                    begin: '',
                    end: '',
                    time: 0
                }
            ],
            keyWord: '',
            idBox: [],
            nameBox: [],
            popIdBox: [],
            popNameBox: [],
            results: [],
            reason: '',
            nodeStatus: true,
            nodeList: [],
            ccList: [],
            ccData: []
        }
    },
    methods: {
        init () {
            this.$get('api/task/allusers', {
            }).then((res) => {
                this.userList = res.data.data.list
            })
            this.$get('api/workflow/get_node', {
                wId: 8
            }).then((res) => {
                this.nodeStatus = res.data.data.status
                if (this.nodeStatus) {
                    this.nodeList = res.data.data.node
                }
                this.ccList = res.data.data.list
            })
        },
        // 校验开始结束时间并计算时长
        checkTime (index, begin, end) {
            if (begin && end) {
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
                    this.applyList[index].begin = begin
                    this.applyList[index].end = end
                    this.applyList[index].time = Math.floor((endTime - beginTime) / 60)
                }
            } else {
                this.applyList[index].begin = begin
                this.applyList[index].end = end
            }
        },
        beginSelect (index) {
            let self = this
            this.$vux.datetime.show({
                cancelText: '取消',
                confirmText: '确定',
                format: 'HH: mm',
                value: self.applyList[index].begin,
                hourRow: '{value}时',
                minuteRow: '{value}分',
                onConfirm (val) {
                    self.checkTime(index, val, self.applyList[index].end)
                }
            })
        },
        endSelect (index) {
            let self = this
            this.$vux.datetime.show({
                cancelText: '取消',
                confirmText: '确定',
                format: 'HH: mm',
                value: self.applyList[index].end,
                hourRow: '{value}时',
                minuteRow: '{value}分',
                onConfirm (val) {
                    self.checkTime(index, self.applyList[index].begin, val)
                }
            })
        },
        // 选择人员
        deepCopy (value) {
            return JSON.parse(JSON.stringify(value))
        },
        openPop (index) {
            this.applyList[index].popShow = true
            this.keyWord = ''
            this.results = []
            this.popIdBox = this.deepCopy(this.applyList[index].users)
            this.popNameBox = this.deepCopy(this.applyList[index].nameBox)
        },
        cancelPop (index) {
            this.applyList[index].popShow = false
            this.popIdBox = this.deepCopy(this.applyList[index].users)
            this.popNameBox = this.deepCopy(this.applyList[index].nameBox)
        },
        confirmPop (index) {
            this.applyList[index].popShow = false
            this.applyList[index].users = this.deepCopy(this.popIdBox)
            this.applyList[index].nameBox = this.deepCopy(this.popNameBox)
        },
        resultClick (item) {
            if (item.value !== -1) {
                let id = item.value
                let name = item.title
                if (!this.popIdBox.includes(id)) {
                    this.popIdBox.push(id)
                    this.popNameBox.push(name)
                }
            }
        },
        removeUser (index) {
            this.popIdBox.splice(index, 1)
            this.popNameBox.splice(index, 1)
        },
        searchUser (val) {
            let rs = []
            for (let i = 0; i < this.userList.length; i++) {
                if (this.userList[i].emailStr.includes(val)) {
                    rs.push({
                        title: this.userList[i].userName,
                        value: this.userList[i].userId
                    })
                }
            }
            if (rs.length === 0) {
                return [{title: '无匹配数据', value: -1}]
            } else {
                return rs
            }
        },
        getResult (val) {
            this.results = val ? this.searchUser(this.keyWord) : []
        },
        // 添加删除模块
        addApply () {
            let empty = {
                popShow: false,
                users: [],
                nameBox: [],
                begin: '',
                end: '',
                time: 0
            }
            this.applyList.push(empty)
        },
        removeApply (index) {
            this.applyList.splice(index, 1)
        },
        // 提交
        checkFail () {
            this.$vux.alert.show({
                title: '提示',
                content: '请将信息填写完善'
            })
        },
        checkForm () {
            if (this.date === '' || this.reason === '') {
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
            for (let i = 0; i < this.applyList.length; i++) {
                if (this.applyList[i].users.length === 0) {
                    this.checkFail()
                    return false
                }
                if (this.applyList[i].time < 2) {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '加班时长不得小于2小时'
                    })
                    return false
                }
            }
            return true
        },
        applyPost () {
            if (this.checkForm()) {
                this.$vux.loading.show({
                    text: 'Loading'
                })
                let pa = {
                    id: this.id,
                    date: this.date,
                    reason: this.reason,
                    content: this.applyList,
                    correlation: this.ccData
                }
                this.$post('api/workflow/overtime_edit', pa).then((res) => {
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
