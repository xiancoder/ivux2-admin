<style scoped>
    .nodeDiv{ position: relative; padding-right: 44px; }
    .paddR54{ padding-right: 54px; }
    .nodeBorder{ border: 1px dashed rgb(3, 149, 236); padding: 6px; margin-left: 16px; }
    .node2{ flex: 1; padding: 0 15px; width: 45px; }
    .node_to2{ position: absolute; right: 14px; top: 15px; width: 20px; }
    .posTop22{ top: 22px; right: 10px; }
</style>
<template>
    <div>
        <div class="scroll_container">
            <div style="padding: 10px 15px">审批人</div>
            <div class="node_error red textCen" v-if="!this.status">
                <div>请联系人事配置审批流程</div>
                <div style="height: 20px;"></div>
            </div >
            <div style="width: 100%;overflow: hidden;" v-else>
                <nav class="scroll_list">
                    <div class="inline_block nodeDiv" :class="row.length>1 ? 'paddR54' : ''" v-for="(row, index) in data" :key="index">
                        <div :class="row.length>1 ? 'nodeBorder' : ''" style="display: flex;">
                            <div class="node2 textCen"  v-for="(row2, index2) in row" :key="index2" >
                                <img :src="row2.photo" v-show="row2.photo !== ''" class="photo_img">
                                <span class="first_name" v-show="row2.photo === ''">{{row2.userName | firstName}}</span>
                                <br>{{row2.userName}}
                            </div>
                        </div>
                        <img class="node_to2" :class="row.length>1 ? 'posTop22' : ''" src="../../img/rBuleArrow.png" v-show="index !== data.length - 1">
                    </div>
                </nav>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    // dsf-2019-6-4 审批人组件
    name: 'approver',
    props: {
        data: null,
        status: null
    },
    filters: {
        firstName: function (value) { // 截取字符串的第一个
            return value.substr(0, 1)
        }
    }
}
</script>
