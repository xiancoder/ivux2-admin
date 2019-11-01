<template>
    <div>
        <x-header :left-options="{backText: ''}" style="background-color: #0094eb">联系人信息<a slot="right" style="color: #fff" @click="addContact">保存</a></x-header>
        <div class="info_title">
            <span class="info_blue"></span> 联系人信息
        </div>
        <div class="info_container">
            <group>
                <cell title="联系人姓名"><x-input placeholder="必填" v-model="contactInfo.name" :max="20" required text-align="right"></x-input></cell>
                <cell title="职位"><x-input placeholder="15字以内" v-model="contactInfo.post" :max="15" text-align="right"></x-input></cell>
                <cell title="电话"><x-input :is-type="telNumber"  placeholder="20位以内" v-model="contactInfo.tel" ref="tel" :max="20" text-align="right"></x-input></cell>
                <cell title="邮箱"><x-input is-type="email" placeholder="邮箱" v-model="contactInfo.email" ref="email" text-align="right"></x-input></cell>
                <cell title="微信"><x-input placeholder="20字以内" v-model="contactInfo.wechat" :max="20" text-align="right"></x-input></cell>
                <cell title="QQ"><x-input :is-type="telNumber" placeholder="5-15位" v-model="contactInfo.qq" ref="qq" :min="5" :max="15" text-align="right"></x-input></cell>
                <cell title="备注"></cell>
                <div style="padding-left: 15px;padding-bottom: 15px">
                    <XTextarea v-model="contactInfo.remark" style="border: 1px solid #d9d9d9;min-height: 70px" :max="50" placeholder="备注限制50个字符以内"></XTextarea>
                </div>
            </group>
        </div>
    </div>
</template>
<script>
import {XHeader, Group, Cell, XInput, XTextarea} from 'vux'
export default {
    name: 'add-contact',
    components: {Group, Cell, XHeader, XInput, XTextarea},
    data () {
        return {
            contactInfo: {
                cusId: 0,
                id: 0,
                name: '',
                post: '',
                tel: '',
                qq: '',
                wechat: '',
                email: '',
                remark: ''
            },
            telNumber: function (value) {
                let num = /^[0-9]\d*$/
                return {
                    valid: num.test(value),
                    msg: '只能输入数字'
                }
            }
        }
    },
    methods: {
        init () {
            this.contactInfo.cusId = this.$route.query.companyId
            // 编辑
            if (this.$route.query.contactId) {
                this.$get('api/home/contactdetail', {
                    id: this.$route.query.contactId
                }).then((res) => {
                    this.contactInfo = res.data.data.result
                })
            }
        },
        addContact () {
            if (this.contactInfo.name === '') {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请填写联系人姓名！'
                })
            } else if (!this.$refs.tel.valid || !this.$refs.qq.valid || !this.$refs.email.valid) {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请检查信息格式！'
                })
            } else {
                this.$vux.loading.show({
                    text: 'Loading'
                })
                this.$post('api/customer/add_contact', this.contactInfo).then((res) => {
                    this.$vux.loading.hide()
                    if (res.data.data.res === 1) {
                        this.$vux.alert.show({
                            title: '提示',
                            content: '操作成功'
                        })
                        this.$router.replace({name: 'private-contact', query: {companyId: this.$route.query.companyId}})
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
