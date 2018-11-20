<template>
  <div class="mine-container ">
    <div class="min-container-page">
      <!-- 头部区域 -->
      <div class="mine-header">
        <div class="mine-icon">
          <div class="mine-title">
            <img src="/static/images/mine_logo.png">
            <div class="min-account" v-show="custName">{{custName}}</div>
            <div class="min-account" v-show="!custName">未实名</div>
            <!-- <div class="min-account" v-show="mobile">{{mobileStart}}****{{mobileEnd}}</div> -->
          </div>
        </div>
      </div>
      <!-- 内容区域 -->
      <ul class="mine-content">
        <li class="mine-content-item" v-show="mobile" @click="changeMobile">
          <span class="mine-content-item-icon"></span> 手机号
          <span class="font-size24 server-phone">{{mobileStart}}****{{mobileEnd}}</span>
        </li>
        <li class="mine-content-item" @click="changeBankCard" v-show="bankShow">
          <span class="mine-content-item-icon"></span> 银行卡
          <span class="font-size24 server-phone">{{tempBankCardNo}}</span>
        </li>
        <li class="mine-content-item" @click="changePwd">
          <span class="mine-content-item-icon"></span> 修改密码
        </li>
        <li class="mine-content-item" @click="bugQuestion">
          <span class="mine-content-item-icon"></span> 疑难解答
        </li>
        <li class="mine-content-item" @click="feedBack" v-show="true">
          <span class="mine-content-item-icon"></span> 意见反馈
        </li>
        <li class="mine-content-item" href="tel:400-010-6886">
          <a href="tel:400-010-6886" class="server-phone-a font-size28">
            <span class="mine-content-item-icon"></span>
            客服中心
            <span class="font-color-2DA8E1 font-size24 server-phone">400-010-6886</span>
          </a>
        </li>
        <li class="mine-content-item" @click="aboutUs">
          <span class="mine-content-item-icon"></span> 关于我们
          <span class="server-phone font-size24">普惠1.0.0</span>
        </li>
      </ul>
      <!-- 退出登录 -->
      <ul class="mine-content sign-out">
        <li class="mine-content-item sign-out font-color-2DA8E1 font-size34" @click="isSignOut">退出登录</li>
      </ul>
    </div>
    <Tabbar></Tabbar>
    <!-- 弹框 -->
    <div class="tip" v-show="tipShow" @click="tipShow=false">
      <!-- <p> -->
      <span>{{alentText}}</span>
      <!-- </p> -->
    </div>
    <!-- 检查实名认证弹框 -->
    <div class="rzsbTip" v-show="rzSbShow">
      <div>
        <p class="rzsbInfo">{{statusText}}</p>
        <p class="rzsbSure">
          <button @click="rzSbShow=false">取消</button>
          <button @click="goRealName">确定</button>
        </p>
        <!-- <img src="/static/images/tip-close.png" @click="rzSbShow=false"> -->
      </div>
    </div>
    <div class="rzTip" v-show="rzTipShow">
      <div>
        <p class="rzTitle">信息不符</p>
        <p class="rzInfo">您当前输入银行卡号与实名认证信息不符，核实后请重新输入！</p>
        <p class="rzSure" @click="goChangeBankCard">确定</p>
      </div>
    </div>
<!--     <div class="rzsb-tip" v-show="rzsbTipShow">
      <div>
        <p class="rzsb-info">认证失败, 请重新认证!</p>
        <p class="rzsb-sure" @click="goChangeBankCard">确定</p>
      </div>
    </div> -->
    <div class="rzsbTip" v-show="rzsbTipShow">
      <div>
        <p class="rzsbInfo">认证失败, 请重新认证!</p>
        <p class="rzsbSure">
          <button @click="rzsbTipShow=false">取消</button>
          <button @click="goChangeBankCard">重新认证</button>
        </p>
      </div>
    </div>
    <!-- 退出登录 -->
    <div class="rzsbTip" v-show="singOutShow">
      <div>
        <p class="rzsbInfo">{{statusText}}</p>
        <p class="rzsbSure">
          <button @click="singOutShow=false">取消</button>
          <button @click="signOut">确定</button>
        </p>
        <!-- <img src="/static/images/tip-close.png" @click="rzSbShow=false"> -->
      </div>
    </div>
  </div>
</template>
<script>
import Tabbar from './tabbar'
import * as types from '../store/types'
import { Indicator } from 'mint-ui';
export default {
  name: 'mine',
  data() {
    return {
      msg: 'mine',
      alentText: '',
      tipShow: false, // 弹窗
      custName: '', // 登录人
      mobile: '', // 手机号
      mobileStart: '',
      mobileEnd: '',
      isPassVerify: '', //是否实名认证  0是1否
      custId: '', //
      rzTipShow: false,
      rzSbShow: false,
      rzsbTipShow: false,
      statusText: '',
      bankShow: false, // 银行卡
      bankStart: '',
      bankEnd: '',
      bankCardNo: '',
      certCode: '', // 证件号码
      tempBankCardNo: '', // 页面显示的银行卡号
      singOutShow:false, // 退出登录
    }
  },
  components: {
    Tabbar
  },
  mounted() {
    this.custId = localStorage.getItem('custId');

    localStorage.removeItem('bankObj')
    localStorage.removeItem('cityObj')
    localStorage.removeItem('fourcertCode')
    localStorage.removeItem('from')
    localStorage.removeItem('payObj')

    localStorage.getItem('mobile') == 'undefined' ? this.mobile = '' : this.mobile = localStorage.getItem('mobile');
    this.mobile == 'undefined' ? '' : this.mobile;
    this.mobileStart = this.mobile.substr(0, 3);
    this.mobileEnd = this.mobile.substr(-4, 4);

    // this.tempBankCardNo = localStorage.getItem('bankCardNo');
    // console.log(this.tempBankCardNo)
    // if (this.tempBankCardNo != null) {
    //   if (this.tempBankCardNo != 'undefined') {

    //     this.bankShow = true;
    //     this.bankCardNo = localStorage.getItem('bankCardNo').replace(localStorage.getItem('bankCardNo').substr(6, 8), '********');
    //     console.log(this.bankCardNo, this.bankShow)
    //   }
    // } 

    localStorage.getItem('custName') == 'undefined' ? this.custName = '' : this.custName = localStorage.getItem('custName');
    localStorage.getItem('bank') == 'undefined' ? this.bank = '' : this.bank = localStorage.getItem('bank');

    // 身份证号码
    this.certCode = localStorage.getItem('certCode');

    this.getCertiInfo();
  },
  methods: {
    getCertiInfo() {
      this.post('/account/getCertiInfo', {
        custId: this.custId
      }).then(res => {
        if (res.data.code == '100000' && res.data.data.bankCardVerify == '0') {
          this.bankShow = true;
          this.bankCardNo = res.data.data.bankCardNo;
          // this.bankCardNo = this.bankCardNo.replace(this.bankCardNo.substr(6, 8), '********');
          this.tempBankCardNo = this.bankCardNo.substr(0, 6) + '********' + this.bankCardNo.substr(-4, 4);
        }
      })
    },
    //手机号码变更,
    changeMobile() {
      this.post('/account/getCertiInfo', { custId: this.custId })
        .then(res => {
          if (res.data.code == '100000') {
            this.isPassVerify = res.data.data.isPassVerify;
            if (this.isPassVerify == '0') {
              this.$router.push("/myAccount");
            } else if (this.isPassVerify == '1') {
              this.statusText = '您暂未进行实名认证，请前去认证！';
              this.rzSbShow = true;
              return;
            }
          }
        })
    },
    goRealName() {
      localStorage.setItem('jichuOrYewu', 'mine');
      this.$router.push('/realName');
    },
    // 修改银行卡号
    changeBankCard: function() {
      console.log('修改银行卡号');
      this.getBankVerifyResultNew();
    },
    goChangeBankCard: function() {
      this.$router.push('/changeBankCard')
    },
    // 查最新状态
    getBankVerifyResultNew: function() {
      this.post('/account/getBankVerifyResultNew', {
        idNum: this.certCode
      }).then(res => {
        if (res.data.code == '100000') {
          if (res.data.data.code == '0') {
            localStorage.setItem('bankCardNo',res.data.data.bankCardNo)
            this.$router.push('/changeBankCard')
          } else if (res.data.data.code == '1') { // 
            this.rzTipShow = true;
          } else if (res.data.data.code == '2') {
            // 认证中
            // 认证中，请耐心等待
            // 弹窗
            var sel = this;
            this.alentText = '认证中，请耐心等待';
            this.tipShow = true;
            setTimeout(function() { sel.tipShow = false; }, 3000);
            return;

          } else if (res.data.data.code == '4' || res.data.data.code == '5') {
            // var sel = this;
            // this.alentText = '认证失败, 请重新认证!';
            // this.tipShow = true;
            // setTimeout(function() { sel.tipShow = false; }, 3000);
            this.rzsbTipShow = true;
            return;
          } else {
            var sel = this;
            this.alentText = res.data.msg;
            this.tipShow = true;
            setTimeout(function() { sel.tipShow = false; }, 3000);
            return;
          }
        } else {
          var sel = this;
          this.alentText = res.data.msg;
          this.tipShow = true;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })
    },
    // 修改密码
    changePwd: function() {
      console.log('修改密码');
      this.$router.push('/changePassword')
    },
    bugQuestion: function() {
      console.log('疑难解答');
      this.$router.push('/bugQuestion')
    },
    // 意见反馈
    feedBack: function() {
      console.log('意见反馈');
      this.$router.push('/feedBack')
    },
    // 关于我们
    aboutUs: function() {
      console.log('关于我们');
      // this.$router.push('/aboutUs')

      // 这里切换 普惠官网 关于我们
      var aboutUsUrl = localStorage.getItem('aboutUsUrl');
      window.location.href = aboutUsUrl;
    },
    isSignOut:function(){
      this.statusText = '确定退出当前账号?'
      this.singOutShow = true;
    },
    // 退出登录
    signOut: function() {
      Indicator.open();
      console.log('退出登录');

      this.post('/account/logout', {})
        .then(res => {
          console.log(res);
          console.log(res.data.code)
          if (res.data.code == '100000') {
            Indicator.close();
            // 清空数据
            // localStorage.clear();
            // 因为 imei 要存本地,所以 localseStorage 数据需要手动清除
            this.$store.commit(types.LOGOUT)
            this.$router.push('/')
          } else {
            var sel = this;
            this.alentText = res.data.msg;
            this.tipShow = true;
            setTimeout(function() { sel.tipShow = false; }, 3000);
            this.$router.push('/')

          }
        })
    }
  }
}

</script>
<style scoped>
.mine-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  font-size: 0.2rem;
  background: #f6f6f6;
}


.min-container-page {
  width: 100%;
  height: 100%;
  margin-bottom: 1rem;
}

.mine-icon {
  width: 100%;
  height: 1.8rem;
  margin-bottom: 0.3rem;
  background: url(../../static/images/mine_bg_header.png);
  background-size: 100%;
}

.mine-title {
  width: 100%;
  margin: 0 auto;
  position: absolute;
  /*top: 4.5rem;*/
}

.mine-icon img {
  /*  width: 100%;
  height: 100%;*/
  width: 1rem;
  height: 1rem;
  margin-top: 0.4rem;
  margin-left: 0.4rem;
  float: left;
  pointer-events: none;
}




/* 账户-手机号 */

.min-account {
  /*position: relative;*/
  bottom: 1.5rem;
  font-size: 0.32rem;
  line-height: 1.8rem;
  margin-left: 0.3rem;
  float: left;
  color: #fff;
  font-size: 0.4rem;
}


/* 每项内容 */

.mine-content {
  background: #fff;
  padding: 0 0.3rem;
}

.mine-content-item {
  border-bottom: 0.5px solid #f6f6f6;
  height: 0.88rem;
  line-height: 0.88rem;
  text-align: left;
  font-size: 0.28rem;
  background: url(../../static/images/more_arrow@2x.png) no-repeat right;
  background-size: 0.15rem 0.24rem;
}

.mine-content-item-icon {
  display: inline-block;
  width: 0.36rem;
  height: 0.36rem;
  vertical-align: middle;
  line-height: 0.88rem;
  margin-right: 0.17rem;
}

.mine-content-item:nth-of-type(1) .mine-content-item-icon {
  background: url(../../static/images/mine_hone@2x.png) no-repeat center;
  background-size: 100%;
}

.mine-content-item:nth-of-type(2) .mine-content-item-icon {
  background: url(../../static/images/mine_bank@2x.png) no-repeat center;
  background-size: 100%;
}

.mine-content-item:nth-of-type(3) .mine-content-item-icon {
  background: url(../../static/images/mine_fixPWD@2x.png) no-repeat center;
  background-size: 100%;
}

.mine-content-item:nth-of-type(4) .mine-content-item-icon {
  background: url(../../static/images/mine_abloutUs@2x.png) no-repeat center;
  background-size: 100%;
}

.mine-content-item:nth-of-type(5) .mine-content-item-icon {
  background: url(../../static/images/mine_feedback@2x.png) no-repeat center;
  background-size: 100%;
}

.mine-content-item:nth-of-type(6) {
  background-image: none;
}

.mine-content-item:nth-of-type(6) .mine-content-item-icon {
  background: url(../../static/images/mine_hotLine@2x.png) no-repeat center;
  background-size: 100%;
}

.mine-content-item:nth-of-type(7) .mine-content-item-icon {
  background: url(../../static/images/mine_abloutUs@2x.png) no-repeat center;
  background-size: 100%;
}


/* 客服电话 */

.server-phone-a {
  width: 100%;
  height: 100%;
  display: inline-block;
}

.server-phone {
  float: right;
  margin-right: 0.5rem;
}

.sign-out {
  text-align: center;
  margin-top: 0.3rem;
  background-image: none;
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

.rzsbTip {
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

.rzsbTip div {
  width: 92%;
  height: 4rem;
  position: absolute;
  background: #fff;
  top: 2.36rem;
  left: 4%;
  border-radius: 10px;
}

.rzsbTip .rzsbInfo {
  width: 78%;
  height: .48rem;
  margin: 1.34rem 0 1.04rem .75rem;
  font-size: .34rem;
  color: #666666;
}

.rzsbTip .rzsbSure {
  width: 100%;
  height: .8rem;
}

.rzsbTip .rzsbSure button {
  width: 2.75rem;
  height: .8rem;
  font-size: .34rem;
  line-height: .8rem;
  text-align: center;
  border-radius: 10px;
}

.rzsbTip .rzsbSure button:nth-of-type(1) {
  float: left;
  border: 1px solid #5c5044;
  color: #5c5044;
  margin-left: .42rem;
  background: #fff;
}

.rzsbTip .rzsbSure button:nth-of-type(2) {
  float: right;
  background-image: linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%);
  color: #fff;
  margin-right: .38rem;
}

.rzsbTip img {
  width: .6rem;
  height: .6rem;
  margin-top: .84rem;
}


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

.rzsb-tip .rzsb-sure{
    background-image: linear-gradient(216deg,#59d3f2 7%,#2da8e1);
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
