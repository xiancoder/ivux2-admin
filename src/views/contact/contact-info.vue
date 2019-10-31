<template>
    <div>
        <x-header :left-options="{backText: ''}" class="header_fix">
            联系人信息
            <a slot="right" v-show="editMark" style="color: #fff" @click="editContact">编辑</a>
        </x-header>
        <div class="header_blank"></div>
        <div class="contact_top">
            <div class="contact_photo">
                {{fName[0]}}
            </div>
            <div class="contact_name">
                <h4>{{contactInfo.name}}</h4>
                <span style="display: block;font-size: 16px;">{{contactInfo.post || '-'}}</span>
            </div>
        </div>
        <div class="info_title">
            <span class="info_blue"></span> 联系方式
        </div>
        <div class="info_container">
            <group>
                <cell title="电话">{{contactInfo.tel || '-'}}</cell>
                <cell title="邮箱" primary="content">{{contactInfo.email || '-'}}</cell>
                <cell title="微信">{{contactInfo.wechat || '-'}}</cell>
                <cell title="QQ">{{contactInfo.qq || '-'}}</cell>
                <cell title="备注"></cell>
                <div class="remark_text">{{contactInfo.remark || '-'}}</div>
            </group>
        </div>
        <div style="height: 8px;background-color: #f5f7f9"></div>
        <div class="info_title">
            <span class="info_blue"></span> 所属客户信息
        </div>
        <div class="info_container">
            <group>
                <cell style="height: auto; word-break: break-all" title="客户名称" primary="content">{{contactInfo.busName || '-'}}</cell>
                <cell title="所属行业">{{contactInfo.industry || '-'}}</cell>
                <cell title="企业法人">{{contactInfo.corp || '-'}}</cell>
            </group>
        </div>
        <div style="height: 8px;background-color: #f5f7f9"></div>
        <div class="info_title">
            <span class="info_blue"></span> 系统信息
        </div>
        <div class="info_container">
            <group>
                <cell title="创建人">{{contactInfo.createByName || '-'}}</cell>
                <cell title="创建日期">{{contactInfo.createdAts || '-'}}</cell>
            </group>
        </div>
    </div>
</template>
<script>
import { XHeader, Group, Cell, XInput } from 'vux'
export default {
    name: 'contact-info',
    components: { Group, Cell, XHeader, XInput},
    data () {
        return {
            editMark: false,
            fName: '',
            contactInfo: {}
        }
    },
    methods: {
        init () {
            if (this.$route.query.mark) {
               this.editMark = true
            }
            this.$get('api/home/contactdetail', {
                id: this.$route.query.contactId
            }).then((res) => {
                this.contactInfo = res.data.data.result
                this.fName = this.contactInfo.name
            })
        },
        editContact () {
            this.$router.push({name: 'add-contact', query: {companyId: this.contactInfo.cusId, contactId: this.contactInfo.id}})
        }
    },
    mounted () {
        this.init()
    }
}
</script>
<style scoped>
    .contact_top{ height: 134px; line-height: 134px; padding: 0 40px; background: url('../../img/contact-bg.png') no-repeat 100% 100%; background-size: cover;}
    .contact_photo{display: inline-block; width: 60px; height: 60px; line-height: 60px; border-radius: 30px; background-color: #FFF; text-align: center; font-size: 20px; color: #9a9a9a;}
    .contact_name{display: inline-block; margin: -5px 0 0 10px; font-size: 18px; line-height: 25px; color: #fff; vertical-align: middle; max-width: 200px;}
    .contact_name h4{ overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
    .contact_name span{ overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
    .remark_text{ background-color: #f8f8f8; padding: 15px; margin: 0 0 10px 15px; word-wrap: break-word; color: #666;}
</style>
