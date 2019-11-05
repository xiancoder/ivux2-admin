<template>
    <div>
        <x-header :left-options="{backText: ''}" style="background-color: #0094eb">修改电话<a slot="right" style="color: #fff" @click="saveTel">保存</a></x-header>
        <div class="tel" style="padding-right: 15px">
            <group>
                <cell title="电话"><x-input :is-type="telNumber"  placeholder="20位以内" v-model="tel" required ref="tel" :max="20" text-align="right"></x-input></cell>
                <cell></cell>
            </group>
        </div>
    </div>
</template>
<script>
import {Group, Cell, XInput} from 'vux'
export default {
    name: 'modify-telphone',
    components: {Group, Cell, XInput},
    data () {
        return {
            tel: '',
            telNumber: function (value) {
                let num = /^[0-9]\d*$/
                return {
                    valid: num.test(value),
                    msg: '电话只能为纯数字'
                }
            }
        }
    },
    methods: {
        saveTel () {
            if (this.tel === '') {
                this.$vux.alert.show({
                    title: '提示',
                    content: '电话不能为空'
                })
            } else if (!this.$refs.tel.valid) {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请检查电话格式！'
                })
            } else {
                this.$post('api/my/tel_modify', {
                    tel: this.tel
                }).then((res) => {
                    if (res.data.data.res === 1) {
                        this.$vux.alert.show({
                            title: '提示',
                            content: '操作成功'
                        })
                        this.$router.replace({name: 'my-info'})
                    } else if (res.data.data.res === 0) {
                        this.$vux.alert.show({
                            title: '提示',
                            content: '操作失败'
                        })
                    } else {
                        this.$vux.alert.show({
                            title: '提示',
                            content: res.data.data
                        })
                    }
                })
            }
        }
    },
    mounted () {
    }
}
</script>
<style scoped>
    .tel .weui-cells{ font-size: 16px; margin-top: 0;}
    .tel .weui-cell{ height: 35px; padding-right: 0;}
    .tel .weui-cells:after{ border: none;}
    .tel .vux-cell-primary{ color: #333;}
    .tel .weui-cell__ft{ color: #666;}
</style>
