<template>
    <div>
        <x-header @on-click-back="goInfo" :left-options="{backText: '', preventGoBack: true}" style="background-color: #0094eb">任务编辑<a slot="right" style="color: #fff" @click="saveEdit">保存</a></x-header>
        <div class="info_container">
            <group>
                <cell title="完成日期" primary="content"><datetime v-model="deadline" placeholder=""></datetime></cell>
                <cell title="抄送人" primary="content">
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
                                :auto-fixed="false" ref="searchOp" placeholder="搜索并选择抄送人"></search>
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
import {Group, Cell, Datetime, Popup, Search, Icon} from 'vux'
export default {
    name: 'release-edit',
    components: {Group, Cell, Popup, Datetime, Search, Icon},
    data () {
        return {
            userList: [],
            deadline: '',
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
                if (task.completeTime) {
                    this.deadline = task.completeTime
                }
                if (task.correlation.length > 0) {
                    for (let i = 0; i < task.correlation.length; i++) {
                        this.idBox.push(task.correlation[i].userId)
                        this.nameBox.push(task.correlation[i].userName)
                    }
                    this.popIdBox = JSON.parse(JSON.stringify(this.idBox))
                    this.popNameBox = JSON.parse(JSON.stringify(this.nameBox))
                }
            })
        },
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
            this.$post('api/task/founderedit', {
                taskId: parseInt(this.$route.query.taskId),
                entime: this.deadline,
                correlation: this.opBox
            }).then((res) => {
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
        },
        goInfo () {
            this.$router.push({name: 'task-info', query: {taskId: this.$route.query.taskId, role: '1'}})
        }
    },
    mounted () {
        this.init()
    }
}
</script>
