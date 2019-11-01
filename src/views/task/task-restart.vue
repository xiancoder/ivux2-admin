<template>
    <div>
        <x-header @on-click-back="toInfo" :left-options="{backText: '', preventGoBack: true}" style="background-color: #0094eb">任务重启<a slot="right" style="color: #fff" @click="saveTask">保存</a></x-header>
        <div class="info_container">
            <group>
                <cell title="任务名称"><x-input readonly v-model="taskName" required text-align="right" placeholder="必填"></x-input></cell>
                <popup-picker show-name :columns="1" title="优先级" :data="statusList" v-model="taskPriority"></popup-picker>
                <cell title="完成日期" v-show="taskPriority[0] === '2'" primary="content"><datetime v-model="completeTime" placeholder="必填"></datetime></cell>
                <cell title="负责人" primary="content">
                    <div @click="openP" v-show="personLiableName === ''" class="select_style">必填<img src="../../img/arrow.png"/></div>
                    <div @click="openP" v-show="personLiableName !== ''" class="select_style">{{personLiableName}}<img src="../../img/arrow.png"/></div>
                    <popup  v-model="modalP" position="bottom" height="47%" class="margin_style">
                        <search @result-click="resultClickP" @on-change="getResultP" :results="resultsP" v-model="valueP" class="searchInput" position="absolute" ref="searchP" placeholder="搜索并选择负责人"></search>
                    </popup>
                </cell>
                <cell title="抄送人" primary="content">
                    <div @click="openC" v-show="nameBox.length === 0" class="select_style">请选择<img src="../../img/arrow.png"/></div>
                    <div @click="openC" v-show="nameBox.length > 0" class="select_style">
                        <span v-for="(name, index) in nameBox" :key="index" v-show="index < 3"><span v-show="nameBox.length !== 1 && index !== 0">, </span>{{name}}</span>
                        <span v-show="nameBox.length > 3">等</span>
                        <img src="../../img/arrow.png"/>
                    </div>
                    <popup v-model="modalC" position="bottom" height="53%" class="margin_style">
                        <div style="min-height: 40px;line-height: 40px;text-align: left;padding: 0 15px">
                            <span v-for="(co, index) in nameBox" :key="index" @click="removeCo(index)">{{co}}<icon type="clear"></icon>&nbsp;&nbsp;</span>
                        </div>
                        <search @result-click="resultClickC" @on-change="getResultC" :results="resultsC" v-model="valueC" class="searchInput" position="absolute" ref="searchC" top="40px" placeholder="搜索并选择抄送人"></search>
                    </popup>
                </cell>
                <cell></cell>
            </group>
        </div>
        <loading :show="loadingShow === '1'" text="Loading"></loading>
    </div>
</template>
<script>
import Vue from 'vue'
import {XHeader, Group, Cell, XInput, PopupPicker, AlertPlugin, Loading, Datetime, Popup, Search, Icon} from 'vux'
Vue.use(AlertPlugin)
export default {
    name: 'task-restart',
    components: {Group, Cell, XHeader, XInput, Popup, Search, PopupPicker, Loading, Datetime, Icon},
    data () {
        return {
            userList: [],
            taskName: '',
            taskPriority: [],
            statusList: [{name: '一般', value: '0'}, {name: '重要', value: '1'}, {name: '紧急', value: '2'}],
            completeTime: '',
            modalP: false,
            valueP: '',
            personLiable: '',
            personLiableName: '',
            resultsP: [],
            modalC: false,
            valueC: '',
            idBox: [],
            nameBox: [],
            resultsC: [],
            loadingShow: ''
        }
    },
    methods: {
        init () {
            this.$get('api/task/allusers', {
            }).then((res) => {
                this.userList = res.data.data.list
            })
            this.$get('api/task/restartdetail', {
                taskId: this.$route.query.taskId
            }).then((res) => {
                let task = res.data.data.res
                this.taskName = task.taskName
                if (task.taskPriority === 0) {
                    this.taskPriority = ['0']
                } else if (task.taskPriority === 1) {
                    this.taskPriority = ['1']
                } else {
                    this.taskPriority = ['2']
                }
                this.completeTime = task.completeTime
                this.personLiable = task.personLiable.userId
                this.personLiableName = task.personLiable.userName
                if (task.correlation.length > 0) {
                    for (let i = 0; i < task.correlation.length; i++) {
                        this.idBox.push(task.correlation[i].userId)
                        this.nameBox.push(task.correlation[i].userName)
                    }
                }
            })
        },
        toInfo () {
            this.$router.push({name: 'task-info', query: {taskId: this.$route.query.taskId, role: '1'}})
        },
        // 负责人
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
        // 抄送人
        openC () {
            this.modalC = true
            this.valueC = ''
            this.resultsC = []
        },
        resultClickC (item) {
            let id = item.value
            let name = item.title
            if (this.idBox.indexOf(id) === -1) {
                this.idBox.push(id)
                this.nameBox.push(name)
            }
        },
        removeCo (index) {
            this.idBox.splice(index, 1)
            this.nameBox.splice(index, 1)
        },
        getUserC (val) {
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
        getResultC (val) {
            this.resultsC = val ? this.getUserC(this.valueC) : []
        },
        saveTask () {
            // 清空非紧急任务的完成时间
            if (this.taskPriority[0] !== '2') {
                this.completeTime = ''
            }
            if (this.taskPriority[0] === '2' && this.completeTime === '') {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请选择完成时间！'
                })
            } else {
                this.$post('api/task/restartSpecial', {
                    id: parseInt(this.$route.query.taskId),
                    taskPriority: parseInt(this.taskPriority[0]),
                    personLiable: this.personLiable,
                    correlation: this.idBox,
                    completeTime: this.completeTime === '' ? null : this.completeTime
                }).then(res => {
                    if (res.data.data.res === 1) {
                        this.$vux.alert.show({
                            title: '提示',
                            content: '操作成功'
                        })
                        this.$router.replace({name: 'task-info', query: {taskId: this.$route.query.taskId, role: '1'}})
                    } else {
                        this.$vux.alert.show({
                            title: '提示',
                            content: res.data.msg || '操作失败'
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
