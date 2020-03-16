// 项目::路由页面
// 2019年12月31日15:15:49 更新

import { makeTwoLevelRoute } from './util'
import Exp from '@/views/Exp.vue'

export default makeTwoLevelRoute({
    path: 'exp', title: 'exp', icon: 'md-globe', component: Exp,
    children: [
        {path: 'exp01', title: '尝试视频组件'},
        {path: 'exp01auto', title: '尝试视频自动播放'},
        {path: 'exp01heng', title: '尝试视频横屏'},
        {path: 'exp02', title: '尝试视频插件'},
        {path: 'exp03', title: '表格的优美写法'},
        {path: 'exp03', title: '表单的优美写法'}
    ]
})
