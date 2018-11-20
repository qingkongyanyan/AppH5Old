<!-- 首页 -->
<template>
  <div class="home">
    <div class="home_page">
      <div class="home_page_header">
        <p>
          <img src="/static/images/mine_location@2x.png">
          <b-map-component></b-map-component>
          <!-- <label id="allmaps" style="width:.6rem;height:100%;">定位获取{{location}}</label> -->
        </p>
        <p>诺远</p>
        <p>
          <router-link to="creditStrategy">授信攻略</router-link>
        </p>
      </div>
      <div class="home-center">
        <div class="home-bg-icon">
        </div>
        <div class="home-bg-slogan">
        </div>
      </div>
      <p class="home_page_button">
        <!-- <router-link to="openPermissions" v-show="flag">立即授信</router-link>
        <router-link to="basicAuthentication" v-show="!flag">立即授信</router-link> -->
        <span class="add-credit" @click="addCredit">立即授信</span>
      </p>
    </div>
    <!-- 弹框 -->
    <div class="tip" v-show="tipShow" @click="tipShow=false">
      <span>{{alertText}}</span>
    </div>
    <!-- 实名认证OVR补录状态弹框 -->
    <div class="smTip" v-show="smTipShow">
      <div>
        <p class="smInfo">实名信息未完善，请您完善！</p>
        <p class="smSure">
          <button @click="smTipShow=false">取消</button>
          <button @click="goRealName">确定</button>
        </p>
      </div>
      <!-- <img src="/static/images/tip-close.png" @click="smTipShow=false"> -->
    </div>
    <Tabbar class="tab-bar"></Tabbar>
  </div>
</template>
<script>
import Tabbar from '../tabbar'
import BMapComponent from './bmap'
import { MessageBox } from 'mint-ui';

export default {
  data() {
    return {
      msg: 123,
      location: '',
      custName: '',
      certCode: '',
      mobile: '',
      isPassVerify: '',
      bankCardVerify: '',
      bankCardNo: '',
      isOcrVerify: '',
      isTdAuth: '',
      tdBlackBox: '',
      tdClientType: '',
      isAuthsocial: '',
      isAuthFund: '',
      fundAuthDate: '',
      socialAuthDate: '',
      isAuthCarrier: '',
      isAuthBank: '',
      carrierAuthDate: '',
      bankAuthDate: '',
      isAuthRong360: '',
      rong360AuthDate: '',
      token: '',
      search_id: '',
      account: '',
      flag: true, //是否开启权限
      tipShow: false,
      alertText: '',
      tempDataSource: '',
      smTipShow: false
    }
  },
  components: {
    Tabbar,
    BMapComponent
  },
  mounted() {
    localStorage.removeItem('addObj')
    this.flag = localStorage.getItem('location');
    console.log(this.flag);
    this.custName = localStorage.getItem('custName');
    this.custId = localStorage.getItem('custId');
    this.certCode = localStorage.getItem('certCode');
    this.mobile = localStorage.getItem('mobile');
    // 首页初始化
    // 忘记密码(设置密码)  短信验证码登录 注册
    this.initHomePage();
    // 获取用户认证信息
    this.getCertiInfo();
    // 查询是否授权
    if (this.certCode) {
      this.checkAuth(); //这里新用户 无银行卡 
    }
  },
  methods: {
    goRealName() {
      localStorage.setItem('jichuOrYewu', 'yewuyemian');
      this.$router.push('/realName');
    },
    checkAuthCreidt() {
      this.post('/authcredit/checkAuthCredit', {
        certCode: this.certCode,
        custName: this.custName,
        custId: this.custId
      }).then(res => {
        if (res.data.code == '100000') {
          this.$router.push('/addCredit')
        } else {
          var sel = this;
          //失败
          this.tipShow = true;
          this.alertText = res.data.msg;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })
    },
    // 获取授信列表
    getList: function() {
      this.post('/authcredit/getAuthCreditList', {
        custId: this.custId
      }).then(res => {
        console.log(res);
        if (res.data.code == '100000') {
          this.tempDataSource = res.data.data;
          for (let i = 0; i < this.tempDataSource.length; i++) {
            let item = this.tempDataSource[i];
            if (item.authCreditState == '0' || item.authCreditState == '1') {
              var sel = this;
              //失败
              this.tipShow = true;
              this.alertText = '尊敬的客户，由于您存在未完成的进件信息，不可重复进件，如有疑问请联系您的专属客户经理。';
              setTimeout(function() { sel.tipShow = false; }, 1000);
              return;
            }
            this.$router.push('/addCredit');
          }
        } else if (res.data.code == '10070004') {
          // 未找到相关内容
          this.msg = '您未发起有效的授权申请'
        }
      })
    },
    // 立即授信 需要判断实名
    addCredit: function() {
      console.log(this.isPassVerify);
      console.log(this.isOcrVerify);
      console.log(this.bankCardVerify);
      console.log(this.isTdAuth);
      console.log(this.isAuthCarrier);
      console.log(this.isAuthRong360);
      // 老用户 未ocr
      if (this.isPassVerify == '0' && this.isOcrVerify == '1') {
        this.smTipShow = true;
        // MessageBox.confirm('实名信息未完善，请您完善！').then(action => {
        //   this.$router.push('/realName');
        // });
        return;
      }

      // 已经实名 , 其他有一项未做
      if (this.isPassVerify == '0' && this.isOcrVerify == '0' && this.isTdAuth != '3' && this.bankCardVerify != '0' && this.isAuthCarrier != '3' && this.isAuthRong360 != '3') {
        // 判断定位
        var location = localStorage.getItem('location');
        console.log(location)
        if (location == 'false') {
          console.log('打开权限')
          this.$router.push('/openPermissions')
          return;

        } else {
          console.log('基础认证')
          this.$router.push('/basicAuthentication')
          return;
        }
      }

      if (this.isPassVerify == '0' && this.isOcrVerify == '0') {

        // 判断定位
        var location = localStorage.getItem('location');
        console.log(location)
        if (location == 'false') {
          console.log('打开权限')
          this.$router.push('/openPermissions')
          return;
        } else {
          if (this.isTdAuth != '3' || this.bankCardVerify != '0' || this.isAuthCarrier != '3' || this.isAuthRong360 != '3') {
            console.log('基础认证')
            this.$router.push('/basicAuthentication')
          } else {
            // this.getList();
            this.checkAuthCreidt();
            // this.$router.push('/addCredit')
          }
          // this.getList();
          return;
        }
      }


      // isPassVerify  实名  0:是  1:否
      // isOcrVerify    ocr   0:是  1:否
      if (this.isPassVerify == '1' || this.isOcrVerify == '1') {
        // 判断定位
        var location = localStorage.getItem('location');
        console.log(location)
        if (location == 'false') {
          console.log('打开权限')
          this.$router.push('/openPermissions')
          return;
        } else {
          console.log('基础认证')
          // this.getList();
          this.$router.push('/basicAuthentication')
          return;
        }
      }

      if (
        this.isPassVerify == '0' && this.isOcrVerify == '0' && this.bankCardVerify == '0' && this.isTdAuth == '3' && this.isAuthCarrier == '3' && this.isAuthRong360 == '3') {
        // this.getList();
        this.checkAuthCreidt();
        // this.$router.push('/addCredit');
        return;
      }
    },
    // 查询是否授信接口
    checkAuth: function() {
      this.post('/socialFund/checkAuth', {
          custName: this.custName,
          certCode: this.certCode, // 银行卡号
          mobile: this.mobile,
          orgType: '00', // 机构类型  聚信立
          userId: this.custName + '-' + this.certCode + '-app'
        })
        .then(res => {
          console.log(res)
          if (res.data.code == '100000') {
            this.isAuthsocial = res.data.data.isAuthsocial;
            this.isAuthFund = res.data.data.isAuthFund;
            this.fundAuthDate = res.data.data.fundAuthDate;
            this.socialAuthDate = res.data.data.socialAuthDate;
            this.isAuthCarrier = res.data.data.isAuthCarrier;
            this.isAuthBank = res.data.data.isAuthBank;
            this.carrierAuthDate = res.data.data.carrierAuthDate;
            this.bankAuthDate = res.data.data.bankAuthDate;
            this.isAuthRong360 = res.data.data.isAuthRong360;
            this.rong360AuthDate = res.data.data.rong360AuthDate;
            this.token = res.data.data.token;
            this.search_id = res.data.data.search_id;
            this.account = res.data.data.account;
          }
        })
    },
    // 获取认证信息
    getCertiInfo: function() {
      this.post('/account/getCertiInfo', { custId: this.custId })
        .then(res => {
          if (res.data.code == '100000') {
            this.isPassVerify = res.data.data.isPassVerify;
            this.bankCardVerify = res.data.data.bankCardVerify;
            this.bankCardNo = res.data.data.bankCardNo;
            this.isOcrVerify = res.data.data.isOcrVerify;
            this.isTdAuth = res.data.data.isTdAuth;
            this.tdBlackBox = res.data.data.tdBlackBox;
            this.tdClientType = res.data.data.tdClientType;
          }
        })
    },
    initHomePage: function() {
      this.post('/account/initHomepage', { custId: this.custId })
        .then(res => {
          if (res.data.code === '100000') {
            // 客户 id
            localStorage.setItem('custId', res.data.data.custId);
            // 客户姓名
            localStorage.setItem('custName', res.data.data.custName);
            // 身份证号
            localStorage.setItem('certCode', res.data.data.certCode);
            // 手机号码
            localStorage.setItem('mobile', res.data.data.mobile);
            // 关于我们
            localStorage.setItem('aboutUsUrl', res.data.data.aboutUsUrl);
          }
        })
    }
  },
}

</script>
<style scoped>
.home {
  width: 100%;
  height: 100%;
  background: #6382fc;
}

.home_page {
  width: 100%;
  /*height: calc(100% - 1.01rem);*/
  /*background: url(/static/images/homeBackground.png) no-repeat;*/
  /*background-size: 100% 100%;*/
  height: 100%;
  margin-bottom: 1rem;
}

.home_page_header {
  width: 100%;
  height: 1.67rem;
  padding-top: .78rem;
  float: left;
}

.home_page_header p {
  line-height: .67rem;
  float: left;
}

.home_page_header p:nth-of-type(1) {
  width: calc(50% - .5rem);
  height: .67rem;
}

.home_page_header p:nth-of-type(1) img {
  width: .26rem;
  height: .38rem;
  padding: .14rem .07rem 0 .2rem;
  display: block;
  float: left;
}

.home_page_header p:nth-of-type(1) label {
  font-size: .28rem;
  color: #fff;
  float: left;
}

.home_page_header p:nth-of-type(2) {
  width: 1rem;
  color: #fff;
  font-size: .48rem;
}

.home_page_header p:nth-of-type(3) {
  color: #fff;
  font-size: .28rem;
  width: calc(50% - .5rem);
}

.home_page_header p:nth-of-type(3) a {
  color: #fff;
  padding-left: 1.73rem;
  font-size: .28rem;
}

.home_page_button {
  width: 4.6rem;
  height: 1rem;
  position: absolute;
  bottom: 1.69rem;
  left: 50%;
  margin-left: -2.3rem;
  background: #ffffff;
  box-shadow: 0 14px 24px 0 rgba(122, 105, 255, 0.35);
  border-radius: .24rem;
}

.home_page_button .add-credit {
  color: #6382ff;
  font-size: .6rem;
  line-height: 1rem;
  text-align: center;
  display: inherit;
}




/* OCR补录弹框 */

.smTip,
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

.smTip div,
.rzsbTip div {
  width: 92%;
  height: 4rem;
  position: absolute;
  background: #fff;
  top: 2.36rem;
  left: 4%;
  border-radius: 10px;
}

.smTip div .smInfo {
  width: 78%;
  height: .48rem;
  font-size: .34rem;
  color: #666666;
  text-align: center;
  margin-left: 11%;
  margin-bottom: 1.04rem;
  margin-top: 1.34rem;
}

.smTip div .smSure {
  width: 100%;
  height: .8rem;
  font-size: .34rem;
}

.smTip div .smSure button:nth-of-type(1) {
  color: #5c5044;
  width: 2.75rem;
  height: .8rem;
  border-radius: 10px;
  border: none;
  outline: none;
  border: 1px solid #5c5044;
  float: left;
  margin-left: .42rem;
  background: #fff;
}

.smTip div .smSure button:nth-of-type(2) {
  color: #fff;
  float: right;
  width: 2.75rem;
  height: .8rem;
  border-radius: 10px;
  background-image: linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%);
  margin-right: .38rem;
}

.smTip img {
  width: .6rem;
  height: .6rem;
  position: absolute;
  left: 50%;
  margin-left: -.3rem;
  bottom: 5.66rem;
}

.home-center {
  width: 100%;
  float: left;
}


.home-bg-icon {
  padding: 0.3rem;
  background: url(/static/images/home_bg_icon.png) no-repeat;
  width: 4rem;
  height: 4rem;
  height: 4rem;
  background-size: 4rem;
  margin-top: 0.5rem;
}

.home-bg-slogan {
  width: 100%;
  background: url(/static/images/home_bg_slogan.png) no-repeat center;
  height: 2rem;
  background-size: 50%;
  /* margin: 0 auto; */
  /* float: left; */
  /* text-align: center; */
}

</style>
