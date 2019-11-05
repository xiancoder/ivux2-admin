<template>
    <div>
        <div class="head_div">
            <div class="back_img"><span @click="clearCache">我的</span></div>
            <div class="card_div">
                <img class="my_photo" :src="src + randomNum" v-if="userInfo.userPhoto" @click="toPhoto"/>
                <div class="name_photo" v-else @click="toPhoto">{{fName}}</div>
                <p class="name" @click="toInfo">{{userInfo.userName}}</p>
                <p @click="toInfo">{{postName}}</p>
            </div>
        </div>
        <div class="content">
            <div @click="toPassword"> <img src="../../img/password.png" alt=""> 修改密码 </div>
            <div @click="toImg"> <img style="width: 26px;" src="../../img/photo.png" alt=""> 认证照片 </div>
            <div @click="toSign"> <img src="../../img/inscription.png" alt=""> 设置落款 </div>
        </div>
        <div class="logout" @click="userLogout">退出系统</div>
    </div>
</template>
<script>
import Cookies from 'js-cookie'
export default {
    name: 'my',
    components: {},
    data () {
        return {
            randomNum: ' ? t=' + Math.ceil(Math.random() * 10000),
            fName: '',
            userInfo: {},
            postName: '',
            src: ''
        }
    },
    methods: {
        init () {
            this.$get('api/my/base_info', {
            }).then((res) => {
                this.userInfo = res.data.data.result
                // let post = []
                // for (let i = 0; i < this.userInfo.postion.length; i++) {
                //     post.push(this.userInfo.postion[i].positionName)
                // }
                this.postName = this.userInfo.postName.join('，')
                if (this.userInfo.userPhoto) {
                    this.src = this.userInfo.userPhoto
                }
                this.fName = this.userInfo.userName[0]
            })
        },
        clearCache () {
            this.$get('api/system/remove_all_cache', {
            }).then((res) => {
                if (res.data.data && res.data.data.res === 1) {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '操作成功'
                    })
                } else {
                    this.$vux.alert.show({
                        title: '提示',
                        content: res.data.msg || '操作失败'
                    })
                }
            })
        },
        toPhoto () {
            this.$router.push({name: 'my-photo'})
        },
        toInfo () {
            this.$router.push({name: 'my-info'})
        },
        toPassword () {
            this.$router.push({name: 'modify-password'})
        },
        toProposal () {
            // 吐槽与建议
            this.$router.push({name: 'my-proposal'})
        },
        toSign () {
            this.$router.push({name: 'my-sign'})
        },
        toImg () {
            this.$router.push({name: 'modify-picture'})
        },
        userLogout () {
            const self = this // 需要注意 onCancel 和 onConfirm 的 this 指向
            this.$vux.confirm.show({
                content: '确认要退出吗？',
                onCancel () {},
                onConfirm () {
                    self.$get('api/system/loginout').then((res) => {
                        if (res.data.data.res === 1) {
                            if (Cookies.get('type')) {
                                // window.webkit.messageHandlers.gologin.postMessage('123')
                                window.$App.gologin()
                            } else {
                                self.$router.replace({name: 'login'})
                            }
                        }
                    })
                }
            })
        }
    },
    mounted () {
        this.init()
    }
}
</script>
<style scoped lang="less">
    .head_div{
        .back_img{ height: 150px; background: url('../../img/my-head-back.png') no-repeat; background-size: 100% 166px; text-align: center; line-height: 46px; color: #fff; font-size: 18px;}
        .card_div{ margin-top: -96px; height: 200px; padding: 0 2%; box-sizing: border-box; background: url('../../img/card.png') no-repeat center; background-size: 96% 200px; text-align: center; padding-top: 20px;
            .my_photo{display: inline-block; width: 80px; height: 80px; border-radius: 40px; vertical-align: middle; margin: 0 auto;}
            .name_photo{display: inline-block; width: 80px; height: 80px; line-height: 80px; border-radius: 40px; text-align: center; background-color: #fff; color: #4A8BFF; margin: 0 auto; border: 1px solid #4A8BFF;}
            .name{ font-size: 24px; color: #333; line-height: 48px;}
        }
    }
    .content{display: flex;display: -webkit-flex; padding: 0 2%;
        div{ height: 85px; flex: 1; text-align: center; font-size: 14px; background: url('../../img/white-back.png') no-repeat; background-size: 100%; background-size: 100% 85px; padding-top: 20px; box-sizing: border-box;
            img{ width: 20px; margin: 0 auto;display: block;}
        }
    }
    .logout{ position: fixed; bottom: 75px; width: 70%; left: 15%; height: 40px; line-height: 40px; border-radius: 20px; color: #ffffff; background-color: #fff; color: #4A8BFF; border: 1px solid #e7e7e7; text-align: center;}
</style>
