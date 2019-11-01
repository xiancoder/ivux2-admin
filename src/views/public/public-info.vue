<style lang='less' scoped>
    @import '../main.less';
</style>
<template>
    <div>
        <x-header @on-click-back="goList" :left-options="{backText: '', preventGoBack: true}" style="background-color: #0094eb">客户信息</x-header>
        <div class="customer_top">
            <div class="customer_mark"><span @click="toRelation">关联客户</span></div>
            <div style="padding: 0 15px">
                <div class="customer_name" @click="toInfo">
                    <a>{{cusName}}</a>
                    <span><img src="../../img/arrow.png" style="width: 18px;vertical-align: middle"></span>
                </div>
            </div>
            <XButton class="get_customer" @click.native="getCustomer">领 取</XButton>
        </div>
        <div class="customer_md">
            <img src="../../img/gjjl.png">
            跟进记录
            <span @click="moreFollow" v-show="!noFollow">更多<img src="../../img/arrow.png" style="width: 18px"></span>
        </div>
        <div style="padding: 0 15px 0 25px">
            <div class="no_follow" v-show="noFollow">
                <div><img src="../../img/no_follow.png"></div>
                亲，暂时没有跟进记录哦！
            </div>
            <div class="follow_container" v-show="!noFollow">
                <div class="follow_modal" v-for="(follow, index) in followList" :key="index" :class="index === 0 ? 'bn' : ''" @click="toDetail(follow.id)">
                    <div class="follow_method">
                        <img src="../../img/tel_active.png" v-show="follow.wayName === '电话'">
                        <img src="../../img/wechat_active.png" v-show="follow.wayName === '微信'">
                        <img src="../../img/qq_active.png" v-show="follow.wayName === 'qq'">
                        <img src="../../img/mail_active.png" v-show="follow.wayName === '邮件'">
                        <img src="../../img/face_active.png" v-show="follow.wayName === '面谈'">
                    </div>
                    <div class="follow_title">
                        <img src="../../img/todo.png">
                        {{follow.createAt}}
                        <span class="text_overflow" style="max-width: 100px">{{follow.busName}}</span>
                    </div>
                    <div class="follow_content">
                        {{follow.content}}
                    </div>
                    <div>
                        <div class="follow_img" v-for="(img, index) in follow.image" :key="index">
                            <img :src="img">
                        </div>
                        <div class="follow_img" v-show="follow.file.length > 0">
                            <img src="../../img/file.png">
                        </div>
                    </div>
                    <div class="follow_member text_overflow" style="max-width: 200px">
                        {{follow.operateBy}}&nbsp;<span style="color: #d1d1d1"> |</span>&nbsp; 联系人 : {{follow.contact || '-'}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {XHeader, XButton} from 'vux'
export default {
    name: 'public-info',
    components: {XHeader, XButton},
    data () {
        return {
            cusName: '',
            noFollow: false,
            followList: [
                {
                    id: '',
                    operateBy: '',
                    content: '',
                    busName: '',
                    createAt: '',
                    wayName: '',
                    contact: '',
                    file: [],
                    image: []
                }
            ]
        }
    },
    methods: {
        goList () {
            this.$router.replace({name: 'public-list'})
        },
        init () {
            this.$get('api/customer/detail', {
                id: this.$route.query.companyId
            }).then((res) => {
                this.cusName = res.data.data.result.busName
            })
            this.$get('api/customer/followuplog_cus_brief', {
                cusId: this.$route.query.companyId
            }).then((res) => {
                this.followList = res.data.data.list
                if (this.followList.length === 0) {
                    this.noFollow = true
                }
            })
        },
        toInfo (id) {
            this.$router.push({name: 'company-info', query: {companyId: this.$route.query.companyId}})
        },
        toRelation () {
            this.$router.push({name: 'relation-company', query: {companyId: this.$route.query.companyId, tab: 0}})
        },
        toDetail (id) {
            this.$router.push({name: 'follow-detail', query: {followId: id}})
        },
        moreFollow () {
            this.$router.push({name: 'follow-list', query: {cusId: this.$route.query.companyId}})
        },
        getCustomer () {
            const self = this
            this.$vux.confirm.show({
                content: '确认要领取么？',
                onCancel () {},
                onConfirm () {self.setPrivate()}
            })
        },
        setPrivate () {
            this.$get('api/customer/set_private', {
                cusId: this.$route.query.companyId
            }).then((res) => {
                if (res.data.data.res === 1) {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '操作成功'
                    })
                    this.$router.push({name: 'public-list'})
                } else if (res.data.data.res === 0) {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '操作失败'
                    })
                } else if (res.data.data.res === -1) {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '今日已达领取上限，请明日再来。'
                    })
                } else if (res.data.data.res === -2) {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '已达到领取上限，不可再领取。'
                    })
                } else {
                    this.$vux.alert.show({
                        title: '提示',
                        content: res.data.data
                    })
                }
            })
        }
    },
    mounted () {
        this.init()
    }
}
</script>
