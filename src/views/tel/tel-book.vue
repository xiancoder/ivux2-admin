<template>
    <div>
        <x-header class="header_div" :left-options="{showBack: false}"><span class="header_title">通讯录</span></x-header>
        <div style="height: 47px"></div>
        <div class="grey_search">
            <search v-model="keyWord" cancel-text :auto-fixed="false" @on-change="debSearch" @on-submit="searchContact" placeholder="支持员工姓名模糊查询"></search>
        </div>
        <div class="topping" style="bottom: 14%;" @click="update"><img src="../../img/top.png" alt=""></div>
        <scroller lock-x  ref="scrollerBottom" :scroll-bottom-offst="150" height="-150">
            <div style="padding: 15px">
                <div class="no_follow" v-if="contactList.length === 0 && isEmpty">
                    <div><img src="../../img/no_follow.png"></div>
                    没有联系人
                </div>
                <load-more v-show="top_loading" tip="loading"></load-more>
                <div class="contact_modal contact_modal2" v-for="(contact, index) in contactList" :key="index" style="height: 60px;position: relative;padding: 10px">
                    <div style="padding-right: 65px;height: 100%;" @click="to_staffInfo(contact.userId)">
                        <div class="book_photo" v-show="contact.userPhoto"><img :src="contact.userPhoto"></div>
                        <div class="name_photo" v-show="!contact.userPhoto">{{firstName(contact.userName)}}</div>
                        <div class="book_name">
                            <div class="contact_mark">{{contact.userName}}</div>&nbsp
                            <!--<span class="text_overflow" style="max-width: 70px;display: inline-block;line-height: 27px;font-size: 13px">{{contact.post || ' -'}}</span>-->
                        </div>
                        <div>
                            <span class="book_tel text_overflow">{{contact.post || ' -'}}</span>
                        </div>
                        <!--<div class="book_tel text_overflow">{{contact.tel}}</div>-->
                    </div>
                    <div class="pic_box" @click="bigShow(contact.userPicture)" v-if="contact.miniuserPicture">
                        <div :style="{backgroundImage: 'url(' + picRandom(contact.miniuserPicture) + ')', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', transform: 'rotate(' + deg(contact.miniuserPicture) + ')'}"></div>
                    </div>
                    <!--<div class="book_call"><a :href="'tel: ' + contact.tel"><img src="../../img/tel_active.png"></a></div>-->
                </div>
            </div>
            <div style="height: 40px;"></div>
        </scroller>
        <div class="imgDiv" v-show="bigImg" @click="back">
            <div :style="{backgroundImage: 'url(' + picRandom(userPicture) + ')', backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', width: '100%', height: pWidth.toString(), transform: 'rotate(' + deg(angle) + ')'}"></div>
        </div>
    </div>
</template>
<script>
import {Tabbar, TabbarItem, Scroller, LoadMore, Divider, Search, debounce} from 'vux'
export default {
    name: 'tel-book',
    components: { Tabbar, TabbarItem, Scroller, LoadMore, Divider, Search },
    data () {
        return {
            isEmpty: false,
            keyWord: '',
            contactList: [],
            searchSource: [],
            userPicture: '',
            pWidth: sessionStorage.getItem('phoneWidth') + 'px',
            angle: '_picture.png',
            debSearch: '', top_loading: false
        }
    },
    computed: {
        bigImg: function () {
            return this.$route.query.type
        }
    },
    methods: {
        init () {
            this.debSearch = debounce(this.searchContact, 500)
            this.getList()
        },
        // 更新通讯录
        update () {
            this.keyWord = ''
            this.top_loading = true
            this.isEmpty = false
            this.$get('api/contacts/getcontacts', {
                keyWord: null,
                page_index: 1,
                page_size: 500
            }).then((res) => {
                this.contactList = this.searchSource = res.data.data.list
                this.isEmpty = true
                this.top_loading = false
            })
            this.$nextTick(() => {
                this.$refs.scrollerBottom.reset({top: 0})
            })
        },
        getList () {
            this.$vux.loading.show({text: 'Loading'})
            this.$get('api/contacts/getcontacts', {
                keyWord: this.keyWord === '' ? null : this.keyWord,
                page_index: 1,
                page_size: 500
            }).then((res) => {
                this.contactList = this.searchSource = res.data.data.list
                this.isEmpty = true
                this.$vux.loading.hide()
            })
        },
        searchContact () {
            this.keyWord = this.keyWord.replace(/\s*/g, '')
            if (this.keyWord) {
                let telSearchList = [];// 通讯录临时数据
                for (let i = 0; i < this.searchSource.length; i++) {
                    if (this.searchSource[i].userName.indexOf(this.keyWord) !== -1 || this.searchSource[i].emailStr.indexOf(this.keyWord) !== -1) {
                        telSearchList.push(this.searchSource[i])
                    }
                }
                this.contactList = telSearchList
                this.isEmpty = true
            } else {
                this.contactList = this.searchSource
            }
            this.$nextTick(() => {
                this.$refs.scrollerBottom.reset({top: 0})
            })
        },
        to_staffInfo (userId) {
            this.$router.push({name: 'staff-info', query: {userId: userId}})
        },
        clearTel () {
            // removetel()
        },
        firstName (name) {
            return name[0]
        },
        picRandom (url) {
            return url + ' ? t=' + Math.ceil(Math.random() * 10000)
        },
        bigShow (val) {
            this.userPicture = val
            this.angle = val
            // 用改变router的方式实现大图的切换的原因：保证用手机的回退键时大图回退到详情页面
            this.$router.push({name: 'tel-book', query: {type: '1'}})
        },
        back () {
            this.$router.go(-1)
        },
        deg (url) {
            let index = url.lastIndexOf('_')
            let index2 = url.lastIndexOf('.')
            let angle = url.substring(index + 1, index2)
            if (angle === 'picture') {
                return '0' + 'deg'
            } else {
                return angle + 'deg'
            }
        }
    },
    mounted () {
        this.init()
    }
}
</script>
<style scoped lang="less">
    .book_call{ position: absolute; right: 20px; top: 20px;}
    .book_call img{ width: 40px;}
    .book_photo{ position: absolute; left: 15px; top: 15px;}
    .book_photo img{ width: 50px; height: 50px; border-radius: 25px;}
    .name_photo{ position: absolute; left: 15px; top: 15px;display: inline-block; width: 50px; height: 50px; line-height: 50px; border-radius: 25px; vertical-align: middle; text-align: center; background: linear-gradient(180deg, rgba(57, 98, 255, 1) 0%, rgba(91, 162, 255, 1) 100%); color: #fff;}
    .book_name{ position: absolute; left: 80px; top: 15px;}
    .book_tel{ position: absolute; left: 80px; top: 40px; max-width: 120px;}
    .pic_box{ position: absolute; right: 0; top: 0; width: 60px; height: 60px; padding: 10px;
        div{ border-radius: 6px;}
    }
    .pic_box>div{ width: 100%; height: 100%;}
    .imgDiv{ position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: #fff; z-index: 999;display: flex; align-items: center;}
    .bigImage{ max-width: 100%; position: absolute; top: 0; right: 0; bottom: 0; left: 0; margin: auto;}
    .contact_modal2{ box-shadow: 0px 2px 4px 4px rgba(79, 121, 197, 0.06); border-radius: 6px; border: none;}
</style>
