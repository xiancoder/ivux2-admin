<template>
    <div>
        <x-header :left-options="{showBack:true,backText:''}" class="header_box">
            <span class="header_title">UI组件预览</span>
        </x-header>
        <div style="height:50px;"></div>
        <br>
        <x-header> 标题,如果太长会自动缩短哈哈哈哈 </x-header>
        <br>
        <x-header :left-options="{showBack:false}">没有"返回"按钮</x-header>
        <br>
        <x-header :left-options="{backText:''}">"返回"按钮精简</x-header>
        <br>
        <x-header :right-options="{showMore:true}" @on-click-more="showMenus=true">"更多"按钮</x-header>
        <actionsheet :menus="menus" v-model="showMenus" show-cancel></actionsheet>
        <br>
        <x-header>slot写右按钮文本<a slot="right">呵呵</a></x-header>
        <br>
        <x-header>slot写左按钮文本<a slot="left">呵呵</a></x-header>
        <br>
        <x-header>
            <span>slot复写左按钮</span>
            <x-icon slot="overwrite-left" type="navicon" size="35" style="fill:#fff;position:relative;top:-8px;left:-3px;"></x-icon>
        </x-header>
        <br>
        <x-header style="background-color:#000;">施加样式影响</x-header>
    </div>
</template>
<script>
import { Actionsheet } from 'vux'

export default {
    components: { Actionsheet },
    data () {
        return {
            menus: {
                menu1: 'Take Photo',
                menu2: 'Choose from photos'
            },
            showMenus: false
        }
    },
    methods: {
    },
    mounted () {
    }
}
</script>
<style>
</style>
