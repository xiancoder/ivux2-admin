import '../rem.js'
import Vue from 'vue'
import '@/plugins'
import '@/config'
import '@/api'
import store from '@/store'
import {router} from '@/router'
import 'vux/src/styles/reset.less'
import 'vux/src/styles/1px.less'
import '@/style/overflow.less'

// 问题是 vue 项目默认启动生产模式
Vue.config.productionTip = false

new Vue({
    store,
    router,
    // import App from '@/App.vue' // 页面主体
    // render: h => h(App), // 因为app没有有效内容 所以放弃app.vue文件
    render: h => h('router-view'),
    beforeCreate () {
        // 在实例初始化之后，数据观测 data observer
    },
    created: function () {
        // 在实例已经创建完成之后被调用。
    },
    beforeMount: function () {
        // 在挂载开始之前被调用。相关的render函数首次被调用。
    },
    mounted: function () {
        // 在el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用。
    },
    beforeUpdate: function () {
        // 在数据更新之前调用，发生在虚拟DOM重新渲染和打补丁之前。
    },
    updated: function () {
        // 在由于数据更改导致的虚拟DOM重新渲染和打补丁之后调用。
    },
    beforeDestroy: function () {
        // 在实例销毁之前调用。实例仍然完全可用
    },
    destroyed: function () {
        // 在实例销毁之后调用。
    }
}).$mount('#app-box')
