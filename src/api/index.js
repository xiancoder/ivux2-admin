import Vue from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'

import system from './api.system' // 系统
import role from './api.role' // 角色

Vue.prototype.$api = { // 挂载api
    system,
    role
}

// 取消请求
// let CancelToken = axios.CancelToken
// 设置默认请求头，如果不需要可以取消这一步
axios.defaults.headers = {
    'X-Requested-With': 'XMLHttpRequest'
}
// 请求超时的时间限制
axios.defaults.timeout = 20000
// 开始设置请求 发起的拦截处理
// config 代表发起请求的参数的实体
axios.interceptors.request.use(config => {
    return config
}, error => {
    return Promise.reject(error)
})
// 请求到结果的拦截处理
axios.interceptors.response.use(config => {
    // 返回请求正确的结果
    return config;
}, error => {
    // 错误的请求结果处理，这里的代码根据后台的状态码来决定错误的输出信息
    if (error && error.response) {
        switch (error.response.status) {
            case 400:
                error.message = '错误请求'
                break
            case 401:
                if (Cookies.get('type')) {
                    if (!Cookies.get('timeCheck')) {
                        Cookies.set('timeCheck', '1');
                        window.$App.gologin();
                    }
                    // window.webkit.messageHandlers.gologin.postMessage('123');
                } else {
                    Cookies.set('mark', '1');
                    location.reload();
                }
                break
            case 403:
                Vue.$vux.alert.show({
                    title: '提示',
                    content: '没有权限'
                });
                break
            case 404:
                error.message = '请求错误,未找到该资源'
                break
            case 405:
                error.message = '请求方法未允许'
                break
            case 408:
                error.message = '请求超时'
                break
            case 413:
                Vue.$vux.alert.show({
                    title: '提示',
                    content: '文件过大'
                });
                break
            case 500:
                Vue.$vux.alert.show({
                    title: '提示',
                    content: '服务器错误'
                });
                break
            case 501:
                error.message = '网络未实现'
                break
            case 502:
                error.message = '网络错误'
                break
            case 503:
                error.message = '服务不可用'
                break
            case 504:
                error.message = '网络超时'
                break
            case 505:
                error.message = 'http版本不支持该请求'
                break
            default:
                error.message = `连接错误${error.response.status}`;
        }
    } else {
        Vue.$vux.alert.show({
            title: '提示',
            content: '网络异常，请稍后再试'
        });
    }
    return Promise.reject(error.message);
})
// 将axios 的 post 方法，绑定到 vue 实例上面的 $post
Vue.prototype.$post = function (url, params, headers) {
    return new Promise((resolve, reject) => {
        axios.post(url, params, headers)
            .then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            });
    });
}
// 将axios 的 get 方法，绑定到 vue 实例上面的 $get
Vue.prototype.$get = function (url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res); // 返回请求成功的数据 data
        }).catch(err => {
            reject(err);
        });
    });
}

export default axios;
