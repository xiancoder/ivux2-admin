<template>
    <div>
        <x-header :left-options="{backText: ''}" class="header_fix">跟进记录详情</x-header>
        <div class="header_blank"></div>
        <div class="info_container">
            <group>
                <cell style="height: auto;word-break: break-all" title="客户名称" primary="content" :value="followDetail.busName"></cell>
                <cell title="客户类型" :value="followDetail.cusTypeName"></cell>
                <cell title="合作状态" :value="followDetail.teamWorkStatusName"></cell>
                <cell title="联系人" :value="followDetail.contact || '-'"></cell>
                <cell title="跟进方式" :value="followDetail.wayName"></cell>
                <cell title="跟进时间" :value="followDetail.createAt"></cell>
                <div class="detail_content">
                    <div style="border-top: 0.5px solid #D9D9D9;padding: 10px 0">
                        跟进内容
                        <div class="detail_text">
                            {{followDetail.content}}
                        </div>
                        <div>
                            <x-dialog v-model="mask" hide-on-blur>
                                <img :src="img" style="max-width: 100%">
                            </x-dialog>
                            <div class="follow_img" v-for="(img, index) in followDetail.image" :key="index">
                                <img :src="img" @click="openMask(img)">
                            </div>
                            <div class="follow_img" v-show="followDetail.file.length > 0">
                                <a :href="file" v-for="(file, index) in followDetail.file" :key="index" download=""><img src="../../img/file.png"></a>
                            </div>
                        </div>
                    </div>
                </div>
            </group>
        </div>
    </div>
</template>
<script>
import {Group, Cell, XDialog} from 'vux'
export default {
    name: 'follow-detail',
    components: {Group, Cell, XDialog},
    data () {
        return {
            mask: false,
            img: '',
            followDetail: {
                busName: '',
                cusTypeName: '',
                cusLevelName: '',
                teamWorkStatusName: '',
                contact: '',
                wayName: '',
                createAt: '',
                content: '',
                file: [],
                image: []
            }
        }
    },
    methods: {
        init () {
            this.$get('api/customer/followuplog_detail', {
                id: this.$route.query.followId
            }).then((res) => {
                this.followDetail = res.data.data.result
            })
        },
        openMask (img) {
            this.mask = true
            this.img = img
        }
    },
    mounted () {
        this.init()
    }
}
</script>
<style scoped>
    .detail_content{ padding-left: 15px; font-size: 14px; color: #333;}
    .detail_text{ background-color: #f8f8f8; padding: 15px; margin: 10px 0; word-wrap: break-word; color: #666;}
</style>
