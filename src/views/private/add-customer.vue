<style lang='less'>
    .vux-popup-header-right{ color: #0094eb!important;}
    .vux-popup-picker-placeholder { color: #777!important;}
    .vux-popup-picker-value{ color: #333!important;}
</style>
<template>
    <div>
        <x-header :left-options="{backText: ''}" class="header_fix">客户信息<a slot="right" style="color: #fff" @click="addCustomer">保存</a></x-header>
        <div class="header_blank"></div>
        <div class="links">
            <div><a href="https: // www.tianyancha.com/" target="_blank"><img src="../../img/tyc.png"></a><div>天眼查</div></div>
            <div><a href="https: // www.qichacha.com/" target="_blank"><img src="../../img/qcc.png"></a><div>企查查</div></div>
            <div><a href="https: // maimai.cn/" target="_blank"><img src="../../img/mm.png"></a><div>脉脉</div></div>
            <div><a href="https: // www.zdao.com/" target="_blank"><img src="../../img/zd.png"></a><div>找到</div></div>
        </div>
        <div class="info_container">
            <group>
                <popup-picker v-show="showProject" popup-title="选择所属项目" placeholder="必填" show-name :columns="1" title="所属项目" :data="projectList" v-model="projectType"></popup-picker>
                <popup-picker popup-title="选择客户类型" placeholder="必填" show-name :columns="1" title="客户类型" :data="cusList" v-model="cusType"></popup-picker>
                <popup-picker v-show="cusType[0] === '1'" popup-title="选择渠道类型" placeholder="必填" show-name :columns="1" title="渠道类型" :data="channelList" v-model="channelType"></popup-picker>
                <popup-picker v-show="cusType[0] === '2'" popup-title="选择广告主属性" placeholder="必填" show-name :columns="1" title="广告主属性" :data="adList" v-model="adType"></popup-picker>
                <popup-picker popup-title="选择客户级别" placeholder="必填" show-name :columns="1" title="客户级别" :data="levelList" v-model="cusLevel"></popup-picker>
                <popup-picker popup-title="选择合作状态" placeholder="必填" show-name :columns="1" title="合作状态" :data="statusList" v-model="cusStatus"></popup-picker>
            </group>
        </div>
        <div style="height: 8px;background-color: #f5f7f9"></div>
        <div class="info_title">
            <span class="info_blue"></span> 客户基本信息
        </div>
        <div class="info_container">
            <group>
                <cell title="客户名称"><x-input placeholder="必填" v-model="customerInfo.busName" :max="50" required text-align="right"></x-input></cell>
                <cell title="所属行业"><x-input placeholder="20字以内" v-model="customerInfo.industry" :max="20" text-align="right"></x-input></cell>
                <cell title="企业法人"><x-input placeholder="20字以内" v-model="customerInfo.corp" :max="20" text-align="right"></x-input></cell>
                <cell title="联系电话"><x-input :is-type="telNumber" placeholder="20位以内" ref="tel" v-model="customerInfo.tel" :max="20" text-align="right"></x-input></cell>
                <cell title="客户地址"><x-input placeholder="请输入客户地址" v-model="customerInfo.address" text-align="right" :max="50"></x-input></cell>
                <cell title="成立时间"><datetime v-model="customerInfo.foundDate"></datetime></cell>
                <cell title="企业规模"><x-input placeholder="请输入企业规模" v-model="customerInfo.scale" text-align="right" :max="20"></x-input></cell>
                <cell title="企业网址"><x-input placeholder="请输入企业网址" v-model="customerInfo.website" text-align="right" :max="500"></x-input></cell>
                <cell title="关键词"></cell>
                <div style="padding-left: 15px">
                    <XTextarea v-model="customerInfo.keyword" style="border: 1px solid #d9d9d9;min-height: 60px" placeholder="每个关键词限制2-8个字，多个关键词之间用英文半角逗号隔开"></XTextarea>
                </div>
                <div style="padding: 10px 0 10px 15px;color: #333">备注</div>
                <div style="padding-left: 15px;padding-bottom: 15px">
                    <XTextarea v-model="customerInfo.mark" style="border: 1px solid #d9d9d9;min-height: 70px" :max="200" placeholder="备注限制200个字符以内"></XTextarea>
                </div>
            </group>
        </div>
    </div>
</template>
<script>
import {Group, Cell, PopupPicker, XInput, XTextarea, Datetime} from 'vux'
export default {
    name: 'add-customer',
    components: {Group, Cell, PopupPicker, XInput, XTextarea, Datetime},
    data () {
        return {
            showProject: true,
            projectList: [],
            projectType: [],
            cusList: [{name: '渠道', value: '1'}, {name: '广告主', value: '2'}, {name: '城市合伙人', value: '3'}, {name: '直接客户', value: '4'}],
            channelList: [{name: 'wap网站主', value: '1'}, {name: 'OP', value: '2'}, {name: 'app', value: '3'}, {name: '网吧', value: '4'}, {name: '其他', value: '5'}],
            channelType: [],
            adList: [{name: '企业', value: '1'}, {name: '个人', value: '2'}],
            adType: [],
            cusType: [],
            levelList: [{name: 'A', value: '1'}, {name: 'B', value: '2'}, {name: 'C', value: '3'}, {name: 'D', value: '4'}],
            cusLevel: [],
            statusList: [{name: '未合作', value: '0'}, {name: '已合作', value: '1'}, {name: '已终止', value: '3'}],
            cusStatus: [],
            customerInfo: {
                id: 0,
                projectType: '',
                cusType: '',
                cusLevel: '',
                teamWorkStatus: '',
                busName: '',
                industry: '',
                corp: '',
                tel: '',
                address: '',
                keyword: '',
                mark: '',
                foundDate: '',
                scale: '',
                website: '',
                channelType: '',
                adType: ''
            },
            telNumber: function (value) {
                let num = /^[0-9]\d*$/
                return {
                    valid: num.test(value),
                    msg: '电话只能为纯数字'
                }
            }
        }
    },
    methods: {
        init () {
            // 获取客户详情
            if (this.$route.query.companyId) {
                this.showProject = false
                this.$get('api/customer/detail', {
                    id: this.$route.query.companyId
                }).then((res) => {
                    this.customerInfo = res.data.data.result
                    this.customerInfo.foundDate = res.data.data.result.foundDates
                    this.projectType.push(this.customerInfo.projectId + '')
                    this.cusType.push(this.customerInfo.cusType + '')
                    this.cusLevel.push(this.customerInfo.cusLevel + '')
                    this.cusStatus.push(this.customerInfo.teamWorkStatus + '')
                    this.channelType = [this.customerInfo.channelType.toString()]
                    this.adType = [this.customerInfo.adType.toString()]
                })
            }
            // 获取项目下拉框
            this.$get('api/sys/project_list', {
            }).then((res) => {
                const data = res.data.data.list
                for (let i = 0; i < data.length; i++) {
                    this.projectList.push({value: '', name: ''})
                    this.projectList[i].value = data[i].id + ''
                    this.projectList[i].name = data[i].name
                }
            })
        },
        addCustomer () {
            if (this.projectType.length === 0) {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请选择所属项目！'
                })
            } else if (this.cusType.length === 0) {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请选择客户类型！'
                })
            } else if (this.cusLevel.length === 0) {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请选择客户级别！'
                })
            } else if (this.cusStatus.length === 0) {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请选择合作状态！'
                })
            } else if (this.cusType[0] === '1' && this.channelType[0] === '0') {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请选择渠道类型！'
                })
            } else if (this.cusType[0] === '2' && this.adType[0] === '0') {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请选择广告主属性！'
                })
            } else if (this.customerInfo.busName === '') {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请填写客户名称！'
                })
            } else if (!this.$refs.tel.valid) {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请检查电话格式！'
                })
            } else {
                if (this.cusType[0] === '1') {
                    this.adType = ['0']
                }
                if (this.cusType[0] === '2') {
                    this.channelType = ['0']
                }
                if (this.cusType[0] !== '1' && this.cusType[0] !== '2') {
                    this.channelType = ['0']
                    this.adType = ['0']
                }
                this.$vux.loading.show({
                    text: 'Loading'
                })
                this.customerInfo.projectType = parseInt(this.projectType[0])
                this.customerInfo.cusType = parseInt(this.cusType[0])
                this.customerInfo.cusLevel = parseInt(this.cusLevel[0])
                this.customerInfo.teamWorkStatus = parseInt(this.cusStatus[0])
                this.customerInfo.channelType = parseInt(this.channelType[0])
                this.customerInfo.adType = parseInt(this.adType[0])
                this.$post('api/customer/add_private', this.customerInfo).then((res) => {
                    this.$vux.loading.hide()
                    if (res.data.data.res === 1) {
                        this.$vux.alert.show({
                            title: '提示',
                            content: '操作成功'
                        })
                        if (sessionStorage.getItem('listType') === '1') {
                            this.$router.replace({name: 'private-list'})
                        } else {
                            this.$router.replace({name: 'under-list'})
                        }
                    } else if (res.data.data.res === 0) {
                        this.$vux.alert.show({
                            title: '提示',
                            content: '操作失败'
                        })
                    } else {
                        this.$vux.alert.show({
                            title: '提示',
                            content: res.data.data
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
<style scoped>
    .disNone{display: none;}
</style>
