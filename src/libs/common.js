// 设置工单sessionStorage
export const setOrder = function (val) {
    sessionStorage.setItem('order_keyword', val[0])
    sessionStorage.setItem('order_pageIndex', val[1])
    sessionStorage.setItem('order_list', val[2])
    sessionStorage.setItem('order_scroll', val[3]);
    sessionStorage.setItem('order_index', val[4]);
}
export const removeOrder = function () {
    sessionStorage.removeItem('order_keyword')
    sessionStorage.removeItem('order_pageIndex')
    sessionStorage.removeItem('order_list')
    sessionStorage.removeItem('order_scroll')
    sessionStorage.removeItem('order_index')
}
export const removetel = function () {
    sessionStorage.removeItem('tel_scroll')
    sessionStorage.removeItem('tel_keyword')
    sessionStorage.removeItem('tel_list')
}
// 匹配超链接, 转化为a标签
export const urlToLink = function (val) {
    const re = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g
    const str = val.replace(re, function (website) {
        return '<a style="color:#0094eb" href="' + website + '" target="_blank">' + website + '</a>'
    });
    return str
}
