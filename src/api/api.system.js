import axios from 'axios' // http请求库
import { error } from '@/tools' // 自定义常用工具

export default {
    login ({ // 登录 看名字也知道
        userName, // 可否直接复制来frm对象
        password
    }) {
        userName = userName.replace(/^ | $/g, '') // 移除空格
        password = password.replace(/^ | $/g, '')
        return new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                url: '/api/system/login',
                data: {
                    u: userName,
                    p: password
                }
            }).then(response => { // 请注意这个返回值是整个结果对象
                const res = response.data
                if (res && res.data && res.data.res) {
                    resolve(1)
                } else {
                    // error(res.msg) // 报错并继续reject
                    resolve(0)
                }
            }).catch(e => {
                error(e.message) // ajax异常后 报错并中止操作
            })
        })
    },
    submit ({file, content}) { // 提交文章 file文章路径
        return new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                url: '/api/blog/submit',
                data: {
                    file,
                    content
                }
            }).then(response => { // 请注意这个返回值是整个结果对象
                const res = response.data
                if (res && res.data && res.data.res) {
                    resolve()
                } else {
                    error(res.msg) // 报错并继续reject
                    reject()
                }
            }).catch(e => {
                error(e.message) // ajax异常后 报错并中止操作
            })
        })
    },
    read (file) { // 读取文章 file文章路径
        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                url: '/api/blog/read',
                data: {
                    file
                }
            }).then(response => { // 请注意这个返回值是整个结果对象
                const res = response.data
                if (res && res.data) {
                    resolve(res.data)
                } else {
                    error(res.msg) // 报错并继续reject
                    reject()
                }
            }).catch(e => {
                error(e.message) // ajax异常后 报错并中止操作
            })
        })
    },
    end () {} // 错误占位符
}
