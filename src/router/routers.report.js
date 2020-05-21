// 项目::路由页面
// 2019年12月31日15:15:49 更新

import { makeTwoLevelRoute } from './util'

export default makeTwoLevelRoute({
    path: 'report', title: '报告管理', icon: 'md-globe',
    children: [
        {power: 'order1', path: 'myReport', icon: 'md-bonfire', title: '我的报告TAB'},
        {power: 'order1', path: 'myReport@receive', icon: 'md-bonfire', title: '我的报告-已收报告'}
    ]
})
