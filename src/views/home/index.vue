<template>
    <div>
        <x-header :left-options="{showBack: false}" class="header_white">
            <span class="header_title">云袭移动OA</span>
        </x-header>
        <div class="header_blank">
        </div>
        <div style="padding: 0 6px">
            <img src="../../img/banner.png" style="width: 100%">
        </div>
        <div style="margin-top: 10px">
            <div @click="toTest" class="area_title">工单管理</div>
            <grid :cols="4" :show-lr-borders="false" :show-vertical-dividers="false" class="icon_box">
                <grid-item link="/order/receive-list"> <img src="../../img/my-order.png"> 我的工单 </grid-item>
                <grid-item link="/order/release ? home = 1"> <img src="../../img/release-order.png"> 发工单 </grid-item>
                <grid-item link="/order/group-list"> <img src="../../img/group-manage.png"> 组查看 </grid-item>
                <grid-item link="/order/unEndSub-list"> <img src="../../img/sub-order.png"> 下属工单 </grid-item>
            </grid>
        </div>
        <!--工单管理所有人都有权限，默认显示-->
        <div>
            <div class="area_title">考勤管理</div>
            <grid :cols="4" :show-lr-borders="false" :show-vertical-dividers="false" class="icon_box">
                <div v-if="!childrenName.includes('商务流程')">
                    <grid-item link="/process/unused-holidays"> <img src="../../img/remain-vacation.png"> 剩余假期 </grid-item>
                    <grid-item link="/process/vacation-apply"> <img src="../../img/vacation-apply.png"> 请假 </grid-item>
                    <grid-item link="/process/overtime-apply"> <img src="../../img/overtime-apply.png"> 加班 </grid-item>
                    <grid-item link="/process/noCheck-apply"> <img src="../../img/uncheck-apply.png"> 未打卡 </grid-item>
                    <grid-item link="/process/outwork-apply"> <img src="../../img/outwork-apply.png"> 外出 </grid-item>
                    <grid-item link="/process/busTrip-apply"> <img src="../../img/bustrip-apply.png"> 出差 </grid-item>
                    <grid-item link="/process/breastfeed-apply" v-if="gender===2"> <img src="../../img/breastfeed-apply.png"> 哺乳假 </grid-item>
                </div>
                <grid-item link="/process/process-my">
                    <img src="../../img/my-process.png">
                    考勤流程
                </grid-item>
            </grid>
        </div>
        <div v-if="menuData.includes('客户管理')">
            <div class="area_title">客户管理</div>
            <grid :cols="4" :show-lr-borders="false" :show-vertical-dividers="false" class="icon_box">
                <grid-item link="/public/list" v-if="childrenName.includes('公海')"> <img src="../../img/public-customer.png"> 公海 </grid-item>
                <grid-item link="/private/list" v-if="childrenName.includes('我的客户')"> <img src="../../img/my-customer.png"> 我的客户 </grid-item>
                <grid-item link="/contact/contactList" v-if="childrenName.includes('联系人')"> <img src="../../img/contact-list.png"> 联系人 </grid-item>
                <grid-item link="/follow/home" v-if="childrenName.includes('跟进记录')"> <img src="../../img/follow-list.png"> 跟进记录 </grid-item>
                <grid-item link="/under/list" v-if="childrenName.includes('下属客户')"> <img src="../../img/sub-customer.png"> 下属客户 </grid-item>
            </grid>
        </div>
        <div v-if="childrenName.includes('商务流程')">
            <div class="area_title">统计监控</div>
            <grid :cols="4" :show-lr-borders="false" :show-vertical-dividers="false" class="icon_box">
                <grid-item link="/business/list"> <img src="../../img/business-process.png"> 商务流程 </grid-item>
                <grid-item link="/charts"> <img src="../../img/customer-total.png"> 客户统计 </grid-item>
                <grid-item link="/invoice"> <img src="../../img/invoice-total.png"> 发票统计 </grid-item>
            </grid>
        </div>
        <div class="tabbar_blank"></div>
    </div>
</template>
<script>
import {removeOrder} from '../../libs/common.js'
import Cookies from 'js-cookie'
import {Grid, GridItem, Tabbar, TabbarItem} from 'vux'
export default {
    name: 'home',
    components: { Grid, GridItem, Tabbar, TabbarItem },
    data () {
        return {
            menuData: [],
            childrenName: [],
            seeList: false,
            gender: 1
        }
    },
    methods: {
        callJsFunction (str) {
            Cookies.set('type', str)
        },
        toTest () {
            // this.$router.push({name: 'test'})
            if (this.seeList) {
                this.$router.push({name: 'feedbacklist'})
            }
        },
        checkPic () {
            this.$get('api/my/base_info', {
            }).then((res) => {
                this.gender = res.data.data.result.sex
                if (!res.data.data.result.userPicture) {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '欢迎使用云袭OA，请上传真实的个人正面照片，通过身份认证后才能正常进入云袭之家！',
                        onhide: () => {
                            this.$router.push({name: 'modify-picture'})
                        }
                    })
                }
            })
        }
    },
    mounted () {
        // 将要给原生调用的方法挂载到 window 上面
        window.callJsFunction = this.callJsFunction
        this.$get('api/system/menulist', {
        }).then((res) => {
            let menuList = res.data.data.list.listMenu
            for (let i = 0; i < menuList.length; i++) {
                this.menuData.push(menuList[i].auth_name)
                if (menuList[i].children.length > 0) {
                    for (let k = 0; k < menuList[i].children.length; k++) {
                        this.childrenName.push(menuList[i].children[k].auth_name)
                    }
                }
            }
            this.seeList = res.data.data.list.listPages.length > 0
        })
        this.checkPic()
        Cookies.remove('timeCheck'); // 清除登录超时标记
        removeOrder();// 清空工单缓存
    }
}
</script>
<style scoped>
    .area_title{ color: #292C39; padding: 0 12px; font-size: 16px; font-weight: 600;}
    .icon_box{ padding: 15px 3%; font-size: 13px;}
    .weui-grids:before{ border: none;}
    .weui-grid:after{ border: none;}
    .weui-grid{ color: #333; padding: 7px; text-align: center;}
    .weui-grid img{ width: 80%;display: block; margin: 0 auto;}
</style>
