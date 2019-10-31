<template>
    <div id="demo" class="tailor clear">
        <div class="add fl" @click="upData">
            <!-- 默认图片 -->
            <img class="imgDefault" v-show="!url" src="../../img/add_img.png" alt="">
            <!-- 上传展示的图片 -->
            <img class="img" v-show="url" :src="url" alt="">
        </div>
        <input ref="imgValue" id="upImg" class="imageInput" type="file" accept="image/*" @change="change">
    </div>
</template>
<script>
export default {
    // 图片点击上传，不需要裁剪图片
    name: 'up-imgNoCut',
    components: {
    },
    props: {
        imgProve: null // 图片证明路径
    },
    data () {
        return {
            picValue: '',
            croppable: false,
            url: ''
        }
    },
    methods: {
        // 清空input 上传图片的数据
        delImg () {
            this.$refs.imgValue.value = ''
        },
        // 绑定input 上传
        upData () {
            let fileElem = document.getElementById('upImg')
            return fileElem.click()
        },
        // change 事件
        change (e) {
            this.$vux.loading.show({
                text: 'Loading'
            })
            let files = e.target.files || e.dataTransfer.files
            if (!files.length) return
            this.picValue = files[0]
            // this.url = this.getObjectURL(this.picValue)
            let fd = new FormData()
            fd.append('file', files[0])
            let config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
            // 应该是，读接口拿到之后就直接用哪个返回的后缀，然后提交申请的时候，使用哪个img的后缀。
            this.$post('api/system/img_upload', fd, config).then(res => {
                if (res.data.data) {
                    this.$emit('change-img', res.data.data.fileurl)
                    this.url = res.data.data.fileurl
                } else {
                    this.$vux.alert.show({
                        title: '提示',
                        content: res.data.data
                    })
                }
                this.$vux.loading.hide()
            })
            // 拿到图片的路径之后删除input 的文件缓存
            this.$refs.imgValue.value = ''
        },
        // 获取完整图片 ( 拿到本地图片 )
        getObjectURL (file) {
            let url = null
            if (window.createObjectURL !=undefined) {
                // basic
                url = window.createObjectURL(file)
            } else if (window.URL !=undefined) {
                // mozilla(firefox)
                url = window.URL.createObjectURL(file)
            } else if (window.webkitURL !=undefined) {
                // webkit or chrome
                url = window.webkitURL.createObjectURL(file)
            }
            return url
        }
    },
    mounted () {
    },
    watch: {
        'imgProve': function (newVal) {
            if (!newVal) {
                // 如果类型切换到不需要传图片的类型了 就会清空图片上传的展示
                this.url = ''
            }
        }
    }
}
</script>
<style scoped>
    .add {display: inline-block; min-width: 50px; min-height: 50px; text-align: center; cursor: pointer; color: #999; position: relative; border-radius: 10px;}
    .imageInput {display: none;}
    .imgDefault{display: block; width: 50px; height: 50px;}
    .img {display: block; width: 150px; height: auto; border-radius: 10px; border: 1px dashed #c7c5c5;}
</style>
