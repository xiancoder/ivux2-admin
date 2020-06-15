import Vue from 'vue'

import {
    ToastPlugin, AlertPlugin, LoadingPlugin, ConfirmPlugin, DatetimePlugin,
    XHeader, XButton,
    Alert
} from 'vux'

Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)
Vue.use(DatetimePlugin)

Vue.component('x-header', XHeader)
Vue.component('x-button', XButton)
Vue.component('alert', Alert)
