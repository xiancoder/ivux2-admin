<template>
    <div>
        <x-header :left-options="{showBack:true,backText:''}" class="header_box">
            <span class="header_title">表格页模版01</span>
        </x-header>
        <div style="height:50px;"></div>
        <group class="inlineBox">
            <x-input title="" class="weui-vcode inlineBoxInput" v-model="frm.id" placeholder="请输入会员ID">
                <x-button slot="right" type="primary" mini >添加为管理员</x-button>
            </x-input>
        </group>
        <scroller class="pad15" ref="scroll" height="-100"
            lock-x :scroll-bottom-offst="200"
            @on-scroll-bottom="onScrollBottom()">
            <div>
                <div v-if="!obj.list.length" style="color: #9a9a9a;margin-top: 100px;text-align: center;">
                    <p> 暂无数据 </p>
                </div>
                <x-table :cell-bordered="false" :content-bordered="true">
                    <tbody>
                        <tr v-for="(row,index) in obj.list" :key="pageIndex+'-'+index">
                            <td style="width:70px; text-align: left;">
                                &nbsp;&nbsp;
                                <img :src="row.header" style="width:40px; border-radius: 50%; vertical-align: bottom;margin:10px 0;" alt="" />
                            </td>
                            <td style="text-align: left;font-size: 14px;">
                                &nbsp;&nbsp;
                                {{row.nickname}}
                                ( ID: {{row.id}} )
                                {{['-','超管','管理员','会员'][row.role]}}
                            </td>
                            <td style="width:100px;text-align:right;font-size: 14px;">
                                <span style="color: #2196F3;" @click="delPower(row.id)">删除管理身份</span>
                                &nbsp;&nbsp;
                            </td>
                        </tr>
                    </tbody>
                </x-table>
                <load-more v-show="loading" tip="loading"></load-more>
                <divider v-show="noMore && obj.list.length>0">没有更多数据</divider>
            </div>
        </scroller>
    </div>
</template>
<script>
import '@/plugins/vux-table'
import { throttle } from '@/utils/function'

export default {
    data () {
        return {
            obj: {
                list: [],
                rowcount: 0
            },
            frm: {
                id: ''
            },
            pageIndex: 1,
            pageSize: 15,
            loading: false,
            noMore: false
        }
    },
    methods: {
        ajaxList () {
            if (this.loading || this.noMore) { return false }
            this.loading = true
            this.$get('/api/super/roleList', {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            }).then(response => { // response 为完整结构
                const res = response.data // res 为我方接口结构
                const data = res.data
                this.obj.list = [...this.obj.list, ...data.list]
                this.obj.rowcount = data.rowcount
                this.loading = false
                this.pageIndex += 1
                if (this.pageIndex * this.pageSize >= this.obj.rowcount) {
                    this.noMore = true
                }
                if (this.pageIndex > 1) {
                    this.$nextTick(() => {
                        this.$refs.scroll.reset()
                    })
                }
            })
        },
        // 下拉刷新
        onScrollBottom: throttle(function () {
            this.ajaxList()
        }),
        // 复原
        initTable: function () {
            this.pageIndex = 1
            this.obj.list = []
            this.obj.rowcount = 0
            this.ajaxList()
        },
        // 添加
        addPower () {
            const id = '' + this.frm.id
            const that = this
            if (!/^[1-9][0-9]*?$/.test(id)) {
                that.$vux.alert.show({ content: '请输入合法ID' })
                return false
            }
            this.$vux.confirm.show({
                content: '<strong>确定要添加该管理员的权限吗？</strong>',
                onConfirm () {
                    that.$get('api/super/serRole', {id: id, role: 2}).then(response => { // response 为完整结构
                        const res = response.data // res 为我方接口结构
                        const data = res
                        if (data.res === 1) {
                            that.$vux.alert.show({ content: '添加成功' })
                            this.initTable()
                        } else {
                            that.$vux.alert.show({ content: res.data.msg || '添加失败' })
                        }
                    })
                }
            })
        },
        // 删除
        delPower (id) {
            const that = this
            this.$vux.confirm.show({
                content: '<strong>确定要删除该管理员的权限吗？</strong>',
                onConfirm () {
                    that.$get('api/super/serRole', {id: id, role: 3}).then(response => { // response 为完整结构
                        const res = response.data // res 为我方接口结构
                        const data = res
                        if (data.res === 1) {
                            that.$vux.alert.show({ content: '删除成功' })
                            this.initTable()
                        } else {
                            that.$vux.alert.show({ content: res.data.msg || '删除失败' })
                        }
                    })
                }
            })
        }
    },
    mounted () {
        this.initTable()
    }
}
</script>
<style>
    .inlineBox {}
    .inlineBox .weui-cells { background: #f2f2f2; margin-top: 0; }
    .inlineBox .weui-input { border: 1px solid #dcdee2; background: #fff; width: 90%; height: 28px; padding: 0 0 0 10px; font-size: 14px; }
    .vux-table.vux-table-no-content-bordered tr:last-child td:before { border-bottom-width: 0; }
</style>
