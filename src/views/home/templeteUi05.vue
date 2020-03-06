<template>
    <div>
        <x-header :left-options="{showBack:true,backText:''}" class="header_box">
            <span class="header_title">UI组件预览</span>
        </x-header>
        <group-title>二分</group-title>
        <grid>
            <grid-item label="二分" v-for="i in 2" :key="i">
                <x-icon type="ios-ionic-outline" size="30"></x-icon>
            </grid-item>
        </grid>
        <group-title>三分</group-title>
        <grid :show-lr-borders="false" :show-vertical-dividers="false">
            <grid-item link="/component/cell" label="三分">
                <x-icon type="ios-ionic-outline" size="30"></x-icon>
            </grid-item>
            <grid-item link="/component/cell" label="三分">
                <x-icon type="ios-ionic-outline" size="30"></x-icon>
            </grid-item>
            <grid-item link="/component/cell" @on-item-click="onItemClick">
                <x-icon type="ios-ionic-outline" size="30"></x-icon>
                <span slot="label">1234</span>
            </grid-item>
        </grid>
        <group-title>四分</group-title>
        <grid :show-lr-borders="false">
            <grid-item :label="'四分'" v-for="i in 4" :key="i">
                <x-icon type="ios-ionic-outline" size="30"></x-icon>
            </grid-item>
        </grid>
        <group-title> 五分 </group-title>
        <grid :show-vertical-dividers="false">
            <grid-item v-for="i in 5" :key="i">
                <span class="grid-center">{{i}}</span>
            </grid-item>
        </grid>
        <group-title> 自定义列 </group-title>
        <div style="padding:0 10px;">
            <grid :cols="3" :show-lr-borders="false" :show-vertical-dividers="false">
                <grid-item v-for="i in 6" :key="i">
                    <span class="grid-center">{{i}}</span>
                </grid-item>
            </grid>
        </div>
        <div style="height:50px;"></div>
    </div>
</template>
<script>
import { Grid, GridItem, GroupTitle } from 'vux'

export default {
    components: { Grid, GridItem, GroupTitle },
    data () {
        return {
        }
    },
    methods: {
        onItemClick () {
            console.log('on item click')
        }
    },
    mounted () {
    }
}
</script>
<style>
</style>
