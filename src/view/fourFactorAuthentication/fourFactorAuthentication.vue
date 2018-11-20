<!-- 四要素认证 -->
<template>
  <div class="fourFactorAuthentication">
    <div class="header">
      <div class="header-item">
        <div class="left font-size28">
          {{userName}}
        </div>
        <div class="right font-size28">
          {{idNum}}
        </div>
      </div>
      <div class="header-item">
        <div class="font-size24 header-item-mobile">
          银行卡绑定手机号码必须为: {{newMobile}}
        </div>
        <!-- <div class="left font-size28">
          银行卡绑定手机号码必须为:
        </div>
        <div class="right font-size28">
          {{newMobile}}
        </div> -->
      </div>
    </div>
    <div class="fourFactorAuthentication-div">
      <ul>
        <!-- <li>{{userName}}</li>
        <li>{{idNum}}</li>
        <li>{{newMobile}}</li> -->
        <li @click="goSearch('kaihuhang')">
          <input type="text" placeholder="请选择开户行名称" disabled="disabled" v-model="bankName">
          <img src="/static/images/more_arrow@2x.png">
        </li>
        <li>
          <input class="input-bank" type="text" placeholder="请输入银行卡号" v-model="cardNo" @blur="checkCarNo">
          <span class="close" @click="clearHight" v-show="cardNo.length"></span>
        </li>
        <li @click="goSearch('chengshi')">
          <input type="text" placeholder="请选择开户行所在城市名称" disabled="disabled" v-model="cityName">
          <img src="/static/images/more_arrow@2x.png">
        </li>
      </ul>
      <textarea placeholder="请输入分支行名称" v-model="branchName" maxlength="50"></textarea>
      <p class="sureButt" @click="sureButt">确定</p>
      <div class="tip-div">
        <h5>温馨提示：</h5>
        <p>1、请输入本人名下正确储蓄卡号，所输入卡号将作为审批放款指定账户。
        </p>
        <p>2、请保持银行卡号预留手机号与当前用户注册手机号一致。</p>
      </div>
    </div>
    <!-- 弹框 -->
    <div class="tip" v-show="tipShow" @click="tipShow=false">
      <span>{{alertText}}</span>
    </div>
    <!-- 认证状态弹框 -->
    <div class="rzTip" v-show="rzTipShow">
      <div>
        <p class="rzTitle">信息不符</p>
        <p class="rzInfo">您当前输入银行卡号与实名认证信息不符，核实后请重新输入！</p>
        <p class="rzSure" @click="rzTipShow=false">确定</p>
      </div>
      <!-- <img src="/static/images/tip-close.png" @click="rzTipShow=false"> -->
    </div>
    <div class="rzsb-tip" v-show="rzsbTipShow">
      <div>
        <p class="rzsb-info">认证失败, 请重新认证!</p>
        <p class="rzsb-sure" @click="rzsbTipShow=false">确定</p>
      </div>
    </div>
  </div>
</template>
<script>
import { Indicator } from 'mint-ui';
export default {
  data() {
    return {
      clear: '', //从业务页面跳过来
      tipShow: false,
      rzTipShow: false, //认证状态弹框
      alertText: '',
      uid: '', // 客户id
      userName: '', // 客户姓名 
      idNum: '', // 客户身份证号  
      mobile: '', // 手机号  
      cardNo: '', // 银行卡号 
      cityCode: '', // 开户所在城市代码 
      cityName: '', // 开户所在城市名称 
      bankCode: '', // 开户行代码  
      bankName: '', // 开户行名称  
      branchName: '', // 分/支行名称 
      operType: '', // 操作类型 1:四要素认证 2:四要素变更
      yuserName: '', //未加密的字段 姓名
      yidNum: '', //未加密的字段 银行卡
      newMobile: '', //未加密的字段 手机号
      rzsbTipShow: '',
    }
  },
  mounted() {
    this.uid = localStorage.getItem('custId');
    // 选择银行 城市
    this.clear = localStorage.getItem('from');
    console.log(this.clear);
    console.log(2222, this.cardNo);
    if (this.clear == 'yewu') {
      //alert("&")
      this.bankName = '';
      this.cityName = '';
      console.log(1111, this.cardNo);
      this.cardNo = '';
      localStorage.removeItem('bankObj');
      localStorage.removeItem('cityObj');
    } else if (this.clear == 'back') {
      var bankObj = JSON.parse(localStorage.getItem('bankObj'));
      var cityObj = JSON.parse(localStorage.getItem('cityObj'));
      // 银行卡号
      var fourcertCode = localStorage.getItem('bankCardNo');
      if (bankObj) {
        this.bankName = bankObj.bankName;
        this.bankCode = bankObj.bankCode;
      };
      if (cityObj) {
        this.cityName = cityObj.cityName;
        this.cityCode = cityObj.cityCode;
      };
      if (fourcertCode) {
        this.cardNo = fourcertCode;
      };
    }
    //console.log(this.bankName);
    // 登录信息
    var loginInformation = JSON.parse(localStorage.getItem('loginInformation')).sysCust;
    console.log(loginInformation)
    this.uid = localStorage.getItem('custId');
    //姓名打码
    this.yuserName = localStorage.getItem('custName');
    this.userName = this.yuserName.replace(this.yuserName.slice(0, 1), '*');
    console.log(this.userName)
    //银行卡号打码
    this.yidNum = localStorage.getItem('certCode');
    var xingLen = this.yidNum.slice(6, -4);
    var ss = '';
    for (var i = 0; i < xingLen.length; i++) {
      ss = ss + '*';
    }
    this.idNum = this.yidNum.replace(xingLen, ss);
    //手机号打码
    this.mobile = localStorage.getItem('mobile');
    this.newMobile = this.mobile.replace(this.mobile.slice(3, 7), '****');
  },
  methods: {
    clearHight: function() {
      console.log('清空 最高还款额')
      this.cardNo = '';
    },
    goSearch(flag) {
      // 存银行卡号
      // localStorage.setItem('fourcertCode',this.cardNo);
      localStorage.setItem('bankCardNo', this.cardNo);
      //this.clear = false;
      switch (flag) {
        case 'kaihuhang':
          this.clear = false;
          this.$router.push('nameOfBack');
          return;
        case 'chengshi':
          this.clear = false;
          this.$router.push('nameOfCity');
          return;
      }
    },
    // 银行卡号校验
    checkCarNo() {
      // var reg = /^([1-9]{1})(\d{14}|\d{18})$/;
      var reg = /^([1-9]{1})(\d{14}|\d{15}|\d{16}|\d{17}|\d{18})$/;
      if (this.cardNo) {
        if (!reg.test(this.cardNo)) {
          var sel = this;
          this.alertText = '请输入正确的银行卡号';
          this.cardNo = '';
          this.tipShow = true;
          setTimeout(function() {
            sel.tipShow = false;
          }, 3000);
        }
        return;
      };
    },
    sureButt() {
      if (!this.bankName) {
        var sel = this;
        this.alertText = '请选择开户行名称';
        this.tipShow = true;
        setTimeout(function() { sel.tipShow = false; }, 3000);
        return;
      };
      if (!this.cardNo) {
        var sel = this;
        this.alertText = '请输入正确的银行卡号';
        this.tipShow = true;
        setTimeout(function() { sel.tipShow = false; }, 3000);
        return;
      };
      if (!this.cityName) {
        var sel = this;
        this.alertText = '请选择开户行所在城市名称';
        this.tipShow = true;
        setTimeout(function() { sel.tipShow = false; }, 3000);
        return;
      };
      console.log("0000");
      /*this.post('/account/bankVerify', {
        uid: this.uid,
        userName: this.yuserName,
        idNum: this.yidNum,
        mobile: this.mobile,
        cardNo: this.cardNo,
        cityCode: this.cityCode,
        cityName: this.cityName,
        bankCode: this.bankCode,
        bankName: this.bankName,
        branchName: this.branchName,
        operType: '1', // 1:四要素认证  , 2:四要素变更*/

      Indicator.open();
      this.post('/bankCardChange/bankCardVerify', {
        uid: this.uid,
        userName: this.yuserName,
        idNum: this.yidNum,
        mobile: this.mobile,
        cardNo: this.cardNo,
        cityCode: this.cityCode,
        cityName: this.cityName,
        bankCode: this.bankCode,
        bankName: this.bankName,
        branchName: this.branchName,
        operType: '1', // 1:四要素认证  , 2:四要素变更
        //client:'5'// 客户端类型
      }).then(res => {
        Indicator.close();
        console.log(res)
        if (res.data.code == '100000') {

          //认证成功
          if (res.data.data.bankCardVerify == '0') {
            // 接口调用成功
            localStorage.removeItem('bankObj');
            localStorage.removeItem('cityObj');

            localStorage.setItem('bankCardNo', this.cardNo);
            this.$router.replace('/siyaosuSucess');
          };
          //认证失败
          if (res.data.data.bankCardVerify == '1') {
            localStorage.removeItem('bankCardNo')
            this.rzTipShow = true;
            //this.$router.push('/businessList');
          };
          //认证中
          if (res.data.data.bankCardVerify == '2') {
            // 接口调用成功
            localStorage.removeItem('bankObj');
            localStorage.removeItem('cityObj');
            localStorage.removeItem('bankCardNo')
            // localStorage.setItem('bankCardNo', this.cardNo);
            this.$router.replace('/siyaosuWait');
          };
          if (res.data.data.bankCardVerify == '5') {
            // var sel = this;
            // this.alentText = '认证失败, 请重新认证!';
            // this.tipShow = true;
            // setTimeout(function() { sel.tipShow = false; }, 3000);
            this.rzsbTipShow = true;
            return;
          }

        } else {
          var sel = this;
          this.alertText = res.data.msg;
          this.tipShow = true;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })
    },
  },
}

</script>
<style type="text/css" scoped>
.fourFactorAuthentication {
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: auto !important;
}

.fourFactorAuthentication-div {
  width: 92%;
  margin-left: 4%;
  /* height: 100%; */
  height: auto;
}

.fourFactorAuthentication-div ul li {
  height: .85rem;
  line-height: .85rem;
  border-bottom: 1px solid #b3b3b3;
  text-align: left;
  font-size: .28rem;
  color: #333333;
  position: relative;
}

.fourFactorAuthentication-div ul li input {
  border: none;
  outline: none;
  background: #fff;
  color: #333333;
  width: 100%;
}

.fourFactorAuthentication-div ul li input[disabled],
.fourFactorAuthentication-div ul li input:disabled,
.fourFactorAuthentication-div ul li input.disabled {
  border: none;
  outline: none;
  background: #fff;
  color: #333333;
  width: 100%;
  opacity: 1;
  -webkit-text-fill-color: #333333;
  -webkit-opacity: 1;
}

.fourFactorAuthentication-div ul li input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #999 !important;
  -webkit-text-fill-color: #999;
  opacity: 1;
  -webkit-opacity: 1;
}






/* .fourFactorAuthentication-div ul li input:-moz-placeholder { Mozilla Firefox 4 to 18 
  color: #999 !important;
  -webkit-text-fill-color: #999;
  opacity: 1;
  -webkit-opacity:1;
} 
.fourFactorAuthentication-div ul li input::-moz-placeholder { Mozilla Firefox 19+ 
  color: #999 !important; 
  -webkit-text-fill-color: #999;
  opacity: 1;
  -webkit-opacity:1;
} 
.fourFactorAuthentication-div ul li input:-ms-input-placeholder { Internet Explorer 10+ 
  color: #999 !important;
  -webkit-text-fill-color: #999;
  opacity: 1;
  -webkit-opacity:1;
}  */

.fourFactorAuthentication-div ul li input:disabled::-webkit-input-placeholder {
  color: #999 !important;
  -webkit-text-fill-color: #999;
  opacity: 1;
  -webkit-opacity: 1;
}


.fourFactorAuthentication-div ul li img {
  width: .16rem;
  height: .3rem;
  position: absolute;
  right: .1rem;
  top: .27rem;
}

.fourFactorAuthentication-div textarea {
  width: 100%;
  height: 1.64rem;
  border: 1px solid #b3b3b3;
  border-radius: .1rem;
  resize: none;
  font-size: .28rem;
  color: #333333;
  margin-top: .18rem;
  padding: .1rem 0 0 .05rem;
  display: block;
}

.fourFactorAuthentication-div .sureButt {
  width: 100%;
  height: .8rem;
  line-height: .8rem;
  text-align: center;
  background-image: linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%);
  border-radius: 10px;
  font-size: .34rem;
  color: #ffffff;
  margin-top: .6rem;
}

.fourFactorAuthentication-div .tip-div {
  width: 100%;
  margin-top: .35rem;
  font-size: .24rem;
  color: #999999;
  text-align: left;
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

.fourFactorAuthentication-div .input-bank {
  width: 100%;
}






/* 认证弹框 */

.rzTip {
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(51, 51, 51, .7);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.rzTip div {
  width: 92%;
  height: 5.27rem;
  position: absolute;
  background: #fff;
  top: 2.36rem;
  left: 4%;
  border-radius: 10px;
}

.rzTip div .rzTitle {
  width: 100%;
  height: .56rem;
  font-size: .40rem;
  color: #333333;
  text-align: center;
  margin: .91rem 0 .82rem 0;
}

.rzTip div .rzInfo {
  width: 88%;
  height: 1.44rem;
  font-size: .34rem;
  color: #666666;
  text-align: center;
  line-height: 2;
  margin-left: .42rem;
  margin-bottom: .33rem;
}

.rzTip div .rzSure {
  width: 88%;
  height: .8rem;
  font-size: .34rem;
  color: #fff;
  text-align: center;
  line-height: .8rem;
  background-image: linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%);
  border-radius: 10px;
  margin-left: .42rem;
}

.rzTip img {
  width: .6rem;
  height: .6rem;
  position: absolute;
  left: 50%;
  margin-left: -.3rem;
  bottom: 4.6rem;
}

.header {
  background: #ffffff;
  box-shadow: 0 0.02rem 0.34rem 0 rgba(39, 52, 125, 0.25);
  width: 100%;
  height: 1.77rem;
  padding: 0 0.3rem;
}

.header .header-item {
  height: .85rem;
  line-height: .85rem;
  text-align: left;
  font-size: .28rem;
  color: #333333;
  position: relative;
  /*border-bottom: 1px solid #a2b9f1;*/
}

.header .header-item:last-child {
  border: none;
}

.header .left {
  width: 50%;
  float: left;
  text-align: left;
}

.header .right {
  width: 50%;
  float: right;
  text-align: left;
}

.header .header-item-mobile {
  text-align: center;
  color: #999999;
}

.fourFactorAuthentication-div .close {
  display: inline-block;
  background: url(/static/images/close.png) no-repeat left;
  background-size: 0.3rem;
  width: 0.3rem;
  height: 0.3rem;
  float: left;
  position: absolute;
  top: 0.3rem;
  right: 0.2rem;
}

.rzsb-tip {
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(51, 51, 51, .7);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.rzsb-tip div {
  height: 3rem;
  top: 4rem;
  width: 92%;
  position: absolute;
  background: #fff;
  left: 4%;
  border-radius: 10px;
}

.rzsb-tip .rzsb-info {
  width: 88%;
  height: 1rem;
  font-size: .34rem;
  color: #666;
  text-align: center;
  line-height: 2;
  margin-left: .42rem;
  margin-bottom: .33rem;
  margin-top: 0.5rem;
}

.rzsb-tip .rzsb-sure {
  background-image: linear-gradient(216deg, #59d3f2 7%, #2da8e1);
  color: #fff;
  height: .8rem;
  height: .8rem;
  font-size: .34rem;
  line-height: .8rem;
  text-align: center;
  border-radius: 10px;
  margin: 0 0.2rem;
  float: left;
  margin: 0 0.3rem 0 0.3rem;
  width: 90%;
}

</style>
