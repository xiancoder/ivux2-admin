
import Vue from 'vue'

import {
    ToastPlugin, AlertPlugin, LoadingPlugin, ConfirmPlugin, DatetimePlugin,
    XHeader
} from 'vux'

Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)
Vue.use(DatetimePlugin)

Vue.component('x-header', XHeader)
