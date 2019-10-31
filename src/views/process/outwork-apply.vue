<style>
    @import '../main.less';
    .font14 .weui-cells{ font-size: 14px; padding: 10px 15px; line-height: 25px;}
    .font14 .vux-checker-box{ margin-left: 20px;display: inline-block;}
</style>
<style scoped>
    .demo2-item { width: 16px; height: 16px; border: 1px solid #ccc; border-radius: 50%; line-height: 40px; vertical-align: middle;}
    .demo2-item-selected { background: #0094eb;}
    .hei10{ background-color: #f5f7f9; height: 10px;}
    .color666{ color: #666;}
    .marR20{ margin-right: 20px;}
</style>
<template>
    <div>
        <x-header :left-options="{backText: ''}" class="header_fix">外出申请<a slot="right" style="color: #fff" @click="applyPost">提交</a></x-header>
        <div class="header_blank"></div>
        <group gutter="0" class="info_container">
            <datetime v-model="obj.outTime" format="YYYY-MM-DD HH: mm" year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分" placeholder="请选择外出时间" @on-confirm="compareTime(1)">
                <div slot="title"><span class="red">* </span>外出时间</div>
            </datetime>
        </group>
        <group gutter="0" class="font14">
            <span class="red">* </span>是否返回
            <checker v-model="check" default-item-class="demo2-item" selected-item-class="demo2-item-selected">
                是&nbsp;&nbsp;<checker-item class="marR20" :value="1" @on-item-click="back"></checker-item>
                否&nbsp;&nbsp;<checker-item :value="0" @on-item-click="back"></checker-item>
            </checker>
        </group>
        <group gutter="0" class="info_container">
            <datetime :readonly="disabled" v-model="obj.backTime" format="YYYY-MM-DD HH: mm" year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分" placeholder="请选择返回时间"  @on-confirm="compareTime(2)">
                <div slot="title" :class="disabled ? 'color666' : ''"><span class="red">* </span>返回时间</div>
            </datetime>
        </group>
        <div class="hei10"></div>
        <group gutter="0">
            <x-textarea v-model="obj.reason" placeholder="请输入外出事由" :max="50" style="font-size: 14px">
                <div slot="label" style="padding-right: 10px;color: #333"><span class="red">* </span>外出事由</div>
            </x-textarea>
        </group>
        <div class="hei10"></div>
        <group gutter="0">
            <x-textarea v-model="obj.place" placeholder="请输入外出地点" :max="50" style="font-size: 14px">
                <div slot="label" style="padding-right: 10px;color: #333"><span class="red">* </span>外出地点</div>
            </x-textarea>
        </group>
        <div class="hei10"></div>
        <approver :data="nodeList" :status="nodeStatus"></approver>
        <div class="hei10"></div>
        <copy-person v-model="ccData" :userList="userList" :ccList="ccList"></copy-person>
    </div>
</template>
<script>
import { XHeader, Group, Datetime, Checker, CheckerItem, XTextarea } from 'vux'
import approver from '../components/approver.vue'
import copyPerson from '../components/copy-person.vue'
export default {
    name: 'overtime-apply',
    components: { XHeader, Group, Datetime, Checker, CheckerItem, XTextarea, approver, copyPerson },
    data () {
        return {
            check: 1,
            obj: {
                outTime: null,
                backTime: null,
                reason: null,
                place: null
            },
            nodeStatus: true,
            userList: [], // 公司员工
            nodeList: [], // 审批人
            ccList: [], // 默认抄送人
            ccData: [], // 全部抄送人
            beginEnd: false // 开始时间是否大于结束时间
        }
    },
    computed: {
        disabled: function () {
            return this.check !== 1
        }
    },
    methods: {
        init () {
            // 公司员工
            this.$get('api/task/allusers', {
            }).then((res) => {
                this.userList = res.data.data.list
            })
            // 审批人抄送人
            this.$get('api/workflow/get_node', {
                wId: 11
            }).then((res) => {
                this.nodeStatus = res.data.data.status
                if (this.nodeStatus) {
                    this.nodeList = res.data.data.node
                }
                this.ccList = res.data.data.list
            })
        },
        back (val) {
            if (val === 0) {
                this.obj.backTime = null
            }
        },
        // 比较时间
        compareTime (n) {
            if (this.obj.outTime && this.obj.backTime) {
                let time1 = Date.parse(this.obj.outTime)
                let time2 = Date.parse(this.obj.backTime)
                if (time1 >= time2) {
                    this.$vux.toast.show({
                        type: 'cancel',
                        text: '外出时间需早于返回时间'
                    })
                    this.beginEnd = true
                    if (n === 1) {
                        this.obj.outTime = null
                    } else {
                        this.obj.backTime = null
                    }
                    return false
                }
                this.beginEnd = false
            }
        },
        // 提交
        checkForm () {
            if (this.obj.outTime === null || (this.check === 1 && this.obj.backTime === null) || !this.obj.reason || !this.obj.place) {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请将信息填写完善'
                })
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
                    'id': 0,
                    'outTime': this.obj.outTime, // 外出时间
                    'back': this.check, // 是否返回 1 返回 0 不返回
                    'backTime': this.obj.backTime, // 返回时间
                    'reason': this.obj.reason, // 外出事由
                    'place': this.obj.place, // 外出地点
                    'correlation': this.ccData
                }
                this.$post('api/workflow/outwork_add', pa).then((res) => {
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
