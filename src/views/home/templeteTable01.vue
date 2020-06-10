 <template>
    <div class="tableX">
        <x-header :left-options="{showBack:true,backText:''}" class="header_box header_fix">
            <span class="header_title">表格页模版01</span>
            <span slot="right" @click="toAddQun(0)"> <font color="#F7F7F7">添加推广群</font> </span>
        </x-header>
        <div style="height:50px;"></div>
        <group class="inlineBox">
            <x-input title="" class="weui-vcode inlineBoxInput" v-model="search.id" placeholder="请输入会员ID">
                <x-button slot="right" type="primary" mini >添加为管理员</x-button>
            </x-input>
        </group>
        <scroller ref="scroll" height="-100" lock-x :scroll-bottom-offst="200" @on-scroll-bottom="scrollPage()">
            <div>
                <x-table :cell-bordered="false" :content-bordered="true">
                    <tbody>
                        <tr v-for="(row,index) in vuxTableList" :key="page.pageIndex+'-'+index">
                            <td class="td1">
                                &nbsp;
                                <img :src="row.header" alt="" />
                            </td>
                            <td class="td2">
                                {{row.nickname}} &nbsp; ( ID: {{row.id}} )
                                <br />
                                <span class="role">& &nbsp; {{['-','超管','管理员','会员'][row.role]}}</span>
                            </td>
                            <td class="td3">
                                <span style="color: #2196F3;" @click="delPower(row.id)">删除管理身份</span>
                                &nbsp;&nbsp;
                            </td>
                        </tr>
                    </tbody>
                </x-table>
                <div class="noData" v-show="!vuxTableList.length">
                    暂无数据
                </div>
                <load-more v-show="vuxTableLoading" tip="加载中...">
                </load-more>
                <divider class="noMore" v-show="vuxTableNoMore && vuxTableList.length>0">
                    没有更多数据
                </divider>
            </div>
        </scroller>
    </div>
</template>
<script>
// 经验之谈 scroller 里面每个tr的高度必须提前指定清晰 否则内容高度的变化会导致滚动混乱
import '@/plugins/vux-table'
import {extend, extendF} from '@/utils'

export default {
    data () {
        return {
            search: { // [[模版结构不要修改]]
                id: ''
            },
            page: {
                pageIndex: 1, // 分页 [[模版结构不要修改]]
                pageSize: 10 // 条数 [[模版结构不要修改]]
            },
            order: {
                orderKey: 'id', // 排序属性 [[模版结构不要修改]]
                orderRule: true // 排序规则 true降序false升序 [[模版结构不要修改]]
            },
            vuxTableParams: {}, // 请求参数 [[模版结构不要修改]]
            vuxTableList: [], // 表格内容 [[模版结构不要修改]]
            vuxTableCount: 0, // 表格条数 [[模版结构不要修改]]
            vuxTableLoading: false, // 加载中 [[模版结构不要修改]]
            vuxTableNoMore: false // 没有更多 [[模版结构不要修改]]
        }
    },
    methods: {
        initTable () { // 复原 [[模版结构不要修改]]
            this.page.pageIndex = 1
            this.vuxTableList = []
            this.vuxTableCount = 0
            this.handleSearch()
        },
        ajaxList () { // 读取信息 [[模版结构不要修改]]
            if (this.vuxTableNoMore) {return false}
            if (this.vuxTableLoading) {return false}
            this.vuxTableLoading = true
            extendF(this.search, this.vuxTableParams) // 反继承搜索项
            this.$api.role
                .list(this.vuxTableParams)
                .then(data => {
                    this.vuxTableList = [...this.vuxTableList, ...data.list]
                    this.vuxTableCount = data.rowcount
                    this.vuxTableLoading = false
                    this.vuxTableNoMore = this.page.pageIndex * this.page.pageSize >= parseInt(data.rowcount) // 计算是否还有更多
                    if (this.vuxTableParams.pageIndex > 1) {
                        this.$nextTick(() => { // 用以重新渲染，避免新加的内容无法上拉看到
                            this.$refs.scroll.reset()
                        })
                    }
                })
                .catch(e => {
                    this.vuxTableLoading = false
                })
        },
        handlePage (page) { // 换页 [[模版结构不要修改]]
            this.page.pageIndex = page || 1
            extend(this.vuxTableParams, this.page) // 继承搜索项
            this.ajaxList()
        },
        scrollPage () { // 换页 [[模版结构不要修改]]
            if (this.vuxTableNoMore) {return false}
            if (this.vuxTableLoading) {return false}
            this.handlePage(this.page.pageIndex + 1)
        },
        handleSearch () { // 搜索 [[模版结构不要修改]]
            extend(this.vuxTableParams, this.search) // 继承搜索项
            this.handlePage(1)
        },
        handleOrder (key) { // 排序 [[模版结构不要修改]]
            if (this.order.orderKey === key) {
                this.order.orderRule = !this.order.orderRule
            } else {
                this.order.orderKey = key
                this.order.orderRule = true
            }
            extend(this.vuxTableParams, this.order) // 继承搜索项
            this.handlePage(1)
        },
        // 添加
        addPower () {
            const id = '' + this.search.id
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
<style lang="less" scoped>
    .tableX {
        .noData {color: #9a9a9a;margin: 20px;text-align: center;}
        .noMore {margin: 30px 0 30px 0;}
    }
    .vux-table {
        .td1 {width:60px; text-align: left;}
        .td1 img {width:40px; height:43px; border-radius: 50%; vertical-align: bottom;margin:10px 0;}
        .td2 {text-align: left;font-size: 14px;line-height: 20px;}
        .td2 .role{font-size: 12px;color:#aaa;}
        .td3 {width:100px;text-align:right;font-size: 14px;}
    }
</style>
<style>
    .inlineBox {}
    .inlineBox .weui-cells { background: #f2f2f2; margin-top: 0; }
    .inlineBox .weui-input { border: 1px solid #dcdee2; background: #fff; width: 90%; height: 28px; padding: 0 0 0 10px; font-size: 14px; }
    .vux-table.vux-table-no-content-bordered tr:last-child td:before { border-bottom-width: 0; }
</style>
