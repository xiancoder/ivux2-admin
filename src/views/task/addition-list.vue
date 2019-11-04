<template>
    <div>
        <x-header :left-options="{backText: ''}" class="header_fix">追加需求</x-header>
        <div class="header_blank"></div>
        <div class="info_container" style="padding: 0 15px">
            <div v-for="(item, index) in additionList" :key="item.id" v-show="index !== 0" style="border-bottom: 1px solid #ddd;padding: 10px 0">
                <div style="margin-bottom: 10px">
                    {{item.createdTime}}
                </div>
                <div class="remark_text">
                    <div v-html="item.taskContent" class="task_content"></div>
                </div>
                <div style="margin-top: 10px">
                    <a v-for="(file, index) in item.taskEnclosure" :key="index" :href="file" download="" style="color: #0094eb;display: block">{{urlName(file)}}</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name: 'request-list',
    components: {},
    data () {
        return {
            additionList: [],
            urlName: function (url) {
                let index = url.lastIndexOf('_')
                url = url.substring(index + 1, url.length)
                return url
            }
        }
    },
    methods: {
        init () {
            this.$get('api/task/contentlist', {
                taskId: this.$route.query.taskId
            }).then((res) => {
                this.additionList = res.data.data.list
            })
        }
    },
    mounted () {
        this.init()
    }
}
</script>
<style scoped>
    .remark_text{ background-color: #f8f8f8; padding: 15px; margin-bottom: 10px; word-wrap: break-word; color: #666;}
</style>
