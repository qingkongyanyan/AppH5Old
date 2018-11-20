<!-- 登录页 -->
<template>
  <!-- logo -->
  <div class="login">
    <div class="logo">
      <img src="/static/images/logo.png">
    </div>
    <!-- 表单 -->
    <form class="form">
      <div class="form-group" :class="{activea:aa && mobile && mobile.length > 0}">
        <label>
          <input type="phone" placeholder="手机号" maxlength="13" v-model="mobile" @focus="aa = true" @blur="regMobile">
        </label>
        <span class="close" v-show='aa && mobile && mobile.length > 0' @click="mobile=''"></span>
      </div>
      <div class="form-group" :class="{activeb:bb && password && password.length > 0}">
        <label>
          <input type="password" maxlength="16" minlength="6" placeholder="登录密码" v-model="password" @focus="bb = true" @blur="bb = false">
        </label>
        <span class="close" v-show='bb && password && password.length > 0' @click="password=''"></span>
      </div>
      <div class="form-group" :class="{activec:cc && code && code.length > 0}">
        <label>
          <input type="text" placeholder="验证码" v-model="code" @focus="cc = true" @blur="cc = false">
        </label>
        <span class="close" v-show='cc && code && code.length > 0' @click="code=''"></span>
        <span class="imgCode">
          <img :src="imgSrc" @click="getImgCode">
        </span>
      </div>
      <p class="signBtn" @click="signUp()">
        <!-- <button>  -->
        登录
        <!-- </button> -->
      </p>
      <p class="forgetPassword">
        <span @click="goForgetPassword">忘记密码</span>
        <!-- <a class="fl">
          <router-link to="/forgetPassword">忘记密码</router-link>
        </a> -->
        <span @click="goSignUp">注册账号</span>
        <!-- <a class="fr" href="">
          <router-link to="/signUp">注册账号</router-link>
        </a> -->
      </p>
      <p class="codeLogin">
        <span @click="goCodeLogin">手机验证码登录</span>
        <!-- <a href="javascript:void(0);" @click="goCodeLogin">
          手机验证码登录
          <router-link to="/mobileCodeLogin">手机验证码登录</router-link>
        </a> -->
      </p>
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
import * as types from '../../store/types'
export default {
  data() {
    return {
      aa: false,
      bb: false,
      cc: false,
      mobile: '',
      password: '',
      code: '',
      codeId: '',
      tipShow: false,
      alentText: '',
      imgSrc: '', // 图片验证码
      token: ''
    };
  },
  mounted() {
    this.getImgCode();
  },
  methods: {
    //获取验证码
    getImgCode() {
      console.log('9999');
      this.post('/account/getImgCheckCode', {

      }).then(res => {

        if (res.data.code == 100000) {

          this.imgSrc = res.data.data.strImg;

          console.log(this.imgSrc)
          this.codeId = res.data.data.checkCodeId;
        };
        if (res.data.code == 101001) {
          this.tipShow = true;
          this.alentText = res.data.msg;
        }
      })
    },
    signUp() {
      if (!this.mobile) {
        var sel = this;
        this.alentText = '手机号不能为空';
        this.tipShow = true;
        setTimeout(function() { sel.tipShow = false; }, 3000);
        this.getImgCode();

        return;
      } else if (this.mobile) {
        //console.log("ooo")
        console.log(this.mobile);
        if (!(/^1[3|4|5|6|7|8|9][0-9]\s\d{4}\s\d{4}$/.test(this.mobile))) {
          var sel = this;
          this.alentText = '手机号格式不正确';
          this.tipShow = true;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          this.getImgCode();
          return;
        };

      };
      if (!this.password) {
        var sel = this;
        this.alentText = '密码不能为空';
        this.tipShow = true;
        setTimeout(function() { sel.tipShow = false; }, 3000);
        return;
      } else if (this.password) {
        //console.log("ooo")
        if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(this.password))) {
          var sel = this;
          this.alentText = '请输入包含数字和字母的6-16位密码';
          this.tipShow = true;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          this.getImgCode();
          return;
        }
      }
      if (!this.code) {
        var sel = this;
        this.alentText = '图片验证码不能为空';
        this.tipShow = true;
        setTimeout(function() { sel.tipShow = false; }, 3000);
        this.getImgCode();
        return;
      } else if (this.code) {
        console.log("ooo")
      };
      // MD5
      var password = md5(this.password)
      console.log(md5(this.password))

      this.post('/account/custLogin', {
        mobile: this.mobile.replace(/\s+/g,""), //手机号 
        loginType: '0', //登录类型 (密码登录) 
        msgCheckCode: '', //短信验证码 登录类型为1时必输
        password: password, //密码  登录类型为0时必输
        imgCheckCodeId: this.codeId, //图片验证码id 登录类型为0时必输
        imgCheckCode: this.code, //图片验证码 登录类型为0时必输
      }).then(res => {
        if (res.data.status == true && res.data.code == 100000) {
          //成功
          localStorage.setItem("loginInformation", JSON.stringify(res.data.data));
          localStorage.setItem('token', res.data.data.token)
          this.token = res.data.data.token;

          // 客户 id
          localStorage.setItem('custId', res.data.data.sysCust.custId);
          // 客户姓名
          localStorage.setItem('custName', res.data.data.sysCust.custName);
          // 身份证号
          localStorage.setItem('certCode', res.data.data.sysCust.certCode);
          // 手机号
          localStorage.setItem('mobile', res.data.data.sysCust.mobile);
          // 银行卡号
          localStorage.setItem('bankCardNo',res.data.data.sysCust.bankCardNo);
          if (this.token) {
            this.$store.commit(types.LOGIN, this.token)
          }
          this.$router.push("/home");
        };
        if (res.data.status == false && res.data.code != 100000) {
          //失败
          this.code = '';
          var sel = this;
          this.tipShow = true;
          this.alentText = res.data.msg;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          if(res.data.msg == '图片验证码校验失败'){
            this.code = '';
            var sel = this;
            this.tipShow = true;
            this.alentText = '图片验证码错误，请重新输入';
            setTimeout(function() { sel.tipShow = false; }, 3000);
          };
          this.getImgCode();
          return;
        }
      })
    },
    goCodeLogin(){
      localStorage.removeItem('codeMobile');
      localStorage.removeItem('codeImgcode');
      localStorage.removeItem('codeCode');
      this.$router.push('/mobileCodeLogin');
    },
    goForgetPassword(){
      this.$router.push('/forgetPassword');
    },
    goSignUp(){
      localStorage.removeItem('signMobile');
      localStorage.removeItem('signImgcode');
      localStorage.removeItem('signCode');
      this.$router.push('/signUp');
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
.login {
  width: 100%;
  height: 100%;
  background: #fff;
  min-height: 10rem;
}

.logo {
  margin: 0 auto;
}

.logo img {
  width: 2.95rem;
  height: .66rem;
  margin: 1.6rem 0 .75rem 0;
}

.form {
  text-align: center;
  padding: 0 5%;
}

.form-group {
  display: block;
  margin-bottom: 0;
  position: relative;
  height: 0.85rem;
  border-bottom: 1px solid #eeeeee;
}

.form .form-group label {
  width: 100%;
  height: 100%;
  display: inline-block;
  text-align: left;
}

.form input {
  width: calc(100% - .24rem);
  height: 100%;
  border: none;
  outline: none;
  font-size: .28rem;
  color: #333333;
  vertical-align: top;
}

.form .form-group:nth-of-type(3) input {
  width: calc(100% - 1.7rem);
  height: 100%;
  border: none;
  outline: none;
  font-size: .28rem;
  color: #333333;
  vertical-align: top;
}

.form .form-group:nth-of-type(3) .close {
  right: 1.3rem;
}

.form .form-group .close {
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

.imgCode {
  position: absolute;
  display: inline-block;
  width: 1.27rem;
  height: 0.52rem;
  right: 0rem;
  top: .18rem;
  border: 1px solid #ccc;
}











/* 登录按钮 */

.signBtn {
  font-size: 0.34rem;
  text-decoration: none;
  width: 100%;
  height: .8rem;
  line-height: .8rem;
  background-image: linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%);
  border-radius: 10px;
  color: #fff;
  margin-top: .8rem;
  margin-bottom: .33rem;
  font-size: .34rem;
}











/* .signBtn{
    
  } */

.form .form-group:nth-of-type(3) .close {
  right: 1.35rem;
}

.form .form-group .close {
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

.imgCode {
  position: absolute;
  display: inline-block;
  width: 1.27rem;
  height: 0.52rem;
  right: 0rem;
  top: .18rem;
  border: 1px solid #ccc;
}

.imgCode img {
  width: 100%;
  height: 100%;
  pointer-events:auto;
}









/* 登录按钮 */

.signBtn {
  font-size: 0.34rem;
  text-decoration: none;
  width: 100%;
  height: .8rem;
  line-height: .8rem;
  background-image: linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%);
  border-radius: 10px;
  color: #fff;
  margin-top: .8rem;
  margin-bottom: .33rem;
}

.signBtnDis {
  font-size: 0.34rem;
  text-decoration: none;
  width: 100%;
  height: .8rem;
  line-height: .8rem;
  background: url(/static/images/OCR_submit_disable@2x.png) no-repeat;
  background-size: 100% 100%;
  border-radius: 10px;
  color: #fff;
  margin: 0 auto;
  margin-top: .8rem;
  margin-bottom: .33rem;
}
/* 忘记密码 */

.forgetPassword {
  width: 100%;
  height: .33rem;
}

.forgetPassword span {
  font-size: .24rem;
  color: #2a3776;
}
.forgetPassword span:nth-of-type(1) {
  float: left;
}
.forgetPassword span:nth-of-type(2) {
  float: right;
}









/* 验证码登录 */

.codeLogin {
  width: 100%;
  text-align: center;
  height: .33rem;
  margin-top: 2.05rem;
}

.codeLogin span {
  font-size: .24rem;
  color: #2a3776;
}




/* 忘记密码 */

.forgetPassword {
  width: 100%;
  height: .33rem;
}

.forgetPassword a {
  font-size: .24rem;
  color: #2a3776;
}











/* 验证码登录 */

.codeLogin {
  width: 100%;
  text-align: center;
  height: .33rem;
  margin-top: 2.05rem;
}

.codeLogin a {
  font-size: .24rem;
  color: #2a3776;
  display: inherit;
}











/* 获取焦点，底部边框颜色高亮 */

.activea,
.activeb,
.activec {
  border-bottom: 1px solid #c0a78a;
}











/* 弹框 */

.tip {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  max-width: 84%;
}

.tip span {
  color: #fff;
  font-size: .32rem;
  opacity: 0.8;
  background: #000000;
  border-radius: 20px;
  padding: .81rem .56rem;
  margin-top: 3.74rem;
  display: inline-block;
}

</style>
