<template>
    <div>
        <div style="height:50px;"></div>
        <group title="基本尝试">
            <x-switch title="基本弹框" v-model="show"></x-switch>
            <alert v-model="show" :title="'成功'"
                @on-show="onShow" @on-hide="onHide">
                信息发送成功
            </alert>

            <x-switch v-model="show2" :title="'成功'"></x-switch>
            <alert v-model="show2":title="'成功'" :content="'信息发送成功'"></alert>

            <cell :title="'方法触发'" @click.native="showModule" is-link></cell>
            <cell :title="'方法触发 挂载vue'" @click.native="showPlugin" is-link></cell>
            <cell :title="'自动关闭'" @click.native="showModuleAuto" is-link></cell>
            <cell :title="'自动关闭 挂载vue'" @click.native="showPluginAuto" is-link></cell>
        </group>
    </div>
</template>

<script>
import { AlertModule, Alert, Group, XSwitch, Cell } from 'vux'

export default {
    components: { Alert, Group, XSwitch, Cell },
    data () {
        return {
            show: false,
            show1: false,
            show2: false
        }
    },
    methods: {
        onHide () {
            console.log('on hide')
        },
        onShow () {
            console.log('on show')
        },
        showPlugin () {
            this.$vux.alert.show({
                title: 'VUX is Cool',
                content: 'Do you agree?',
                onShow () {
                    console.log('Plugin: I\'m showing')
                },
                onHide () {
                    console.log('Plugin: I\'m hiding now')
                }
            })
        },
        showModule () {
            AlertModule.show({
                title: 'VUX is Cool',
                content: 'Do you agree?',
                onShow () {
                    console.log('Module: I\'m showing')
                },
                onHide () {
                    console.log('Module: I\'m hiding now')
                }
            })
        },
        showModuleAuto () {
            this.showModule()
            setTimeout(() => {
                AlertModule.hide()
            }, 3000)
        },
        showPluginAuto () {
            this.showPlugin()
            setTimeout(() => {
                this.$vux.alert.hide()
            }, 3000)
        }
    },
    mounted () {
    },
    beforeDestroy () {
    }
}
</script>
