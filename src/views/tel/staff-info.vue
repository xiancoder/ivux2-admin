<template>
    <div>
        <x-header @on-click-back="toTelBook"  class="header_div" :left-options="{backText: '', preventGoBack: true}"><span class="header_title">员工详情</span></x-header>
        <div style="height: 47px"></div>
        <img class="img_top" src="../../img/information-top.png" alt="">
        <div class="content_div" v-show="!bigImg">
            <div class="applicant name_div">
                <div style="position: relative;">
                    <img class="circular_img" :src="info.userPhoto" v-if="info.userPhoto" />
                    <span class="applicant_portrait circular_name" v-else>{{info.userName | firstName}}</span>
                    <div class="information_name">
                        <span>{{info.userName}}</span><br/>
                        <span style="font-weight: normal;font-size: 14px;">{{info.postName}}</span>
                    </div>
                </div>
            </div>
            <div class="applicant_data">
                <table>
                    <tbody>
                        <tr>
                            <td>所在部门</td>
                            <td>{{info.department || '-'}}</td>
                        </tr>
                        <!-- <tr>
                            <td>所在职位</td>
                            <td>{{info.postName || '-'}}</td>
                        </tr> -->
                        <tr>
                            <td>邮箱</td>
                            <td>{{info.email || '-'}}</td>
                        </tr>
                        <tr>
                            <td>电话</td>
                            <td>{{info.tel || '-'}}</td>
                        </tr>
                        <tr>
                            <td>个人照片</td>
                            <td style="padding-top: 6px;" v-if="info.userPicture" @click="bigShow">
                                <div class="img_box" :style="{backgroundImage: 'url(' + picRandom(info.userPicture) + ')', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', transform: 'rotate(' + deg(info.userPicture) + ')'}"></div>
                            </td>
                            <td v-else>尚未上传照片</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="imgDiv" v-show="bigImg" @click="back">
            <div :style="{backgroundImage: 'url(' + picRandom(info.userPicture) + ')', backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', width: '100%', height: pWidth.toString(), transform: 'rotate(' + deg(info.userPicture) + ')'}"></div>
        </div>
    </div>
</template>
<script>
// 引入组件
import { XHeader, XButton} from 'vux'
export default {
    name: 'staff-info',
    components: { // 组件声明
        XHeader,
        XButton
    },
    data () { // 参数声明
        return {
            info: {
                userName: '',
                userPhoto: null,
                department: null, // 部门列表 字符串，以逗号隔开。
                postName: null, // 所在职位 字符串，以逗号隔开。
                email: null,
                qq: null,
                tel: null,
                userPicture: null
            },
            pWidth: sessionStorage.getItem('phoneWidth') + 'px',
            bigImg: false, // 查看大图
        }
    },
    methods: {
        init () { // 初始化 列表
            this.$get('api/my/base_info', {id: this.$route.query.userId}).then(res => {
                this.info = res.data.data.result
                this.info.postName = this.info.postName.join('，')
                const deparArr = []
                for (let i = 0; i < this.info.department.length; i++) {
                    deparArr.push(this.info.department[i].name)
                }
                this.info.department = deparArr.join('，')
                this.info.userPicture=this.info.userPicture ? this.info.userPicture+' ? t='+Math.ceil(Math.random() * 10000) : null
            })
        },
        toTelBook () {
            this.$router.replace({name: 'tel-book'})
        },
        bigShow (val) {
            this.bigImg = true
        },
        back () {
            this.bigImg = false
        },
        picRandom (url) {
            return url  + ' ? t=' + Math.ceil(Math.random() * 10000)
        },
        deg (url) {
            if (!url) {
                return '0' + 'deg'
            } else {
                let index = url.lastIndexOf('_')
                let index2 = url.lastIndexOf('.')
                let angle = url.substring(index + 1, index2)
                if (angle === 'picture') {
                    return '0' + 'deg'
                } else {
                    return angle + 'deg'
                }
            }
        }
    },
    mounted () {
        this.init()
    },
    filters: {
        firstName: function (value) { // 截取字符串的第一个
            return value.substr(0, 1)
        }
    },
    beforeRouteLeave (to, from, next) {
        if (this.bigImg) {
            // 手机回退键将图片隐藏
            this.bigImg = false
            next(false)
        } else {
            next()
        }
    }
}
</script>
<style lang="less" scoped>
    .imgDiv{ position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: #fff; z-index: 999;display: flex; align-items: center;
    }
    .bigImage{ max-width: 100%; position: absolute; top: 0; right: 0; bottom: 0; left: 0; margin: auto;}
    tr{ line-height: 28px;}
    .img_box{ width: 150px; height: 150px; border-radius: 12px;}
    .img_top{ width: 50px; margin: 0 auto;display: block; margin-top: 25px;}
    .content_div{ width: 92%; margin: -25px 0 30px 4%; padding: 16px 0 10px 0; padding-bottom: 40px; background: rgba(255, 255, 255, 1); box-shadow: 0px 2px 12px 4px rgba(74, 139, 255, 0.15); border-radius: 12px;
        .name_div{ box-sizing: border-box; padding: 25px 15px; min-height: 110px; margin-top: 20px; border: none !important; background: url('../../img/information-back.png') no-repeat; background-size: 100% 100%; color: #fff;
            .circular_img{ width: 50px; height: 50px; position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto 0;}
            .circular_name{ background: #fff; color: #4A8BFF; width: 50px; height: 50px; line-height: 50px; position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto 0;}
            .information_name{ line-height: 22px; box-sizing: border-box; padding: 6px 0 0 70px;}
        }
    }
</style>
