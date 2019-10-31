<template>
    <group class="my-group">
        <x-header @on-click-back="goHome" :left-options="{backText: '', preventGoBack: true}" style="background-color: #0094eb">人事流程申请</x-header>
        <grid :cols="3">
            <grid-item link="unused-holidays">
                <img slot="icon" :src="require('../../img/vacation.png')" alt=""/>
                <span slot="label">剩余假期</span>
            </grid-item>
            <grid-item v-for="row in dataArr" :key="row.id" :link="row.link">
                <img slot="icon" :src="row.src" alt=""/>
                <span slot="label">{{row.name}}</span>
            </grid-item>
            <grid-item v-if="sex == 2" link="breastfeed-apply">
                <img slot="icon" :src="require('../../img/lactation.png')" alt=""/>
                <span slot="label">哺乳假</span>
            </grid-item>
        </grid>
    </group>
</template>
<script>
import {Group, XHeader, Grid, GridItem} from 'vux'
export default {
    name: 'process-personnel',
    components: {Group, XHeader, Grid, GridItem},
    data () {
        return {
            dataArr: [],
            sex: 0 // 用户性别
        }
    },
    methods: {
        goHome () {
            this.$router.replace({name: 'home_index'})
        },
        getList () {
            this.$get('api/workflow/type', {typeId: 1}).then(res => {
                this.dataArr = res.data.data.list
                for (let i = 0; i < this.dataArr.length; i++) {
                    switch (this.dataArr[i].id) {
                        case 7:
                            this.dataArr[i].src = require('../../img/leave.png')
                            this.dataArr[i].link = 'vacation-apply'
                            break
                        case 8:
                            this.dataArr[i].src = require('../../img/overtime.png')
                            this.dataArr[i].link = 'overtime-apply'
                            break
                        case 9:
                            this.dataArr[i].src = require('../../img/nocard.png')
                            this.dataArr[i].link = 'noCheck-apply'
                            break
                        case 10:
                            this.dataArr[i].src = require('../../img/duty.png')
                            this.dataArr[i].link = ''
                            break
                        case 11:
                            this.dataArr[i].src = require('../../img/goout.png')
                            this.dataArr[i].link = 'outwork-apply'
                            break
                        case 12:
                            this.dataArr[i].src = require('../../img/outwork.png')
                            this.dataArr[i].link = 'busTrip-apply'
                            break
                    }
                }
            })
            // 获取用户信息-- 性别
            this.$get('api/my/base_info', {}).then(res => {
                if (res.data.data) {
                    this.sex = res.data.data.result.sex
                }
            })
        }
    },
    mounted () {
        this.getList()
        this.$vux.loading.hide()
    }
}
</script>
