import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        unReadNum: ''
    },
    mutations: {
        setUnReadNum (state, num) {
            state.unReadNum = num
        }
    },
    plugins: [createPersistedState({
        storage: window.sessionStorage
    })]
})

export default store
