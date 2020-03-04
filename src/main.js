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
    // directive: { // 组件
    // },
    // di: { // 指令
    // },
    // filters: { // 过滤器
    // },
    // computed: { // 计算属性
    // },
    // watch: { // 监听
    // },
    beforeCreate () {
        // 在实例初始化之后，数据观测(data observer开始监控Data对象数据变化)
    },
    created: function () {
        // 在实例已经创建完成之后被调用。
        // 实例已完成以下的配置：数据观测(data observer)，属性和方法的运算，event事件回调。
        // 挂载阶段尚未开始，$el 属性不可见
    },
    beforeMount: function () {
        // 在挂载开始之前被调用。相关的render函数首次被调用。实例已完成以下的配置：编译模板，把data里面的数据和模板生成html。注意此时还没有挂载html到页面上
    },
    mounted: function () {
        // 在el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用。
        // 实例已完成以下的配置：用上面编译好的html内容替换el属性指向的DOM对象。
        // 此时模板中的html渲染到了html页面中，此时一般可以做一些Ajax操作。
        // 注意mounted只会执行一次
    },
    beforeUpdate: function () {
        // 在数据更新之前调用，发生在虚拟DOM重新渲染和打补丁之前。
        // 可以在该钩子中进一步地更改状态，不会触发附加的重渲染过程
    },
    updated: function () {
        // 在由于数据更改导致的虚拟DOM重新渲染和打补丁之后调用。
        // 调用时，组件DOM已经更新，所以可以执行依赖于DOM的操作。
        // 然而在大多数情况下，应该避免在此期间更改状态，因为这可能会导致更新无限循环。
        // 该钩子在服务器端渲染期间不被调用
    },
    beforeDestroy: function () {
        // 在实例销毁之前调用。实例仍然完全可用
    },
    destroyed: function () {
        // 在实例销毁之后调用。
        // 调用后，所有的事件监听器会被移除，所有的子实例也会被销毁。
        // 该钩子在服务器端渲染期间不被调用
    }
}).$mount('#app-box')
