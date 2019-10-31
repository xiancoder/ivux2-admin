<template>
    <div>
        <div v-show="!bigImg">
            <x-header class="header_div" @on-click-back="goBack" :left-options="{backText: '', preventGoBack: true}"><span class="header_title">工单详情</span></x-header>
            <div style="height: 47px"></div>
            <div ref="contentDiv" style="overflow-y: auto;">
                <loading :show="showLoading" text=""></loading>
                <div v-show="!showLoading">
                    <div class="head">
                        <strong>{{response.workName}}</strong>
                        <span class="order_typeColor" :class="response.typeStyle">{{response.workTypeName}}</span>
                    </div>
                    <div class="partLine"></div>
                    <div class="personnel">
                        <div class="send">
                            <span>发件人</span>
                            <span>{{response.founderName}}</span>
                            <span>{{response.date}}</span>
                            <span class="tr" @click="showState">阅读状态</span>
                        </div>
                        <div class="receive" style="margin-bottom: 10px;">
                            <div>接收人</div>
                            <div>{{response.receiverName}}</div>
                        </div>
                        <div v-if="response.correlationName" class="receive">
                            <div class="tl" style="width: 20px;">抄</div>
                            <div class="tr" style="width: 20px;">送</div>
                            <div>{{response.correlationName}}</div>
                        </div>
                    </div>
                    <div class="remark_text tl borNone">
                        <div :style="{width: textWid + 'px'}" v-html="response.workContent" class="task_content overHidden"></div>
                    </div>
                    <div class="enclosure" v-if="response.workEnCopy.length>0">
                        <img src="../../img/uploadFile.png"/>
                        <div><a v-for="row in response.workEnCopy" :key="row.url" :href="row.url" download="">{{row.name}}</a></div>
                    </div>
                    <div class="pardDiv" v-if="replyData.length > 0 && response.workEnCopy.length>0"></div>
                    <div v-if="replyData.length > 0">
                        <div class="replyDiv" v-for="(row, index) in replyData" :key="row.id">
                            <div class="iconDiv">
                                <img src="../../img/icon-reply.png" alt="">回复
                            </div>
                            <div class="replyHead">
                                <span>{{row.name}}</span>
                                <span v-if="row.canBack && handleShow" @click="recall(index, row.id)">撤回</span>
                                <span>{{row.date}}</span>
                            </div>
                            <div v-if="row.isBack" class="recallDiv">该内容已撤回</div>
                            <div v-else class="replyContent">
                                <div v-html="row.workContent"></div>
                                <div v-if="row.workEnCopy.length > 0" style="line-height: 20px;">
                                    <img style="display: inline-block;" class="iconImg" src="../../img/uploadFile.png"/>
                                    <div style="display: inline-block;">
                                        <div style="margin-bottom: 2px;" v-for="row2 in row.workEnCopy" :key="row2.url">
                                            <img style="width: 100px;height: auto" v-if="row2.type === 'img'" :src="row2.url" alt="" @click="bigShow(row2.url)">
                                            <a style="color: #0094eb;font-size: 15px;" v-else :href="row2.url" download="">{{row2.name}}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="handleShow" style="height: 50px;"></div>
            <div v-if="handleShow" class="handleDiv">
                <div></div>
                <div @click="reply"><img src="../../img/reply.png" alt="">回复</div>
                <div @click="transmit"><img src="../../img/relay.png" alt="">转发</div>
                <div v-if="endShow" @click="ending"><img src="../../img/order-end.png" alt="">结单</div>
            </div>
            <popup v-model="stateShow" height="100%" class="readState"  @click.native="stateShow = false">
                <x-table :cell-bordered="false" :content-bordered="false" >
                    <tbody>
                        <tr :class="row.isRead ? 'blue' : ''" v-for="(row, index) in readData" :key="index">
                            <td>{{row.name}}</td>
                            <td >{{row.isRead ? '已读' : '未读'}}</td>
                            <td>{{row.isRead ? row.date : ''}}</td>
                        </tr>
                        <tr style="height: 15px;"></tr>
                    </tbody>
                </x-table>
            </popup>
        </div>
        <div class="imgDiv" v-show="bigImg" @click="back">
            <img ref="bigImgSize" :src="bigImgSrc" alt="">
        </div>
    </div>
</template>
<script>
import qs from 'qs'
import {XHeader, XTable, Loading, Popup, Scroller } from 'vux'
export default {
    components: {XHeader, XTable, Loading, Popup, Scroller},
    data () {
        return {
            response: {
                workStatus: 0,
                workEnCopy: []
            }, // 原工单
            replyData: [], // 回复
            readData: [],
            // onlyOne: 0,
            showLoading: true,
            textWid: null,
            textWid2: null,
            isEnd: false,
            order_list: [], // 缓存工单数据
            order_index: null, // 缓存数据下标
            suffixArr: ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'pcx', 'tiff'], // 图片类型
            bigImgSrc: null,
            bigImg: false, // 查看大图
            stateShow: false, // 查看通知
        }
    },
    computed :{
        handleShow: function () {
            return this.$route.query.handle * 1 === 1 && this.response.workStatus === 0
        },
        endShow: function () {
            return this.$route.query.ending * 1 === 1
        }
    },
    methods: {
        // 文件类型：img/file
        fileType (val) {
            const n = val.indexOf('.')
            const suffix = val.substring(n+1)
            const type = this.suffixArr.indexOf(suffix) === -1 ? 'file' : 'img'
            return type
        },
        init () {
            const phoneWid = sessionStorage.getItem('phoneWidth')
            this.textWid = phoneWid -30
            this.textWid2 = phoneWid -30
            this.$refs.contentDiv.style.height = sessionStorage.getItem('phoneHeight') - 96 +'px'
            this.$refs.bigImgSize.style.width = sessionStorage.getItem('phoneWidth') +'px'
            this.order_list = JSON.parse(sessionStorage.getItem('order_list'))
            this.order_index = sessionStorage.getItem('order_index')
            this.$get('api/order/order_info', {
                id: this.$route.query.id
            }).then((res) => {
                this.response = res.data.data.info
                this.replyData = res.data.data.reply
                switch (this.response.workType) {
                    case 1:
                        this.response.workTypeName = '工作'
                        this.response.typeStyle = 'order_color1'
                        break
                    case 2:
                        this.response.workTypeName = '周报日报'
                        this.response.typeStyle = 'order_color2'
                        break
                    case 3:
                        this.response.workTypeName = '通知公告'
                        this.response.typeStyle = 'order_color3'
                        break
                    case 4:
                        this.response.workTypeName = '温馨提示'
                        this.response.typeStyle = 'order_color4'
                        break
                    default:
                        this.response.workTypeName = ''
                        this.response.typeStyle = ''
                }
                let [receivers, correlations] = [[], []]
                for (let i = 0; i < this.response.receiver.length; i++) {
                    receivers.push(this.response.receiver[i].name)
                }
                for (let i = 0; i < this.response.correlation.length; i++) {
                    correlations.push(this.response.correlation[i].name)
                }
                this.response.receiverName = receivers.join('、')
                this.response.correlationName = correlations.join('、')
                const paths = this.response.workEnclosure
                this.response.workEnCopy = []
                if (paths.length>0) {
                    for (let i = 0; i < paths.length; i++) {
                        this.response.workEnCopy.push({url: paths[i], name: this.subUrl(paths[i])})
                    }
                }
                if (this.replyData.length > 0) {
                    for (let i = 0; i < this.replyData.length; i++) {
                        this.replyData[i].workEnCopy = []
                        if (this.replyData[i].workEnclosure) {
                            if (this.replyData[i].workEnclosure.length > 0) {
                                for (let j=0;j<this.replyData[i].workEnclosure.length;j++) {
                                    const someone = this.replyData[i].workEnclosure[j]
                                    const type = this.fileType(someone)
                                    this.replyData[i].workEnCopy.push({url: someone, name: this.subUrl(someone), type: type})
                                }
                            }
                        }
                    }
                }
                this.showLoading = false
                // 更新缓存数据最新回复人
                this.$nextTick(() => {
                    if (this.replyData.length > 0 && sessionStorage.getItem('order_list')) {
                        this.order_list[this.order_index].repleName = this.replyData[this.replyData.length-1].name
                        sessionStorage.setItem('order_list', JSON.stringify(this.order_list))
                    }
                })
            })
        },
        goBack () {
            if (this.$route.query.notice) {
                this.$router.go(-1)
            } else {
                this.$router.replace({name: 'notice-list'})
            }
        },
        subUrl (val) {
            const index = val.lastIndexOf('_') + 1
            return val.substring(index)
        },
        showState () {
            this.$get('api/order/read_list', {id: this.$route.query.id}).then( res => {
                this.readData = res.data.data.list
            })
            this.stateShow = true
            // this.$router.push({name: 'order-info', query: {notice: 1}})
        },
        recall (index, id) {
            this.$post('api/order/recall', qs.stringify({'id': id}), {headers: { 'content-type': 'application/x-www-form-urlencoded' }}).then( res => {
                if (res.data.data.res === 1) {
                    this.replyData[index].isBack = 1
                    this.replyData[index].canBack = 0
                } else {
                    this.$vux.alert.show({
                        title: '提示',
                        content: res.data.msg || '操作失败'
                    })
                }
            })
        },
        reply () {
            this.$router.push({name: 'order-reply', query: {id: this.$route.query.id, send: this.$route.query.send * 1}})
        },
        transmit () {
            this.$router.push({name: 'order-release', query: {id: this.$route.query.id}})
        },
        ending () {
            const self = this
            self.$vux.confirm.show({
                content: '确认要同意吗？',
                onCancel () {},
                onConfirm () {
                    self.$post('api/order/closure', qs.stringify({'id': self.$route.query.id}), {headers: { 'content-type': 'application/x-www-form-urlencoded' }}).then( res => {
                        if (res.data.data.res === 1) {
                            self.$vux.alert.show({
                                title: '提示',
                                content: '操作成功'
                            })
                            self.order_list.splice(self.order_index, 1)
                            sessionStorage.setItem('order_list', JSON.stringify(self.order_list))
                            self.$router.replace({name: 'send-list'})
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
        // 显示大图
        bigShow (src) {
            this.bigImgSrc = src
            this.bigImg = true
        },
        // 大图消失
        back () {
            this.bigImg = false
        }
    },
    mounted () {
        this.init()
    },
    beforeRouteLeave (to, from, next) {
        if (this.bigImg) {
            this.bigImg = false
            next(false)
        }else if (this.stateShow) {
            this.stateShow = false
            next(false)
        } else {
            next()
        }
    }
}
</script>
<style scoped lang='less'>
    .imgDiv{ position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: #fff; z-index: 999;display: flex; align-items: center;}
    .headerStyle{ width: 100%; background-color: #0094eb; position: fixed; z-index: 999;}
    .remark_text{ background-color: #f8f8f8; padding: 15px !important; word-wrap: break-word; color: #666;}
    .vux-table th:before{ border-bottom: none;}
    .readState{ background: #fff; padding: 15px; box-sizing: border-box;
        .vux-table:after{ border: none;}
        .vux-table tbody tr td:before{ border: none;}
        .vux-table tbody tr td{ line-height: 34px;}
    }
    .borNone:before{ border-bottom: none;}
    .overHidden{ overflow: hidden;}
    .head{display: flex; line-height: 18px; margin-bottom: 18px; box-sizing: border-box; padding: 18px 15px 0 15px;}
    span{ height: 18px;}
    strong{ flex: 1;}
    .partLine{ width: 100%; height: 1px; background: #e1e1e1;}
    .personnel{ box-sizing: border-box; padding: 15px; color: #9A9A9A; font-size: 13px;
        .send{display: flex; margin-bottom: 10px;
            :first-child{display: inline-block;}
            :nth-child(2) {display: inline-block; background: #5be9f9; padding: 0 6px; border-radius: 5px; color: #000; margin-left: 12px; font-size: 12px; line-height: 18px;}
            :nth-child(3) { width: 130px; text-align: right;}
            :last-child{ flex: 1; color: rgb(0, 148, 235);}
        }
        .receive{display: flex;
            :last-child{ flex: 1; margin-left: 12px;}
        }
    }
    .enclosure{ padding: 15px;
        img{ width: 20px; height: 20px; vertical-align: top;}
        div{display: inline-block;
            a{ color: #0094eb;display: block; margin-bottom: 4px; }
        }
    }
    .pardDiv{ height: 6px; background: #f5f5f5;;}
    .replyDiv{ padding: 15px 15px 0 15px;
        .iconDiv{ font-size: 14px; color: #9A9A9A; margin-bottom: 10px;
            img{ width: 14px; margin-right: 4px;}
        }
        .replyHead{display: flex; margin-bottom: 18px;
            :nth-child(2) { width: 70px; color: rgb(0, 148, 235); text-align: center;}
            :last-child{ flex: 1; text-align: right; color: #9A9A9A;}
        }
        .replyContent{ border-bottom: 1px solid #dedede; padding-bottom: 10px;
            :first-child{ white-space: pre-wrap; word-break: break-all; margin-bottom: 6px;}
            .iconImg{ width: 20px; height: 20px; vertical-align: top;}
        }
        .recallDiv{ height: 50px; line-height: 25px; color: #9A9A9A; text-align: center; border-bottom: 1px solid #dedede;}
    }
    .handleDiv{ width: 100%; height: 50px; line-height: 50px;display: flex; position: fixed; bottom: 0; background: #fff; border-top: 1px solid #dedede; text-align: right;
        div{ flex: 1; margin-right: 15px;}
        img{ width: 20px; margin-right: 5px; vertical-align: middle;}
    }
</style>
