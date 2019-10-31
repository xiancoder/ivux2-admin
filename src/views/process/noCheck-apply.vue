<template>
    <div>
        <x-header :left-options="{backText: ''}" class="header_fix">未打卡申请<a slot="right" style="color: #fff" @click="applyPost">提交</a></x-header>
        <div class="header_blank"></div>
        <group gutter="0" class="info_container">
            <datetime format='YYYY-MM-DD HH: mm' year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}时" minute-row="{value}分" v-model="date" placeholder="请选择未打卡时间">
                <div slot="title"><span class="red">* </span>未打卡时间</div>
            </datetime>
        </group>
        <group gutter="0">
            <x-textarea v-model="reason" placeholder="请输入未打卡事由" :max="50" style="font-size: 14px">
                <div slot="label" style="padding-right: 10px;color: #333"><span class="red">* </span>未打卡事由</div>
            </x-textarea>
        </group>
        <div style="background-color: #f5f7f9;height: 10px"></div>
        <approver :data="nodeList" :status="nodeStatus"></approver>
        <div style="background-color: #f5f7f9;height: 10px"></div>
        <copy-person v-model="ccData" :userList="userList" :ccList="ccList"></copy-person>
    </div>
</template>
<script>
import { XHeader, Group, Loading, Datetime, XTextarea } from 'vux'
import approver from '../components/approver.vue'
import copyPerson from '../components/copy-person.vue'
export default {
    name: 'noCheck-apply',
    components: { XHeader, Group, Loading, Datetime, XTextarea, approver, copyPerson },
    data () {
        return {
            id: 0,
            userList: [],
            date: '', // 未打卡时间
            keyWord: '',
            results: [],
            reason: '', // 原因
            nodeStatus: true,
            nodeList: [], // 审批人列表
            ccList: [],
            ccData: [], // 全部抄送人
            addList: [],
            ccShow: false
        }
    },
    methods: {
        init () {
            // 获取公司所有员工。
            this.$get('api/task/allusers', {
            }).then((res) => {
                this.userList = res.data.data.list
            })
            this.$get('api/workflow/get_node', {
                wId: 9 // 未打卡的类型是9 获取对应类型的审批人
            }).then((res) => {
                this.nodeStatus = res.data.data.status
                if (this.nodeStatus) {
                    this.nodeList = res.data.data.node
                }
                this.ccList = res.data.data.list
            })
        },
        // 提交
        checkFail () {
            this.$vux.alert.show({
                title: '提示',
                content: '请将信息填写完善'
            })
        },
        checkForm () {
            // 没有日期和原因.其实未打卡就这俩东西。
            if (this.date === '' || this.reason === '') {
                this.checkFail()
                return false
            }
            // 审批节点异常
            if (!this.nodeStatus) {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请联系人事配置审批流程'
                })
                return false
            }
            return true
        },
        applyPost () { // 提交按钮
            if (this.checkForm()) {
                this.$vux.loading.show({
                    text: 'Loading'
                })
                let pa = {
                    id: this.id,
                    clockTime: this.date, // 未打卡时间
                    reason: this.reason,
                    correlation: this.ccData
                }
                this.$post('api/workflow/no_check_edit', pa).then((res) => {
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
<style>
    .mainSearch .font614{ color: #666;}
    .mainSearch .font614 p{ font-size: 14px;}
</style>
