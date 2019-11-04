
import VueHtml5Editor from 'vue-html5-editor'
// 引入并安装作为全局组件
// Vue.use(VueHtml5Editor,options);
// 同样你也可以作为局部组件使用，方便在不同的场景里使用不同的配置.
const options1 = {
    name: 'vue-html5-editor',
    showModuleName: false,
    icons: {
        text: 'fa fa-pencil',
        color: 'fa fa-paint-brush',
        font: 'fa fa-font',
        align: 'fa fa-align-justify',
        list: 'fa fa-list',
        tabulation: 'fa fa-table',
        image: 'fa fa-file-image-o',
        hr: 'fa fa-minus',
        eraser: 'fa fa-eraser'
    },
    // 配置图片模块
    // config image module
    image: {
        // 文件最大体积，单位字节  max file size
        sizeLimit: 10000 * 1024,
        upload: {
            url: null,
            headers: {},
            params: {},
            fieldName: {}
        },
        compress: { width: 1600, height: 1600,
            quality: 80
        },
        uploadHandler (responseText) {
            var json = JSON.parse(responseText)
            if (!json.ok) {
                alert(json.msg)
            } else {
                return json.data
            }
        }
    },
    // 语言，内建的有英文（en-us）和中文（zh-cn）
    // default en-us, en-us and zh-cn are built-in
    language: 'zh-cn',
    hiddenModules: [],
    visibleModules: [ 'text', 'color', 'font', 'align', 'tabulation', 'image', 'hr', 'eraser' ],
    modules: {
        // omit, reference to source code of build-in modules
    }
}

export const VueHtml5Editor1 = () => {
    return new VueHtml5Editor(options1)
}
