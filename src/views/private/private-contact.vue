<template>
    <div>
        <x-header @on-click-back="goInfo" :left-options="{backText: '', preventGoBack: true}" class="header_fix">联系人<a slot="right" style="color: #fff" @click="addContact">添加</a></x-header>
        <div class="header_blank"></div>
        <div style="padding: 15px">
            <div class="no_follow" v-show="contactList.length === 0">
                <div><img src="../../img/no_follow.png"></div>
                没有联系人
            </div>
            <div class="contact_modal" v-for="(contact, index) in contactList" :key="index">
                <div class="contact_msg" @click="toInfo(contact.id)">
                    <div class="contact_mark">{{contact.name}}</div>&nbsp;<span class="text_overflow" style="max-width: 80px;display: inline-block;line-height: 27px">{{contact.post || ' -'}}</span>
                    <div class="contact_cpy">{{contact.busName}}</div>
                </div>
                <div class="contact_action">
                    <div v-show="contact.tel"><a :href="'tel: ' + contact.tel"><img src="../../img/call.png"></a><div>打电话</div></div>
                    <div v-show="!contact.tel"><img src="../../img/greyTel.png"><div>打电话</div></div>
                    <div><a @click="addFollow(contact.id)"><img src="../../img/write.png"></a><div>写跟进</div></div>
                    <div><a @click="toList(contact.id)"><img src="../../img/check.png"></a><div>跟进记录</div></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {XHeader, Group, Cell} from 'vux'
export default {
    name: 'private-contact',
    components: {Group, Cell, XHeader},
    data () {
        return {
            show: false,
            telNumber: '',
            contactList: []
        }
    },
    methods: {
        init () {
            this.$get('api/customer/contacter', {
                id: this.$route.query.companyId
            }).then((res) => {
                this.contactList = res.data.data.list
            })
        },
        goInfo () {
            this.$router.replace({name: 'private-info', query: {companyId: this.$route.query.companyId}})
        },
        addContact () {
            this.$router.push({name: 'add-contact', query: {companyId: this.$route.query.companyId}})
        },
        toInfo (contactId) {
            this.$router.push({name: 'contact-info', query: {contactId: contactId, mark: '1'}})
        },
        addFollow (contactId) {
            this.$router.push({name: 'add-follow', query: {contactId: contactId}})
        },
        toList (contactId) {
            this.$router.push({name: 'contact-follow', query: {contactId: contactId}})
        }
    },
    mounted () {
        this.init()
    }
}
</script>
