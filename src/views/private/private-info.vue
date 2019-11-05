<template>
    <div>
        <x-header @on-click-back="goList" :left-options="{backText: '', preventGoBack: true}" style="background-color: #0094eb">客户信息</x-header>
        <div class="customer_top" style="height: 228px">
            <div class="customer_mark"><span v-show="!isUnioner || type === '2'" @click="toPubic">转入公海</span></div>
            <div style="padding: 0 15px">
                <div  class="customer_name" @click="toInfo">
                    <a>{{cusName}}</a>
                    <span><img src="../../img/arrow.png" style="width: 18px;vertical-align: middle"></span>
                </div>
            </div>
            <div style="clear: both"></div>
            <XButton class="info-btns" @click.native="toRelation">关联客户
                <badge v-show="isUnion" style=" position: absolute; right: 17px;padding: 4px;top: 4px;">
                </badge>
            </XButton>
            <XButton class="info-btns" @click.native="addRelation">添加关联客户</XButton>
            <XButton v-show="!isUnioner || type === '2'" class="info-btns" @click.native="getFollower">跟进人</XButton>
            <XButton class="info-btns" @click.native="getContactor">联系人</XButton>
            <XButton class="info-btns" @click.native="addFollow">写跟进</XButton>
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
import {XButton, Badge} from 'vux'
export default {
    name: 'public-info',
    components: {XButton, Badge},
    data () {
        return {
            type: '',
            isUnion: false,
            isUnioner: true,
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
            if (this.type === '1') {
                this.$router.replace({name: 'private-list'})
            } else {
                this.$router.replace({name: 'under-list'})
            }
        },
        init () {
            this.type = sessionStorage.getItem('listType')
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
            this.$get('api/customer/leader', {
                id: this.$route.query.companyId
            }).then((res) => {
                this.isUnion = res.data.data.isUnion
                this.isUnioner = res.data.data.isUnioner
                this.teamWorkStatus = res.data.data.teamWorkStatus
            })
        },
        toInfo (id) {
            this.$router.push({name: 'company-info', query: {companyId: this.$route.query.companyId, type: 2}})
        },
        toRelation () {
            this.$router.push({name: 'relation-company', query: {companyId: this.$route.query.companyId, type: 2, tab: 0}})
        },
        addRelation () {
            this.$router.push({name: 'private-addRelation', query: {companyId: this.$route.query.companyId}})
        },
        addFollow () {
            this.$router.push({name: 'add-follow', query: {companyId: this.$route.query.companyId, companyName: this.cusName, status: this.teamWorkStatus}})
        },
        getFollower () {
            this.$router.push({name: 'private-people', query: {companyId: this.$route.query.companyId}})
        },
        getContactor () {
            this.$router.push({name: 'private-contact', query: {companyId: this.$route.query.companyId}})
        },
        toDetail (id) {
            this.$router.push({name: 'follow-detail', query: {followId: id}})
        },
        moreFollow () {
            this.$router.push({name: 'follow-list', query: {cusId: this.$route.query.companyId}})
        }, topubic () {
            const self = this
            this.$vux.confirm.show({
                content: '<strong>确认要转入公海吗？</strong></br>转移成功之后，此客户数据将属于公共资源，原负责人不能再维护跟进和更新此客户数据',
                onCancel () {},
                onConfirm () {self.setPublic()}
            })
        },
        setPublic () {
            this.$get('api/customer/change_public', {
                id: this.$route.query.companyId
            }).then((res) => {
                if (res.data.data.res === 1) {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '操作成功'
                    })
                    if (this.type === '1') {
                        this.$router.replace({name: 'private-list'})
                    } else {
                        this.$router.replace({name: 'under-list'})
                    }
                } else if (res.data.data.res === 0) {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '操作失败'
                    })
                // } else if (res.data.data.res === -1) {
                //     this.$vux.alert.show({
                //         title: '提示',
                //         content: '当天领取客户数量超过限制',
                //     })
                // } else if (res.data.data.res === -2) {
                //     this.$vux.alert.show({
                //         title: '提示',
                //         content: '领取客户总数超过限制',
                //     })
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
<style scoped>
    .customer_mark span{ background-color: #FF4844; color: white; }
    .info-btns{ float: left; width: 110px; padding: 0; font-size: 15px; border-radius: 18px; margin: 15px 5px 0 5px; color: #0094EB;}
</style>
