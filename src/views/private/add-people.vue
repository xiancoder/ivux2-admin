<template>
    <group class="my-group">
        <x-header :left-options="{backText: ''}" style="background-color: #0094eb">跟进人
            <!-- <a  style="color: white" slot="right">查一查</a> -->
        </x-header>
        <div class="title">
            <div style="clear: both"></div>
            <div class="left">负责人</div>
            <div class="right" @click="openLeaderList">
                <popup-picker title="变更" :data="leaderData" :columns="3" v-model="leader"  show-name @on-hide="changeLeader"></popup-picker>
            </div>
        </div>
        <div style="padding: 10px">
            <div v-show="leaderPhoto==null||leaderPhoto==''" class="user-photo">
                {{leaderName[0]}}
            </div>
            <img v-show="leaderPhoto!=null&&leaderPhoto!=''" class="user-photo" :src=leaderPhoto />
            <div class="la-names">{{leaderName}}</div>
        </div>
        <div class="title">
            <div style="clear: both"></div>
            <div class="left">联合跟进人</div>
                <div class="right" @click="openUnionList">
                    <popup-picker style=" margin-right: -45px;" title="添加" :data="unionData" :columns="3" v-model="unioner"  show-name @on-hide="changeUnioner"></popup-picker>
                </div>
        </div>
        <div style="padding: 10px">
            <span v-show="unions.length==0" style="color: rgb(102, 102, 102);font-size: 13px">暂无联合跟进人</span>
            <div class="undiv"  v-for="item in  unions">
                <div @click="delUnioner(item.id)" style="background: #ccc;height: 17px;width: 17px; border-radius: 16px; text-align: center;line-height: 19px;position: absolute; right: 5px; top: 2px;">
                    <img style="height: 13px;width: 13px" src="../../img/del.png"/>
                </div>
                <div  v-show="item.userPhoto==null||item.userPhoto==''" class="user-photo">
                    {{item.userName[0]}}
                </div>
                <img  v-show="item.userPhoto!=null&&item.userPhoto!=''" class="user-photo" :src=item.userPhoto />
                <div class='la-names' >{{item.userName}}</div>
            </div>
        </div>
    </group>
</template>
<script>
import {Group, PopupPicker, Picker, Popup, PopupHeader} from 'vux'
export default {
    components: {
        Group, PopupPicker, Picker, Popup, PopupHeader
    },
    mounted: function () {
        this.getInfo()
    },
    data () {
        return {
            type: '',
            unions: [],
            leader: [],
            unioner: [],
            leaderName: '',
            leaderPhoto: '',
            unionerName: '',
            unionerPhoto: '',
            showLeaders: false,
            leaderData: [{name: '', value: ''}],
            unionData: [{name: '', value: ''}]
        }
    },
    methods: {
        getInfo () {
            this.type = sessionStorage.getItem('listType')
            this.$get('api/customer/get_leader_unioner', {
                id: this.$route.query.companyId
            }).then((res) => {
                if (res.data.data.leader.length === 0) {
                    this.leaderName = []
                    this.leaderPhoto = ''
                } else {
                    this.leaderName = res.data.data.leader.userName
                    this.leaderPhoto = res.data.data.leader.userPhoto
                }
                if (res.data.data.unioner.length === 0) {
                    this.unions = []
                } else {
                    this.unions = res.data.data.unioner
                }
            })
            // this.userData = []
        },
        makeValue (data) {
            let newData = []
            for (var i = 0; i < data.length; i++) {
                newData.push({value: data[i].id, name: data[i].name})
            }
            return newData
        },
        openLeaderList () {
            this.showLeaders = true
            this.$get('api/customer/get_leader_drop', {
                id: this.$route.query.companyId
            }).then((res) => {
                let leaderList = []
                leaderList = res.data.data.list
                this.leaderData = this.makeValue(leaderList)
            })
        },
        openUnionList () {
            this.showUnioners = true
            this.$get('api/customer/get_unioner_drop', {
                id: this.$route.query.companyId
            }).then((res) => {
                let leaderList = []
                leaderList = res.data.data.list
                this.unionData = this.makeValue(leaderList)
            })
        },
        changeLeader (type) {
            if (type) {
                this.$post('api/customer/change_leader', {
                    id: this.$route.query.companyId,
                    userId: this.leader[0]
                }).then((res) => {
                    if (res.data.data.res === 1) {
                        let that = this
                        this.$vux.alert.show({
                            content: '操作成功',
                            onHide () {
                                if (that.type === '1') {
                                    that.$router.replace({name: 'private-list'})
                                } else {
                                    that.$router.replace({name: 'under-list'})
                                }
                            }
                        })
                    } else if (res.data.data.res === 0) {
                        this.$vux.alert.show({
                            content: res.data.data.msg || '操作失败'
                        })
                    } else {
                        this.$vux.alert.show({
                            content: res.data.data || '操作失败'
                        })
                    }
                })
            }
        },
        changeUnioner (type) {
            if (type) {
                this.$post('api/customer/add_union', {
                    id: this.$route.query.companyId,
                    userId: this.unioner[0]
                }).then((res) => {
                    if (res.data.data.res === 1) {
                        let that = this
                        this.$vux.alert.show({
                            content: '操作成功',
                            onHide () {
                                that.getInfo()
                            }
                        })
                    } else if (res.data.data.res === 0) {
                        this.$vux.alert.show({
                            content: res.data.data.msg || '操作失败'
                        })
                    } else {
                        this.$vux.alert.show({
                            content: res.data.data || '操作失败'
                        })
                    }
                })
            }
        },
        delUnioner (id) {
            let that = this
            this.$vux.confirm.show({
                content: '确认删除该联合跟进人？',
                onConfirm () {
                    that.$post('api/customer/del_union', {
                        id: that.$route.query.companyId,
                        userId: id
                    }).then((res) => {
                        // let that = this
                        if (res.data.data.res === 1) {
                            that.$vux.alert.show({
                                content: '操作成功',
                                onHide () {
                                    that.getInfo()
                                }
                            })
                        } else if (res.data.data.res === 0) {
                            that.$vux.alert.show({
                                content: res.data.data.msg || '操作失败'
                            })
                        } else {
                            that.$vux.alert.show({
                                content: res.data.data || '操作失败'
                            })
                        }
                    })
                }
            })
        }
    }
}
</script>
<style scoped>
    .title .left{ float: left; width: 100px;}
    .title .right{ width: 80px; text-align: right; float: right; color: #0094EB; margin-right: -45px;}
    .title{ padding: 10px; height: 24px; background-color: #FBFBFB;}
    .user-photo{ width: 50px; height: 50px; border: 1px solid #ddd; border-radius: 25px; text-align: center; line-height: 50px;}
    .undiv{ float: left;padding: 5px 10px; position: relative;}
    .la-names{ color: #666;width: 58px; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
    .right .weui-cell { padding: 0;}
    .right .weui-cell__ft{display: none;}
</style>
