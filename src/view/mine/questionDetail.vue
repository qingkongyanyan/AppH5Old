<!-- 疑难解答问题详情 -->
<template>
  <div class="question-detail">
    <div class="question-contain" v-html="template" v-show="!markShow"></div>
    <!-- <div class="question-mark" v-show="markShow">
      <img :src="imgUrl" :class="{'active':isChoose}" @click.stop="imgScc">
    </div> -->
	  <swiper :options="swiperOption" ref="imgOverview" style="height: 100%;" v-show="markShow" @click.stop="hideImg">
	    <swiper-slide v-for="(img, index) in previewImg">
	      <div class="swiper-zoom-container">
	        <img :src="img" alt="">
	    </div>
	    </swiper-slide>
	  </swiper>
	</div>
</div>

</template>
<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'questonDetail',
  data() {
    return {
      //template: this.$route.query.template,
      template:'',
      markShow: false,
      imgUrl: '#',
      isChoose: false,
      swiperOption: {
        width: window.innerWidth,
        zoom: true,
        initialSlide: 0,
        //preventClicksPropagation: true,//阻止click冒泡。拖动Swiper时阻止click事件。
      },
      previewImg:[],
    }
  },
  created(){
    this.template = localStorage.getItem('questionContent');
  },
  mounted() {
    var imgClick = document.querySelectorAll('.while_div p img');
    var questionMark = document.querySelectorAll('.question-mark')[0];
    var swiperZoomContainer = document.querySelectorAll('.swiper-container')[0];
    for (var i = 0; i < imgClick.length; i++) {
      imgClick[i].addEventListener('click', (e) => {
        //console.log(imgClick);
        this.previewImg = [];
        //将点击的图片放入遮罩层页面
        this.markShow = true;
        this.imgUrl = imgClick[i - 1].src;
        this.previewImg.push(this.imgUrl);
        //console.log(this.previewImg);
        //点击遮罩层遮罩层消失
        /*swiperZoomContainer.addEventListener('click', (e) => {
          this.markShow = false;
        })*/
      })
    };

  },
  methods: {
    imgScc: function() {
      this.isChoose = !this.isChoose;
    },
    hideImg(){
    	this.markShow = false;
    },
  },
  components: {
    swiper,
    swiperSlide,
  },
}

</script>
<style scoped>
.question-detail {
  width: 100%;
  height: 100%;
  background: #fff;
}

.question-detail .question-contain {
  width: 100%;
  height: 100%;
  text-align: left;
  text-indent: 2em;
}

.question-contain .while_div {
  margin: .1rem auto;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}

/* 疑难解答详情页 显示大图 */

.question-mark {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  padding: 0.3rem;
  overflow: auto;
  z-index: 100000;
}

.question-mark img {
  max-width: 100%;
  /* margin: 10px 0; */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: scale(1);
  transition: all ease 0.5s;
  transform: translate(-50%, -50%);
}

.question-mark img.active {
  transform: scale(3);
  /*图片需要放大3倍*/
  position: absolute;
  /*是相对于前面的容器定位的，此处要放大的图片，不能使用position：relative；以及float，否则会导致z-index无效*/
  z-index: 100;
}

.swiper-container{
  background: rgba(0, 0, 0, 0.9);
}
</style>
