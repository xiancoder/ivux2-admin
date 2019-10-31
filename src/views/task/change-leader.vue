<template>
    <div>
        <x-header @on-click-back="goInfo" :left-options="{backText: '', preventGoBack: true}" style="background-color: #0094eb">变更负责人<a slot="right" style="color: #fff" @click="saveChange">保存</a></x-header>
        <div class="info_container">
            <group>
                <cell title="负责人" primary="content">
                    <div @click="openP" class="select_style">{{personLiableName}}<img src="../../img/arrow.png"/></div>
                    <popup  v-model="modalP" position="bottom" height="315px" class="margin_style">
                        <search @result-click="resultClickP" @on-change="getResultP" :results="resultsP" v-model="valueP" class="searchInput"
                                :auto-fixed="false" ref="searchP" placeholder="搜索并选择负责人"></search>
                    </popup>
                </cell>
                <cell></cell>
            </group>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import { XHeader, Group, Cell, AlertPlugin, Popup, Search } from 'vux'
Vue.use(AlertPlugin)
export default {
    name: 'change-leader',
    components: { Group, Cell, XHeader, Popup, Search },
    data () {
        return {
            userList: [],
            modalP: false,
            valueP: '',
            personLiable: '',
            personLiableName: '',
            resultsP: []
        }
    },
    methods: {
        init () {
            this.$get('api/task/allusers', {
            }).then((res) => {
                this.userList = res.data.data.list
            })
            this.$get('api/task/detail', {
                taskId: this.$route.query.taskId
            }).then((res) => {
                this.personLiableName = res.data.data.res.personLiable.userName
                this.personLiable = res.data.data.res.personLiable.userId
            })
        },
        openP () {
            this.modalP = true
            this.valueP = ''
            this.resultsP = []
        },
        resultClickP (item) {
            this.personLiable = item.value
            this.personLiableName = item.title
            this.modalP = false
        },
        getUserP (val) {
            let rs = []
            for (let i = 0; i < this.userList.length; i++) {
                if (this.userList[i].userName.indexOf(val) !== -1) {
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
        getResultP (val) {
            this.resultsP = val ? this.getUserP(this.valueP) : []
        },
        goInfo () {
            this.$router.push({name: 'task-info', query: {taskId: this.$route.query.taskId, role: '2'}})
        },
        saveChange () {
            this.$post('api/task/changeleader', {
                taskId: parseInt(this.$route.query.taskId),
                userId: this.personLiable
            }).then((res) => {
                if (res.data.data.res === 1) {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '操作成功'
                    })
                    this.$router.replace({name: 'my-response'})
                } else {
                    this.$vux.alert.show({
                        title: '提示',
                        content: res.data.msg || '操作失败'
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
