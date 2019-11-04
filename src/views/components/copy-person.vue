<template>
    <div>
        <div class="scroll_container info_container">
            <div style="padding: 10px 15px">抄送人</div>
            <div style="width: 100%;overflow: hidden;">
                <nav class="scroll_list">
                    <div v-for="(cc, index) in ccList" :key="index" class="cc_model">
                        <img :src="cc.photo" v-show="cc.photo !== ''" class="photo_img">
                        <span class="first_name" v-show="cc.photo === ''">{{cc.userName | firstName}}</span>
                        <br><span style="color: #333; display: inline-block;width: 45px">{{cc.userName}}</span>
                    </div>
                    <div v-for="(add, index) in addList" :key="add.id" class="cc_model">
                        <img :src="add.photo" v-show="add.photo !== ''" @click="removeCC(index)" class="photo_img">
                        <span class="first_name" v-show="add.photo === ''" @click="removeCC(index)">{{add.userName | firstName}}</span>
                        <br><span style="color: #333; display: inline-block;width: 45px">{{add.userName}}</span>
                        <icon type="clear" class="cc_remove" @click="removeCC(index)"></icon>
                    </div>
                    <div class="add_cc">
                        <img class="photo_img" src="../../img/add.png" @click="addCC">
                        <br>&nbsp
                    </div>
                    <popup v-model="ccShow" position="bottom" height="315px" class="margin_style">
                        <search class="searchInput" @on-result-click="resultClickCC" @on-change="getResultCC" @on-cancel="ccShow=false;" :results="ccResult" v-model="ccSearch"
                            :auto-fixed="false" placeholder="搜索并添加抄送人"></search>
                    </popup>
                </nav>
            </div>
        </div>
    </div>
</template>
<script>
import {Icon, Popup, Search} from 'vux'
export default {
    // dsf-2019-6-4 抄送人组件
    name: 'copy-person',
    components: {
        Icon, Popup, Search
    },
    props: {
        userList: null, // 公司员工
        ccList: null // 默认抄送人
    },
    watch: {
        ccList () {
            for (let i = 0; i < this.ccList.length; i++) {
                this.cc.push(this.ccList[i].id)
            }
            this.defaultNum = this.ccList.length
            this.$emit('input', this.cc)
        }
    },
    data () {
        return {
            addList: [], // 新添加抄送人
            ccShow: false,
            ccSearch: '',
            ccResult: [],
            cc: [],
            defaultNum: null // 默认抄送人个数
        }
    },
    filters: {
        firstName: function (value) { // 截取字符串的第一个
            return value.substr(0, 1)
        }
    },
    methods: {
        addCC () {
            this.ccShow = true
            this.ccSearch = ''
            this.ccResult = []
        },
        removeCC (index) {
            let index2 = this.defaultNum + index
            this.addList.splice(index, 1)
            this.cc.splice(index2, 1)
            this.$emit('input', this.cc)
        },
        // 搜索公司职员
        searchStaff (val) {
            let rs = []
            for (let i = 0; i < this.userList.length; i++) {
                if (this.userList[i].emailStr.includes(val)) {
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
        // 选中某一员工
        resultClickCC (item) {
            if (item.value * 1 === -1) return false
            this.ccShow = false
            // 获取员工头像
            this.$vux.loading.show({
                text: 'Loading'
            })
            this.$get('api/workflow/get_photo', {
                userId: item.value
            }).then((res) => {
                let newAdd = {
                    id: item.value,
                    userName: item.title,
                    photo: res.data.data.img
                }
                if (this.cc.indexOf(newAdd.id) === -1) {
                    this.addList.push(newAdd)
                    this.cc.push(newAdd.id)
                    this.$emit('input', this.cc)
                }
                this.$vux.loading.hide()
            })
        },
        getResultCC (val) {
            this.ccResult = val ? this.searchStaff(val) : []
        }
    },
    mounted () {
    }
}
</script>
