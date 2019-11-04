
// 广播 不同浏览器标签 相同项目将得到广告提示
// 触发广播
export const resetSetItem = function (key, newVal) {
    if (key === 'watchStorage') {
        // 创建一个StorageEvent事件
        var newStorageEvent = document.createEvent('StorageEvent')
        const storage = {
            setItem: function (k, val) {
                sessionStorage.setItem(k, val)
                // 初始化创建的事件
                newStorageEvent.initStorageEvent('broadcast', false, false, k, null, val, null, null)
                // 派发对象
                window.dispatchEvent(newStorageEvent)
            }
        }
        return storage.setItem(key, newVal)
    }
}
// 接收广播 通常用来处理状态
window.addEventListener('broadcast', () => {
    // sessionStorage.getItem('watchStorage')
})
