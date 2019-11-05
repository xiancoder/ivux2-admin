import Main from '@V/main.vue'
import homePage from '@V/home/index.vue'

export const makeRoute = (config) => {
    if (config.componentUrl) {
        config.component = () => import('@V/' + config.componentUrl)
    }
    config.meta = {
        keepAlive: config.keepAlive || false,
        title: config.title || config.name,
        file: config.componentUrl
    }
    if (config.children && config.children.length) {
        config.children.forEach((v, i, a) => {
            makeRoute(v)
        })
    }
    return config
}
export const routers = [
    makeRoute({ path: '/login', name: 'login', title: 'Login-登录', componentUrl: 'login.vue' }),
    makeRoute({ path: '/download', name: 'download', title: 'Apk-下载', componentUrl: '/home/download.vue' }),
    makeRoute({
        path: '/', name: 'main', redirect: '/login', title: 'Oa-Wap', component: Main,
        children: [
            {path: 'home', name: 'home_index', title: 'Oa-Wap', component: homePage},
            {path: 'feedback-list', name: 'feedback-list', title: '反馈意见列表', componentUrl: '/home/feedback-list.vue'},
            {path: 'invoice', name: 'invoice', title: '发票统计', componentUrl: '/home/invoice.vue'},
            {path: 'charts', name: 'charts', title: '统计报表', componentUrl: '/home/charts.vue'},
            {path: 'public/list', name: 'public-list', title: '公海列表', componentUrl: '/public/public-list.vue'},
            {path: 'public/info', name: 'public-info', title: '公海客户信息', componentUrl: '/public/public-info.vue'},
            {path: 'test', name: 'test', title: '测试', componentUrl: '/my/test.vue'},
            {path: 'notice/list', name: 'notice-list', title: '通知列表', componentUrl: '/notice/notice-list.vue'},
            {path: 'my', name: 'my', title: '我的', componentUrl: '/my/my.vue'},
            {path: 'my/photo', name: 'my-photo', title: '头像', componentUrl: '/my/my-photo.vue'},
            {path: 'my/photo-edit', name: 'photo-edit', title: '修改图片', componentUrl: '/my/photo-edit.vue'},
            {path: 'my/info', name: 'my-info', title: '我的信息', componentUrl: '/my/my-info.vue'},
            {path: 'my/telphone', name: 'modify-telphone', title: '修改电话', componentUrl: '/my/modify-telphone.vue'},
            {path: 'my/password', name: 'modify-password', title: '修改密码', componentUrl: '/my/modify-password.vue'},
            {path: 'my/sign', name: 'my-sign', title: '签名维护', componentUrl: '/my/my-sign.vue'},
            {path: 'my/sign/password', name: 'sign-password', title: '修改密码', componentUrl: '/my/sign-password.vue'},
            {path: 'my/sign/setpass', name: 'sign-setpass', title: '设置密码', componentUrl: '/my/sign-setpass.vue'},
            {path: 'my/sign/setting', name: 'sign-setting', title: '修改签名', componentUrl: '/my/sign-setting.vue'},
            {path: 'my/proposal', name: 'my-proposal', title: '吐槽与建议', componentUrl: '/my/my-proposal.vue'},
            {path: 'my/picture', name: 'modify-picture', title: '修改照片', componentUrl: '/my/modify-picture.vue'},
            {path: 'follow/home', name: 'home-follow', title: '跟进记录', componentUrl: '/follow/home-follow.vue'},
            {path: 'follow/list', name: 'follow-list', title: '客户跟进列表', componentUrl: '/follow/follow-list.vue'},
            {path: 'follow/detail', name: 'follow-detail', title: '跟进详情', componentUrl: '/follow/follow-detail.vue'},
            {path: 'follow/contact', name: 'contact-follow', title: '联系人跟进列表', componentUrl: '/follow/contact-follow.vue'},
            {path: 'under/list', name: 'under-list', title: '下属列表', componentUrl: '/private/under-list.vue'},
            {path: 'private/info', name: 'private-info', title: '私海客户信息', componentUrl: '/private/private-info.vue'},
            {path: 'private/list', name: 'private-list', title: '私海列表', componentUrl: '/private/private-list.vue'},
            {path: 'private/addCustomer', name: 'add-customer', title: '新增客户', componentUrl: '/private/add-customer.vue'},
            {path: 'private/addRelation', name: 'private-addRelation', title: '添加关联客户', componentUrl: '/private/add-relation.vue'},
            {path: 'private/people', name: 'private-people', title: '联合跟进人', componentUrl: '/private/add-people.vue'},
            {path: 'private/contact', name: 'private-contact', title: '私海联系人列表', componentUrl: '/private/private-contact.vue'},
            {path: 'private/addContact', name: 'add-contact', title: '添加联系人', componentUrl: '/private/add-contact.vue'},
            {path: 'private/addFollow', name: 'add-follow', title: '写跟进', componentUrl: '/private/add-follow.vue'},
            {path: 'company/info', name: 'company-info', title: '客户信息', componentUrl: '/company/company-info.vue'},
            {path: 'company/relation', name: 'relation-company', title: '关联客户', componentUrl: '/company/relation-company.vue'},
            {path: 'contact/contactList', name: 'contact-list', title: '联系人列表', componentUrl: '/contact/contact-list.vue'},
            {path: 'contact/contactInfo', name: 'contact-info', title: '联系人详情', componentUrl: '/contact/contact-info.vue'},
            // {path: 'task/my', name: 'my-task', title: '我发布的', componentUrl: '/task/my-task.vue'},
            // {path: 'task/response', name: 'my-response', title: '我负责的', componentUrl: '/task/my-response.vue'},
            // {path: 'task/operate', name: 'my-operate', title: '我执行的', componentUrl: '/task/my-operate.vue'},
            // {path: 'task/cc', name: 'my-cc', title: '抄送我的', componentUrl: '/task/my-cc.vue'},
            // {path: 'task/all', name: 'task-all', title: '下属任务', componentUrl: '/task/task-all.vue'},
            // {path: 'task/release', name: 'task-release', title: '发布任务', componentUrl: '/task/task-release.vue'},
            // {path: 'task/info', name: 'task-info', title: '任务详情', componentUrl: '/task/task-info.vue'},
            // {path: 'task/addition', name: 'addition-list', title: '更多追加需求', componentUrl: '/task/addition-list.vue'},
            // {path: 'task/log', name: 'log-list', title: '轨迹列表', componentUrl: '/task/log-list.vue'},
            // {path: 'task/accept', name: 'accept-task', title: '接受任务', componentUrl: '/task/accept-task.vue'},
            // {path: 'task/change', name: 'change-leader', title: '变更负责人', componentUrl: '/task/change-leader.vue'},
            // {path: 'task/response/edit', name: 'response-edit', title: '负责人编辑', componentUrl: '/task/response-edit.vue'},
            // {path: 'task/release/edit', name: 'release-edit', title: '发布人编辑', componentUrl: '/task/release-edit.vue'},
            // {path: 'task/restart', name: 'task-restart', title: '发布人重启', componentUrl: '/task/task-restart.vue'},
            // {path: 'task/add', name: 'add-request', title: '追加需求', componentUrl: '/task/add-request.vue'},
            {path: 'tel/list', name: 'tel-book', meta: {keepAlive: true}, title: '通讯录', componentUrl: '/tel/tel-book.vue'},
            {path: 'tel/staff-info', name: 'staff-info', title: '通讯录--个人信息详情', componentUrl: '/tel/staff-info.vue'},
            // {path: 'process/process-personnel', name: 'process-personnel', title: '流程中心-人事流程-列表', componentUrl: '/process/process-personnel.vue'},
            {path: 'process/process-my', name: 'process-my', title: '流程中心-我申请的', componentUrl: '/process/process-my.vue'},
            {path: 'process/process-notexamine', name: 'process-notexamine', title: '流程中心-待我审批的', componentUrl: '/process/process-notexamine.vue'},
            {path: 'process/process-examined', name: 'process-examined', title: '流程中心-我已审批的', componentUrl: '/process/process-examined.vue'},
            {path: 'process/process-send', name: 'process-send', title: '流程中心-抄送我的', componentUrl: '/process/process-send.vue'},
            {path: 'process/unused-holidays', name: 'unused-holidays', title: '流程中心-剩余假期', componentUrl: '/process/unused-holidays.vue'},
            {path: 'process/vacation-apply', name: 'vacation-apply', title: '流程中心-请假申请', componentUrl: '/process/vacation-apply.vue'},
            {path: 'process/vacation-info', name: 'vacation-info', title: '', componentUrl: '/process/vacation-info.vue'},
            {path: 'process/breastfeed-apply', name: 'breastfeed-apply', title: '流程中心-哺乳假申请', componentUrl: '/process/breastfeed-apply.vue'},
            {path: 'process/breastfeed-info', name: 'breastfeed-info', title: '哺乳假详情', componentUrl: '/process/breastfeed-info.vue'},
            {path: 'process/overtime-apply', name: 'overtime-apply', title: '加班申请', componentUrl: '/process/overtime-apply.vue'},
            {path: 'process/overtime-info', name: 'overtime-info', title: '加班详情', componentUrl: '/process/overtime-info.vue'},
            {path: 'process/noCheck-apply', name: 'noCheck-apply', title: '未打卡申请', componentUrl: '/process/noCheck-apply.vue'},
            {path: 'process/noCheck-info', name: 'noCheck-info', title: '未打卡详情', componentUrl: '/process/noCheck-info.vue'},
            {path: 'process/outwork-apply', name: 'outwork-apply', title: '外出申请', componentUrl: '/process/outwork-apply.vue'},
            {path: 'process/outwork-info', name: 'outwork-info', title: '外出详情', componentUrl: '/process/outwork-info.vue'},
            {path: 'process/busTrip-apply', name: 'busTrip-apply', title: '出差申请', componentUrl: '/process/busTrip-apply.vue'},
            {path: 'process/busTrip-info', name: 'busTrip-info', title: '出差详情', componentUrl: '/process/busTrip-info.vue'},
            {path: 'business/list', name: 'business-list', title: '商务流程列表', componentUrl: '/business/business-list.vue'},
            {path: 'business/prepose', name: 'prepose-info', title: '合同前置详情', componentUrl: '/business/prepose-info.vue'},
            {path: 'business/advertisement', name: 'advertisement-info', title: '广告上线详情', componentUrl: '/business/advertisement-info.vue'},
            {path: 'business/change', name: 'change-info', title: '变更补充详情', componentUrl: '/business/change-info.vue'},
            {path: 'business/contract', name: 'contract-info', title: '商务合同详情', componentUrl: '/business/contract-info.vue'},
            {path: 'business/frame', name: 'frame-info', title: '框架协议详情', componentUrl: '/business/frame-info.vue'},
            {path: 'business/invoice', name: 'invoice-info', title: '发票申请详情', componentUrl: '/business/invoice-info.vue'},
            {path: 'business/maintain', name: 'maintain-info', title: '广告维护申请详情', componentUrl: '/business/maintain-info.vue'},
            {path: 'order/send-list', name: 'send-list', title: '已发工单--我的工单', componentUrl: '/order/send-list.vue'},
            {path: 'order/receive-list', name: 'receive-list', title: '已收工单--我的工单', componentUrl: '/order/receive-list.vue'},
            {path: 'order/drafts-list', name: 'drafts-list', title: '草稿箱--我的工单', componentUrl: '/order/drafts-list.vue'},
            {path: 'order/end-list', name: 'end-list', title: '已删除--我的工单', componentUrl: '/order/end-list.vue'},
            {path: 'order/unEndSub-list', name: 'unEndSub-list', title: '未完结列表--下属工单', componentUrl: '/order/unEndSub-list.vue'},
            {path: 'order/endSub-list', name: 'endSub-list', title: '已完结列表--下属工单', componentUrl: '/order/endSub-list.vue'},
            {path: 'order/order-info', name: 'order-info', title: '工单详情', componentUrl: '/order/order-info.vue'},
            {path: 'order/release', name: 'order-release', title: '工单发布', componentUrl: '/order/order-release.vue'},
            {path: 'order/reply', name: 'order-reply', title: '工单回复', componentUrl: '/order/order-reply.vue'},
            {path: 'order/group-list', name: 'group-list', title: '组列表', componentUrl: '/order/group-list.vue'}
            // {path: 'order/group-edit', name: 'group-edit', title: '组添加/编辑', componentUrl: '/order/group-edit.vue'},
        ]
    })
]
