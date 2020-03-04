// 项目::路由页面
// 2019年12月31日15:15:49 更新

import { makeTwoLevelRoute } from './util'
import homePage from '@/views/home/index.vue'

export default makeTwoLevelRoute({
    path: 'home', title: '工单管理', icon: 'md-globe',
    children: [
        {path: 'index', name: 'home-index', component: homePage},
    ]
})
