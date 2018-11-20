<!-- 设置密码 -->
<template>
  <!-- logo -->
  <div class="setPassword">
    <!-- 表单 -->
    <form class="form">
      <div class="form-group" :class="{activeb:aa && password && password.length > 0}">
        <label>
          <input 
              type="password" 
              maxlength="16" 
              minlength="6"
              placeholder="设置密码（包含数字和字母的6-16位密码）"
              v-model="password" 
              @focus="aa = true"        
              @blur="aa = false"
          >           
        </label>
        <span class="close" v-show='aa && password && password.length > 0' @click="password=''"></span>
      </div>
      <div class="form-group" :class="{activeb:bb && password2 && password2.length > 0}">
        <label>
          <input 
              type="password" 
              maxlength="16" 
              minlength="6"
              placeholder="再次设置密码（包含数字和字母的6-16位密码）"
              v-model="password2" 
              @focus="bb = true"        
              @blur="bb = false"
          >           
        </label>
        <span class="close" v-show='bb && password2 && password2.length > 0' @click="password2=''"></span>
      </div>
      <p class="signBtn" @click="signUp()">确定</p> 
      <!-- <p class="signBtn" v-if="sure" @click="signUp()">确定</p> 
      <p class="signBtnDis" v-if="sureDis">确定</p>  -->
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
import md5 from 'blueimp-md5'
export default {
  data() {
    return {
      aa:false,
      bb:false,
      password:'',
      password2:'',
      tipShow:false,
      alentText:'',
      mobile : this.$route.params.mobile,
      sure:false,
      sureDis:true,
      goOrBack:'',
    };
  },
  mounted(){
    //this.getImgCheckCode();
    this.goOrBack=localStorage.getItem('goBackLoin');
  },
  methods: {
    signUp(){
        if(!this.password){
            var sel=this;
            this.alentText='设置密码不能为空';
            this.tipShow=true;
            setTimeout(function () {sel.tipShow=false;}, 3000);
            return;  
        }else if(this.password){
          //console.log("ooo")
          if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(this.password))){
            var sel=this;
            this.alentText='请输入包含数字和字母的6-16位密码';
            this.tipShow=true;
            setTimeout(function () {sel.tipShow=false;}, 3000);
            return;
          };
            
        };
        if(!this.password2){
            var sel=this;
            this.alentText='再次设置密码不能为空';
            this.tipShow=true;
            setTimeout(function () {sel.tipShow=false;}, 3000);
            return;  
        }else if(this.password2){
          console.log("oo8888o")
          if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(this.password))){
            var sel=this;
            this.alentText='请输入包含数字和字母的6-16位密码';
            this.tipShow=true;
            setTimeout(function () {sel.tipShow=false;}, 3000);
            return;
          };
        };
        if(this.password && this.password2){
          if(this.password != this.password2){
            var sel=this;
            this.alentText='两次密码输入不一样';
            this.tipShow=true;
            setTimeout(function () {sel.tipShow=false;}, 3000);
            return;
          }
        };
        this.sure = true;
        this.sureDis = false;
       this.post('/account/updatePassword', {
          operType:'0',//操作类型  0-设置密码，1-修改密码
          mobile:this.mobile.replace(/\s+/g,""),//手机号 
          oldPassword:'',//旧密码 操作类型为1时必输
          newPassword:md5(this.password2),//新密码
      }).then(res => {
        if(res.data.status == true && res.data.code == 100000){
          if(this.goOrBack == 'goBackLoin'){
            //alert('************')
            this.$router.push({
              path: '/',
            });
          }
          if(this.goOrBack == 'goHome'){
            this.$router.push({
              name: 'Home',
            });
          }
          
        };
        if(res.data.status == false && res.data.code != 100000){
          var sel=this;
          this.alentText=res.data.msg;
          this.tipShow=true;
          setTimeout(function () {sel.tipShow=false;}, 3000);
          return;
        }
      }) 
    },
  }
};

</script>
<style scoped>
.setPassword{
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
    right: 0rem;
    top: .18rem;
    border: 1px solid #ccc;
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
    font-size: .34rem;
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
  