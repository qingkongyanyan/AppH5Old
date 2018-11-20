<template>
  <div class="content">
    <!-- <header>
      {{item.title}}
    </header>
    <p><span>{{item.pushTimeTxt}}</span><label>{{item.messageTypeTxt}}</label></p> -->
    <div class="question-contain" v-html="content">{{content}}</div>
    <!-- <div class="question-contain" v-html="item.content" v-show="!markShow">{{item.content}}</div>
    <div class="question-mark" v-show="markShow">
      <img :src="imgUrl">
    </div> -->
  </div>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
      //content:this.$route.query.content,
      content:'',
      id:this.$route.query.id,
      custId:'',
      markShow:false,
      imgUrl:'#',
    }
  },
  mounted() {
    this.content = localStorage.getItem('inforContent');
    this.custId = localStorage.getItem('custId');
    //console.log(this.item);
    this.haveRead();
    /*var imgClick = document.querySelectorAll('.contain_div p img');
    console.log(imgClick);
    var questionMark= document.querySelectorAll('.question-mark')[0];

    for (var i = 0; i < imgClick.length; i++) {
      imgClick[i].addEventListener('click', (e)=> {
        console.log(imgClick);
        this.markShow = true;
        this.imgUrl=imgClick[i - 1].src
        //点击遮罩层遮罩层消失
        questionMark.addEventListener('click', (e)=> {
          this.markShow = false;
        })
      })
    };*/
  },
  methods: {
    haveRead(){
      this.post("/message/readMessage",{custId:this.custId,messageId:this.id})
      .then(res=>{
        if(res.data.code == '100000'){
          console.log("已读消息！")
        }
      })
    },
  },
}

</script>
<style scoped>
.content{
  width: 100%;
  height: 100%;
  background: #fff;
}
.content header{
  width: 6.98rem;
  margin: 0 auto;
  padding: .2rem 0 .23rem 0;
  font-size:.30rem;
  color:#344b67;
  text-align: left;
  line-height: 1.5;
}
.content p{
  width: 6.98rem;
  margin: 0 auto;
  height: .36rem;
  line-height: .36rem;
  text-align: left; 
  font-size: .28rem;
  text-indent: 0;
}
.content p span{
  font-size:.28rem;
  color:#344b67;
  padding-right: .17rem;
}
.content p label{
  width: .94rem;
  height: .5rem;
  display: inline-block;
  line-height: .36rem;
  text-align: center;
  font-size: .24rem;
  color: #fff;
  background: url(/static/images/infor_type.png) no-repeat;
  background-size: 100% 100%;
}
.content div{
  width: 6.98rem;
  margin: 0 auto;
  margin-top: .1rem;
  font-size:.3rem;
  color:#333333;
  text-indent:2em;
  text-align: left;
  line-height: 1.5;
  height: calc(100% - 1.6rem );
  overflow-y: auto;
}
.question-contain .title_div{
  padding: .1rem .13rem 0 0;
  font-size: .3rem;
}

.content .timeP span {
    font-size: .28rem;
    color: #344b67;
    padding: .10rem .13rem 0 .13rem;
}
/* 详情页 显示大图 */

.question-mark {
  position: absolute;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;
  background: rgba(0, 0, 0, 0.9);
  padding: 0.3rem;
  overflow: auto;
  z-index: 100000;
}

.question-mark img {
  max-width: 100%;
  margin: 10px 0;
}
</style>
