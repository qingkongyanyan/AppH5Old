<!-- 忘记密码 -->
<template>
  <div class="forgetPassword">
    <!-- 表单 -->
    <form class="form">
      <div class="form-group" :class="{activea:aa && mobile && mobile.length > 0}">
        <label>
          <input 
              type="phone" 
              placeholder="手机号" 
              maxlength="13"
              v-model="mobile" 
              @focus="aa = true"        
              @blur="regMobile">           
        </label>
        <span class="close" v-show='aa && mobile && mobile.length > 0' @click="mobile=''"></span>
      </div>
      <div class="form-group" :class="{activec:bb && imgCode && imgCode.length > 0}">
        <label>
          <input 
          type="text" 
          placeholder="图片验证码"
          v-model="imgCode" 
          @focus="bb = true"        
          @blur="bb = false"
          >           
        </label>
        <span class="close" v-show='bb && imgCode && imgCode.length > 0' @click="imgCode=''"></span>
        <span class="imgCode">
          <img @click="getImgCode" :src='imgCheckCode'>
        </span>
      </div>
      <div class="form-group" :class="{activec:cc && code && code.length > 0}">
        <label>
          <input 
          type="text" 
          placeholder="验证码"
          v-model="code" 
          @focus="cc = true"        
          @blur="cc = false"
          >           
        </label>
        <span class="close" v-show='cc && code && code.length > 0' @click="code=''"></span>
        <span class="mobileCode" v-show="show" @click="getMobilCode">
              获取验证码
        </span>
        <span class="mobileCode" v-show="daoShow">
          {{count}}秒
        </span>
        <span class="mobileCode" v-show="reShow" @click="getMobilCode">
          重新获取
        </span>
        <!-- <span class="imgCode">
          <img @click="getMobilCode">
        </span> -->
      </div>
      <p class="signBtn" @click="signUp()">确定</p> 
      <!-- <p class="signBtn" v-if="sure" @click="signUp()">登录</p> 
      <p class="signBtnDis" v-if="sureDis">登录</p>  -->
    </form>
    <!-- 弹框 -->
    <div class="tip" v-show="tipShow" @click="tipShow=false">
      <!-- <p> -->
        <span>{{alentText}}</span>
      <!-- </p> -->
    </div>
  </div>
</template>
<script>
import * as types from '../../store/types'

export default {
  data() {
    return {
      aa:false,
      bb:false,
      cc:false,
      mobile:'',
      imgCode:'',
      imgCheckCode:'',
      imgCodeId:'',
      code:'',
      tipShow:false,
      alentText:'',
      show:true,
      reShow:false,
      daoShow:false,
      count:'',
      timer:null,
      sure:false,
      sureDis:true,
      token:'', // token 
    };
  },
  mounted(){
    this.getImgCode();
    this.show = true;
    this.reShow = false;
    this.daoShow = false;
  },
  methods: {
    //获取图片验证码
    getImgCode(){
      this.post('/account/getImgCheckCode', {

      }).then(res => {
        if(res.data.code == 100000){
          this.imgCheckCode = res.data.data.strImg;
          this.imgCodeId = res.data.data.checkCodeId;
        };
        if(res.data.code == 101001){
          var sel=this;
          this.alentText=res.data.msg;
          this.tipShow=true;
          setTimeout(function () {sel.tipShow=false;}, 3000);
          return;
        }
      })
    },
    //点击获取短信验证码 
    getMobilCode(){
      if(!this.mobile){
            var sel=this;
            this.alentText='手机号不能为空';
            this.tipShow=true;
           setTimeout(function () {sel.tipShow=false;}, 3000);
          return;  
        }else if(this.mobile){
          //console.log("ooo")/^1[3|4|5|8][0-9]\s\d{4}\s\d{4}$/
          if(!(/^1[3|4|5|6|7|8|9][0-9]\s\d{4}\s\d{4}$/.test(this.mobile))){
            var sel=this;
            this.alentText='手机号格式不正确';
            this.tipShow=true;
            setTimeout(function () {sel.tipShow=false;}, 3000);
            return;
          };
            
        };
      //先判断图片验证码是不是空
      if(!this.imgCode){
          var sel=this;
          this.alentText='图片验证码不能为空';
          this.tipShow=true;
          setTimeout(function () {sel.tipShow=false;}, 3000);
          return;  
      };
      //先判断图片验证码对不对
      this.post('/account/getMsgCheckCode', {
        mobile:this.mobile.replace(/\s+/g,""),//手机号 
        msgCheckType:'2',//短信验证码类型  忘记密码验证码:2
        imgCheckCodeId:this.imgCodeId,//图片验证码id 
        imgCheckCode:this.imgCode,//图片验证码 
      }).then(res => {
        if(res.data.status == true && res.data.code == 100000){
          //成功
          const TIME_COUNT = 120;
          if (!this.timer) {
             this.count = TIME_COUNT;
             this.daoShow = true;
             this.timer = setInterval(() => {
             if (this.count > 0 && this.count <= TIME_COUNT) {
               this.count--;
              } else {
               this.show = false;
               this.reShow = true;
               clearInterval(this.timer);
               this.timer = null;
              }
             }, 1000)
            };
        };
        if(res.data.status == false && res.data.code != 100000){
          if((res.data.status == false && res.data.code == 101002) || (res.data.status == false && res.data.code == 101004)){
            //失败
            this.imgCode = '';
            var sel=this;
            this.alentText='图片验证码错误，请重新输入';
            this.tipShow=true;
            setTimeout(function () {sel.tipShow=false;}, 3000);
            return; 
          };
          //失败
          var sel=this;
          this.alentText=res.data.msg;
          this.tipShow=true;
          setTimeout(function () {sel.tipShow=false;}, 3000);
          return; 
        };
        
      })
    },
    signUp(){
        if(!this.mobile){
            var sel=this;
            this.alentText='手机号不能为空';
            this.tipShow=true;
           setTimeout(function () {sel.tipShow=false;}, 3000);
          return;  
        }else if(this.mobile){
          //console.log("ooo")
          if(!(/^1[3|4|5|6|7|8|9][0-9]\s\d{4}\s\d{4}$/.test(this.mobile))){
            var sel=this;
            this.alentText='手机号格式不正确';
            this.tipShow=true;
            setTimeout(function () {sel.tipShow=false;}, 3000);
            return;
          };
            
        };
        if(!this.imgCode){
            var sel=this;
            this.alentText='图片验证码不能为空';
            this.tipShow=true;
            setTimeout(function () {sel.tipShow=false;}, 3000);
            return;  
        };
        if(!this.code){
            var sel=this;
            this.alentText='验证码不能为空';
            this.tipShow=true;
            setTimeout(function () {sel.tipShow=false;}, 3000);
            return;  
        }else if(this.code){
          console.log("ooo")
        };

        this.sure = true;
        this.sureDis = false;
        
      this.post('/account/forgetPassword', {
          mobile:this.mobile.replace(/\s+/g,""),//手机号 
          msgCheckCode:this.code//短信验证码 登录类型为1时必输
      }).then(res => {
        if(res.data.status == true && res.data.code == 100000){
          
          localStorage.setItem('token', res.data.data.token);
          //标志设置密码后返回登陆页还是去首页
          localStorage.setItem('goBackLoin', 'goBackLoin');
          this.token = res.data.data.token;
          if (this.token) {
            this.$store.commit(types.LOGIN, this.token)
          }

          this.$router.push({
            name: 'setPassword',
            params:{
              mobile:this.mobile
            }
          });
        };
        if(res.data.status == false && res.data.code != 100000){
          this.imgCode = '';
          if(res.data.status == false && res.data.code == 101003){
            this.code = '';
            var sel=this;
            this.alentText='短信验证码错误，请重新输入';
            this.tipShow=true;
            setTimeout(function () {sel.tipShow=false;}, 3000);
            return; 
          }
          var sel=this;
          this.alentText=res.data.msg;
          this.tipShow=true;
          setTimeout(function () {sel.tipShow=false;}, 3000);
          return;  
        }
      })
    },
    regMobile(){
      this.aa = false;
      console.log(this.mobile)
      this.mobile=this.mobile.replace(/\s+/g, "");
      console.log(111,this.mobile)
      if(this.mobile.length==4 || this.mobile.length==5 || this.mobile.length==6 || this.mobile.length==7){
          this.mobile = this.mobile.substring(0,3)+' '+this.mobile.substring(3);
      }
      if(this.mobile.length==8 || this.mobile.length==9 || this.mobile.length==10 || this.mobile.length==11){
          this.mobile = this.mobile.substring(0,3)+' '+this.mobile.substring(3,7)+' '+this.mobile.substring(7);
          return
      }
    },
  },
  watch:{
    mobile(newValue, oldValue) {
      if (newValue.length > oldValue.length) { // 文本框中输入
        if (newValue.length === 3 || newValue.length === 8) {
          console.log(newValue.length)
          this.mobile += ' ';
        }
      };
    },
  },
};

</script>
<style scoped>
.forgetPassword{
    width: 100%;
    height: 100%;
    background: #fff;
    min-height: 10rem;
  }
  .form{
    text-align: center;
    padding: 0 5%;

  }
  .form-group{
    display: block;
    margin-bottom: 0;
    position: relative;
    height: 0.85rem;
    border-bottom: 1px solid #eeeeee;

  }
  .form .form-group label{
    width: 100%;
    height: 100%;
    display: inline-block;
    text-align: left;

  }
  .form input{
    width: calc(100% - .24rem);
    height: 100%;
    border: none;
    outline: none;
    font-size:.28rem;
    color:#333333;
    vertical-align: top;
  }
  .form .form-group:nth-of-type(3) input,.form .form-group:nth-of-type(2) input {
    width: calc(100% - 1.8rem);
    height: 100%;
    border: none;
    outline: none;
    font-size:.28rem;
    color:#333333;
    vertical-align: top;
  }

  .form .form-group:nth-of-type(3) .close,.form .form-group:nth-of-type(2) .close {
    right: 1.5rem;
  }
  
  .form .form-group .close{
    position: absolute;
    right: 0rem;
    top: 0.35rem;
    margin-left: -2rem;
    display: inline-block;
    width: 0.24rem;
    height: 0.24rem;
    background: url(/static/images/close.png) no-repeat;
    background-size: 0.24rem 0.24rem;
  }
  .imgCode{
    position: absolute;
    display: inline-block;
    width: 1.27rem;
    height: 0.52rem;
    right: .06rem;
    top: .18rem;
    border: 1px solid #ccc;
  }
  .imgCode img{
    width: 100%;
    height: 100%;
    pointer-events: auto;
  }
  .mobileCode{
    position: absolute;
    display: inline-block;
    width: 1.4rem;
    height: 0.5rem;
    right: 0rem;
    top: .18rem;
    border: 1px solid #ccc;
    background:#c0a78a;
    border-radius:.1rem;
    font-size: .22rem;
    color: #fff;
    line-height: .5rem;
  }
  /* 登录按钮 */
  .signBtn{
    font-size: 0.34rem;
    text-decoration: none;
    width: 100%;
    height: .8rem;
    line-height: .8rem;
    background-image:linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%);
    border-radius:10px;
    color: #fff;
    margin-top: .8rem;
    margin-bottom: .33rem;
  }
  .signBtnDis{
    font-size: 0.34rem;
    text-decoration: none;
    width: 100%;
    height: .8rem;
    line-height: .8rem;
    background:url(/static/images/OCR_submit_disable@2x.png) no-repeat;
    background-size: 100% 100%;
    border-radius:10px;
    color: #fff;
    margin:0 auto;
    margin-top: .8rem;
    margin-bottom: .33rem;
  }
  /* 获取焦点，底部边框颜色高亮 */
  .activea,.activeb,.activec{
    border-bottom:1px solid #c0a78a;
  }
  /* 弹框 */
  .tip{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    max-width: 84%;
  }
  .tip span{
    color: #fff;
    font-size: .32rem;
    opacity:0.8;
    background:#000000;
    border-radius:20px;
    padding:.81rem .56rem;
    margin-top: 3.74rem; 
    display: inline-block;
  }
</style>
  