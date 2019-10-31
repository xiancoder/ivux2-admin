const vuxLoader = require('vux-loader')
const path = require('path')

const resolve = dir => {
    return path.join(__dirname, dir)
}

module.exports = {
    // 如果你不需要使用eslint，把lintOnSave设为false即可
    lintOnSave: true,
    // 运行时编译
    runtimeCompiler: true,
    // 方便别名
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
            .set('@C', resolve('src/components'))
            .set('@S', resolve('src/style'))
            .set('@V', resolve('src/views'))
    },
    // webpack 初始化配置
    configureWebpack: config => {
        vuxLoader.merge(config, {
            plugins: ['vux-ui']
        })
    },
    // 设为false打包时不生成.map文件
    productionSourceMap: false,
    // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理
    // 那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
    devServer: {
        hot: true,
        inline: true,
        historyApiFallback: true,
        stats: { colors: true },
        port: 4011, // 设置访问的端口号
        proxy: {
            // 匹配代理的url
            '/api': {
                target: 'http://172.30.30.205:10071/',
                pathRewrite: {'^/api': '/api'},
                changeOrigin: true
            },
            '/Login': {
                target: 'http://172.30.30.205:10071/',
                pathRewrite: {'^/Login': '/Login'},
                changeOrigin: true
            },
            '/fllowup': { // 用于图片和文件(跟进记录)
                target: 'http://172.30.30.205:10071/',
                pathRewrite: {'^/fllowup': '/fllowup'},
                changeOrigin: true
            },
            '/file': { // 用于文件下载(失败的导入文件)
                target: 'http://172.30.30.205:10071/',
                pathRewrite: {'^/file': '/file'},
                changeOrigin: true
            }
        }
    }
}
