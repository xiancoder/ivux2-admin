// 项目::路由页面
// 2019年12月31日15:15:49 更新

import { makeTwoLevelRoute } from './util'
import homePage from '@V/home/index.vue'

export default makeTwoLevelRoute({
    path: 'home', title: '首页', icon: 'md-globe',
    children: [
        {path: 'index', title: '首页', component: homePage},
        {path: 'templeteTable', title: '列表页模版'},
        {path: 'templeteForm', title: '表单页模版'},
        {path: 'templeteUi01', title: '模版UI XHeader'},
        {path: 'templeteUi02', title: '模版UI Actionsheet'},
        {path: 'templeteUi03', title: '模版UI Alert'},
        {path: 'templeteUi04', title: '模版UI Confirm'},
        {path: 'templeteUi05', title: '模版UI Grid'}
    ]
})
