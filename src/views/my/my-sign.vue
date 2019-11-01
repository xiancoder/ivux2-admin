<template>
    <div>
        <x-header @on-click-back="toMy" :left-options="{backText: '', preventGoBack: true}" style="background-color: #0094eb">维护落款</x-header>
        <div style="padding: 0 15px">
            <div class="sign_cell" @click="toSignPass" v-show="img !== ''">
                <div style="float: left;margin-left: 10px">修改授权密码</div>
                <div style="float: right"><img src="../../img/arrow.png" style="width: 20px;vertical-align: middle"/></div>
            </div>
            <div class="sign_cell" @click="toDraw">
                <div style="float: left;margin-left: 10px">{{img === '' ? '设置' : '修改'}}落款</div>
                <div style="float: right"><img src="../../img/arrow.png" style="width: 20px;vertical-align: middle"/></div>
            </div>
            <div style="text-align: center;width: 100%">
                <img :src="img" class="sign" v-show="img !== ''">
            </div>
        </div>
    </div>
</template>
<script>
import {XHeader} from 'vux'
export default {
    name: 'my-sign',
    components: {
        XHeader
    },
    data () {
        return {
            img: ''
        }
    },
    methods: {
        init () {
            this.$get('api/my/signature_status', {
            }).then((res) => {
                if (res.data.data.content) {
                    this.img = res.data.data.content
                }
            })
        },
        toMy () {
            this.$router.push({name: 'my'})
        },
        toSignPass () {
            this.$router.push({name: 'sign-password'})
        },
        toDraw () {
            if (this.img === '') {
                this.$router.push({name: 'sign-setpass'})
            } else {
                this.$router.push({name: 'sign-setting'})
            }
        }
    },
    mounted () {
        this.init()
    }
}
</script>
<style scoped>
    .sign_cell{ border-bottom: 1px solid #eee; height: 50px; line-height: 50px; font-size: 14px;}
    .sign{ border: 1px solid #0094eb; width: 150px; height: 300px; transform: rotate(-90deg); margin-top: -40px;}
</style>
