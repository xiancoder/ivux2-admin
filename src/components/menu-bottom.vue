<template>
    <div>
        <tabbar style="position: fixed" class="bottomTab">
            <tabbar-item :link="{path:'/realTimeQun',replace:true}">
                <span slot="label" :class="select === 1 ? 'blue' : 'color999'">基础数据</span>
            </tabbar-item>
            <tabbar-item :link="{path:'/list',replace:true}">
                <span slot="label" :class="select === 2 ? 'blue' : 'color999'">数据查询</span>
            </tabbar-item>
        </tabbar>
    </div>
</template>
<script>
import {Tabbar, TabbarItem} from 'vux';
export default {
    // dsf-2020-02-20 底部菜单组件
    name: 'menu-bottom',
    components: { Tabbar, TabbarItem },
    props: {
        select: {
            type: Number,
            default: null
        }
    }
}
</script>
<style scoped>
    .color999{
        color:#999;
    }
</style>
