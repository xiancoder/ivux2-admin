<style lang='less'>
    .my-group .weui-cells{ margin-top: 0; border-bottom: 1px solid #D9D9D9;}
    .my-group .weui-cells .weui-cell__ft{ font-size: 15px; color: #666;}
    .my-group .weui-cells .vux-label{ overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 226px;}
    .my-group .vux-table:after{ border-top: none; border-bottom: none;}
    .my-group .vux-table tr td{ padding: 10px 0;}
    .vux-swipeout-button-primary{ width: 90px; position: absolute; font-size: 15px; top: 0; background-color: #EF4E4B; border: none; color: white; bottom: 0; right: 80px;}
    .vux-swipeout-button-warn{ width: 90px; font-size: 15px; background-color: #FFBE2A; border: none; color: white;}
    .my-tab .vux-button-group > a.vux-button-tab-item-first { border-top-left-radius: 6px; border-bottom-left-radius: 6px;}
    .my-tab .vux-button-group > a.vux-button-tab-item-last { border-top-right-radius: 6px; border-bottom-right-radius: 6px;}
    .my-tab .vux-button-group > a.vux-button-tab-item-last:after{ border-top-right-radius: 8px; border-bottom-right-radius: 8px;}
    .my-tab .vux-button-group > a.vux-button-tab-item-first:after{ border-top-left-radius: 8px; border-bottom-left-radius: 8px;}
    .vux-swipeout-item{ position: relative;}
    .vux-swipeout-button-box{ position: absolute; right: 0; top: 0; bottom: 0; width: 80px;}
    .my-group .weui-cell:before{ border-top: none;}
    .my-group .weui-cells:after{ border-bottom: none;}
</style>
<template>
    <group class="my-group">
        <x-header :left-options="{backText: ''}" class="header_fix">关联客户</x-header>
        <div class="header_blank"></div>
        <div  class="my-tab" style="background-color: #0094EB;padding: 10px 50px">
            <button-tab v-model=demo01>
                <button-tab-item @on-item-click="demo01==0">可能关联客户</button-tab-item>
                <button-tab-item @on-item-click="demo01==1">已关联客户</button-tab-item>
            </button-tab>
        </div>
        <div style="text-align: center;padding: 15px 0;" v-show=" maybelist.length==0&&demo01==0">
            <p style="font-size: 14px;  color: #666;">无数据</p>
        </div>
        <swipeout-item  v-show="demo01==0" v-for="(item, index) in  maybelist" :key="index" :disabled='type!=2'  transition-mode="follow">
            <div slot="right-menu" >
            <swipeout-button @click.native="onButtonClick(item.id, -1)" type="primary">忽略</swipeout-button>
            <swipeout-button style="position: absolute; top: 0; right: 0; bottom: 0;" @click.native="onButtonClick(item.id, 2)" type="warn">关联</swipeout-button>
            </div>
            <div slot="content" class="demo-content vux-1px-t" >
                <cell  :title=item.busName  :inline-desc=item.common
                :value="item.leader||'-'"></cell>
            </div>
        </swipeout-item>
        <div >
            <div style="text-align: center;padding: 15px 0;" v-show=" relist.length==0&&demo01==1">
                <p style="font-size: 14px;color: #666;">无数据</p>
            </div>
            <swipeout-item  v-show="demo01==1" v-for="(item, index) in  relist" :key="index" :disabled='type!=2'  transition-mode="follow">
            <!-- <div style="padding: 0 15px" v-show="demo01==0" v-for="item in  maybelist"> -->
                <div slot="right-menu">
                <!-- <swipeout-button @click.native="onButtonClick(item.id, -1)" type="primary">忽略</swipeout-button> -->
                <swipeout-button style="font-size: 15px; position: absolute; top: 0; right: 0; bottom: 0;" @click.native="onButtonClick(item.id, -1)" type="warn">取消关联</swipeout-button>
                </div>
                <div slot="content" class="demo-content vux-1px-t" style="padding: 10px 0;">
                    <cell  :title=item.busName
                    :value="item.leader||'-'"></cell>
                </div>
            <!-- </div> -->
            </swipeout-item>
        </div>
    </group>
</template>
<script>
import Vue from 'vue'
import {Group, Badge, ButtonTab, XTable, Swipeout, SwipeoutItem, Cell, XButton, SwipeoutButton, ButtonTabItem, AlertPlugin} from 'vux'
Vue.use(AlertPlugin)
export default {
    components: {Group, Badge, ButtonTab, Swipeout, SwipeoutItem, Cell, XButton, SwipeoutButton, ButtonTabItem, XTable},
    mounted: function () {
        this.getUser()
    },
    data () {
        return {
            type: this.$route.query.type,
            disabled: false,
            demo01: parseInt(this.$route.query.tab),
            maybelist: [],
            relist: [],
            isrelation: true,
            users: {
            }
        }
    },
    methods: {
        getUser () {
            this.$get('api/customer/relation_customer', {id: this.$route.query.companyId}).then((res) => {
                this.maybelist = res.data.data.maybelist
                this.relist = res.data.data.relist
                // this.showdiver = true
            })
        },
        onButtonClick (id, type) {// 忽略// 关联
            this.oprate(id, type)
        },
        oprate (rid, type) {
            let pa = {
                'cusId': this.$route.query.companyId, // 基准客户id
                'releId': rid, // 关联客户id
                'status': type // -1 忽略/取消关联，2关联，
            }
            this.$post('api/customer/relation_operate', pa).then((res) => {
                let that = this
                if (res.data.data.res === 1) {
                    this.$vux.alert.show({
                        content: '操作成功',
                        onhide () {
                            that.getUser()
                        }
                    })
                }
                // this.showdiver = true
            })
        }
    }
}
</script>
