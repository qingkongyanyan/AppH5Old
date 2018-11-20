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
// import PdfShower from 'pdfshower/vue-pdf-shower/index';
import PdfShower from 'pdfShow/index.js';

export default {
    name: 'pdfshower',
    components: {
        'pdf-shower':PdfShower
    },
    data() {
        return {
            // 所查看的pdf url
            pdfurls: '//cdn.mozilla.net/pdfjs/tracemonkey.pdf',/*'http://updatecredit.nuoyuan.com.cn/credith5-web-boss/api/common/showFile?filePath=/home/appserver/filedata/credit/contract_save_path/03008914-2ad2-40a9-bfab-25c8cc098099//sign/%E5%80%9F%E6%AC%BE%E5%8D%8F%E8%AE%AE_%E7%89%9B%E5%9D%A4(210211198404140911).pdf'*/
            // 缩放 默认为1
            scale: 1.2,
            newArry:[this.$route.params.list],
            list:this.$route.params.list,
        };
    },
    mounted() {
    //console.log(this.newArry);
    console.log(this.newArry[0]);
    },
    methods: {
        // 加载失败的callback
        onErr(err) {
            console.log('pdf加载失败，请重试');
            console.log('错误信息：', err);
        }
    },
    //props: ['pathUrl'],
    /*watch:{
        pathUrl(value){        
            this.newArry = value;
            console.log(this.newArry);
        }
    },*/
};
</script>