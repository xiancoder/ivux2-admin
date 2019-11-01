<template>
    <group class="my-group">
        <x-header @on-click-back="goHome" :left-options="{backText: '', preventGoBack: true}" style="background-color: #0094eb">剩余假期</x-header>
        <grid :cols="2">
            <grid-item v-for="row in dataArr" :key="row.id">
                <p class="fontP">{{row.typeName}}</p>
                <p class="fontP">{{row.hour}}</p>
            </grid-item>
        </grid>
        <div style="padding: 20px 4px">
            <p class="p1" style="color: #f15252;">
                <span class="flex1">说明：</span>
                <!-- <span class="flex5">剩余假期实时更新会出现误差，仅供参考，请以每月考勤确认的最终数据为准。</span> -->
                <span class="flex5">请假时请优先使用剩余假期，剩余假期数据为上个考勤周期结余数据，非实时数据，仅供参考。</span>
            </p>
            <div style="height: 10px"></div>
            <p class="p1" v-for="row in holidays" :key="row.title">
                <span class="flex1">{{row.title}}</span>
                <span class="flex5">{{row.content}}</span>
            </p>
        </div>
    </group>
</template>
<script>
import {Group, XHeader, Grid, GridItem} from 'vux'
export default {
    name: 'unused-holidays',
    components: {Group, XHeader, Grid, GridItem},
    data () {
        return {
            holidays: [
                {title: '婚假：', content: '最多3天，不能分阶段申请。'},
                {title: '丧假：', content: '最多3天，不能分阶段申请。'},
                {title: '产假：', content: '产假（含产检）最多累计为158天。'},
                {title: '陪产假：', content: '顺产最多5天，剖腹产最多7天，不能分阶段申请。'}
            ],
            dataArr: [
                {id: 1, typeName: '可用调休时长', hour: '- 小时'},
                {id: 2, typeName: '即将转换的调休时长', hour: '- 小时'},
                {id: 3, typeName: '可用转换年假时长', hour: '- 小时'},
                {id: 4, typeName: '可用年假时长', hour: '- 小时'}
            ]
        }
    },
    methods: {
        goHome () {
            this.$router.go(-1)
        }
    },
    mounted () {
        this.$get('api/workflow/unusedHoliday').then(res => {
            const resData = res.data.data
            if (resData) {
                [this.dataArr[0].hour, this.dataArr[1].hour, this.dataArr[2].hour, this.dataArr[3].hour] = [resData.dayoff + '小时', resData.willTurn + '小时', resData.remainTurn + '小时', resData.remainAnnual + '小时']
            }
        })
    }
}
</script>
<style scoped lang='less'>
    .fontP{ text-align: center; color: #000000; font-size: 14px;}
    .p1{ font-size: 14px;display: flex; line-height: 24px;}
    .flex1{ flex: 1; text-align: right;}
    .flex5{ flex: 4;}
</style>
