<!-- 支付签约 -->
<template>
  <div class="pay-contract">
    <div class="container">
      <div class="top">
        按三方支付要求，需要您对以下银行卡进行支付签约，验证码将发送至您的银行预留手机号
      </div>
      <div class="center">
        <ul class="list-ul">
          <li class="list-item">
            <div class="left">
              <!-- <span class="icon">*</span> -->
              <img :src="iconUrl" alt="" class="icon">
              <span class="font-size28">{{bankName}}</span> 
              (<span class="font-size28">{{showCardNo}}</span>)
            </div>
            <!-- <div class="right">
              单笔{{showDayPayment}}万; 单日{{shwoSumPayment}}万
            </div> -->
          </li>
          <li class="list-item font-size28">
            银行预留手机号: {{newMobile}}
          </li>
        </ul>
      </div>
      <div class="bottom">
        <span class="font-size28">短信验证码</span>
        <input type="test" placeholder="请输入验证码" v-model="checkCode">
        <!-- <span class="mobile-msg" @click="prePaySign">{{mobileMsg}}</span> -->
        <span class="close" @click="clearHight" v-show="checkCode.length"></span>
        <span class="mobile-code font-size24" v-show="show" @click="prePaySign">
              获取验证码
        </span>
        <span class="mobile-code" v-show="daoShow">
          {{count}}秒
        </span>
        <span class="mobile-code" v-show="reShow" @click="prePaySign">
          重新获取
        </span>
      </div>
      <div class="submit-btn" @click="submit">
        签订
      </div>
    </div>
    <!-- 弹框 -->
    <div class="tip" v-show="tipShow" @click="tipShow=false">
      <span>{{alertText}}</span>
    </div>
  </div>
</template>
<script>
import { Indicator } from 'mint-ui';
export default {

  data() {
    return {
      mobileMsg: '获取验证码',
      id: '', // id
      bankCode: '', // 银行 code
      bankName: '', // 银行 Name
      binNums: '', // 银行卡 bin 数组
      iconUrl: '', // 银行图标URL
      dayLimitPayment: '', // 单笔日收款限额
      showDayPayment: '',
      sumDayLimitPayment: '', // 单日收款限额
      shwoSumPayment: '',
      accountCode: '', // 
      showCardNo: '', // 显示的银行卡尾号
      newMobile: '', // 显示的 mobile
      count: 60,
      tipShow: false,
      alertText: '',
      show: true,
      reShow: false,
      daoShow: false,
      count: '',
      timer: null,
      orderNo: '', // 订单号
      signFlag:'',//是否签约标识
      checkCode: '',
      payObj: '',
      signNo:''
    }
  },
  mounted() {
    console.log(1233)
    this.show = true;
    this.reShow = false;
    this.daoShow = false;
    this.bankName = this.$route.params.bankName;
    this.bankCardNo = this.$route.params.bankCardNo;
    this.showCardNo = (this.bankCardNo + '').substr(-4, 4);
    this.iconUrl = this.$route.params.iconUrl;
    console.log(this.iconUrl)
    this.payObj = JSON.parse(localStorage.getItem('payObj'));


    // 单笔每日收款限额(元)
    this.dayLimitPayment = this.$route.params.dayLimitPayment;
    this.showDayPayment = this.dayLimitPayment / 10000;
    // 单日收款限额(元)
    this.sumDayLimitPayment = this.$route.params.sumDayLimitPayment;
    this.shwoSumPayment = this.sumDayLimitPayment / 10000;

    if (!this.bankName || !this.bankCardNo || !this.iconUrl || !this.dayLimitPayment || !this.sumDayLimitPayment) {
      console.log(this.bankName)
      console.log(this.bankCardNo)
      console.log(this.iconUrl)
      console.log(this.dayLimitPayment)
      console.log(this.sumDayLimitPayment)
      // this.$router.go(-1);

    }
    this.accountCode = localStorage.getItem('bankCardNo');
    this.custNo = localStorage.getItem('custNo');
    this.accountName = localStorage.getItem('custName');
    this.certCode = localStorage.getItem('certCode');
    // this.phone = localStorage.getItem('mobile');
    //手机号打码
    this.mobile = localStorage.getItem('mobile');
    this.newMobile = this.mobile.replace(this.mobile.slice(3, 7), '****');
  },
  methods: {
    clearHight: function() {
      console.log('清空 最高还款额')
      this.checkCode = '';
    },
    // 预签约 (获取短信验证码)
    prePaySign: function() {
      Indicator.open();
      this.post('/contPay/prePaySign', {
        accountName: this.accountName, // 客户姓名
        // accountName: "韩梅梅",
        certCode: this.certCode, //证件号码
        // certCode: "210302196001012114",
        accountCode: this.accountCode, // 银行卡号
        // accountCode: "6214242710498509",
        custNo: this.custNo, //客户编号
        // custNo:'sbvtPBpBpa9bjIi3LPp2DHi3JGEu6fo2As24',
        phone: this.mobile, //手机号码
        // phone: "13220482188"
      }).then(res => {
        Indicator.close();
        if (res.data.code == '100000') {
          if(res.data.data.orderNo){
            this.orderNo = res.data.data.orderNo;
          }else{
            this.orderNo = '';
          };
          
          this.signFlag = res.data.data.signFlag;
          //成功
          const TIME_COUNT = 120;
          if (!this.timer) {
            console.log(TIME_COUNT)
            this.count = TIME_COUNT;
            this.reShow = false;
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
          // return;
        }
        if (res.data.status == false && res.data.code != '100000') {
          //失败
          var sel = this;
          this.alertText = res.data.msg;
          this.tipShow = true;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        };
        if ((res.data.status == false && res.data.code == '101002') || (res.data.status == false && res.data.code == '101004')) {
          //失败
          this.imgcode = '';
          var sel = this;
          this.tipShow = true;
          this.alertText = '图片验证码错误，请重新输入';
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        };
      })
    },
    // 签约
    submit: function() {
      console.log('提交签约信息');
      /*if(!this.orderNo){
        var sel = this;
          this.alertText = '请获取验证码';
          this.tipShow = true;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
      }*/
      Indicator.open();
      this.post('/contPay/paySign', {
        checkCode: this.checkCode, // 短信验证码
        orderNo: this.orderNo, // 订单号
        signFlag:this.signFlag,//是否签约标识 0-否 1-是
        mobile:this.mobile//手机号
      }).then(res => {
        Indicator.close();
        if (res.data.code == '100000') {
          if(res.data.data){
            this.signNo = res.data.data.signNo;
          }else{
            this.signNo = '';
          };
          this.modifySubAccount();
        } else {
          var sel = this;
          this.alertText = res.data.msg;
          this.tipShow = true;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })
    },
    // 调分户账
    modifySubAccount() {
      Indicator.open();
      this.post('/bankCardChange/modifySubAccount', {
        idNum: this.payObj.idNum,
        userName: this.payObj.userName,
        cardNo: this.payObj.bankCardNo,
        mobile:this.mobile,
        cityCode: this.payObj.cityCode,
        cityName: this.payObj.cityName,
        bankCode: this.payObj.bankCode,
        bankName: this.payObj.bankName,
        branchName: this.payObj.branchName,
        flag: this.payObj.pcFlag,
        callBackId: this.payObj.callBackId,
        signNo:this.signNo
      }).then(res => {
        Indicator.close();
        if (res.data.code == '100000') {
          var sel = this;
          this.alertText = '恭喜您，银行卡信息变更成功！';
          this.tipShow = true;
          setTimeout(function() { 
            sel.tipShow = false; 
            sel.$router.push('/mine')
          }, 3000);
          return;
        } else {
          var sel = this;
          this.alertText = res.data.msg;
          this.tipShow = true;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })
    },
  }

}

</script>
<style scoped>
.pay-contract {
  width: 100%;
  height: 100%;
  background: #fff;
}

.pay-contract .container {
  padding-top: 0.66rem;
}

.pay-contract .container .top {
  font-family: PingFangSC-Regular;
  font-size: 0.28rem;
  color: #666666;
  text-align: center;
  margin-bottom: 0.4rem;
  padding-left: 0.34rem;
  padding-right: 0.34rem;
}

.pay-contract .container .center {
  background: #ffffff;
  box-shadow: 0 0 0.19rem 0 rgba(39, 52, 125, 0.25);
  height: 1.88rem;
  padding-left: 0.34rem;
  padding-right: 0.34rem;
}

.pay-contract .container .center .list-ul {
  width: 100%;
  height: 100%;
}

.pay-contract .container .center .list-ul .list-item {
  width: 100%;
  height: 0.99rem;
  line-height: 0.99rem;
  text-align: left;
  /*border-bottom: 1px solid #a2b9f1;*/
}

.pay-contract .container .center .list-ul .list-item:nth-of-type(2) {
  border-bottom: none;
}

.left,
.right {
  width: 50%;
  height: 100%;
  float: left;
  line-height: 0.99rem;
}

.right {
  font-family: PingFangSC-Regular;
  font-size: 0.26rem;
  color: #a0a3b8;
  text-align: left;
}

.pay-contract .container .bottom {
  margin-left: 0.34rem;
  margin-right: 0.34rem;
  width: calc( 100% - 0.68rem);
  height: 0.99rem;
  float: left;
  line-height: 0.99rem;
  border-bottom: 1px solid #c2c2c2;
  position: relative;
}

.pay-contract .container .bottom span {
  display: inline-block;
  float: left;
  height: 100%;
  line-height: 0.99rem;
}

.pay-contract .container .bottom input {
  display: inline-block;
  float: left;
  height: 0.99rem;
  line-height: 0.99rem;
  background: none;
  margin-left: 0.2rem;
  font-size: 0.28rem;
}

.pay-contract .container .bottom .mobile-code {
  background: #c8a986;
  border-radius: 0.1rem;
  width: 1.8rem;
  height: 0.5rem;
  color: #fff;
  display: inline-block;
  line-height: 0.5rem;
  vertical-align: middle;
  position: absolute;
  top: 0.3rem;
  right: 0rem;
}

.submit-btn {
  background-image: linear-gradient(-216deg, #59d3f2 7%, #2da8e1 100%);
  border-radius: 10px;
  width: calc( 100% - 0.68rem);
  height: 0.8rem;
  float: left;
  margin-top: 0.3rem;
  margin-left: 0.34rem;
  margin-right: 0.34rem;
  color: #fff;
  line-height: 0.8rem;
  font-size: 0.34rem;
}

.btn-active {
  background-image: linear-gradient(-216deg, #59d3f2 7%, #2da8e1 100%);
}

.btn-normal {}

.icon {
  width: 0.62rem;
  height: 0.62rem;
  line-height: 100%;
  display: inline-block;
  vertical-align: middle;
}


.pay-contract .close {
  display: inline-block;
  background: url(/static/images/close.png) no-repeat left;
  background-size: 0.3rem;
  width: 0.3rem;
  height: 0.3rem;
  float: left;
  position: absolute;
  top: 0rem;
  right: 2rem;
  line-height: none;
}

</style>
