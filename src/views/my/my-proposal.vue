<style>
    .proposal .weui-cells{ margin-top: 0px !important;}
    .proposal .vux-no-group-title{ margin-top: 0px !important;}
    .proposal .weui-cells .vux-label{ font-size: 14px !important;}
    .proposal .weui-cells .vux-cell-placeholder{ font-size: 14px !important;}
    .proposal .weui-cells .vux-cell-value{ font-size: 14px !important;}
    .proposal .weui-cell__bd .weui-textarea{ font-size: 14px !important;}
</style>
<template>
    <div class="proposal">
        <x-header class="back1" :left-options="{backText: ''}">吐槽与建议<a slot="right" style="color: #fff" @click="savePsd">保存</a></x-header>
        <group>
            <popup-radio title="类型" :options="types" v-model="type_id" placeholder="请选择类型"></popup-radio>
        </group>
        <group>
            <x-textarea :max="500" :rows="8" :autosize="true" :placeholder="text1" v-model="text2"></x-textarea>
        </group>
    </div>
</template>
<script>
import {Group, XInput, AlertPlugin, PopupRadio, XTextarea} from 'vux'
export default {
    name: 'modify-password',
    components: {Group, XInput, AlertPlugin, PopupRadio, XTextarea},
    data () {
        return {
            types: [{key: 1, value: '功能建议'}, {key: 2, value: '用户体验'}, {key: 3, value: '页面设计'}, {key: 4, value: '其他'}],
            type_id: '',
            text1: '请留下您的吐槽与建议，我们会充分考虑，感谢您的配合！',
            text2: ''
        }
    },
    methods: {
        savePsd () {
            if (this.type_id === '') {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请选择类型！'
                })
                return
            }
            if (this.text2.length === 0) {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请填写吐槽或建议的内容！'
                })
                return
            }
            this.$post('api/system/suggest', {
                'type': this.type_id,
                'content': this.text2
            }).then(res => {
                if (res.data.data.res === 1) {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '感谢您的反馈！'
                    })
                    this.$router.go(-1)
                } else {
                    this.$vux.alert.show({
                        title: '提示',
                        content: res.data.data
                    })
                }
            })
        }
    }
}
</script>
<style scoped>
    .back1{ background-color: #0094eb;}
</style>
