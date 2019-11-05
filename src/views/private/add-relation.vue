<template>
    <group class="my-group">
        <x-header :left-options="{backText: ''}" style="background-color: #0094eb">添加关联客户
            <!-- <a  style="color: white" slot="right">查一查</a> -->
        </x-header>
        <div class="links">
            <div><a href="https: // www.tianyancha.com/" target="_blank"><img src="../../img/tyc.png"></a><div>天眼查</div></div>
            <div><a href="https: // www.qichacha.com/" target="_blank"><img src="../../img/qcc.png"></a><div>企查查</div></div>
            <div><a href="https: // maimai.cn/" target="_blank"><img src="../../img/mm.png"></a><div>脉脉</div></div>
            <div><a href="https: // www.zdao.com/" target="_blank"><img src="../../img/zd.png"></a><div>找到</div></div>
        </div>
        <!-- <search v-model="searchValue"  class="searchInput" @on-enter="serach()"
            cancel-text  :auto-fixed="autoFixed" @on-cancel="serach()"
            @on-clear="serach()"
            placeholder="请输入客户名称（全称）"
            ></search> -->
        <!-- <x-input type="text" class="follow_search" placeholder="请输入客户名称（全称）"  v-model="searchName" >
            <i slot="right" class="fa fa-search fa-lg" @click="search()"></i>
        </x-input> -->
        <group class="follow_search1">
            <x-input type="text" placeholder="请输入客户名称（全称）" class="follow_input1" v-model="searchName" @on-enter="search()">
                <i slot="right" class="fa fa-search fa-lg" style="vertical-align: baseline" @click="search()"></i>
            </x-input>
        </group>
        <x-table :cell-bordered="false"  >
            <tbody>
            <tr v-show="userData.length==0||userData==null">
                <td colspan="2">无数据</td>
            </tr>
            <tr  v-for="item in userData">
                <!-- <td style="  line-height: 20px;">
                    <img style="height: 36px" v-show="item.cusLevel=='A'" src="../../img/LA.png"/>
                    <img srtyle="height: 36px" v-show="item.cusLevel=='B'" src="../../img/LB.png"/>
                    <img style="height: 36px" v-show="item.cusLevel=='C'" src="../../img/LC.png"/>
                    <img style="height: 36px" v-show="item.cusLevel=='D'" src="../../img/LD.png"/>
                </td> -->
                <td style="text-align: left;padding-left: 28px;line-height: 22px;">
                    <div style="font-size: 16px; max-width: 245px;">{{item.busName}}</div>
                    <div style="color: #666666;font-size: 14px">负责人：{{item.leadername||'-'}}</div>
                </td>
                <td  style="text-align: right;padding-right: 20px;">
                    <x-button mini type="primary" @click.native="addRelation(item.id)">关联</x-button>
                </td>
            </tr>
            </tbody>
        </x-table>
    </group>
</template>
<script>
import {Loading, Group, Cell, Badge, Search, XInput, XTable, XButton} from 'vux'
export default {
    components: { Group, Cell, Badge, Search, XInput, XTable, XButton, Loading },
    mounted: function () {
        // this.getInfo()
    },
    data () {
        return {
            autoFixed: false,
            searchName: '',
            userData: []
        }
    },
    methods: {
        showLoading () {
            this.$vux.loading.show({
                text: 'Loading'
            })
            // setTimeout(() => {
            //     this.$vux.loading.hide()
            // }, 2000)
        },
        search () {
            this.showLoading()
            this.$get('api/customer/get_customer', {
                busName: this.searchName
            }).then((res) => {
                this.userData = res.data.data
                this.$vux.loading.hide()
                // this.showdiver = true
            })
            this.userData = []
        },
        addRelation (id) {
            let pa = {
                'cusId': this.$route.query.companyId, // 基准客户id
                'releId': id, // 关联客户id
                'status': 2 // -1 忽略/取消关联，2关联，
            }
            this.$post('api/customer/relation_operate', pa).then((res) => {
                if (res.data.data.res === 1) {
                    let that = this
                    this.$vux.alert.show({
                        content: '操作成功',
                        onHide () {
                            that.goRelationList()
                            // http:// localhost: 8080/#/company/relation ? companyId = 1175&type = 2
                        }
                    })
                }
                // this.showdiver = true
            })
        },
        goRelationList () {
            this.$router.replace({name: 'relation-company', query: {companyId: this.$route.query.companyId, type: 2, tab: 1}})
        }
    }
}
</script>
<style scoped>
    .follow_search1{ background-color: #f9f9f9; padding: 15px;}
    .follow_search1 .weui-cells{ margin-top: 0; border-radius: 17px;}
    .follow_search1 .weui-cells:before{ border: none;}
    .follow_search1 .weui-cells:after{ border: none;}
    .follow_input1{ height: 16px; font-size: 14px; padding: 5px 15px; color: #999999;}
</style>
