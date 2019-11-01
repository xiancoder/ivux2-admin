<template>
    <div>
        <x-header @on-click-back="goHome" :left-options="{backText: '', preventGoBack: true}" style="background-color: #0094eb">联系人</x-header>
        <div class="follow_search">
            <search v-model="keyWord" cancel-text @on-change="searchContact()"
                    :auto-fixed="false" placeholder="请输入联系人、客户、职位"></search>
        </div>
        <scroller lock-x  @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="100" height="-120">
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
            <load-more v-show="loading" tip="loading"></load-more>
            <divider v-show="noMore">没有更多数据</divider>
        </scroller>
    </div>
</template>
<script>
import {XHeader, XInput, Group, Cell, Scroller, LoadMore, Divider, Search} from 'vux'
export default {
    name: 'contact-list',
    components: {XHeader, XInput, Group, Cell, Scroller, LoadMore, Divider, Search},
    data () {
        return {
            keyWord: null,
            currentCount: 30,
            loading: false,
            noMore: false,
            contactList: []
        }
    },
    methods: {
        init () {
            this.getList()
        },
        goHome () {
            this.$router.replace({name: 'home_index'})
        },
        getList () {
            this.$get('api/home/contacter', {
                keyWord: this.keyWord === '' ? null : this.keyWord,
                page_index: 1,
                page_size: 15
            }).then((res) => {
                this.contactList = res.data.data.list
                this.loading = false
            })
        },
        searchContact () {
            this.currentCount = 30
            this.noMore = false
            this.loading = true
            this.getList()
            this.$nextTick(() => {
                this.$refs.scrollerBottom.reset({top: 0})
            })
        },
        toInfo (id) {
            this.$router.push({name: 'contact-info', query: {contactId: id}})
        },
        addFollow (contactId) {
            this.$router.push({name: 'add-follow', query: {contactId: contactId, mark: '1'}})
        },
        toList (contactId) {
            this.$router.push({name: 'contact-follow', query: {contactId: contactId}})
        },
        onScrollBottom () {
            if (this.loading || this.contactList.length === 0) {
                console.log('???')
            } else {
                if (!this.noMore) {
                    this.loading = true
                    setTimeout(() => {
                        this.$get('api/home/contacter', {
                            keyWord: this.keyWord,
                            page_index: 1,
                            page_size: this.currentCount
                        }).then((res) => {
                            this.contactList = res.data.data.list
                            if (this.currentCount < res.data.data.rowCount) {
                                this.currentCount = this.currentCount + 15
                            } else {
                                this.noMore = true
                            }
                            this.loading = false
                        })
                    }, 2000)
                }
            }
        }
    },
    mounted () {
        this.init()
    }
}
</script>
