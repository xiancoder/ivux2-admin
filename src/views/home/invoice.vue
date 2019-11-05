<template>
    <div>
        <x-header @on-click-back="goHome" :left-options="{backText: '', preventGoBack: true}" style="background-color: #0094eb">发票统计</x-header>
        <group>
            <popup-picker @on-change="getInfo" show-name :columns="1" title="选择年份" :data="yearList" v-model="year"></popup-picker>
            <popup-picker @on-change="getInfo" show-name :columns="1" title="选择月份" :data="monthList" v-model="month"></popup-picker>
        </group>
        <div ref="pie" style="width: 100%;height: 300px"></div>
        <div class="textCen">开票总金额：{{total}}元</div>
        <div class="links">
            <div style="color: #ed4014;font-size: 16px">任礼游<br>{{rly}}元</div>
            <div style="color: #2db7f5;font-size: 16px">云袭加客<br>{{yxjk}}元</div>
            <div style="color: #ff9900;font-size: 16px">云袭广告<br>{{yxgg}}元</div>
        </div>
    </div>
</template>
<script>

import {Tab, TabItem, PopupPicker, Group} from 'vux'
export default {
    name: 'invoice',
    components: {Tab, TabItem, PopupPicker, Group},
    data () {
        return {
            yearList: [],
            year: [],
            monthList: [
                {name: '全部月份', value: '0'},
                {name: '1月', value: '01'},
                {name: '2月', value: '02'},
                {name: '3月', value: '03'},
                {name: '4月', value: '04'},
                {name: '5月', value: '05'},
                {name: '6月', value: '06'},
                {name: '7月', value: '07'},
                {name: '8月', value: '08'},
                {name: '9月', value: '09'},
                {name: '10月', value: '10'},
                {name: '11月', value: '11'},
                {name: '12月', value: '12'}
            ],
            month: ['0'],
            total: '',
            rly: '',
            yxjk: '',
            yxgg: ''
        }
    },
    methods: {
        goHome () {
            this.$router.replace({name: 'home_index'})
        },
        init () {
            let now = new Date().getFullYear()
            let list = []
            this.year = [now.toString()]
            for (let i = now; i > 2018; i--) {
                list.push({name: i + '年', value: i.toString()})
                this.yearList = JSON.parse(JSON.stringify(list))
            }
            this.getInfo()
        },
        getInfo () {
            this.$get('/api/finance/invoice', {
                year: this.year[0],
                month: this.month[0]
            }).then((res) => {
                let info = res.data.data.info
                this.total = info.total
                this.rly = info.renliyou
                this.yxjk = info.jiake
                this.yxgg = info.guanggao
                this.setPie()
            })
        },
        setPie () {
            let echarts = require('echarts/lib/echarts')
            require('echarts/lib/chart/pie')
            let myChart = echarts.init(this.$refs['pie'])
            myChart.setOption({ color: ['#ed4014', '#2db7f5', '#ff9900'],
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '60%',
                        center: ['50%', '50%'],
                        label: { // 饼图图形上的文本标签
                            normal: {
                                show: true, position: 'outside', // 标签的位置
                                textStyle: {
                                    fontWeight: 300,
                                    fontSize: 14 // 文字的字体大小
                                },
                                formatter: '{d}%'
                            }
                        },
                        labelLine: {
                            normal: {
                                length: 8,
                                length2: 7
                            }
                        },
                        data: [
                            {value: this.rly},
                            {value: this.yxjk},
                            {value: this.yxgg}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            })
        }
    },
    mounted () {
        this.init()
    }
}
</script>
<style scoped>
    .vux-cell-box:not(:first-child):before{ left: 0;}
    .msg span{ margin: 0 10px;}
</style>
