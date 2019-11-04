<template>
    <div>
        <x-header @on-click-back="goHome" :left-options="{backText: '', preventGoBack: true}" style="background-color: #0094eb">客户统计</x-header>
        <tab>
            <tab-item v-for="(project, index) in list" :key="project.id" :selected="index === 0" @on-item-click="setPie">{{project.name}}</tab-item>
        </tab>
        <div id="main" style="width: 100%;height: 320px"></div>
        <div class="msg">
            <span style="color: #2db7f5">合作中：{{coNum}}</span>
            <span style="color: #ed4014">已终止：{{endNum}}</span>
            <span style="color: #ff9900">未合作：{{ncoNum}}</span>
        </div>
    </div>
</template>
<script>

import {Tab, TabItem} from 'vux'
export default {
    name: 'charts',
    components: {Tab, TabItem},
    data () {
        return {
            list: [],
            dataList: [],
            coNum: '',
            endNum: '',
            ncoNum: ''
        }
    },
    methods: {
        goHome () {
            this.$router.replace({name: 'home_index'})
        },
        init () {
            this.$get('api/customer/getreport', {
            }).then((res) => {
                this.list = res.data.data.list
                this.setPie(0)
            })
        },
        setPie (index) {
            this.coNum = this.list[index].cooperationNum
            this.endNum = this.list[index].endingNum
            this.ncoNum = this.list[index].nocooperationNum
            var echarts = require('echarts/lib/echarts')
            require('echarts/lib/chart/pie')
            var myChart = echarts.init(document.getElementById('main'))
            myChart.setOption({ color: ['#ed4014', '#2db7f5', '#ff9900'],
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '60%',
                        center: ['50%', '54%'],
                        label: { // 饼图图形上的文本标签
                            normal: {
                                show: true,
                                position: 'outside', // 标签的位置
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
                            {value: this.list[index].endingNum},
                            {value: this.list[index].cooperationNum},
                            {value: this.list[index].nocooperationNum}
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
    .msg{ text-align: center;}
    .msg span{ margin: 0 10px;}
</style>
