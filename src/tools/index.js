import Vue from 'vue'

export const alert = (msg) => { // 弹框提示
    Vue.$vux.alert.show({title: '提示', content: msg || '处理中'})
}
export const success = (msg) => { // 成功提示
    Vue.$vux.alert.show({title: '成功', content: msg || '处理成功'})
}
export const error = (msg) => { // 错误提示
    Vue.$vux.alert.show({title: '失败', content: msg || '处理失败'})
}
