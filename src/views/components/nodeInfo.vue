<template>
    <div>
        <!-- 循环审批人 -->
        <div>
            <div class="loop_process" style="margin-top: 14px;">
                <img class="members_portrait marginRight15" v-if="info.userPhoto" :src="info.userPhoto" />
                <span class="members_portrait marginRight15" v-if="!info.userPhoto">{{info.userName | firstName}}</span>
                {{info.userName}}
                <span style="margin-left: 4px;">发起申请</span>
                <span class="time_right">{{info.createdTimeStr}}</span>
                <img class="info_buleArrow" src="../../img/dBuleArrow.png" />
            </div>
            <div v-for="(row, index) in info.approverList" :key="index">
                <div class="loop_process" v-if="row.length === 1" :class="(row[0].status === 1 || row[0].status === 2) && row[0].rejectReason ? 'hei_auto' : ''">
                    <img class="members_portrait marginRight15" v-if="row[0].userPhoto" :src="row[0].userPhoto" />
                    <span class="members_portrait marginRight15" v-if="!row[0].userPhoto">{{row[0].approverName | firstName}}</span>
                    {{row[0].approverName}}
                    <span style="margin-left: 4px;color: #0395ec;" v-if="row[0].status === 0 && approvalNode === index">待审批</span>
                    <span style="margin-left: 4px;color: #cccccc;" v-if="row[0].status === 0 && approvalNode !== index">待审批</span>
                    <span style="margin-left: 4px;color: #24b188;" v-if="row[0].status === 2">已同意</span>
                    <span style="margin-left: 4px;color: #24b188;" v-if="row[0].status === 3">已审阅</span>
                    <span style="margin-left: 4px;color: red;" v-if="row[0].status === 1">已驳回</span>
                    <span class="time_right" v-if="row[0].status !== 0">{{row[0].createdTimeStr}}</span>
                    <p v-if="(row[0].status === 1 || row[0].status === 2) && row[0].rejectReason" style="padding-left: 57px;line-height: 20px;margin-bottom: 5px" :class="row[0].status === 1 ? 'colRed' :'col8'">{{row[0].rejectReason}}</p>
                    <img v-if="info.approverList.length - 1 !== index && index<approvalNode" class="info_buleArrow" :class="(row[0].status === 1 || row[0].status === 2) && row[0].rejectReason ? 'top62' : ''" src="../../img/dBuleArrow.png" />
                    <img v-if="info.approverList.length - 1 !== index && index >= approvalNode" class="info_buleArrow" src="../../img/dGrayArrow.png" />
                </div>
                <div class="borderBlue loop_processComplex" v-if="row.length > 1">
                    <div style="padding: 5px;" v-for="(list, indexs) in row" :key="indexs">
                        <img class="members_portrait marginRight15" v-if="list.userPhoto" :src="list.userPhoto" />
                        <span class="members_portrait marginRight15" v-if="!list.userPhoto">{{list.approverName | firstName}}</span>
                        {{list.approverName}}
                        <span style="margin-left: 4px;color: #0395ec;" v-if="list.status === 0 && approvalNode === index">待审批</span>
                        <span style="margin-left: 4px;color: #cccccc;" v-if="list.status === 0 && approvalNode !== index">待审批</span>
                        <span style="margin-left: 4px;color: #24b188;" v-if="list.status === 2">已同意</span>
                        <span style="margin-left: 4px;color: red;" v-if="list.status === 1">已驳回</span>
                        <span class="time_right" v-if="list.status !== 0">{{list.createdTimeStr}}</span>
                        <p style="padding-left: 57px;line-height: 20px;" :class="list.status === 1 ? 'colRed' :'col8'" v-if="(list.status === 1 || list.status === 2) && list.rejectReason">{{list.rejectReason}}</p>
                    </div>
                    <img v-if="info.approverList.length - 1 !== index && index<approvalNode" class="info_buleArrowComplex" src="../../img/dBuleArrow.png" />
                    <img v-if="info.approverList.length - 1 !== index && index >= approvalNode" class="info_buleArrowComplex" src="../../img/dGrayArrow.png" />
                </div>
                <div v-if="row.length > 1" style="height: 30px;"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    // 详情-审批人 组件
    name: 'nodeInfo',
    props: {
        info: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            approvalNode: null
        }
    },
    watch: {
        info: {
            // 拿到审批节点的下标
            deep: true,
            handler (newVal) {
                // if (newVal.status === 0 || newVal.status === 1) {
                //     for (let x = 0; x <newVal.approverList.length; x++) {
                //         for (let y = 0; y < newVal.approverList[x].length; y++) {
                //             if (newVal.approverList[x][y].status === 0 || newVal.approverList[x][y].status === 1) {
                //                 this.approvalNode = x
                //                 return
                //             }
                //         }
                //     }
                // } else {
                //     this.approvalNode = newVal.approverList.length
                // }
                for (let x = 0; x < newVal.approverList.length; x++) {
                    for (let y = 0; y < newVal.approverList[x].length; y++) {
                        if (newVal.approverList[x][y].status === 0 || newVal.approverList[x][y].status === 1) {
                            this.approvalNode = x
                            return
                        }
                        this.approvalNode = x
                    }
                }
            }
        }
    },
    filters: {
        firstName: function (value) { // 截取字符串的第一个
            return value.substr(0, 1)
        }
    }
}
</script>
<style scoped>
    .borderBlue{ border: 1px dashed #0395ec; padding: 5px;}
    .hei_auto{ min-height: 70px; height: auto !important;}
    .top62{ top: 62% !important;}
    .col8{ color: #24b188;}
    .colRed{ color: red;}
</style>
