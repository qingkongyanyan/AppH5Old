<template>
    <div class="ShowPdf">
        <pdf-shower 
            v-for="(item,index) in newArry"
            :key="Math.random()"
            :pdfurl="item" 
            :scale="scale" 
            @onErr="onErr">  
        </pdf-shower>
    </div>
</template>

<script>
import appConstant from '../../util/constant'
// import PdfShower from 'vue-pdf-shower';
import PdfShower from 'pdfShow/index.js';
export default {
    name: 'pdfshower',
    components: {
        'pdf-shower':PdfShower
    },
    data() {
        return {
            // 所查看的pdf url
            pdfurls: '//cdn.mozilla.net/pdfjs/tracemonkey.pdf',
            // 缩放 默认为1
            scale: 1.2,
            newArry:[this.$route.params.url],
            list:this.$route.params.url,
        };
    },
    mounted() {
    console.log(this.newArry[0]);
    },
    methods: {
        // 加载失败的callback
        onErr(err) {
            console.log('pdf加载失败，请重试');
            console.log('错误信息：', err);
        }
    },
};
</script>