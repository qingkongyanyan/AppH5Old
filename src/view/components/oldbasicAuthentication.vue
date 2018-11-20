<!-- 基础认证 -->
<template>
  <div class="home-creditStrategy home-basicAuthentication">
    <p class="basicAuthentication-p">
      <img src="/static/images/loan_title_nor@2x.png">
      <span>必填项</span>
    </p>
    <ul class="basicAuthentication-ul">
      <li>
        <img src="/static/images/home_baseauth_xx@2x.png" class="li-firstImg">
        <span>实名认证</span>
        <img src="/static/images/more_arrow@2x.png" class="li-secondImg" v-show="isPassVerify=='1' || isOcrVerify=='1'">
        <label v-show="isPassVerify=='1' || isOcrVerify=='1'" @click="goVerify('realName')">未认证</label>
        <label v-show="isPassVerify=='0' && isOcrVerify=='0'" class="activeLabel" @click="goVerify('realName')">已认证</label>
      </li>
      <li>
        <img src="/static/images/home_baseauth_sys@2x.png" class="li-firstImg" style="padding-top:.2rem;">
        <span>四要素</span>
        <img src="/static/images/more_arrow@2x.png" class="li-secondImg" v-show="bankCardVerify!='0'">
        <label v-show="bankCardVerify=='0'" class="activeLabel" @click="goVerify('bank')">
          已认证</label>
        <label v-show="bankCardVerify=='1'" @click="goVerify('bank')">认证失败</label>
        <label v-show="bankCardVerify=='2'" @click="goVerify('bank')">认证中</label>
        <label v-show="bankCardVerify=='3'" @click="goVerify('bank')">未认证</label>
      </li>
      <li>
        <img src="/static/images/home_baseauth_yys@2x.png" class="li-firstImg" style="width:.5rem;height:.54rem;padding-top:.19rem;">
        <span>运营商</span>
        <img src="/static/images/more_arrow@2x.png" class="li-secondImg" v-show="isAuthCarrier!='3'">
        <label v-show="isAuthCarrier=='0'" @click="goVerify('yunyingshang')">未认证</label>
        <label v-show="isAuthCarrier=='1'" @click="goVerify('yunyingshang')">认证中</label>
        <label v-show="isAuthCarrier=='2'" @click="goVerify('yunyingshang')">认证失败</label>
        <label v-show="isAuthCarrier=='4'||isAuthCarrier.length==0" @click="goVerify('yunyingshang')">未认证</label>
        <label v-show="isAuthCarrier=='5'" @click="goVerify('yunyingshang')">重新认证</label>
        <label v-show="isAuthCarrier=='3'" class="activeLabel" @click="goVerify('yunyingshang')">已认证</label>
      </li>
      <li>
        <img src="/static/images/home_baseauth_sbzw@2x.png" class="li-firstImg" style="width:.49rem;height:.49rem;padding-top:.2rem;">
        <span>设备画像</span>
        <img src="/static/images/more_arrow@2x.png" class="li-secondImg" v-show="isTdAuth!='3'">
        <label v-show="isTdAuth!='3'" @click="goVerify('tdAuth')">未认证</label>
        <label v-show="isTdAuth=='3'" class="activeLabel">已认证</label>
      </li>
      <li>
        <img src="/static/images/home_baseauth_zx@2x.png" class="li-firstImg" style="width:.44rem;height:.52rem;padding-top:.18rem;">
        <span>征信报告</span>
        <img src="/static/images/more_arrow@2x.png" class="li-secondImg" v-show="isAuthRong360!='3'">
        <label v-show="isAuthRong360=='0'" @click="goVerify('authRong360')">未认证</label>
        <label v-show="isAuthRong360=='1'" @click="goVerify('authRong360')">认证中</label>
        <label v-show="isAuthRong360=='2'" @click="goVerify('authRong360')">认证失败</label>
        <label v-show="isAuthRong360=='4'||isAuthRong360.length==0" @click="goVerify('authRong360')">未认证</label>
        <label v-show="isAuthRong360=='5'" @click="goVerify('authRong360')">重新认证</label>
        <label v-show="isAuthRong360=='3'" class="activeLabel" @click="goVerify('authRong360')">已认证</label>
      </li>
    </ul>
    <!-- 屏蔽  start -->
    <p class="basicAuthentication-p">
      <img src="/static/images/loan_title_nor@2x.png">
      <span>必填项</span>
    </p>
    <ul class="basicAuthentication-ul">
      <li>
        <img src="/static/images/home_baseauth_wy@2x.png" class="li-firstImg" style="width:.44rem;height:.52rem;padding-top:.18rem;">
        <span>网银</span>
        <img src="/static/images/more_arrow@2x.png" class="li-secondImg">
        <label v-show="isAuthBank=='0'" @click="goVerify('authBank')">未认证</label>
        <label v-show="isAuthBank=='2' || isAuthBank=='4'" @click="goVerify('authBank')">认证失败</label>
        <label v-show="isAuthBank=='3'">认证成功</label>
        <label v-show="isAuthBank=='5'" @click="goVerify('authBank')">重新认证</label>
      </li>
      <li>
        <img src="/static/images/home_baseauth_gjj@2x.png" class="li-firstImg" style="width:.44rem;height:.52rem;padding-top:.18rem;">
        <span>公积金</span>
        <img src="/static/images/more_arrow@2x.png" class="li-secondImg">
        <label v-show="isAuthFund=='0'" @click="goVerify('authFund')">未认证</label>
        <label v-show="isAuthFund=='2' || isAuthFund=='4'" @click="goVerify('authFund')">认证失败</label>
        <label v-show="isAuthFund=='3'">认证成功</label>
        <label v-show="isAuthFund=='5'" @click="goVerify('authFund')">重新认证</label>
      </li>
      <li>
        <img src="/static/images/home_baseauth_sb@2x.png" class="li-firstImg" style="width:.44rem;height:.52rem;padding-top:.18rem;">
        <span>社保</span>
        <img src="/static/images/more_arrow@2x.png" class="li-secondImg">
        <label v-show="isAuthsocial=='0'" @click="goVerify('authsocial')">未认证</label>
        <label v-show="isAuthsocial=='2' || isAuthsocial=='4'" @click="goVerify('authsocial')">认证失败</label>
        <label v-show="isAuthsocial=='3'">认证成功</label>
        <label v-show="isAuthsocial=='5'" @click="goVerify('authsocial')">重新认证</label>
      </li>
    </ul>
    <!-- 屏蔽 end -->
    <!-- 不让点 -->
    <a class="disable-btn" v-show="isPassVerify != '0' || isOcrVerify != '0' || bankCardVerify != '0'  || isTdAuth != '3' || isAuthCarrier != '3' || !isRong360">
      <button>
        下一步
      </button>
    </a>
    <a class="settingBtn" @click="goNext()" v-show="isPassVerify == '0' && bankCardVerify == '0' && isOcrVerify == '0' && isTdAuth == '3' && isAuthCarrier == '3' && isRong360">
      <button>
        下一步
      </button>
    </a>
    <!-- 弹框 -->
    <div class="tip" v-show="tipShow" @click="tipShow=false">
      <span>{{alertText}}</span>
    </div>
    <!-- 认证失败弹框 -->
    <div class="rzsbTip" v-show="rzSbShow">
      <div>
        <p class="rzsbInfo">{{statusText}}</p>
        <p class="rzsbSure">
          <button @click="rzSbShow=false">取消</button>
          <button @click="resetRZheng(flags)">重新认证</button>
        </p>
      </div>
    </div>
    <!-- 认证状态弹框 -->
    <div class="rzTip" v-show="rzTipShow" @touchmove.preven>
      <div>
        <p class="rzTitle">信息不符</p>
        <p class="rzInfo">您当前输入银行卡号与实名认证信息不符，核实后请重新输入！</p>
        <p class="rzSure" @click="goFourList">确定</p>
      </div>
    </div>
    <!-- 实名认证OVR补录状态弹框 -->
    <div class="smTip" v-show="smTipShow" @touchmove.preven>
      <div>
        <p class="smInfo">实名信息未完善，请您完善！</p>
        <p class="smSure">
          <button @click="smTipShow=false">取消</button>
          <button @click="goRealName">确定</button>
        </p>
      </div>
    </div>
    <!-- 实名 -->
    <div class="smTip" v-show="smrzTipShow" @touchmove.preven>
      <div>
        <p class="smInfo">您暂未进行实名认证，请前去认证！</p>
        <p class="smSure">
          <button @click="smrzTipShow=false">取消</button>
          <button @click="goRealName">确定</button>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { Indicator } from 'mint-ui';
import ThridContent from '../../util/thridConstant.js'
export default {
  data() {
    return {
      aaa: '01',
      bbb: '',
      isPassVerify: '',
      bankCardVerify: '',
      bankCardNo: '',
      isOcrVerify: '',
      isTdAuth: '',
      tdBlackBox: '',
      tdClientType: '',
      isAuthsocial: '', // 
      isAuthFund: '',
      fundAuthDate: '',
      socialAuthDate: '',
      isAuthCarrier: '', // 运营商 3
      isAuthBank: '', // 四要素 3
      carrierAuthDate: '',
      bankAuthDate: '',
      isAuthRong360: '', // rong360简版征信授权 3
      rong360AuthDate: '',
      custName: '',
      custId: '',
      certCode: '',
      mobile: '',
      tipShow: false,
      alertText: '',
      alertShow: '', // 重新返回状态的 交互式弹窗
      rzTipShow: false, // 认证状态弹框
      smTipShow: false, // 实名ocr补录
      smrzTipShow: false, // 实名
      rzSbShow: false, // 认证失败
      statusText: '',
      tempDataSource: '',
      isRong360: false, // 处理 360  0/5
    }
  },
  mounted() {
    localStorage.removeItem('addObj')
    this.fmOpt = {
      partner: 'nuoyuan',
      appName: 'nuoyuan_web',
      token: 'nuoyuan' + "-" + new Date().getTime() + "-" + Math.random().toString(16).substr(2),
      fmb: true,
      getinfo: function() {
        console.log('同盾')
        return "e3Y6ICIyLjUuMCIsIG9zOiAid2ViIiwgczogMTk5LCBlOiAianMgbm90IGRvd25sb2FkIn0=";
      },
      fpHost: 'https://fptest.fraudmetrix.cn',
      staticHost: 'statictest.fraudmetrix.cn',
      tcpHost: 'fpflashtest.fraudmetrix.cn',
      wsHost: 'fptest.fraudmetrix.cn:9090'
    };
    this.custName = localStorage.getItem('custName');
    this.custId = localStorage.getItem('custId');
    // 身份证号
    this.certCode = localStorage.getItem('certCode');
    // 银行卡号
    // this.bankCardNo = localStorage.getItem('bankCardNo');
    this.mobile = localStorage.getItem('mobile');
    this.getCertiInfo();
    if (this.custName && this.custId && this.certCode) {
      this.checkAuth();
    }
  },
  methods: {
    goRealName() {
      localStorage.setItem('jichuOrYewu', 'jichurenzheng');
      this.$router.push('/realName');
    },
    goFourList() {
      localStorage.setItem('from', 'yewu');
      localStorage.setItem('fromOrBack', 'jichurenzheng');
      this.$router.push('/fourFactorAuthentication');
    },
    goVerify: function(type) {
      // 基本认证跳转
      switch (type) {
        case 'realName':
          this.getCertiInfo('realName');
          break;
        case 'bank':
          // 先校验实名
          // isPassVerify  实名   0:是  1:否
          // isOcrVerify  ocr     0:是  1:否
          if (this.isPassVerify == '1') {
            // 提示实名弹窗
            // this.smTipShow = true;
            this.smrzTipShow = true;
            return;
          } else if (this.isPassVerify == '0' && this.isOcrVerify == '1') {
            // 做了实名 , 未做 OCR
            this.smTipShow = true;
            return;
          }
          this.getCertiInfo('bank');
          break;
        case 'yunyingshang':
          // 先校验实名
          // isPassVerify  实名   0:是  1:否
          // isOcrVerify  ocr     0:是  1:否
          if (this.isPassVerify == '1') {
            // 提示实名弹窗
            // this.smTipShow = true;
            this.smrzTipShow = true;
            return;
          } else if (this.isPassVerify == '0' && this.isOcrVerify == '1') {
            // 做了实名 , 未做 OCR
            this.smTipShow = true;
            return;
          }
          this.checkAuth('yunyingshang');
          break;
        case 'tdAuth':
          // 先校验实名
          // isPassVerify  实名   0:是  1:否
          // isOcrVerify  ocr     0:是  1:否
          if (this.isPassVerify == '1') {
            // 提示实名弹窗
            // this.smTipShow = true;
            this.smrzTipShow = true;
            return;
          } else if (this.isPassVerify == '0' && this.isOcrVerify == '1') {
            // 做了实名 , 未做 OCR
            this.smTipShow = true;
            return;
          }
          this.black_box = this.fmOpt.getinfo();
          console.log(this.black_box);
          this.saveTdAuth();
          break;
        case 'authRong360':
          // 先校验实名
          // isPassVerify  实名   0:是  1:否
          // isOcrVerify  ocr     0:是  1:否
          if (this.isPassVerify == '1') {
            // 提示实名弹窗
            // this.smTipShow = true;
            this.smrzTipShow = true;
            return;
          } else if (this.isPassVerify == '0' && this.isOcrVerify == '1') {
            // 做了实名 , 未做 OCR
            this.smTipShow = true;
            return;
          }
          this.checkAuth('authRong360');
          break;
        case 'authBank': // 网银
          // 先校验实名
          // isPassVerify  实名   0:是  1:否
          // isOcrVerify  ocr     0:是  1:否
          if (this.isPassVerify == '1') {
            // 提示实名弹窗
            // this.smTipShow = true;
            this.smrzTipShow = true;
            return;
          } else if (this.isPassVerify == '0' && this.isOcrVerify == '1') {
            // 做了实名 , 未做 OCR
            this.smTipShow = true;
            return;
          }
          this.checkAuth('authBank');
          break;
        case 'authFund': // 公积金
          // 先校验实名
          // isPassVerify  实名   0:是  1:否
          // isOcrVerify  ocr     0:是  1:否
          if (this.isPassVerify == '1') {
            // 提示实名弹窗
            // this.smTipShow = true;
            this.smrzTipShow = true;
            return;
          } else if (this.isPassVerify == '0' && this.isOcrVerify == '1') {
            // 做了实名 , 未做 OCR
            this.smTipShow = true;
            return;
          }
          this.checkAuth('authFund');
          break;
        case 'authsocial': // 社保
          // 先校验实名
          // isPassVerify  实名   0:是  1:否
          // isOcrVerify  ocr     0:是  1:否
          if (this.isPassVerify == '1') {
            // 提示实名弹窗
            // this.smTipShow = true;
            this.smrzTipShow = true;
            return;
          } else if (this.isPassVerify == '0' && this.isOcrVerify == '1') {
            // 做了实名 , 未做 OCR
            this.smTipShow = true;
            return;
          }
          this.checkAuth('authsocial');
          break;
      }
    },
    gotoAuthBank: function() {
      // 网银
      console.log('网银网银网银网银网银');
      this.getFuShuAuthUrl('BANK');
    },
    gotoAuthFund: function() {
      // 公积金
      console.log('公积金公积金公积金公积金');
      this.getFuShuAuthUrl('FUND');
    },
    gotoAuthsocial: function() {
      // 社保
      console.log('社保社保社保社保社保');
      this.getFuShuAuthUrl('SOCIALSECURITY');
    },
    getFuShuAuthUrl: function(type) {
      Indicator.open();
      // 富数调用方法
      this.post('/socialFund/getFuShuAuthUrl', {
        custName: this.custName,
        certCode: this.certCode,
        mobile: this.mobile,
        // userId: this.custName + '-' + this.certCode + '-app',
        category: '03',
        organization_type: type
      }).then(res => {
        Indicator.close();
        if (res.data.code == '100000') {
          if (!res.data.data.url) {
            var sel = this;
            sel.alertText = res.data.data.errorMsg;
            sel.tipShow = true;
            setTimeout(function() { sel.tipShow = false; }, 3000);
            return;
          }
          window.location.href = res.data.data.url;
        } else {
          var sel = this;
          sel.alertText = res.data.msg;
          sel.tipShow = true;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })
    },
    getRong360Auth: function() {
      this.post('/socialFund/getRong360AuthUrl', {
        name: this.custName, //客户姓名  
        idNumber: this.certCode, //证件号码  
        phone: this.mobile //手机号码  
      }).then(res => {
        console.log(res);
        if (res.data.code == 100000) {
          if (!res.data.data.authUrl) {
            var sel = this;
            sel.alertText = res.data.data.errorMsg;
            sel.tipShow = true;
            setTimeout(function() { sel.tipShow = false; }, 3000);
            return;
          }
          window.location.href = res.data.data.authUrl;
        } else if (res.data.code != 100000) {
          var sel = this;
          sel.alertText = res.data.msg;
          sel.tipShow = true;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })
    },
    // 同盾
    saveTdAuth() {
      var imei = localStorage.getItem('imei');
      this.post('/common/saveTdAuth', {
        custId: this.custId, // 客户id
        imei: imei, // 设备号
        tdBlackBox: this.black_box,
        tdClientType: '1', // 其他类型 
      }).then(res => {
        if (res.data.code == '100000') {
          // 成功
          this.isTdAuth = '3';
        } else {
          // 失败
        }
      })
    },
    gotoYunyingshang: function() {
      window.location.href = ThridContent.JUXINLI_CARRIER_BASEURL +
        "/h5/authorize/telecom?api_key=" +
        ThridContent.JUXINLI_CARRIER_APIKEY +
        "&user_id=" +
        this.custName +
        "-" +
        this.certCode +
        "-app&id_card_num=" +
        this.certCode +
        "&phone=" +
        this.mobile +
        "&name=" +
        this.custName +
        "&theme=2da8e1";
    },
    resetRZheng(flag) {
      switch (flag) {
        case 'sbhx':
          this.black_box = this.fmOpt.getinfo();
          console.log(this.black_box);
          this.saveTdAuth();
          break;
        case 'yunyshang':
          this.gotoYunyingshang();
          break;
        case 'zhengxin':
          console.log('==========================')
          this.post('/socialFund/getRong360AuthUrl', {
            name: this.custName, //客户姓名  
            idNumber: this.certCode, //证件号码  
            phone: this.mobile //手机号码  
          }).then(res => {
            console.log('==========================')
            if (res.data.code == '100000') {
              console.log(res.data.data.authUrl)
              if (!res.data.data.authUrl) {
                var sel = this;
                sel.alertText = res.data.data.errorMsg;
                sel.tipShow = true;
                setTimeout(function() { sel.tipShow = false; }, 3000);
                return;
              }
              window.location.href = res.data.data.authUrl;
            } else if (res.data.code != '100000') {
              var sel = this;
              sel.alertText = res.data.msg;
              sel.tipShow = true;
              setTimeout(function() { sel.tipShow = false; }, 3000);
              return;
            }
          });
          break;
        case 'authBank':
          console.log('==========网银=============');
          this.post('/socialFund/getRong360AuthUrl', {
            name: this.custName, //客户姓名  
            idNumber: this.certCode, //证件号码  
            phone: this.mobile //手机号码  
          }).then(res => {
            if (res.data.code == '100000') {
              console.log(res.data.data.authUrl)
              if (!res.data.data.authUrl) {
                var sel = this;
                sel.alertText = res.data.data.errorMsg;
                sel.tipShow = true;
                setTimeout(function() { sel.tipShow = false; }, 3000);
                return;
              }
              window.location.href = res.data.data.authUrl;
            } else if (res.data.code != '100000') {
              var sel = this;
              sel.alertText = res.data.msg;
              sel.tipShow = true;
              setTimeout(function() { sel.tipShow = false; }, 3000);
              return;
            }
          });
          break;
        case 'authFund':
          console.log('==========公积金=============');
          this.post('/socialFund/getRong360AuthUrl', {
            name: this.custName, //客户姓名  
            idNumber: this.certCode, //证件号码  
            phone: this.mobile //手机号码  
          }).then(res => {
            if (res.data.code == '100000') {
              console.log(res.data.data.authUrl)
              if (!res.data.data.authUrl) {
                var sel = this;
                sel.alertText = res.data.data.errorMsg;
                sel.tipShow = true;
                setTimeout(function() { sel.tipShow = false; }, 3000);
                return;
              }
              window.location.href = res.data.data.authUrl;
            } else if (res.data.code != '100000') {
              var sel = this;
              sel.alertText = res.data.msg;
              sel.tipShow = true;
              setTimeout(function() { sel.tipShow = false; }, 3000);
              return;
            }
          });
          break;
        case 'authsocial':
          console.log('==========社保=============');
          this.post('/socialFund/getRong360AuthUrl', {
            name: this.custName, //客户姓名  
            idNumber: this.certCode, //证件号码  
            phone: this.mobile //手机号码  
          }).then(res => {
            if (res.data.code == '100000') {
              console.log(res.data.data.authUrl)
              if (!res.data.data.authUrl) {
                var sel = this;
                sel.alertText = res.data.data.errorMsg;
                sel.tipShow = true;
                setTimeout(function() { sel.tipShow = false; }, 3000);
                return;
              }
              window.location.href = res.data.data.authUrl;
            } else if (res.data.code != '100000') {
              var sel = this;
              sel.alertText = res.data.msg;
              sel.tipShow = true;
              setTimeout(function() { sel.tipShow = false; }, 3000);
              return;
            }
          });
          break;
      }
    },
    // 查询是否授信接口
    checkAuth: function(type) {
      this.post('/socialFund/checkAuth', {
          custName: this.custName,
          certCode: this.certCode, // 身份证号码
          mobile: this.mobile,
          orgType: '00', // 机构类型  聚信立
          userId: this.custName + '-' + this.certCode + '-app'
        })
        .then(res => {
          console.log(res)
          if (res.data.code == '100000') {
            // 社保
            this.isAuthsocial = res.data.data.isAuthsocial;
            // 公积金
            this.isAuthFund = res.data.data.isAuthFund;
            this.fundAuthDate = res.data.data.fundAuthDate;
            this.socialAuthDate = res.data.data.socialAuthDate;
            this.isAuthCarrier = res.data.data.isAuthCarrier;
            // 网银
            this.isAuthBank = res.data.data.isAuthBank;
            this.carrierAuthDate = res.data.data.carrierAuthDate;
            this.bankAuthDate = res.data.data.bankAuthDate;
            this.isAuthRong360 = res.data.data.isAuthRong360;
            this.rong360AuthDate = res.data.data.rong360AuthDate;
            this.token = res.data.data.token;
            this.search_id = res.data.data.search_id;
            this.account = res.data.data.account;

            if (res.data.data.isAuthRong360 == '3' || res.data.data.isAuthRong360 == '2') {
              this.isRong360 = true;
            }

            // 运营商
            if (type == "yunyingshang") {
              if (this.isAuthCarrier == '0') { // 未授权 直接跳
                this.gotoYunyingshang();
              } else {
                if (this.isAuthCarrier == '1') { // 认证中
                  this.alertText = '认证中，请耐心等待';
                  this.tipShow = true;
                  var sel = this;
                  setTimeout(function() { sel.tipShow = false; }, 3000);
                } else if (this.isAuthCarrier == '2') {
                  this.statusText = '认证失败，请重新认证！';
                  this.rzSbShow = true;
                  this.flags = 'yunyshang';
                } else if (this.isAuthCarrier == '4') {
                  this.statusText = '非本人身份信息授权，请重新认证！';
                  this.rzSbShow = true;
                  this.flags = 'yunyshang';
                } else if (this.isAuthCarrier == '5') {
                  this.statusText = '认证过期，请重新认证！';
                  this.rzSbShow = true;
                  this.flags = 'yunyshang';
                }
              }
            }
            // 征信
            if (type == 'authRong360') {
              if (this.isAuthRong360 == '0') {
                this.getRong360Auth();
              } else {
                if (this.isAuthRong360 == '1') {
                  var sel = this;
                  sel.alertText = '认证中，请耐心等待';
                  sel.tipShow = true;
                  setTimeout(function() { sel.tipShow = false; }, 3000);
                  return;
                } else if (this.isAuthRong360 == '2') {
                  this.statusText = '认证失败，请重新认证！';
                  this.rzSbShow = true;
                  this.flags = 'zhengxin';
                  return;
                } else if (this.isAuthRong360 == '4') {
                  this.statusText = '非本人身份信息授权，请重新认证！';
                  this.rzSbShow = true;
                  this.flags = 'zhengxin';
                  return;
                } else if (this.isAuthRong360 == '5') {
                  this.statusText = '认证过期，请重新认证！';
                  this.rzSbShow = true;
                  this.flags = 'zhengxin';
                  return;
                }
                // 弹窗处理
                this.getRong360Auth();
              }
            }
            // 网银
            if (type == "authBank") {
              if (this.isAuthBank == '0') { // 未授权 直接跳
                this.gotoAuthBank();
              } else {
                if (this.isAuthBank == '1') { // 认证中
                  this.alertText = '认证中，请耐心等待';
                  this.tipShow = true;
                  var sel = this;
                  setTimeout(function() { sel.tipShow = false; }, 3000);
                } else if (this.isAuthBank == '2') {
                  this.statusText = '认证失败，请重新认证！';
                  this.rzSbShow = true;
                  this.flags = 'authBank';
                } else if (this.isAuthBank == '4') {
                  this.statusText = '非本人身份信息授权，请重新认证！';
                  this.rzSbShow = true;
                  this.flags = 'authBank';
                } else if (this.isAuthBank == '5') {
                  this.statusText = '认证过期，请重新认证！';
                  this.rzSbShow = true;
                  this.flags = 'authBank';
                }
              }
            }
            // 公积金
            if (type == "authFund") {
              if (this.isAuthFund == '0') { // 未授权 直接跳
                this.gotoAuthFund();
              } else {
                if (this.isAuthFund == '1') { // 认证中
                  this.alertText = '认证中，请耐心等待';
                  this.tipShow = true;
                  var sel = this;
                  setTimeout(function() { sel.tipShow = false; }, 3000);
                } else if (this.isAuthFund == '2') {
                  this.statusText = '认证失败，请重新认证！';
                  this.rzSbShow = true;
                  this.flags = 'authFund';
                } else if (this.isAuthFund == '4') {
                  this.statusText = '非本人身份信息授权，请重新认证！';
                  this.rzSbShow = true;
                  this.flags = 'authFund';
                } else if (this.isAuthFund == '5') {
                  this.statusText = '认证过期，请重新认证！';
                  this.rzSbShow = true;
                  this.flags = 'authFund';
                }
              }
            }
            // 社保
            if (type == "authsocial") {
              if (this.isAuthsocial == '0') { // 未授权 直接跳
                this.gotoAuthsocial();
              } else {
                if (this.isAuthsocial == '1') { // 认证中
                  this.alertText = '认证中，请耐心等待';
                  this.tipShow = true;
                  var sel = this;
                  setTimeout(function() { sel.tipShow = false; }, 3000);
                } else if (this.isAuthsocial == '2') {
                  this.statusText = '认证失败，请重新认证！';
                  this.rzSbShow = true;
                  this.flags = 'authsocial';
                } else if (this.isAuthsocial == '4') {
                  this.statusText = '非本人身份信息授权，请重新认证！';
                  this.rzSbShow = true;
                  this.flags = 'authsocial';
                } else if (this.isAuthsocial == '5') {
                  this.statusText = '认证过期，请重新认证！';
                  this.rzSbShow = true;
                  this.flags = 'authsocial';
                }
              }
            }
          } else {
            var sel = this;
            sel.tipShow = true;
            sel.alertText = res.data.msg;
            setTimeout(function() { sel.tipShow = false; }, 1000);
            return;
          }
        })
    },
    // 获取认证信息
    getCertiInfo: function(type) {
      console.log(type);
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

            // 实名
            if (type == 'realName') {
              if (this.isPassVerify == '1') { // 啥都没做
                // this.alertShow = true;
                // this.alertText = '实名未认证,请重新认证';
                localStorage.setItem('jichuOrYewu', 'jichurenzheng');
                this.$router.push('/realName')
              } else if (this.isPassVerify == '0' && this.isOcrVerify == '1') {
                // 补录ocr
                // this.alertShow = true;
                // this.alertText = '实名信息未完善，请您完善！'
                this.smTipShow = true;
              }
            }
            // 四要素
            /**
             * 0: 认证成功
             * 1: 认证失败
             * 2: 认证中
             * 3: 未认证
             */
            if (type == "bank") {
              if (this.bankCardVerify == '1') {
                // this.tipShow = true;
                // this.alertText = '认证失败，请重新认证';
                localStorage.setItem('from', 'yewu');
                localStorage.setItem('fromOrBack', 'jichurenzheng');
                this.rzTipShow = true;
                // this.$router.push('/fourFactorAuthentication');
              } else {
                if (this.bankCardVerify == '2') {
                  // this.statusText = '认证中，请耐心等待！';
                  // this.tipShow = true;
                  // this.rzSbShow = true;
                  var sel = this;
                  sel.tipShow = true;
                  sel.alertText = '认证中，请耐心等待！';
                  setTimeout(function() { sel.tipShow = false; }, 1000);
                  return;
                } else if (this.bankCardVerify == '3') {
                  localStorage.setItem('from', 'yewu');
                  localStorage.setItem('fromOrBack', 'jichurenzheng');
                  this.$router.push('/fourFactorAuthentication')
                } else if (this.bankCardVerify == '4') {
                  this.statusText = '非本人身份信息授权，请重新认证！';
                  // this.alertShow = true;
                  this.rzSbShow = true;
                } else if (this.bankCardVerify == '5') {
                  this.statusText = '认证过期，请重新认证！';
                  // this.alertShow = true;
                  this.rzSbShow = true;
                }
              }
              // 配置跳转路由
              // this.pushRoute = 'fourFactorAuthentication';
              // this.$router.push('/fourFactorAuthentication');
            }
          }
        })
    },
    // 获取授信列表
    getList: function() {
      // 授信业务校验
      this.post('/authcredit/checkAuthCredit', {
        certCode: this.certCode,
        custName: this.custName,
        custId: this.custId
      }).then(res => {
        if (res.data.code == '100000') {
          this.$router.replace('/addCredit');
        } else {
          var sel = this;
          //失败
          this.tipShow = true;
          this.alertText = res.data.msg;
          setTimeout(function() { sel.tipShow = false; }, 1000);
          return;
        }
      })
    },
    goNext() {
      console.log('1233333333333333333333')

      // // 征信失败 可以添加授信  2 授权失败
      // if (this.rong360AuthDate != '2') {
      // }

      // this.$router.replace('/addCredit');
      this.getList();

    },
  }
}

</script>
<style scoped>
.basicAuthentication-p {
  width: 100%;
  height: .8rem;
  background: #fbfbfb;
  border: 1px solid #eeeeee;
}

.basicAuthentication-p img {
  width: .25rem;
  height: .28rem;
  display: inline-block;
  float: left;
  padding: .27rem .06rem .25rem .3rem;
}

.basicAuthentication-p span {
  font-size: .28rem;
  color: #a18a6f;
  text-align: left;
  float: left;
  line-height: .8rem;
}

.basicAuthentication-ul {
  width: 100%;
  background: #fff;
  /* text-align: center; */
}

.basicAuthentication-ul li {
  width: calc(100% - .6rem);
  height: .88rem;
  border-bottom: 1px solid #eeeeee;
  margin-left: .3rem;
  line-height: .88rem;
}

.li-firstImg {
  width: .51rem;
  height: .5rem;
  padding: .24rem .25rem 0 .34rem;
  float: left;
}

.basicAuthentication-ul li span {
  font-size: .28rem;
  color: #333333;
  float: left;
}

.basicAuthentication-ul li label {
  font-size: .26rem;
  color: #999999;
  float: right;
}

.li-secondImg {
  width: .12rem;
  height: .22rem;
  float: right;
  padding: .32rem 0 0 .38rem;
}


























/* 按钮 */

.settingBtn {
  font-size: 0.34rem;
  text-decoration: none;
}

.settingBtn button {
  width: 92%;
  height: .8rem;
  background-image: linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%);
  border-radius: 10px;
  color: #fff;
  margin-top: .53rem;
  margin-bottom: .33rem;
  font-size: .34rem;
}

.disable-btn button {
  width: 92%;
  height: .8rem;
  background-image: linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%);
  border-radius: 10px;
  color: #fff;
  margin-top: .53rem;
  margin-bottom: .33rem;
  font-size: .34rem;
  opacity: 0.6;
}

.basicAuthentication-ul li .activeLabel {
  color: #2da8e1;
  padding-right: .5rem;
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















/* 认证失败弹框 */

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

</style>
