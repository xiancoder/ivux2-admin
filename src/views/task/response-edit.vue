<template>
    <div>
        <x-header @on-click-back="goInfo" :left-options="{backText: '', preventGoBack: true}" style="background-color: #0094eb">任务编辑<a slot="right" style="color: #fff" @click="saveEdit">保存</a></x-header>
        <div class="info_container">
            <group>
                <cell title="负责人" primary="content">
                    <div @click="openP" class="select_style">{{personLiableName}}<img src="../../img/arrow.png"/></div>
                    <popup  v-model="modalP" position="bottom" height="315px" class="margin_style">
                        <search @result-click="resultClickP" @on-change="getResultP" :results="resultsP" v-model="valueP" class="searchInput"
                                :auto-fixed="false" ref="searchP" placeholder="搜索并选择负责人"></search>
                    </popup>
                </cell>
                <cell title="执行人" primary="content">
                    <div @click="editOp" v-show="nameBox.length === 0"  class="select_style">请选择<img src="../../img/arrow.png"/></div>
                    <div @click="editOp" v-show="nameBox.length > 0"  class="select_style">
                        <span v-for="(name, index) in nameBox" :key="index" v-show="index < 3"><span v-show="nameBox.length !== 1 && index !== 0">, </span>{{name}}</span>
                        <span v-show="nameBox.length > 3">等</span>
                        <img src="../../img/arrow.png"/>
                    </div>
                    <popup v-model="modalOp" position="bottom" height="100%" class="margin_style">
                        <div class="popTop">
                            <span @click="cancelOp">取消</span>
                            <span style="float: right;color: #0094eb" @click="confirmOp">确定</span>
                        </div>
                        <search @result-click="resultClickOp" @on-change="getResultOp" :results="resultsOp" v-model="valueOp" class="searchInput"
                                :auto-fixed="false" ref="searchOp" placeholder="搜索并选择执行人"></search>
                        <div class="popResult" v-show="popNameBox.length > 0">
                            <span v-for="(op, index) in popNameBox" :key="index" @click="removeOp(index)">{{op}}<icon type="clear"></icon>&nbsp;&nbsp;</span>
                        </div>
                    </popup>
                </cell>
                <cell></cell>
            </group>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import {XHeader, Group, Cell, AlertPlugin, Popup, Search, Icon} from 'vux'
Vue.use(AlertPlugin)
export default {
    name: 'response-edit',
    components: {Group, Cell, XHeader, Popup, Search, Icon},
    data () {
        return {
            userList: [],
            modalP: false,
            valueP: '',
            personLiable: '',
            personLiableName: '',
            resultsP: [],
            modalOp: false,
            valueOp: '',
            resultsOp: [],
            nameBox: [],
            idBox: [],
            popNameBox: [],
            popIdBox: [],
            opBox: []
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
                let task = res.data.data.res
                this.personLiableName = task.personLiable.userName
                this.personLiable = task.personLiable.userId
                if (task.implement.length > 0) {
                    for (let i = 0; i < task.implement.length; i++) {
                        this.idBox.push(task.implement[i].userId)
                        this.nameBox.push(task.implement[i].userName)
                    }
                    this.popIdBox = JSON.parse(JSON.stringify(this.idBox))
                    this.popNameBox = JSON.parse(JSON.stringify(this.nameBox))
                }
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
        // 执行人
        editOp () {
            this.modalOp = true
            this.valueOp = ''
            this.resultsOp = []
        },
        cancelOp () {
            this.modalOp = false
            this.popIdBox = JSON.parse(JSON.stringify(this.idBox))
            this.popNameBox = JSON.parse(JSON.stringify(this.nameBox))
        },
        confirmOp () {
            this.modalOp = false
            this.idBox = JSON.parse(JSON.stringify(this.popIdBox))
            this.nameBox = JSON.parse(JSON.stringify(this.popNameBox))
        },
        resultClickOp (item) {
            let id = item.value
            let name = item.title
            if (this.popIdBox.indexOf(id) === -1) {
                this.popIdBox.push(id)
                this.popNameBox.push(name)
            }
        },
        removeOp (index) {
            this.popIdBox.splice(index, 1)
            this.popNameBox.splice(index, 1)
        },
        getUserOp (val) {
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
        getResultOp (val) {
            this.resultsOp = val ? this.getUserOp(this.valueOp) : []
        },
        saveEdit () {
            this.opBox = []
            for (let i = 0; i < this.idBox.length; i++) {
                this.opBox.push({
                    label: this.nameBox[i],
                    value: this.idBox[i]
                })
            }
            this.$post('api/task/change', {
                taskId: parseInt(this.$route.query.taskId),
                personLiable: this.personLiable,
                implement: this.opBox
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
        },
        goInfo () {
            this.$router.push({name: 'task-info', query: {taskId: this.$route.query.taskId, role: '2'}})
        }
    },
    mounted () {
        this.init()
    }
}
</script>
