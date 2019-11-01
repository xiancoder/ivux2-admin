<style lang='less'>
    @import '../main.less';
    .is_public .weui-icon-circle{ font-size: 18px;}
    .is_public .weui-icon-success{ font-size: 18px;}
</style>
<template>
    <div>
        <x-header :left-options="{backText: ''}" class="header_fix">
            {{title}}
            <a slot="right" style="color: #fff" @click="saveGroup">完成</a></x-header>
        <div class="header_blank"></div>
        <div class="info_container">
            <group>
                <cell title="组名称">
                    <span class="red" slot="icon">*</span>
                    <x-input placeholder="请输入组名称" v-model="groupName" :max="20" text-align="right"></x-input>
                </cell>
                <cell title="组成员" primary="content">
                    <span class="red" slot="icon">*</span>
                    <div @click="openC" v-show="correlation.length === 0" class="select_style">请选择组成员<img src="../../img/arrow_grey.jpg"/></div>
                    <div @click="openC" v-show="correlation.length > 0" class="select_style">
                        <span v-for="(co, index) in correlation" :key="index" v-if="index < 3"><span v-show="correlation.length !== 1 && index !== 0">，</span>{{co.userName}}</span>
                        <span v-show="correlation.length > 3">等</span>
                        <img src="../../img/arrow.png"/>
                    </div>
                    <popup v-model="modalC" position="bottom" height="100%" class="margin_style">
                        <div class="popTop">
                            <span @click="cancelC">取消</span>
                            <span style="float: right;color: #0094eb" @click="confirmC">确定</span>
                        </div>
                        <search @result-click="resultClickC" @on-change="getResultC" :results="resultsC" v-model="valueC" class="searchInput"
                                :auto-fixed="false" ref="searchC" placeholder="搜索并选择抄送人"></search>
                        <div class="popResult" v-show="editBox.length > 0">
                            <span v-for="(co, index) in editBox" :key="index" @click="removeCo(index)">{{co.userName}}<icon type="clear"></icon>&nbsp;&nbsp;</span>
                        </div>
                    </popup>
                </cell>
                <cell>
                    <check-icon :value.sync="isPublic" v-show="isPersonnel" slot="title" class="is_public" style="font-size: 14px">设置为公共组</check-icon>
                </cell>
            </group>
        </div>
    </div>
</template>
<script>
import {XHeader, Group, Cell, XInput, PopupPicker, Popup, Search, Icon, CheckIcon} from 'vux'
export default {
    name: 'group-edit',
    components: {Group, Cell, XHeader, XInput, Popup, Search, PopupPicker, Icon, CheckIcon},
    data () {
        return {
            title: '新建组',
            id: 0,
            isPersonnel: false,
            groupName: '',
            modalC: false,
            valueC: '',
            resultsC: [],
            correlation: [],
            editBox: [],
            userList: [],
            idBox: [],
            userIds: [],
            isPublic: false
        }
    },
    methods: {
        init () {
            this.$get('api/order/role', {
            }).then((res) => {
                this.isPersonnel = res.data.data
            })
            this.$get('api/task/allusers', {
            }).then((res) => {
                this.userList = res.data.data.list
            })
            if (this.$route.query.id) {
                this.id = parseInt(this.$route.query.id)
                this.title = '编辑组'
                this.$get('api/order/group_info', {
                    id: this.id
                }).then((res) => {
                    let info = res.data.data.info
                    this.groupName = info.groupName
                    this.correlation = info.userList
                    this.isPublic = info.isPublic === 1
                })
            }
        },
        // 深度复制对象数组
        copyArray (arr) {
            return arr.map((e) => {
                if (typeof e === 'object') {
                    return Object.assign({}, e)
                } else {
                    return e
                }
            })
        },
        // 组成员
        openC () {
            this.modalC = true
            this.valueC = ''
            this.resultsC = []
            this.editBox = this.copyArray(this.correlation)
        },
        cancelC () {
            this.modalC = false
            this.editBox = this.copyArray(this.correlation)
        },
        confirmC () {
            this.modalC = false
            this.correlation = this.copyArray(this.editBox)
        },
        resultClickC (item) {
            if (item.value === -1) {
                return
            }
            let co = {userId: item.value, userName: item.title}
            this.getBox()
            if (!this.idBox.includes(item.value)) {
                this.editBox.push(co)
            }
        },
        removeCo (index) {
            this.editBox.splice(index, 1)
        },
        getUserC (val) {
            let rs = []
            for (let i = 0; i < this.userList.length; i++) {
                if (this.userList[i].userName.indexOf(val) !== -1) {
                    rs.push({
                        title: this.userList[i].userName,
                        value: this.userList[i].userId
                    })
                }
            }
            if (rs.length === 0) {
                return [{title: '无匹配数据', value: -1}]
            } else {
                return rs
            }
        },
        getResultC (val) {
            this.resultsC = val ? this.getUserC(this.valueC) : []
        },
        getBox () {
            let check = function (obj) {
                return obj.userId
            }
            this.idBox = this.editBox.map(check)
        },
        getIds () {
            let check = function (obj) {
                return obj.userId
            }
            this.userIds = this.correlation.map(check)
        },
        saveGroup () {
            if (this.groupName === '' || this.correlation.length === 0) {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请将信息填写完善'
                })
            } else {
                this.$vux.loading.show({
                    text: 'Loading'
                })
                this.getIds()
                this.$post('api/order/group_edit', {
                    id: this.id,
                    groupName: this.groupName,
                    userIds: this.userIds,
                    isPublic: this.isPublic === true ? 1 : 0
                }).then((res) => {
                    this.$vux.loading.hide()
                    if (res.data.data && res.data.data.res === 1) {
                        this.$vux.alert.show({
                            title: '提示',
                            content: '操作成功'
                        })
                        this.$router.replace({name: 'group-list'})
                    } else {
                        this.$vux.alert.show({
                            title: '提示',
                            content: res.data.msg || '操作失败'
                        })
                    }
                })
            }
        }
    },
    mounted () {
        this.init()
    }
}
</script>
