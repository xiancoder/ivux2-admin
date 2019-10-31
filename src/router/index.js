import Vue from 'vue'
import Util from '../libs/util';
import VueRouter from 'vue-router'
import Cookies from 'js-cookie';
import {routers} from './router';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    routes: routers,
};

export const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    Util.title(to.meta.title);
    if (Cookies.get('mark') && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
        Vue.$vux.loading.show({
            text: 'Loading'
        });
        next({
            name: 'login'
        });
        Cookies.remove('mark');
    } else if (sessionStorage.getItem('to_name')){
        // 特定条件下路由不跳转(解决历史回退问题)
        sessionStorage.removeItem('to_name');
        return;
    } else {
        Vue.$vux.loading.show({
            text: 'Loading'
        });
        Util.toDefaultPage([...routers], to.name, router, next);
    }
    // else if (Cookies.get('mark') && to.name === 'login') { // 判断是否已经登录且前往的是登录页
    //     Util.title();
    //     next({
    //         name: 'home_index'
    //     });
    // }

});
router.afterEach((to) => {
    Vue.$vux.loading.hide();
    // Util.openNewPage(router.app, to.name, to.params, to.query);
    window.scrollTo(0, 0);
});
