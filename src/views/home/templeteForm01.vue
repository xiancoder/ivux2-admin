<template>
    <div>
        <x-header :left-options="{showBack:true,backText:''}" class="header_box header_fix">
            <span class="header_title">文本复制功能</span>
        </x-header>
        <div style="height:50px;"></div>
        <group title="兼容情况">
            <cell title="安卓:小米5s" :value="'微信OK'"></cell>
            <cell title="苹果" :value="'微信OK'"></cell>
            <!-- <cell title="余额 (加载效果)" :is-loading="!money" :value="money"></cell>
            <cell title="提现 (禁用样式)" disabled is-link></cell> -->
        </group>
        <group>
            <x-input title="输入框" v-model="money" placeholder="请输入内容"
                placeholder-align="right" text-align="right" :show-clear="false">
            </x-input>
        </group>
        <group label-width="5em" title="label宽度可调">
            <cell title="点击复制" primary="content" @click.native="handleCopy('我是小龙人哈哈哈')"
                value="long long long longlong longlong longlong longlong longlong longlong longlong longlong long">
            </cell>
        </group>
    </div>
</template>
<script>
import '@/plugins/vux-table'
import {alert} from '@/tools'
import ClipboardJS from 'clipboard'

export default {
    data () {
        return {
            money: '' // 余额
        }
    },
    methods: {
        handleCopy (data) {
            var oDiv = document.createElement('div')
            var id = 'copyBoxInHidden'
            oDiv.id = id
            oDiv.innerHTML = data
            oDiv.style.height = '1px'
            oDiv.style.overflow = 'hidden'
            document.body.appendChild(oDiv)
            const range = document.createRange()
            range.selectNode(document.getElementById(id))
            const selection = window.getSelection()
            if (selection.rangeCount > 0) selection.removeAllRanges()
            selection.addRange(range)
            document.execCommand('copy')
            alert('执行浏览器复制命令')
            oDiv.remove()
        }
    },
    mounted () {
        // 在pc上表现良好
        // 在ios上 事件无法给到body 自动下发给了body下的有效内容
        // 在android上 屁事没有
        new ClipboardJS('body', {
            text: function(trigger) {
                console.log('执行浏览器复制命令')
                return '哈哈哈哈' + (+new Date)
            }
        });
    }
}
</script>
<style>
    .demo4-item { background-color: #ddd; color: #222; font-size: 14px; padding: 5px 10px; margin: 0 5px 5px 0; line-height: 18px; border-radius: 15px; }
    .demo4-item-selected { background-color: #FF3B3B; color: #fff; }
    .demo4-item-disabled { color: #999; }

    .demo5-item { width: 100px; height: 26px; line-height: 26px; text-align: center; border-radius: 3px; border: 1px solid #ccc; background-color: #fff; margin-right: 6px; }
    .demo5-item-selected { background: #ffffff; border-color: #ff4a00; }
</style>
