<template>
    <div :style="{minHeight: pageHeight + 'px'}" style="background-color: #f5f6f8">
        <x-header @on-click-back="goHome" :left-options="{backText: '', preventGoBack: true}" class="header_white">
            <span class="header_title">组查看</span>
            <!--<span @click="goAdd" style="color: white" slot="right">添加</span>-->
        </x-header>
        <div class="header_blank" style="border-bottom: 1px solid #d7d7d7"></div>
        <div class="fix_search">
            <div class="grey_search">
                <search v-model="keyword" style="width: 100%;z-index: 1" class="searchInput"
                        cancel-text @on-change="search()" :auto-fixed="false"
                        placeholder="搜索组名称、组成员">
                </search>
            </div>
        </div>
        <div class="search_blank"></div>
        <div style="padding: 0 15px">
            <div class="tc" v-if="listData.length === 0|| listData === null">
                <img src="../../img/no-data.png" style="margin-top: 30%;width: 100px">
                <div style="color: #333333;font-size: 16px">暂无数据</div>
            </div>
            <div v-if="listData.length > 0" v-for="(item, index) in listData" :key="index" class="group_modal">
                <div style="padding: 12px" @click="toInfo(item.id, item.isPublic, item.userName)">
                    <div class="group_title">
                        <span class="public_group" v-if="item.isPublic === 1">公共组</span>
                        {{item.groupName}}
                    </div>
                    <div class="group_members">{{item.userName}}</div>
                </div>
                <!--<div style="line-height: 20px" @click="groupDelete(item.id, item.isPublic)">-->
                    <!--<img style="height: 24px;"  src="../../img/delete.png" v-if="isPersonnel || item.isPublic === 0"/>-->
                <!--</div>-->
            </div>
            <!--<x-table :cell-bordered="false" class="group_table">-->
                <!--<tbody>-->
                    <!--<tr v-if="listData.length === 0|| listData === null">-->
                        <!--<td colspan="3">无数据</td>-->
                    <!--</tr>-->
                    <!--<tr v-if="listData.length > 0" v-for="(item, index) in listData" :key="index" class="group_modal">-->
                        <!--<td style="text-align: left;padding: 15px 0" @click="toInfo(item.id, item.isPublic, item.userName)">-->
                            <!--<div style="font-size: 16px;word-break: break-all;line-height: 30px">-->
                                <!--<span class="public_group" v-if="item.isPublic === 1">公共组</span>-->
                                <!--{{item.groupName}}-->
                            <!--</div>-->
                            <!--<div class="group_members">{{item.userName}}</div>-->
                        <!--</td>-->
                        <!--<td style="line-height: 20px" @click="groupDelete(item.id, item.isPublic)">-->
                            <!--<img style="height: 24px;"  src="../../img/delete.png" v-if="isPersonnel || item.isPublic === 0"/>-->
                        <!--</td>-->
                    <!--</tr>-->
                <!--</tbody>-->
            <!--</x-table>-->
        </div>
        <alert v-model="showUser" title="组成员">
            <div class="mask_table">
                <span v-for="(name, index) in userNameBox" :key="index">{{name}}</span>
            </div>
        </alert>
    </div>
</template>
<script>
import {XHeader, Search, Alert} from 'vux'
export default {
    name: 'group-list',
    components: {Search, XHeader, Alert},
    data () {
        return {
            pageHeight: sessionStorage.getItem('phoneHeight'),
            isPersonnel: false,
            keyword: '',
            listData: [],
            showUser: false,
            userNameBox: []
        }
    },
    methods: {
        init () {
            this.$get('api/order/role', {
            }).then((res) => {
                this.isPersonnel = res.data.data
            })
            this.search()
        },
        goHome () {
            this.$router.replace({name: 'home_index'})
        },
        search () {
            this.$get('api/order/group_list', {
                keyword: this.keyword
            }).then((res) => {
                this.listData = res.data.data.list
            })
        },
        goAdd () {
            this.$router.push({name: 'group-edit'})
        },
        toInfo (id, isPublic, name) {
            this.showUser = true
            this.userNameBox = name.split('，')
            // if (isPublic === 1 && !this.isPersonnel) {
            //     this.showUser = true
            //     this.userNameBox = name
            // } else {
            //     this.$router.push({name: 'group-edit', query: {id: id}})
            // }
        },
        groupDelete (id, isPublic) {
            const self = this
            this.$vux.confirm.show({
                content: '<strong>确认要删除吗？</strong>',
                onCancel () {},
                onConfirm () {
                    self.$post('api/order/group_delete', {
                        id: id,
                        isPublic: isPublic
                    }).then((res) => {
                        if (res.data.data && res.data.data.res === 1) {
                            self.$vux.alert.show({
                                title: '提示',
                                content: '操作成功'
                            })
                            self.search()
                        } else {
                            self.$vux.alert.show({
                                title: '提示',
                                content: res.data.msg || '操作失败'
                            })
                        }
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
    .fix_search{ position: fixed; top: 46px; left: 0; width: 100%; z-index: 1; background-color: #ffffff;}
    .search_blank{ height: 48px;}
    .mask_table{display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */display: -moz-box; /* Firefox 17- */display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */display: -moz-flex; /* Firefox 18+ */display: -ms-flexbox; /* IE 10 */display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */ -webkit-justify-content: flex-start; justify-content: flex-start; flex-wrap: wrap;}
    .mask_table>span{ text-align: center; font-size: 14px; width: 25%;}
    .group_modal{ background-color: #fff; margin-top: 12px; border-radius: 4px;}
    .group_title{ font-size: 16px; word-break: break-all; font-weight: bold;}
    .public_group{display: inline-block; padding: 1px 5px; height: 18px; line-height: 18px; border-radius: 9px; color: #ffffff; background-color: #4a8bff; font-size: 12px; text-align: center; margin-right: 3px; vertical-align: text-top; margin-top: 0.5px;}
    .group_members{ margin-top: 5px; line-height: 22px; overflow: hidden; text-overflow: ellipsis; color: #999999; font-size: 14px; word-break: break-all;display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;}
</style>
