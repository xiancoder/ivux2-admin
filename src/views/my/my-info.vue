<style>
    .my_info .weui-cells{ font-size: 14px; margin-top: 0; }
    .my_info .weui-cell{ height: 30px; }
    .my_info .weui-cell:before{ left: 0; }
    .my_info .vux-cell-primary{ color: #333; }
    .my_info .weui-cell__ft{ color: #666; }
</style>
<template>
    <div>
        <x-header :left-options="{backText: ''}" style="background-color: #0094eb">我的信息</x-header>
        <div style="background-color: #0094eb;text-align: center;padding: 20px 0">
            <img :src="src + randomNum" class="my_photo" v-show="userInfo.userPhoto">
            <div class="name_photo" v-show="!userInfo.userPhoto">{{fName}}</div>
        </div>
        <div class="my_info">
            <div style="height: 15px;background-color: #f5f7f9"></div>
            <group>
                <cell title="姓名">{{userInfo.userName}}</cell>
                <cell title="工号">{{userInfo.jobNum || '-'}}</cell>
                <cell title="职位">{{postName}}</cell>
            </group>
            <div style="height: 15px;background-color: #f5f7f9"></div>
            <group>
                <cell title="电话" is-link link="/my/telphone">{{userInfo.tel || '-'}}</cell>
                <cell title="邮箱">{{userInfo.email || '-'}}</cell>
            </group>
        </div>
    </div>
</template>
<script>
import {XHeader, Group, Cell} from 'vux'
export default {
    name: 'my-info',
    components: {XHeader, Group, Cell},
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
            this.getInfo()
        },
        getInfo () {
            this.$get('api/my/detail_info', {
            }).then((res) => {
                this.userInfo = res.data.data.result
                this.postName = this.userInfo.post.join('，')
                if (this.userInfo.userPhoto) {
                    this.src = this.userInfo.userPhoto
                }
                this.fName = this.userInfo.userName[0]
            })
        }
    },
    mounted () {
        this.init()
    }
}
</script>
<style scoped>
    .my_photo{ width: 60px; height: 60px; border-radius: 30px;}
    .name_photo{display: inline-block; width: 60px; height: 60px; line-height: 60px; border-radius: 30px; text-align: center; background-color: #fff; color: #0094eb;}
</style>
