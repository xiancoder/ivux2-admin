import Vue from 'vue'
import FastClick from 'fastclick'
import { ToastPlugin, AlertPlugin, LoadingPlugin, ConfirmPlugin, DatetimePlugin } from 'vux'
import 'font-awesome/css/font-awesome.min.css'
import './config/global.js'
import App from './App'
import store from './store'
import { router } from './router/index.js'

Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)
Vue.use(DatetimePlugin)
// require('font-awesome-webpack')
FastClick.attach(document.body)

Vue.config.productionTip = false

Vue.prototype.resetSetItem = function (key, newVal) {
    if (key === 'watchStorage') {
        // 创建一个StorageEvent事件
        var newStorageEvent = document.createEvent('StorageEvent')
        const storage = {
            setItem: function (k, val) {
                sessionStorage.setItem(k, val)
                // 初始化创建的事件
                newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null)
                // 派发对象
                window.dispatchEvent(newStorageEvent)
            }
        }
        return storage.setItem(key, newVal);
    }
}
/* eslint-disable no-new */
new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app-box')
