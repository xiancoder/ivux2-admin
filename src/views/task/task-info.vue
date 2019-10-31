<template>
    <div>
        <x-header @on-click-back="toList" :left-options="{backText: '', preventGoBack: true}" class="header_fix">任务详情</x-header>
        <div class="header_blank"></div>
        <div class="info_title">
            <span class="info_blue"></span> 任务信息
        </div>
        <div class="info_container">
            <group>
                <cell title="任务编号">{{taskInfo.taskNumber}}</cell>
                <cell title="任务名称" primary="content" style="height: auto;min-height: 25px">{{taskInfo.taskName}}</cell>
                <cell title="状态">{{taskInfo.taskStatus}}</cell>
                <cell title="优先级">{{taskInfo.taskPriority}}</cell>
                <cell title="完成日期">{{taskInfo.completeTime || '-'}}</cell>
                <cell title="发布人">{{taskInfo.founder}}</cell>
                <cell title="抄送人">
                    <div @click="openCo">
                        <span v-show="correlationName.length === 0">-</span>
                        <span v-for="(co, index) in correlationName" :key="index" v-show="index < 3">
                            {{co}}<span v-show="correlationName.length !== 1 && index !== (correlationName.length - 1) && index !== 2">, </span>
                        </span>
                        <span v-show="correlationName.length > 3">...</span>
                    </div>
                    <alert v-model="showCo" title="抄送人">
                        <div style="text-align: left">
                            <span v-for="(co, index) in correlationName" :key="index">
                                {{co}}<span v-show="correlationName.length !== 1 && index !== (correlationName.length - 1)">, </span>
                            </span>
                        </div>
                    </alert>
                </cell>
                <cell title="负责人">{{inChargeName}}</cell>
                <cell title="执行人">
                    <div @click="openOp">
                        <span v-show="operatorName.length === 0">-</span>
                        <span v-for="(op, index) in operatorName" :key="index" v-show="index < 3">
                            {{op}}<span v-show="operatorName.length !== 1 && index !== (operatorName.length - 1) && index !== 2">, </span>
                        </span>
                        <span v-show="operatorName.length > 3">...</span>
                    </div>
                    <alert v-model="showOp" title="执行人">
                        <div style="text-align: left">
                            <span v-for="(op, index) in operatorName" :key="index">
                                {{op}}<span v-show="operatorName.length !== 1 && index !== (operatorName.length - 1)">, </span>
                            </span>
                        </div>
                    </alert>
                </cell>
            </group>
        </div>
        <div style="height: 8px;background-color: #f5f7f9"></div>
        <div class="info_title">
            <span class="info_blue"></span> 任务内容
        </div>
        <div class="info_container">
            <group>
                <cell title="基本需求"></cell>
                <div class="remark_text"><div v-html="content" class="task_content"></div></div>
                <cell title="附件"></cell>
                <div class="remark_text" style="padding: 0 15px;background-color: #fff">
                    <span v-show="fileList.length === 0">-</span>
                    <a v-for="(file, index) in fileList" :key="index" :href="file" download="" style="color: #0094eb;display: block;margin-bottom: 5px">{{urlName(file)}}</a>
                </div>
                <cell title="追加需求">
                    <div class="blue" @click="addRequest" v-show="(taskStatus === '待接受' || taskStatus === '执行中') && role === 1 && pause === 0">添加</div>
                </cell>
                <div class="remark_text">
                    <div v-show="extraContent === ''">-</div>
                    <div v-html="extraContent" class="task_content"></div>
                </div>
                <div class="remark_text" style="padding: 0 15px;background-color: #fff">
                    <a v-for="(file, index) in extraFile" :key="index" :href="file" download="" style="color: #0094eb;display: block;margin-bottom: 5px">{{urlName(file)}}</a>
                </div>
                <div style="padding-left: 15px">
                    <div v-show="extraMore" class="more_info" @click="toAddition">
                        更多 <i class="fa fa-hand-o-right" aria-hidden="true"></i>
                    </div>
                </div>
            </group>
        </div>
        <div style="height: 8px;background-color: #f5f7f9"></div>
        <div class="info_title">
            <span class="info_blue"></span> 任务轨迹
            <span class="more_log" @click="toComment">写评论</span>
        </div>
        <popup v-model="commentModal" position="right" width="100%">
            <x-header @on-click-back="cancelComment" :left-options="{backText: '', preventGoBack: true}" style="background-color: #0094eb">写评论<a slot="right" style="color: #fff" @click="saveComment">保存</a></x-header>
            <group>
                <x-textarea title="" v-model="taskComment" :rows="5" placeholder="请输入评论内容" style="font-size: 14px"></x-textarea>
            </group>
        </popup>
        <div v-show="taskLog.length === 0" style="text-align: center;padding: 20px;color: #666">暂无记录</div>
        <div class="log_container">
            <div class="record_model" v-for="(log, index) in taskLog" :key="index" :class="index === 2 ? 'bn' : ''">
                <div style="margin-bottom: 5px;font-size: 14px;position: relative">
                    {{log.userName}}<span>{{log.opAt}}</span>
                    <img src="../../img/write.png" v-show="log.type === 1">
                    <img src="../../img/check.png" v-show="log.type === 0">
                </div>
                <div>{{log.content}}</div>
            </div>
        </div>
        <div style="padding: 0 15px">
            <div v-show="logMore" class="more_info" @click="toLog">
                更多 <i class="fa fa-hand-o-right" aria-hidden="true"></i>
            </div>
        </div>
        <div class="buttons">
            <div @click="taskComplete" v-show="taskStatus === '待验收' && role === 1 && pause === 0">通过</div>
            <div @click="taskRestart" v-show="taskStatus === '待验收' && role === 1 && pause === 0">重启</div>
            <div @click="releaseEdit" v-show="(taskStatus === '待接受' || taskStatus === '执行中' || taskStatus === '待验收') && role === 1 && pause === 0">编辑</div>
            <div @click="taskTimeout" v-show="(taskStatus === '待接受' || taskStatus === '执行中' || taskStatus === '待验收') && role === 1 && pause === 0">暂停</div>
            <div @click="taskRecovery" v-show="(taskStatus === '待接受' || taskStatus === '执行中' || taskStatus === '待验收') && role === 1 && pause === 1">恢复</div>
            <div @click="taskAbandon" v-show="(taskStatus === '待接受' || taskStatus === '执行中' || taskStatus === '待验收') && role === 1">废弃</div>
            <div @click="responseEdit" v-show="(taskStatus === '执行中' || taskStatus === '待验收') && pause === 0 && role === 2">编辑</div>
            <div @click="taskCommit" v-show="taskStatus === '执行中' && pause === 0 && role === 2">提交验收</div>
            <div @click="changeLeader" v-show="taskStatus === '待接受' && pause === 0 && role === 2">变更负责人</div>
            <div @click="acceptTask" v-show="taskStatus === '待接受' && pause === 0 && role === 2">接受任务</div>
            <div @click="deleteTask" v-show="taskStatus === '已废弃' && role === 1" style="width: 100%">删除任务</div>
        </div>
        <actionsheet @on-click-menu-menu1="restartNow" @on-click-menu-menu2="restartModify" v-model="restartModal" :menus="restartMenu" :close-on-clicking-mask="false" show-cancel></actionsheet>
        <div style="height: 50px"></div>
    </div>
</template>
<script>
import Vue from 'vue'
import VueHtml5Editor from 'vue-html5-editor'
import { XHeader, Group, Cell, XInput, Loading, XTextarea,
    Datetime, Popup, Search, Icon, Alert, Actionsheet } from 'vux'
Vue.use(VueHtml5Editor, {
    name: 'vue-html5-editor',
    showModuleName: false,
    icons: {
        text: 'fa fa-pencil', color: 'fa fa-paint-brush',
        font: 'fa fa-font',
        align: 'fa fa-align-justify',
        list: 'fa fa-list',
        tabulation: 'fa fa-table',
        image: 'fa fa-file-image-o',
        hr: 'fa fa-minus',
        eraser: 'fa fa-eraser'
    },
    // 配置图片模块
    // config image module
    image: {
        // 文件最大体积，单位字节  max file size
        sizeLimit: 512 * 1024,
        upload: {
            url: null,
            headers: {},
            params: {},
            fieldName: {}
        },
        compress: { width: 1600, height: 1600,
            quality: 80
        },
        uploadHandler (responseText) {
            var json = JSON.parse(responseText)
            if (!json.ok) {
                alert(json.msg)
            } else {
                return json.data
            }
        }
    },
    // 语言，内建的有英文（en-us）和中文（zh-cn）
    // default en-us, en-us and zh-cn are built-in
    language: 'zh-cn',
    hiddenModules: [],
    visibleModules: [
        'text',
        'color',
        'font',
        'align',
        'list',
        'tabulation',
        'image',
        'hr',
        'eraser'
    ],
    modules: {
        // omit, reference to source code of build-in modules
    }
})
export default {
    name: 'task-info',
    components: { Group, Cell, XHeader, XInput, Popup, Search, Alert, Loading, Datetime, Icon, Actionsheet, XTextarea },
    data () {
        return {
            id: '',
            userList: [],
            taskInfo: {},
            taskStatus: '',
            pause: '', // 0：正常，1：暂停
            role: '', // 1：发布人，2：负责人，0：其他
            inChargeName: '',
            correlationName: [],
            showCo: false,
            operatorName: [],
            showOp: false,
            content: '',
            fileList: [],
            urlName: function (url) {
                let index = url.lastIndexOf('_')
                url = url.substring(index + 1, url.length)
                return url
            },
            extraMore: false,
            extraContent: '',
            extraFile: [],
            taskLog: [],
            logMore: false,
            restartModal: false,
            restartMenu: {
                menu1: '直接重启',
                menu2: '修改重启'
            },
            commentModal: false,
            taskComment: ''
        }
    },
    methods: {
        init () {
            this.id = this.$route.query.taskId
            if (this.$route.query.role) {
                this.role = parseInt(this.$route.query.role)
            }
            this.$get('api/task/allusers', {
            }).then((res) => {
                this.userList = res.data.data.list
            })
            this.getInfo()
            this.getLog()
        },
        toList () {
            if (this.$route.query.role === '1') {
                this.$router.push({name: 'my-task'})
            } else if (this.$route.query.role === '2') {
                this.$router.push({name: 'my-response'})
            } else if (this.$route.query.role === '3') {
                this.$router.push({name: 'my-operate'})
            } else if (this.$route.query.role === '4') {
                this.$router.push({name: 'my-cc'})
            } else if (this.$route.query.role === '5') {
                this.$router.push({name: 'task-all'})
            } else {
                this.$router.push({name: 'notice-list'})
            }
        },
        getInfo () {
            this.correlationName = []
            this.operatorName = []
            this.$get('api/task/detail', {
                taskId: this.id
            }).then((res) => {
                if (!res.data.data) {
                    this.$vux.alert.show({
                        title: '提示',
                        content: res.data.msg || '操作失败'
                    })
                    history.go(-1)
                }
                this.taskInfo = res.data.data.res
                this.taskStatus = this.taskInfo.taskStatus
                this.pause = this.taskInfo.pause
                this.inChargeName = this.taskInfo.personLiable.userName
                if (!this.$route.query.role && this.$route.query.role !== 0) {
                    this.role = this.taskInfo.role[0]
                }
                this.content = this.taskInfo.task_content[0].taskContent
                if (this.taskInfo.correlation.length > 0) {
                    for (let i = 0; i < this.taskInfo.correlation.length; i++) {
                        this.correlationName.push(this.taskInfo.correlation[i].userName)
                    }
                }
                if (this.taskInfo.implement.length > 0) {
                    for (let i = 0; i < this.taskInfo.implement.length; i++) {
                        this.operatorName.push(this.taskInfo.implement[i].userName)
                    }
                }
                if (this.taskInfo.task_content[0].taskEnclosure) {
                    this.fileList = this.taskInfo.task_content[0].taskEnclosure
                }
                if (this.taskInfo.task_content[2]) {
                    this.extraMore = true
                }
                if (this.taskInfo.task_content[1]) {
                    this.extraContent = this.taskInfo.task_content[1].taskContent
                    if (this.taskInfo.task_content[1].taskEnclosure) {
                        this.extraFile = this.taskInfo.task_content[1].taskEnclosure
                    }
                }
            })
        },
        getLog () {
            this.$get('api/task/tasklog', {
                taskId: this.id,
                page_index: 1,
                page_size: 3
            }).then((res) => {
                this.taskLog = res.data.data.list
                if (res.data.data.rowcount > 3) {
                    this.logMore = true
                }
            })
        },
        openCo () {
            if (this.correlationName.length <= 3) {
                return
            }
            this.showCo = true
        },
        openOp () {
            if (this.operatorName.length <= 3) {
                return
            }
            this.showOp = true
        },
        toAddition () {
            this.$router.push({name: 'addition-list', query: {taskId: this.id}})
        },
        toLog () {
            this.$router.push({name: 'log-list', query: {taskId: this.id}})
        },
        // 任务通过
        taskComplete () {
            const self = this
            this.$vux.confirm.show({
                title: '提示',
                content: '确认要通过验收吗？',
                onCancel () {},
                onConfirm () {
                    self.$post('api/task/checkpass', {
                        taskId: parseInt(self.id)
                    }).then((res) => {
                        if (res.data.data.res === 1) {
                            self.$vux.alert.show({
                                title: '提示',
                                content: '操作成功'
                            })
                            self.getInfo()
                            self.getLog()
                        } else if (res.data.data.res === -1) {
                            self.$vux.alert.show({
                                title: '提示',
                                content: '没有操作权限'
                            })
                        } else {
                            self.$vux.alert.show({
                                title: '提示',
                                content: res.data.msg || '操作失败'
                            })
                        }
                    })
                }
            })
        },
        // 任务暂停、恢复
        taskTimeout () {
            const self = this
            this.$vux.confirm.show({
                title: '提示',
                content: '确认要暂停任务吗？',
                onCancel () {},
                onConfirm () {
                    self.$post('api/task/setpause', {
                        taskId: parseInt(self.id),
                        isSuspend: 1
                    }).then((res) => {
                        if (res.data.data.res === 1) {
                            self.$vux.alert.show({
                                title: '提示',
                                content: '操作成功'
                            })
                            self.getInfo()
                            self.getLog()
                        } else {
                            self.$vux.alert.show({
                                title: '提示',
                                content: res.data.msg || '操作失败'
                            })
                        }
                    })
                }
            })
        },
        taskRecovery () {
            const self = this
            this.$vux.confirm.show({
                title: '提示',
                content: '确认要恢复任务吗？',
                onCancel () {},
                onConfirm () {
                    self.$post('api/task/setpause', {
                        taskId: parseInt(self.id),
                        isSuspend: 0
                    }).then((res) => {
                        if (res.data.data.res === 1) {
                            self.$vux.alert.show({
                                title: '提示',
                                content: '操作成功'
                            })
                            self.getInfo()
                            self.getLog()
                        } else {
                            self.$vux.alert.show({
                                title: '提示',
                                content: res.data.msg || '操作失败'
                            })
                        }
                    })
                }
            })
        },
        // 废弃任务
        taskAbandon () {
            const self = this
            this.$vux.confirm.show({
                title: '提示',
                content: '确认要废弃任务吗？',
                onCancel () {},
                onConfirm () {
                    self.$post('api/task/giveup', {
                        taskId: parseInt(self.id)
                    }).then((res) => {
                        if (res.data.data.res === 1) {
                            self.$vux.alert.show({
                                title: '提示',
                                content: '操作成功'
                            })
                            self.getInfo()
                            self.getLog()
                        } else {
                            self.$vux.alert.show({
                                title: '提示',
                                content: res.data.msg || '操作失败'
                            })
                        }
                    })
                }
            })
        },
        // 提交验收
        taskCommit () {
            const self = this
            this.$vux.confirm.show({
                title: '提示',
                content: '确认要提交验收吗？',
                onCancel () {},
                onConfirm () {
                    self.$post('api/task/commit', {
                        taskId: parseInt(self.id)
                    }).then((res) => {
                        if (res.data.data.res === 1) {
                            self.$vux.alert.show({
                                title: '提示',
                                content: '操作成功'
                            })
                            self.getInfo()
                            self.getLog()
                        } else if (res.data.data.res === -1) {
                            self.$vux.alert.show({
                                title: '提示',
                                content: '没有操作权限'
                            })
                        } else {
                            self.$vux.alert.show({
                                title: '提示',
                                content: res.data.msg || '操作失败'
                            })
                        }
                    })
                }
            })
        },
        // 接受任务
        acceptTask () {
            this.$router.push({name: 'accept-task', query: {taskId: this.id}})
        },
        // 变更负责人
        changeLeader () {
            this.$router.push({name: 'change-leader', query: {taskId: this.id}})
        },
        // 负责人编辑
        responseEdit () {
            this.$router.push({name: 'response-edit', query: {taskId: this.id}})
        },
        // 发布人编辑
        releaseEdit () {
            this.$router.push({name: 'release-edit', query: {taskId: this.id}})
        },
        // 删除任务
        deleteTask () {
            const self = this
            this.$vux.confirm.show({
                title: '提示',
                content: '确认要删除任务吗？',
                onCancel () {},
                onConfirm () {
                    self.$post('api/task/delete', {
                        taskId: parseInt(self.id)
                    }).then((res) => {
                        if (res.data.data.res === 1) {
                            self.$vux.alert.show({
                                title: '提示',
                                content: '操作成功'
                            })
                            self.$router.push({name: 'my-task'})
                        } else {
                            self.$vux.alert.show({
                                title: '提示',
                                content: res.data.msg || '操作失败'
                            })
                        }
                    })
                }
            })
        },
        // 任务重启
        taskRestart () {
            this.restartModal = true
        },
        restartNow () {
            this.$get('api/task/restart', {
                id: parseInt(this.id)
            }).then((res) => {
                if (res.data.data.res === 1) {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '操作成功'
                    })
                    this.getInfo()
                    this.getLog()
                } else {
                    this.$vux.alert.show({
                        title: '提示',
                        content: res.data.msg || '操作失败'
                    })
                }
            })
        },
        restartModify () {
            this.$router.push({name: 'task-restart', query: {taskId: this.id}})
        },
        // 评论
        toComment () {
            this.commentModal = true
            this.taskComment = ''
        },
        cancelComment () {
            this.commentModal = false
        },
        saveComment () {
            if (this.taskComment === '') {
                this.$vux.alert.show({
                    title: '提示',
                    content: '评论内容不能为空！'
                })
            } else {
                this.$post('api/task/discussadd', {
                    taskId: parseInt(this.id),
                    content: this.taskComment
                }).then((res) => {
                    if (res.data.data.res === 1) {
                        this.$vux.alert.show({
                            title: '提示',
                            content: '操作成功'
                        })
                        this.getLog()
                        this.commentModal = false
                    } else {
                        this.$vux.alert.show({
                            title: '提示',
                            content: res.data.msg || '操作失败'
                        })
                    }
                })
            }
        },
        // 追加需求
        addRequest () {
            this.$router.push({name: 'add-request', query: {taskId: this.id}})
        }
    },
    mounted () {
        this.init()
    }
}
</script>
<style scoped>
    .remark_text{ background-color: #f8f8f8; padding: 15px; margin: 0 0 10px 15px; word-wrap: break-word; color: #666;}
    .more_log{ display: inline-block; float: right; font-size: 14px; margin-right: 15px; color: #0094eb;}
    .more_info{ height: 20px; line-height: 20px; padding: 10px; text-align: center; color: #999; border-top: 1px solid #e1e1e1; font-size: 12px;}
    .log_container{ padding: 0 20px 0 65px;}
    .record_model{ font-size: 13px; border-bottom: 1px solid #e1e1e1; padding: 10px 0;}
    .record_model span{ display: inline-block; margin-left: 20px; color: #999; font-size: 12px!important;}
    .record_model img{ position: absolute; top: 0; left: -50px; width: 30px; height: 30px;}
</style>
