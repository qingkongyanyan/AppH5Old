<!-- 业务 -->
<template>
  <div class="businessList">
    <div class="business-list-page">
      <div class="businessList-top">
        <h1>
        <span>
          <ol>
            <li></li>
            <li></li>
            <li></li>
          </ol>
        </span>
        <label>业务申办</label>
      </h1>
        <ul>
          <li @click="goList('shouxin')">
            <label>
              <img src="/static/images/loan_shouxin@2x.png">
            </label>
            <p>授信</p>
          </li>
          <li @click="goList('qianyue')">
            <label>
              <img src="/static/images/loan_qianyue@3x.png">
            </label>
            <p>签约</p>
          </li>
        </ul>
      </div>
      <div class="businessList-top businessList-center businessList-bottom">
        <h1>
        <span>
          <ol>
            <li></li>
            <li></li>
            <li></li>
          </ol>
        </span>
        <label>业务查询</label>
      </h1>
        <ul>
          <li @click="goList('jindu')">
            <label>
              <img src="/static/images/loan_jindu@3x.png">
            </label>
            <p>进度查询</p>
          </li>
          <li @click="goList('huankuan')">
            <label>
              <img src="/static/images/loan_hk_find@3x.png">
            </label>
            <p>还款查询</p>
          </li>
          <li @click="goList('hetong')">
            <label>
              <img src="/static/images/loan_ht_find@2x.png">
            </label>
            <p>合同查询</p>
          </li>
        </ul>
      </div>
      <div class="businessList-top businessList-bottom">
        <h1>
        <span>
          <ol>
            <li></li>
            <li></li>
            <li></li>
          </ol>
        </span>
        <label>认证授权</label>
      </h1>
        <ul>
          <li @click="goList('shiming')">
            <label>
              <img src="/static/images/mine_auth@2x.png" class="backImg">
              <img src="/static/images/loan_select_nor@2x.png" class="checked" v-show="smShow">
            </label>
            <p>实名</p>
          </li>
          <li @click="goList('siyaosu')">
            <label>
              <img src="/static/images/loan_siyaosu@2x.png" class="backImg">
              <img src="/static/images/loan_select_nor@2x.png" class="checked" v-show="sysShow">
            </label>
            <p>四要素</p>
          </li>
          <li @click="goList('shebeihuaxiang')">
            <label>
              <img src="/static/images/loan_zhiwen@2x.png" class="backImg">
              <img src="/static/images/loan_select_nor@2x.png" class="checked" v-show="sbhxShow">
            </label>
            <p>设备画像</p>
          </li>
          <li @click="goList('zhengxin')">
            <label>
              <img src="/static/images/loan_zhengxin@2x.png" class="backImg">
              <img src="/static/images/loan_select_nor@2x.png" class="checked" v-show="zxShow">
            </label>
            <p>信用报告</p>
          </li>
        </ul>
      </div>
      <ul class="uls">
        <li @click="goList('yunyingshang')">
          <label>
            <img src="/static/images/loan_carrier@2x.png">
            <img src="/static/images/loan_select_nor@2x.png" class="checked" v-show="yxsShow">
          </label>
          <p>运营商</p>
        </li>
        <!-- 屏蔽  start -->
        <li @click="goList('shebao')">
          <label>
            <img src="/static/images/loan_shebao@2x.png">
            <img src="/static/images/loan_select_nor@2x.png" class="checked" v-show="sbShow">
          </label>
          <p>社保</p>
        </li>
        <li @click="goList('gongjijin')">
          <label>
            <img src="/static/images/loan_func@2x.png">
            <img src="/static/images/loan_select_nor@2x.png" class="checked" v-show="gjjShow">
          </label>
          <p>公积金</p>
        </li>
        <li @click="goList('wangyin')">
          <label>
            <img src="/static/images/loan_netbank@2x.png">
            <img src="/static/images/loan_select_nor@2x.png" class="checked" v-show="wyShow">
          </label>
          <p>网银</p>
        </li>
        <!-- 屏蔽 end -->
      </ul>
    </div>
    <Tabbar></Tabbar>
    <!-- 弹框 -->
    <div class="tip" v-show="tipShow" @click="tipShow=false">
      <span>{{alentText}}</span>
    </div>
    <!-- 认证状态弹框 -->
    <div class="rzTip" v-show="rzTipShow">
      <div>
        <p class="rzTitle">信息不符</p>
        <p class="rzInfo">您当前输入银行卡号与实名认证信息不符，核实后请重新输入！</p>
        <p class="rzSure" @click="goFourList">确定</p>
      </div>
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
    </div>
    <!-- 认证失败弹框 -->
    <div class="rzsbTip" v-show="rzSbShow">
      <div>
        <p class="rzsbInfo">{{statusText}}</p>
        <p class="rzsbSure">
          <button @click="rzSbShow=false">取消</button>
          <button @click="resetRZheng(flags)" v-show='!sureRlname'>重新认证</button>
          <button @click="goRealName" v-show='sureRlname'>确定</button>
        </p>
      </div>
    </div>
    <!-- 四要素未认证弹框 -->
    <div class="rzsbTip" v-show="sysTipShow">
      <div>
        <p class="rzsbInfo">您暂未进行四要素认证，请前去认证！</p>
        <p class="rzsbSure">
          <button @click="sysTipShow=false">取消</button>
          <button @click="gosiyaosu">确定</button>
        </p>
      </div>
    </div>
    <div class="rzsbTip" v-show="rzsbTipShow">
      <div>
        <p class="rzsbInfo">认证失败, 请重新认证!</p>
        <p class="rzsbSure">
          <button @click="rzsbTipShow=false">取消</button>
          <button @click="goChangeBankCard">重新认证</button>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { MessageBox } from 'mint-ui';
import Tabbar from '../tabbar'
import ThridContent from '../../util/thridConstant.js'
export default {
  name: 'business',
  data() {
    return {
      name: '',
      idNumber: '',
      phone: '',
      tipShow: false,
      rzTipShow: false, //认证状态弹框
      smTipShow: false, //实名认证OVR补录状态弹框
      rzSbShow: false, //实名失败弹框
      sysShow: false, //四要素提示弹框
      sysTipShow: false, //四要素提示弹框
      alentText: '',
      loginInformation: '',
      custId: '',
      black_box: '',
      fmOpt: {},
      smShow: false,
      sbhxShow: false,
      zxShow: false,
      yxsShow: false,
      sbShow: false,
      gjjShow: false,
      wyShow: false,
      rzsbTipShow: false, // 四要素认证失败 ,重新认证
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
      flags: '', //重新认证弹框按钮
      statusText: '', //重新认证弹框内容
      sureRlname: false, //未实名认证确定按钮
      isAuthsocial: '', //社保是否授权
      socialAuthDate: '', //社保授权时间
      isAuthFund: '', //公积金是否授权
      fundAuthDate: '', //公积金授权时间 
      isAuthBank: '', //网银是否授权 
      bankAuthDate: '', //网银授权时间
    }
  },
  components: {
    Tabbar
  },
  mounted() {
    localStorage.removeItem('addObj')
    this.loginInformation = JSON.parse(localStorage.getItem("loginInformation"));
    this.fmOpt = {
      partner: 'nuoyuan',
      appName: 'nuoyuan_web',
      token: 'nuoyuan' + "-" + new Date().getTime() + "-" + Math.random().toString(16).substr(2),
      fmb: true,
      getinfo: function() {
        console.log('同盾')
        return "e3Y6ICIyLjUuMCIsIG9zOiAid2ViIiwgczogMTk5LCBlOiAianMgbm90IGRvd25sb2FkIn0=";
      },
    };

    var cimg = new Image(1, 1);
    cimg.onload = function() {
      this.fmOpt.imgLoaded = true;
    };
    cimg.src = "https://fp.fraudmetrix.cn/fp/clear.png?partnerCode=nuoyuan&appName=nuoyuan_web&tokenId=" + this.fmOpt.token;
    var fm = document.createElement('script');
    fm.type = 'text/javascript';
    fm.async = true;
    fm.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'static.fraudmetrix.cn/v2/fm.js?ver=0.1&t=' + (new Date().getTime() / 3600000).toFixed(0);
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(fm, s);

    this.custName = localStorage.getItem('custName');
    this.custId = localStorage.getItem('custId');
    // 身份证号
    this.certCode = localStorage.getItem('certCode');
    // 银行卡号
    // this.bankCardNo = localStorage.getItem('bankCardNo');
    this.mobile = localStorage.getItem('mobile');
    if (this.custName && this.custId && this.certCode) {

      this.getCertiInfo();
      this.checkAuth();
    }
  },
  methods: {
    goChangeBankCard: function() {
      this.$router.push('/fourFactorAuthentication')
    },
    // 查询是否授信接口
    checkAuth: function(flag) {
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
            // 征信
            this.zxShow = this.isAuthRong360 == '3' ? true : false;
            // 运营商
            this.yxsShow = this.isAuthCarrier == '3' ? true : false;
            // 社保
            this.sbShow = this.isAuthsocial == '3' ? true : false;
            // 公积金
            this.gjjShow = this.isAuthFund == '3' ? true : false;
            // 网银
            this.wyShow = this.isAuthBank == '3' ? true : false;
            this.isAuthsocial = res.data.data.isAuthsocial; //社保是否授权
            this.socialAuthDate = res.data.data.socialAuthDate; //社保授权时间
            this.isAuthFund = res.data.data.isAuthFund; //公积金是否授权
            this.fundAuthDate = res.data.data.fundAuthDate; //公积金授权时间 
            this.isAuthBank = res.data.data.isAuthBank; //网银是否授权 
            this.bankAuthDate = res.data.data.bankAuthDate; //网银授权时间
          } else {
            var sel = this;
            this.tipShow = true;
            this.alentText = res.data.msg;
            setTimeout(function() { sel.tipShow = false; }, 1000);
            return;
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
            this.isTdAuth = res.data.data.isTdAuth; //同盾授权结果:0未授权，1认证中，2授权失败，3授权成功，4非本人授权成功，5授权过期
            this.tdBlackBox = res.data.data.tdBlackBox;
            this.tdClientType = res.data.data.tdClientType;
            // 实名
            this.smShow = this.isPassVerify == '0' ? true : false;
            // 四要素
            this.sysShow = this.bankCardVerify == '0' ? true : false;
            // 设备画像
            this.sbhxShow = this.isTdAuth == '3' ? true : false;
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
          this.sbhxShow = true;
        } else {
          // 失败
          var sel = this;
          this.tipShow = true;
          this.alentText = res.data.msg;
          setTimeout(function() { sel.tipShow = false; }, 1000);
          return;
        }
      })
    },
    yunyingshang() {
      // 调用 聚信立 / 立木 接口
      this.post('/operator/getOperatorUrl', {
        // userId: this.custName + '-' + this.certCode + '-app',
        idCardNum: this.certCode,
        phone: this.mobile,
        name: this.custName,
      }).then(res => {
        if (res.data.code == '100000') {
          // 接口直接返地址, 前端不做处理
          window.location.href = res.data.data.url;
          if (res.data.data.code == 'lm') {
            // 跳转到立木
          } else if (res.data.data.code == 'jxl') {
            // 聚信立
          }
        } else {
          var sel = this;
          sel.alertText = res.data.data.errorMsg;
          sel.tipShow = true;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })
    },
    goFourList() {
      localStorage.setItem('from', 'yewu');
      this.$router.push('/fourFactorAuthentication');
    },
    goRealName() {
      localStorage.setItem('jichuOrYewu', 'yewuyemian');
      this.$router.push('/realName');
    },
    gosiyaosu() {
      localStorage.setItem('from', 'yewu');
      localStorage.setItem('fromOrBack', 'yewuyemian');
      this.$router.push('/fourFactorAuthentication');
    },
    resetRZheng(flag) {
      switch (flag) {
        case 'sbhx':
          this.black_box = this.fmOpt.getinfo();
          console.log(this.black_box);
          this.saveTdAuth();
          break;
        case 'yunyshang':
          this.yunyingshang();
          break;
        case 'zhengxin':
          this.post('/socialFund/getRong360AuthUrl', {
            name: this.custName, //客户姓名  
            idNumber: this.certCode, //证件号码  
            phone: this.mobile //手机号码  
          }).then(res => {
            if (res.data.code == 100000) {
              window.location.href = res.data.data.authUrl;
            } else if (res.data.code != 100000) {
              var sel = this;
              this.alentText = res.data.msg;
              this.tipShow = true;
              setTimeout(function() { sel.tipShow = false; }, 3000);
              return;
            }
          });
          break;
        case 'shebao':
          this.getFuShuAuthUrl('01');
          break;
        case 'wangyin':
          this.getFuShuAuthUrl('03');
          break;
        case 'gongjijin':
          this.getFuShuAuthUrl('00');
          break;
      }
    },
    getFuShuAuthUrl(flag) {
      this.post('/socialFund/getFuShuAuthUrl', {
        custName: this.custName,
        certCode: this.certCode,
        mobile: this.mobile,
        // userId: this.custName + '-' + this.certCode + '-app',
        // applySubNo: '',
        category: flag,
        // organization_type: ''
      }).then(res => {
        if (res.data.code == '100000') {
          if (!res.data.data.url) {
            var sel = this;
            this.alentText = '服务器繁忙，请稍后再试!';
            this.tipShow = true;
            setTimeout(function() { sel.tipShow = false; }, 3000);
            return;
          }
          window.location.href = res.data.data.url;
        } else {
          var sel = this;
          this.alentText = '服务器繁忙，请稍后再试!';
          this.tipShow = true;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })
    },
    goList(flag, type) {
      // 四要素  征信 运营商  先做实名
      switch (flag) {
        case 'shouxin':
          console.log(this.isPassVerify)
          // 判断定位
          var location = localStorage.getItem('location');
          console.log(location)
          // if (location == 'false') {
          //   console.log('打开权限')
          //   this.$router.push('/openPermissions')
          //   return;
          // }
          // 判断实名 
          if (this.isPassVerify == '0') {
            this.$router.push('/creditList')
          } else {
            this.statusText = '您暂未进行实名认证，请前去认证！';
            this.rzSbShow = true;
            this.sureRlname = true;
            return;
          }
          break;
        case 'qianyue':
          // 判断实名 
          // 实名 && 四要素
          //this.$router.push("/signAContractList");
          if (this.isPassVerify == '0') {
            if (this.bankCardVerify == '0') {
              this.$router.push("/signAContractList");
            } else {
              this.sysTipShow = true;
            }
          } else {
            this.statusText = '您暂未进行实名认证，请前去认证！';
            this.rzSbShow = true;
            this.sureRlname = true;
            return;
          }
          break;
          //合同查询
        case 'hetong':
          //实名
          if (this.isPassVerify == '0') {
            this.$router.push("/contractInquiryList");
          } else {
            this.statusText = '您暂未进行实名认证，请前去认证！';
            this.rzSbShow = true;
            this.sureRlname = true;
            return;
          }
          break;
          //还款查询
        case 'huankuan':
          //实名
          if (this.isPassVerify == '0') {
            this.$router.push("/repaymentQueryList");
          } else {
            this.statusText = '您暂未进行实名认证，请前去认证！';
            this.rzSbShow = true;
            this.sureRlname = true;
            return;
          }
          break;
        case 'jindu':
          // 进度查询
          if (this.isPassVerify == '0') {
            this.$router.push("/progressQueryList");
          } else {
            this.statusText = '您暂未进行实名认证，请前去认证！';
            this.rzSbShow = true;
            this.sureRlname = true;
            return;
          }
          break;
        case 'shiming':
          if (this.smShow) {
            if (this.isOcrVerify == '0') {
              return;
            } else if (this.isOcrVerify == '1') {
              this.smTipShow = true;
            }
          } else {
            localStorage.setItem('jichuOrYewu', 'yewuyemian');
            this.$router.push('/realName');
          };
          break;
        case 'siyaosu':
          this.getCertiInfo();
          if (this.sysShow) {
            return
          };
          // 判断实名 
          if (this.isPassVerify == '0') {
            //1-认证失败,2-认证中,3-未认证
            if (this.bankCardVerify == '1') {
              this.rzTipShow = true;
            } else if (this.bankCardVerify == '2') {
              var sel = this;
              this.alentText = '认证中，请耐心等待';
              this.tipShow = true;
              setTimeout(function() { sel.tipShow = false; }, 3000);
              return;
            } else if (this.bankCardVerify == '3') {
              localStorage.setItem('from', 'yewu');
              localStorage.setItem('fromOrBack', 'yewuyemian');
              this.$router.push('/fourFactorAuthentication');
            } else if (this.bankCardVerify == '5') {
              // 首次认证  , 重新认证
              this.rzsbTipShow = true;
            };
          } else {
            this.statusText = '您暂未进行实名认证，请前去认证！';
            this.rzSbShow = true;
            this.sureRlname = true;
            return;
          };
          break;
        case 'yunyingshang':
          // 判断实名 
          if (this.isPassVerify == '0') {
            this.checkAuth();
            if (this.isAuthCarrier == '0') {
              //0-未授权
              this.yunyingshang();
            } else if (this.isAuthCarrier == '1') {
              //1-认证中 
              var sel = this;
              this.alentText = '认证中，请耐心等待';
              this.tipShow = true;
              setTimeout(function() { sel.tipShow = false; }, 3000);
              return;
            } else if (this.isAuthCarrier == '2') {
              //2-授权失败 
              this.statusText = '认证失败，请重新认证！';
              this.rzSbShow = true;
              this.flags = 'yunyshang';
            } else if (this.isAuthCarrier == '3') {
              //3授权成功
              this.yxsShow = true;
              return;
            } else if (this.isAuthCarrier == '4') {
              //4非本人授权成功 
              this.statusText = '非本人身份信息授权，请重新认证！';
              this.rzSbShow = true;
              this.flags = 'yunyshang';
            } else if (this.isAuthCarrier == '5') {
              //5-授权过期 
              this.statusText = '认证过期，请重新认证！';
              this.rzSbShow = true;
              this.flags = 'yunyshang';
            };
          } else {
            this.statusText = '您暂未进行实名认证，请前去认证！';
            this.rzSbShow = true;
            this.sureRlname = true;
            return;
          }
          break;
        case 'shebeihuaxiang':
          this.getCertiInfo();
          // 判断实名 
          if (this.isPassVerify == '0') {
            //0:未授权
            if (this.isTdAuth == '0') {
              this.black_box = this.fmOpt.getinfo();
              console.log(this.black_box);
              this.saveTdAuth();
            } else if (this.isTdAuth == '1') {
              //1认证中
              var sel = this;
              this.alentText = '认证中，请耐心等待';
              this.tipShow = true;
              setTimeout(function() { sel.tipShow = false; }, 3000);
              return;
            } else if (this.isTdAuth == '2') {
              //2授权失败
              this.statusText = '认证失败，请重新认证！';
              this.rzSbShow = true;
              this.flags = 'sbhx';
              return;
            } else if (this.isTdAuth == '3') {
              //3授权成功
              this.sbhxShow == true;
              return
            } else if (this.isTdAuth == '4') {
              //4非本人授权成功
              this.statusText = '非本人身份信息授权，请重新认证！';
              this.rzSbShow = true;
              this.flags = 'sbhx';
            } else if (this.isTdAuth == '5') {
              //5授权过期
              this.statusText = '认证过期，请重新认证！';
              this.rzSbShow = true;
              this.flags = 'sbhx';
            }
          } else {
            this.statusText = '您暂未进行实名认证，请前去认证！';
            this.rzSbShow = true;
            this.sureRlname = true;
            return;
          }
          break;
        case 'zhengxin':
          // 判断实名 
          if (this.isPassVerify == '0') {
            this.checkAuth();
            if (this.isAuthRong360 == '0') {
              //0-未授权
              this.post('/socialFund/getRong360AuthUrl', {
                name: this.loginInformation.sysCust.custName, //客户姓名  
                idNumber: this.loginInformation.sysCust.certCode, //证件号码  
                phone: this.loginInformation.sysCust.mobile //手机号码  
              }).then(res => {
                if (res.data.code == 100000) {
                  window.location.href = res.data.data.authUrl;
                } else if (res.data.code != 100000) {
                  var sel = this;
                  this.alentText = res.data.msg;
                  this.tipShow = true;
                  setTimeout(function() { sel.tipShow = false; }, 3000);
                  return;
                }
              });
            } else if (this.isAuthRong360 == '1') {
              //1-认证中 
              var sel = this;
              this.alentText = '认证中，请耐心等待';
              this.tipShow = true;
              setTimeout(function() { sel.tipShow = false; }, 3000);
              return;
            } else if (this.isAuthRong360 == '2') {
              //2-授权失败 
              this.statusText = '认证失败，请重新认证！';
              this.rzSbShow = true;
              this.flags = 'zhengxin';
            } else if (this.isAuthRong360 == '3') {
              //3授权成功
              this.zxShow = true;
              return;
            } else if (this.isAuthRong360 == '4') {
              //4非本人授权成功 
              this.statusText = '非本人身份信息授权，请重新认证！';
              this.rzSbShow = true;
              this.flags = 'zhengxin';
            } else if (this.isAuthRong360 == '5') {
              //5-授权过期 
              this.statusText = '认证过期，请重新认证！';
              this.rzSbShow = true;
              this.flags = 'zhengxin';
            };
          } else {
            this.statusText = '您暂未进行实名认证，请前去认证！';
            this.rzSbShow = true;
            this.sureRlname = true;
            return;
          }
          break;
        case 'shebao':
          //先判断是否实名
          if (this.isPassVerify == '0') {
            this.checkAuth();
            //this.isAuthsocial 0：未授权，1：认证中，2：授权失败，3：本人授权成功，4：非本人授权成功，5：授权过期
            if (this.isAuthsocial == '0') {
              this.getFuShuAuthUrl('01');
            } else if (this.isAuthsocial == '1') {
              //1-认证中 
              var sel = this;
              this.alentText = '认证中，请耐心等待';
              this.tipShow = true;
              setTimeout(function() { sel.tipShow = false; }, 3000);
              return;
            } else if (this.isAuthsocial == '2') {
              //2-授权失败 
              this.statusText = '认证失败，请重新认证！';
              this.rzSbShow = true;
              this.flags = 'shebao';
            } else if (this.isAuthsocial == '3') {
              //3授权成功
              this.sbShow = true;
              return;
            } else if (this.isAuthsocial == '4') {
              //4非本人授权成功 
              this.statusText = '非本人身份信息授权，请重新认证！';
              this.rzSbShow = true;
              this.flags = 'shebao';
            } else if (this.isAuthsocial == '5') {
              //5-授权过期 
              this.statusText = '认证过期，请重新认证！';
              this.rzSbShow = true;
              this.flags = 'shebao';
            };
          } else {
            this.statusText = '您暂未进行实名认证，请前去认证！';
            this.rzSbShow = true;
            this.sureRlname = true;
            return;
          }
          break;
        case 'gongjijin':
          //先判断是否实名
          if (this.isPassVerify == '0') {
            this.checkAuth();
            //this.isAuthsocial 0：未授权，1：认证中，2：授权失败，3：本人授权成功，4：非本人授权成功，5：授权过期
            if (this.isAuthFund == '0') {
              this.getFuShuAuthUrl('00');
            } else if (this.isAuthFund == '1') {
              //1-认证中 
              var sel = this;
              this.alentText = '认证中，请耐心等待';
              this.tipShow = true;
              setTimeout(function() { sel.tipShow = false; }, 3000);
              return;
            } else if (this.isAuthFund == '2') {
              //2-授权失败 
              this.statusText = '认证失败，请重新认证！';
              this.rzSbShow = true;
              this.flags = 'gongjijin';
            } else if (this.isAuthFund == '3') {
              //3授权成功
              this.sbShow = true;
              return;
            } else if (this.isAuthFund == '4') {
              //4非本人授权成功 
              this.statusText = '非本人身份信息授权，请重新认证！';
              this.rzSbShow = true;
              this.flags = 'gongjijin';
            } else if (this.isAuthFund == '5') {
              //5-授权过期 
              this.statusText = '认证过期，请重新认证！';
              this.rzSbShow = true;
              this.flags = 'gongjijin';
            };
          } else {
            this.statusText = '您暂未进行实名认证，请前去认证！';
            this.rzSbShow = true;
            this.sureRlname = true;
            return;
          }
          break;
        case 'wangyin':
          //先判断是否实名
          if (this.isPassVerify == '0') {
            this.checkAuth();
            //this.isAuthsocial 0：未授权，1：认证中，2：授权失败，3：本人授权成功，4：非本人授权成功，5：授权过期
            if (this.isAuthBank == '0') {
              this.getFuShuAuthUrl('03');
            } else if (this.isAuthBank == '1') {
              //1-认证中 
              var sel = this;
              this.alentText = '认证中，请耐心等待';
              this.tipShow = true;
              setTimeout(function() { sel.tipShow = false; }, 3000);
              return;
            } else if (this.isAuthBank == '2') {
              //2-授权失败 
              this.statusText = '认证失败，请重新认证！';
              this.rzSbShow = true;
              this.flags = 'wangyin';
            } else if (this.isAuthBank == '3') {
              //3授权成功
              this.sbShow = true;
              return;
            } else if (this.isAuthBank == '4') {
              //4非本人授权成功 
              this.statusText = '非本人身份信息授权，请重新认证！';
              this.rzSbShow = true;
              this.flags = 'wangyin';
            } else if (this.isAuthBank == '5') {
              //5-授权过期 
              this.statusText = '认证过期，请重新认证！';
              this.rzSbShow = true;
              this.flags = 'wangyin';
            };
          } else {
            this.statusText = '您暂未进行实名认证，请前去认证！';
            this.rzSbShow = true;
            this.sureRlname = true;
            return;
          }
          break;
      }
    },
  }
}
</script>
<style type="text/css" scoped>
.businessList {
  width: 100%;
  height: 100%;
  background: #f6f6f6;
}
.business-list-page {
  width: 100%;
  height: calc( 100% - 1rem);
  overflow: auto;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
}
.businessList-top {
  width: 100%;
  height: 3.01rem;
  background: url(/static/images/bussine_yewu_bg@2x.png) no-repeat;
  background-size: 100% 100%;
}
.businessList-top h1 {
  height: .8rem;
}
.businessList-top h1 span {
  float: left;
  padding: .26rem .12rem 0 .45rem;
}
.businessList-top h1 label {
  float: left;
  font-size: .28rem;
  color: #fff;
  line-height: .8rem;
}
.businessList-top h1 ol li {
  width: .06rem;
  height: .06rem;
  border-radius: 50%;
  background: #fff;
}
.businessList-top h1 ol li:nth-of-type(2) {
  margin: .05rem 0;
}
.businessList-top ul {
  width: 100%;
  height: 2.21rem;
}
.businessList-top ul li {
  width: 25%;
  height: 100%;
  float: left;
}
.businessList-top ul li label {
  position: relative;
  display: block;
  width: 100%;
  height: 1.1rem;
}
.businessList-bottom.businessList-top ul li label img.checked {
  position: absolute;
  width: .31rem;
  height: .28rem;
  bottom: -.08rem;
  right: calc(50% - .4rem);
}
.businessList-top ul li p {
  font-size: .28rem;
  color: #666666;
  text-align: center;
  height: .4rem;
  margin-bottom: .46rem;
  margin-top: .25rem;
}
.businessList-top ul li img:nth-of-type(1) {
  position: absolute;
  bottom: 0;
  left: 50%;
  margin-left: -.3rem;
}
.businessList-top ul li:nth-of-type(1) img {
  width: .6rem;
  height: .6rem;
}
.businessList-top ul li:nth-of-type(2) img {
  width: .6rem;
  height: .6rem;
}
.businessList-top.businessList-bottom.businessList-center ul li:nth-of-type(2) img {
  width: .6rem;
  height: .6rem;
}
.businessList-top.businessList-bottom.businessList-center ul li:nth-of-type(3) img {
  width: .6rem;
  height: .6rem;
}
.businessList-top.businessList-bottom.businessList-center ul li:nth-of-type(1) img {
  width: .59rem;
  height: .56rem;
}
.businessList-bottom {
  margin-top: .2rem;
}
.businessList-top.businessList-bottom ul li:nth-of-type(1) .backImg {
  width: .67rem;
  height: .52rem;
}
.businessList-top.businessList-bottom ul li:nth-of-type(2) img {
  width: .65rem;
  height: .65rem;
}
.businessList-top.businessList-bottom ul li:nth-of-type(3) img {
  width: .61rem;
  height: .6rem;
}
.businessList-top.businessList-bottom ul li:nth-of-type(4) img {
  width: .57rem;
  height: .68rem;
}
.businessList-top.businessList-bottom ul li:nth-of-type(4) img:nth-of-type(2) {
  right: calc(50% - .36rem);
}
.uls {
  width: 100%;
  height: 1.77rem;
  background: #fff;
}
.uls li {
  width: 25%;
  height: 1.22rem;
  float: left;
}
.uls li p {
  font-size: .28rem;
  color: #666666;
  text-align: center;
  height: .4rem;
  margin-bottom: .46rem;
  margin-top: .21rem;
}
.uls li:nth-of-type(1) img {
  width: .6rem;
  height: .61rem;
}
.uls li:nth-of-type(2) img {
  width: .64rem;
  height: .6rem;
}
.uls li:nth-of-type(3) img {
  width: .62rem;
  height: .57rem;
}
.uls li:nth-of-type(4) img {
  width: .6rem;
  height: .6rem;
}
.uls li label {
  position: relative;
  display: block;
  width: 100%;
  height: .61rem;
}
.uls li label img.checked {
  position: absolute;
  width: .31rem;
  height: .28rem;
  bottom: -.08rem;
  right: calc(50% - .5rem);
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
  background: #fff;
}
.rzsbTip .rzsbSure button:nth-of-type(2) {
  float: right;
  background-image: linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%);
  color: #fff;
  margin-right: .38rem;
}
.rzsbTip .rzsbSure button:nth-of-type(3) {
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