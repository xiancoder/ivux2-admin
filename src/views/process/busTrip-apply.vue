<template>
    <div>
        <x-header :left-options="{backText: ''}" class="header_fix">出差申请<a slot="right" style="color: #fff" @click="applyPost">提交</a></x-header>
        <div class="header_blank"></div>
        <group gutter="0" class="info_container">
            <cell primary="content" :is-link="true">
                <div slot="title"><span class="red">* </span>出发时间</div>
                <span v-show="!outTime" @click="beginSelect">选择出发时间</span>
                <span v-show="outTime" @click="beginSelect">{{outTime}}</span>
            </cell>
            <cell primary="content" :is-link="true">
                <div slot="title"><span class="red">* </span>返回时间</div>
                <span v-show="!backTime" @click="endSelect">选择返回时间</span>
                <span v-show="backTime" @click="endSelect">{{backTime}}</span>
            </cell>
            <cell primary="content">
                <div slot="title"><span class="red">* </span>出差天数</div>
                {{days}}
            </cell>
        </group>
        <div v-for="(modal, index) in applyList" :key="index">
            <div class="divide">
                目的地
                <img src="../../img/delete.png" class="fr" @click="removeApply(index)" v-show="applyList.length > 1">
            </div>
            <group gutter="0" class="info_container">
                <x-address title="" v-model="modal.address" :list="addressData" placeholder="请选择">
                    <div slot="title" slot-scope="props"><span class="red">* </span><span class="color_333">选择地区</span></div>
                </x-address>
            </group>
            <group gutter="0">
                <x-textarea v-model="modal.detail" placeholder="请输入详细地址" :max="100" style="font-size: 14px">
                    <div slot="label" class="color_333" style="padding-right: 10px"><span class="red">* </span>详细地址</div>
                </x-textarea>
            </group>
        </div>
        <div class="divide tc blue" @click="addApply">+ 添加目的地</div>
        <group gutter="0">
            <x-textarea v-model="reason" placeholder="请输入出差事由" :max="50" style="font-size: 14px">
                <div slot="label" class="color_333" style="padding-right: 10px"><span class="red">* </span>出差事由</div>
            </x-textarea>
        </group>
        <div class="grey_line"></div>
        <div class="check_container">
            <div style="line-height: 35px" class="color_333"><span class="red">* </span>出行方式（多选）</div>
            <checker v-model="tripType" type="checkbox" default-item-class="unSelect" selected-item-class="isSelect">
                <checker-item value="飞机">飞机</checker-item>
                <checker-item value="火车">火车</checker-item>
                <checker-item value="公司车辆">公司车辆</checker-item>
                <checker-item value="长途巴士">长途巴士</checker-item>
                <checker-item value="个人自备车往返里程（km）">个人自备车往返里程（km）</checker-item>
            </checker>
        </div>
        <div class="grey_line"></div>
        <approver :data="nodeList" :status="nodeStatus"></approver>
        <div class="grey_line"></div>
        <copy-person v-model="ccData" :userList="userList" :ccList="ccList"></copy-person>
    </div>
</template>
<script>
import {Group, Cell, Loading, Datetime, XTextarea, XAddress, Checker, CheckerItem} from 'vux'
import approver from '../components/approver.vue'
import copyPerson from '../components/copy-person.vue'
export default {
    name: 'busTrip-apply',
    components: {Group, Cell, Loading, Datetime, XTextarea, XAddress, Checker, CheckerItem, approver, copyPerson},
    data () {
        return {
            id: 0,
            userList: [],
            outTime: '',
            backTime: '',
            days: 0,
            address: [],
            addressData: [],
            applyList: [
                {
                    address: [],
                    detail: ''
                }
            ],
            typeList: [
                {key: '飞机', value: '飞机'},
                {key: '火车', value: '火车'},
                {key: '公司车辆', value: '公司车辆'},
                {key: '长途巴士', value: '长途巴士'},
                {key: '个人自备车往返里程（km）', value: '个人自备车往返里程（km）'}
            ],
            tripType: [],
            reason: '',
            nodeStatus: true,
            nodeList: [],
            ccList: [],
            ccData: []
        }
    },
    methods: {
        init () {
            this.$get('api/sys/area_list', {
            }).then((res) => {
                this.addressData = res.data.data.list
            })
            this.$get('api/task/allusers', {
            }).then((res) => {
                this.userList = res.data.data.list
            })
            this.$get('api/workflow/get_node', {
                wId: 12
            }).then((res) => {
                this.nodeStatus = res.data.data.status
                if (this.nodeStatus) {
                    this.nodeList = res.data.data.node
                }
                this.ccList = res.data.data.list
            })
        },
        // 校验出发归来时间并计算时长
        checkTime (begin, end) {
            if (begin && end) {
                let beginTime = Date.parse(begin)
                let endTime = Date.parse(end)
                let beginDay = Date.parse(begin.substr(0, 10))
                let endDay = Date.parse(end.substr(0, 10))
                if (beginTime >= endTime) {
                    this.$vux.toast.show({
                        type: 'cancel',
                        text: '出发时间需早于返回时间'
                    })
                } else {
                    this.outTime = begin
                    this.backTime = end
                    this.days = (endDay - beginDay) / (24 * 3600 * 1000) + 1
                }
            } else {
                this.outTime = begin
                this.backTime = end
            }
        },
        beginSelect () {
            let self = this
            this.$vux.datetime.show({
                cancelText: '取消',
                confirmText: '确定',
                format: 'YYYY-MM-DD HH: mm',
                value: self.outTime,
                yearRow: '{value}年',
                monthRow: '{value}月',
                dayRow: '{value}日',
                hourRow: '{value}时',
                minuteRow: '{value}分',
                onConfirm (val) {
                    self.checkTime(val, self.backTime)
                }
            })
        },
        endSelect () {
            let self = this
            this.$vux.datetime.show({
                cancelText: '取消',
                confirmText: '确定',
                format: 'YYYY-MM-DD HH: mm',
                value: self.backTime,
                yearRow: '{value}年',
                monthRow: '{value}月',
                dayRow: '{value}日',
                hourRow: '{value}时',
                minuteRow: '{value}分',
                onConfirm (val) {
                    self.checkTime(self.outTime, val)
                }
            })
        },
        // 添加删除模块
        addApply () {
            let empty = {
                address: [],
                detail: ''
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
            if (this.outTime === '' || this.backTime === '' || this.reason === '' || this.tripType.length === 0) {
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
                if (this.applyList[i].address.length === 0 || this.applyList[i].detail === '') {
                    this.checkFail()
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
                let paList = []
                for (let i = 0; i < this.applyList.length; i++) {
                    paList.push({
                        province: this.applyList[i].address[0],
                        city: this.applyList[i].address[1],
                        county: this.applyList[i].address[2],
                        details: this.applyList[i].detail
                    })
                }
                let pa = {
                    id: this.id,
                    outTime: this.outTime,
                    backTime: this.backTime,
                    days: this.days,
                    destination: paList,
                    reason: this.reason,
                    tripType: this.tripType.join('，'),
                    correlation: this.ccData
                }
                this.$post('api/workflow/bus_trip_edit', pa).then((res) => {
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
<style scoped>
    .check_container{ padding: 10px 15px 15px 15px; font-size: 14px;}
    .unSelect{ padding: 5px 10px; margin: 5px; border: 1px solid #666; color: #666;}
    .isSelect{ padding: 5px 10px; margin: 5px; border: 1px solid #0094eb; background-color: #0094eb; color: #fff;}
</style>
