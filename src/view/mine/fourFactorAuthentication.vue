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
        <li @click="goSearch('kaihuhang')">
          <input type="text" placeholder="请选择开户行名称" disabled="disabled" v-model="bankName">
          <img src="/static/images/more_arrow@2x.png">
        </li>
        <li>
          <input class="input-bank" type="text" placeholder="请输入银行卡号" v-model="bankCardNo" @blur="checkCarNo">
          <span class="close" @click="clearHight" v-show="bankCardNo.length"></span>
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
      cityCode: '', // 开户所在城市代码 
      cityName: '', // 开户所在城市名称 
      bankCode: '', // 开户行代码  
      bankName: '', // 开户行名称  
      branchName: '', // 分/支行名称 
      operType: '', // 操作类型 1:四要素认证 2:四要素变更
      yuserName: '', //未加密的字段 姓名
      yidNum: '', //未加密的字段 银行卡
      newMobile: '', //未加密的字段 手机号
      bankCardNo: '', // 登录返回的银行卡号
      certCode: '', // 身份证号码
      pcFlag: '', // 变更返回的 pc 更新标志
      callBackId: '', // 银行卡校验信息ID
      iconUrl: '', // 银行图标url
      binNums: '', // 卡 bin 校验
      dayLimitPayment: '', // 单笔每日收款限额
      sumDayLimitPayment: '', // 单日收款限额
      tempBankCardNo: '',
      tempBranchName: '',
      tempCityName: '',
      tempBankName: '',
      signNo: '', // 签约协议号
    }
  },
  mounted() {

    // 银行卡号  bankCardNo
    this.bankCardNo = localStorage.getItem('bankCardNo');
    // this.cardNo = this.bankCardNo;
    // 客户编号
    this.uid = localStorage.getItem('custId');

    // 登录信息
    var loginInformation = JSON.parse(localStorage.getItem('loginInformation')).sysCust;
    this.uid = localStorage.getItem('custId');
    //姓名打码
    this.yuserName = localStorage.getItem('custName');
    this.userName = this.yuserName.replace(this.yuserName.slice(0, 1), '*');
    //身份证号码
    this.yidNum = localStorage.getItem('certCode');
    this.certCode = localStorage.getItem('certCode');
    var xingLen = this.yidNum.slice(6, -4);
    var ss = '';
    for (var i = 0; i < xingLen.length; i++) {
      ss = ss + '*';
    }
    this.idNum = this.yidNum.replace(xingLen, ss);
    //手机号打码
    this.mobile = localStorage.getItem('mobile');
    this.newMobile = this.mobile.replace(this.mobile.slice(3, 7), '****');

    // 选择银行 城市
    this.clear = localStorage.getItem('from');
    console.log('fromfromfromfrom', this.clear);
    if (this.clear != 'back') {
      this.bankCardNo = localStorage.getItem('bankCardNo')
      // 先请求四要素认证信息
      this.getBankInfo();
    }

    if (this.clear == 'back') {
      this.bankObj = JSON.parse(localStorage.getItem('bankObj'));
      this.cityObj = JSON.parse(localStorage.getItem('cityObj'));
      this.bankCardNo = localStorage.getItem('bankCardNo')

      console.log('bank == ', !!this.bankObj)
      console.log('city == ', !!this.cityObj)
      // return;
      // 银行卡号
      if (!!this.bankObj) {
        console.log('bankObj.bankName')
        this.bankName = this.bankObj.bankName;
        this.bankCode = this.bankObj.bankCode;
      };
      if (!!this.cityObj) {
        console.log('cityObj.cityName')
        this.cityName = this.cityObj.cityName;
        this.cityCode = this.cityObj.cityCode;
      };
    }
    // 银行信息
    if (this.bankName) {
      this.getSmBankList();
    }
  },
  methods: {
    clearHight: function() {
      console.log('清空 最高还款额')
      this.bankCardNo = '';
    },
    getSmBankList: function() {
      this.post('/bank/getBaseBankList', {
        escrowagency: '04',
        bankName: this.bankName,
        pageParam: {
          numPerPage: 10,
          pageNum: 1
        }
      }).then(res => {
        console.log(res);
        if (res.data.code == '100000') {

          this.bankCode = res.data.data.recordList[0].bankCode;
          // 银行图标 URL
          this.iconUrl = res.data.data.recordList[0].iconUrl;
          // 银行卡 bin 数组
          this.binNums = res.data.data.recordList[0].bins;
          // 每笔日收款限额
          this.dayLimitPayment = res.data.data.recordList[0].dayLimitPayment;
          // 单日收款限额
          this.sumDayLimitPayment = res.data.data.recordList[0].sumDayLimitPayment;
        }
      })
    },
    getBankInfo() {
      this.post('/account/getBankVerifyNew', {
        cardNo: this.bankCardNo,
        idNum: this.yidNum
      }).then(res => {
        if (res.data.code) {
          console.log(res)
          if (res.data.code == '100000') {
            if (res.data.data) {

              // 银行卡号
              this.bankCardNo = res.data.data.bankCardNo;
              this.tempBankCardNo = res.data.data.bankCardNo;
              // 开户行代码
              this.bankCode = res.data.data.bankCode;
              // 开户行名称 
              this.bankName = res.data.data.bankName;
              this.tempBankName = res.data.data.bankName;
              // 分/支行名称
              this.branchName = res.data.data.branchName;
              // this.tempBranchName = res.data.data.branchName;
              // 城市code
              this.cityCode = res.data.data.cityCode;
              // 城市名称
              this.cityName = res.data.data.cityName;
              // this.tempCityName = res.data.data.cityName;
              // 客户端类型
              this.clientType = res.data.data.clientType;
              // 银行信息
              if (this.bankName) {
                this.getSmBankList();
              }
            } else {
              this.bankCardNo = '';
              var sel = this;
              this.alertText = '数据为空,请重试!';
              this.tipShow = true;
              setTimeout(function() { sel.tipShow = false; }, 3000);
              return;
            }
          }
        }
      })
    },
    goSearch(flag) {
      // 存银行卡号
      localStorage.setItem('bankCardNo', this.bankCardNo);
      this.cityObj = {
        cityCode: this.cityCode,
        cityName: this.cityName,
        escrowagency: '',
        id: '',
      }
      this.bankObj = {
        bankCode: this.bankCode,
        bankName: this.bankName,
        escrowagency: '',
        id: '',
      }
      localStorage.setItem("cityObj", JSON.stringify(this.cityObj));
      localStorage.setItem("bankObj", JSON.stringify(this.bankObj));
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
      if (this.bankCardNo) {
        if (!reg.test(this.bankCardNo)) {
          var sel = this;
          this.alertText = '请输入正确的银行卡号';
          this.bankCardNo = '';
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
      if (!this.bankCardNo && this.bankCardNo != null) {
        var sel = this;
        this.alertText = '请输入正确的银行卡号';
        this.tipShow = true;
        setTimeout(function() { sel.tipShow = false; }, 3000);
        return;
      };
      // 校验 银行卡 bin
      console.log(this.bankCardNo.substr(0, 6))
      console.log(this.binNums)
      // console.log(this.bankCardNo.substr(0,6) in this.binNums)
      if (this.binNums) {
        var result = this.binNums.some(item => {
          console.log(item.bin, this.bankCardNo.substr(0, 6))
          console.log(item.bin == this.bankCardNo.substr(0, 6));
          return item.bin == this.bankCardNo.substr(0, 6);
        })
        console.log(result)
        if (!result) {
          var sel = this;
          this.alertText = '请输入正确的银行卡号';
          this.tipShow = true;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      }

      if (!this.cityName) {
        var sel = this;
        this.alertText = '请选择开户行所在城市名称';
        this.tipShow = true;
        setTimeout(function() { sel.tipShow = false; }, 3000);
        return;
      };

      if (
        this.tempBankCardNo == this.bankCardNo &&
        this.tempBankName == this.bankName
      ) {
        var sel = this;
        this.alertText = '此卡已认证，请勿重复认证';
        this.tipShow = true;
        setTimeout(function() { sel.tipShow = false; }, 3000);
        return;
      }
      Indicator.open();
      console.log("0000");
      this.post('/bankCardChange/ifAllowChangeCard', {
        certCode: this.certCode,
        cardNo: this.bankCode
      }).then(res => {
        console.log(res);
        Indicator.close();
        if (res.data.code == '100000') {
          localStorage.setItem('custNo', res.data.data.custNo)
          if (res.data.data.isAllow == 'false') {
            var sel = this;
            // this.alertText = res.data.data.msg;
            this.alertText = '尊敬的客户，您有正在处理中的业务，请稍后再进行变更操作，如有疑问请联系您的专属客户经理。';
            this.tipShow = true;
            setTimeout(function() {
              sel.tipShow = false;
              // 接口调用成功
              localStorage.removeItem('bankObj');
              localStorage.removeItem('cityObj');
            }, 3000);
            return;
          }
          // isAllow == true
          if (res.data.data.type == '09') {
            this.bankCardVerify('09'); // 09 变更,不支付签约
          }
          // else if (res.data.data.type == '10') {
          //   var sel = this;
          //   this.alertText = '尊敬的客户，您有正在处理中的业务，请稍后再进行变更操作，如有疑问请联系您的专属客户经理。';
          //   this.tipShow = true;
          //   setTimeout(function() { sel.tipShow = false; }, 3000);
          //   return;
          // } 
          else if (res.data.data.type == '10' || res.data.data.type == '11') {
            this.bankCardVerify('11');
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
    // 调分户账
    modifySubAccount() {
      this.post('/bankCardChange/modifySubAccount', {
        idNum: this.yidNum,
        userName: this.yuserName,
        cardNo: this.bankCardNo,
        mobile: this.mobile,
        cityCode: this.cityCode,
        cityName: this.cityName,
        bankCode: this.bankCode,
        bankName: this.bankName,
        branchName: this.branchName,
        flag: this.pcFlag,
        callBackId: this.callBackId,
        signNo: this.signNo
      }).then(res => {
        if (res.data.code == '100000') {
          var sel = this;
          this.tipShow = true;
          this.alertText = '恭喜您，四要素变更成功！';
          setTimeout(function() {
            sel.tipShow = false;
            sel.$router.push('/mine')
          }, 1500);
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
    // 四要素(银行卡变更)  /bankCardChange/bankCardVerify
    bankCardVerify(flag) {
      this.post('/bankCardChange/bankCardVerify', {
        uid: this.uid,
        userName: this.yuserName,
        idNum: this.yidNum,
        mobile: this.mobile,
        cardNo: this.bankCardNo,
        cityCode: this.cityCode,
        cityName: this.cityName,
        bankCode: this.bankCode,
        bankName: this.bankName,
        branchName: this.branchName,
        operType: '2', // 1:四要素认证  , 2:四要素变更
      }).then(res => {
        console.log(res)
        // return
        if (res.data.code == '100000') {

          this.pcFlag = res.data.data.flag; // PC 分户账标识
          this.callBackId = res.data.data.callbackId; // 四银行校验信息 ID
          //认证成功
          if (res.data.data.bankCardVerify == '0') {
            // this.$router.push('/payContract');
            // var sel = this;
            // this.alertText = '恭喜您，银行卡信息认证成功！';
            // this.tipShow = true;
            // setTimeout(function() { sel.tipShow = false; }, 1500);
            // return;
            localStorage.setItem('bankCardNo', res.data.data.cardNo)
            if (flag == '09') {
              var sel = this;
              this.alertText = '恭喜您，四要素变更成功！';
              this.tipShow = true;
              setTimeout(function() {
                sel.tipShow = false;
                sel.$router.push('/mine');
              }, 1500);
              // return;

            } else if (flag == '11') {
              // 更改成功 , 调  判断签约状态
              this.paySignStateQuery();
            }
          };
          //认证失败
          if (res.data.data.bankCardVerify == '1') {
            this.rzTipShow = true;
            // var sel = this;
            // this.alertText = '您当前输入银行卡号与实名认证信息不符，核实后请重新输入！';
            // this.tipShow = true;
            // setTimeout(function() { sel.tipShow = false; }, 1500);
            // return;
          };
          //认证中
          if (res.data.data.bankCardVerify == '2') {
            // this.$router.push('/siyaosuWait');
            var sel = this;
            this.alertText = '认证中，请耐心等待！';
            this.tipShow = true;
            setTimeout(function() { sel.tipShow = false; }, 1500);
            return;
          };
        } else {
          var sel = this;
          this.alertText = res.data.msg;
          this.tipShow = true;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })
    },
    // 融宝支付签约状态查询接口
    paySignStateQuery() {
      var payObj = {
              idNum: this.yidNum,
              userName: this.yuserName,
              bankCardNo: this.bankCardNo,
              cityCode: this.cityCode,
              cityName: this.cityName,
              bankCode: this.bankCode,
              bankName: this.bankName,
              branchName: this.branchName,
              flag: this.pcFlag,
              callBackId: this.callBackId,
            }
            localStorage.setItem('payObj', JSON.stringify(payObj));

            this.$router.push({
              name: 'payContract',
              params: {
                bankName: this.bankName, // 银行名称
                bankCardNo: this.bankCardNo, // 银行卡号
                iconUrl: this.iconUrl, // 银行卡图标
                dayLimitPayment: this.dayLimitPayment, // 单笔每日收款限额(元)
                sumDayLimitPayment: this.sumDayLimitPayment, // 单日收款限额(元)
              }
            });


      /*this.post('/contPay/paySignStateQuery', {
        certCode: this.certCode,
        bankCardNo: this.bankCardNo,
        mobile: this.mobile,
        signNo: this.signNo,
      }).then(res => {
        if (res.data.code == '100000') {
          // 签约协议号
          this.signNo = res.data.data.signNo;
          if (res.data.data.signStatus == '1') {
            // 1 正常  调变更分户账
            this.modifySubAccount();
          } else if (res.data.data.signStatus == '0' || res.data.data.signStatus == '2') {
            // 未签约 调 签约
            // 这里需要 拿到
            // var payInfo = {
            //   bankName: this.bankName,
            //   bankCode: this.bankCode,
            //   bankCardNo: this.bankCardNo, // 银行卡号
            // }

            var payObj = {
              idNum: this.yidNum,
              userName: this.yuserName,
              bankCardNo: this.bankCardNo,
              cityCode: this.cityCode,
              cityName: this.cityName,
              bankCode: this.bankCode,
              bankName: this.bankName,
              branchName: this.branchName,
              flag: this.pcFlag,
              callBackId: this.callBackId,
            }
            localStorage.setItem('payObj', JSON.stringify(payObj));
            console.log(this.bankName);
            if (!this.bankName) {
              // alert('bankName 为空')
              // var sel = this;
              // this.alertText = 'bankName 为空';
              // this.tipShow = true;
              // setTimeout(function() { sel.tipShow = false; }, 3000);
              // return;
              this.getSmBankList();
              // return;
            }

            console.log(this.bankCardNo);
            if (!this.bankCardNo) {
              // alert('bankCardNo 为空')
              // var sel = this;
              // this.alertText = 'bankCardNo 为空';
              // this.tipShow = true;
              // setTimeout(function() { sel.tipShow = false; }, 3000);
              // return;
              this.getSmBankList();
              // return;
            }
            console.log(this.iconUrl);
            if (!this.iconUrl) {
              // alert('iconUrl 为空')
              // var sel = this;
              // this.alertText = 'iconUrl 为空';
              // this.tipShow = true;
              // setTimeout(function() { sel.tipShow = false; }, 3000);
              // return;
              this.getSmBankList();
              // return;
            }
            console.log(this.dayLimitPayment);
            if (!this.dayLimitPayment) {
              // alert('dayLimitPayment 为空')
              // var sel = this;
              // this.alertText = 'dayLimitPayment 为空';
              // this.tipShow = true;
              // setTimeout(function() { sel.tipShow = false; }, 3000);
              // return;
              this.getSmBankList();
              // return;
            }
            console.log(this.sumDayLimitPayment)
            if (!this.sumDayLimitPayment) {
              // alert('sumDayLimitPayment 为空')
              // var sel = this;
              // this.alertText = 'sumDayLimitPayment 为空';
              // this.tipShow = true;
              // setTimeout(function() { sel.tipShow = false; }, 3000);
              // return;
              this.getSmBankList();
              // return;
            }

            this.$router.push({
              name: 'payContract',
              params: {
                bankName: this.bankName, // 银行名称
                bankCardNo: this.bankCardNo, // 银行卡号
                iconUrl: this.iconUrl, // 银行卡图标
                dayLimitPayment: this.dayLimitPayment, // 单笔每日收款限额(元)
                sumDayLimitPayment: this.sumDayLimitPayment, // 单日收款限额(元)
              }
            });
          }
        } else {
          var sel = this;
          this.alertText = res.data.msg;
          this.tipShow = true;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })*/
    }
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


.fourFactorAuthentication-div .left {
  width: 50%;
  float: left;
  text-align: left;
}

.fourFactorAuthentication-div .right {
  width: 50%;
  float: right;
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
  /*top: 4rem;*/
  /*height: 3rem;*/
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
  margin-top: 0.5rem;
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

</style>
