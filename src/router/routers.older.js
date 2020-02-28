// 项目::路由页面
// 2019年12月31日15:15:49 更新

import { makeTwoLevelRoute } from './util'

export default makeTwoLevelRoute({
    path: 'order', title: '工单管理', icon: 'md-globe',
    children: [
        {power: 'order1', path: 'send-list', icon: 'md-bonfire', title: '我的工单-已发工单'},
        {power: 'order1', path: 'receive-list', icon: 'md-bonfire', title: '我的工单-已收工单'},
        {power: 'order1', path: 'drafts-list', icon: 'md-bonfire', title: '我的工单-草稿箱'},
        {power: 'order1', path: 'end-list', icon: 'md-bonfire', title: '我的工单-已删除'},
        {power: 'order1', path: 'unEndSub-list', icon: 'md-bonfire', title: '下属工单-未完结列表'},
        {power: 'order1', path: 'endSub-list', icon: 'md-bonfire', title: '下属工单-已完结列表'},
        {power: 'order1', path: 'order-info', icon: 'md-bonfire', title: '工单详情'},
        {power: 'order1', path: 'order-release', icon: 'md-bonfire', title: '工单发布'},
        {power: 'order1', path: 'order-reply', icon: 'md-bonfire', title: '工单回复'},
        {power: 'order1', path: 'group-list', icon: 'md-bonfire', title: '组列表'},
        {power: 'order1', path: 'group-edit', icon: 'md-bonfire', title: '组添加/编辑'}
    ]
})
