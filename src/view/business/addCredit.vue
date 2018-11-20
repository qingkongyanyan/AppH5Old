<!-- 添加授信 -->
<template>
  <div class="add-credit">
    <div class="top">
      <div class="title font-size26">
        填写借款金额(1000元整数倍)
      </div>
      <div class="money">
        <span class="icon"></span>
        <input placeholder="0.00" v-model="loanAmt" @blur="checkLoanAmt">
      </div>
      <div class="title font-size24">
        请选择借款期限
      </div>
      <div class="btns">
        <div class="btn-item" v-for="(item,tag) in btns" :key="tag" :class="tag===index-1?'active':'btn-normal'" @click="clickBtn(item,tag,index)">
          {{item.label}}
        </div>
      </div>
    </div>
    <!-- 输入数据部分 -->
    <div class="center">
      <!-- 借款用途 -->
      <div class="input-item">
        <div class="input-item">
          <span class="icon"></span>
          <div class="value-item select-item" @click="loanPurposeShow=true">
            <span class="title">借款用途</span>
            <div class="input">{{loanPurposeTxt}}</div>
          </div>
        </div>
      </div>
      <div class="input-item">
        <span class="icon"></span>
        <div class="value-item">
          <span class="title">可接受的最高还款额</span>
          <input class="input" placeholder="" v-model="eachTermAmt" @blur="checkEachTermAmt">
          <span class="close" @click="clearHight" v-show="eachTermAmt.length"></span>
        </div>
      </div>
      <!-- 纯电销进件不显示 -->
      <div class="input-item" v-show="modeType!='0'">
        <span class="icon"></span>
        <div class="value-item">
          <span class="title">推荐人手机号</span>
          <input class="input" placeholder="" v-model="intrMob" @blur="checkIntrMob" maxlength="11">
          <span class="close" @click="clearPhone" v-show="intrMob.length"></span>
        </div>
      </div>
      <!-- 纯电销进件不显示 -->
      <div class="input-item" v-show="modeType!='0'">
        <span class="icon"></span>
        <div class="value-item">
          <span class="title font-color-999999">推荐人姓名</span>
          <div class="input">{{intrMobName}}</div>
        </div>
      </div>
      <!-- 
        直销:不可选
        电销:需要选择
       -->
      <!-- 0:直销  带回面审机构 -->
      <div class="input-item" v-show="isTelSaler && isTelSaler == '0' && modeType!='0'">
        <span class="icon"></span>
        <!-- 
          直销 直接根据手机号带回    isTelSaler  0:直销  1:电销
          判断条件 手机号带回的信息
        -->
        <!-- 直销  显示 -->
        <div class="value-item">
          <span class="title">面审机构</span>
          <div class="input">{{appOrgName}}</div>
        </div>
      </div>
      <!-- 直销面审机构 1:电销-->
      <div class="input-item" v-show="isTelSaler && isTelSaler == '1' && modeType!='0'">
        <span class="icon"></span>
        <div class="value-item select-item" @click="selectOrg">
          <span class="title">面审机构</span>
          <!-- 选择回来要显示 -->
          <div class="input" v-show="isSelect">{{appOrgName}}</div>
        </div>
      </div>
      <!-- 保险计划 -->
      <!-- 纯电销进件不显示 -->
      <div class="show-insurance" v-show="modeType!=0">
        <input type="checkbox" name="" class="input-checkbox" :checked="insurancePlan" @click="onClick">
        <span class="input-label font-size24">
          加入保险计划
        </span>
        <span @click="showProtocol('agree')" class="pro-color input-label font-size24">《同意投保及指定受益人证明书》</span>
      </div>
    </div>
    <!-- 提交按钮  -->
    <div class="bottom">
      <!-- 极速模式 -->
      <div v-show="loanAmt && loanTerm && loanPurposeTxt && eachTermAmt && modeType=='0'" :class="[submitAcitve?'active':'submit-btn']" @click="submit">
        提交
      </div>
      <!-- 其他模式 -->
      <div v-show="loanAmt && loanTerm && eachTermAmt && intrMob && intrMobName && loanPurposeTxt && appOrgName && modeType!='0'" :class="[submitAcitve?'active':'submit-btn']" @click="submit">
        提交
      </div>
      <!-- 不可点 -->
      <!-- 极速模式 -->
      <div v-show="(!loanAmt || !loanTerm || !eachTermAmt || !loanPurposeTxt) && modeType=='0'" class="submit-btn-normal">
        提交
      </div>
      <div v-show="(!loanAmt || !loanTerm || !eachTermAmt || !intrMob || !intrMobName || !loanPurposeTxt ||!appOrgName) && modeType!='0'" class="submit-btn-normal">
        提交
      </div>
      <div class="input-label font-size24">
        提交表示已阅读并同意
        <span @click="showProtocol('credit')" class="pro-color">《网络借贷资金存管业务开户协议》</span>
        <span @click="showProtocol('notificationLanBusiness')" class="pro-color">《借款业务风险告知书》</span>
        <span @click="showProtocol('letterOfCredit')" class="pro-color">《信用承诺书》</span>
      </div>
    </div>
    <!-- 弹框 -->
    <div class="tip" v-show="tipShow" @click="tipShow=false">
      <span>{{alentText}}</span>
    </div>
    <mt-popup v-model="loanPurposeShow" position="bottom" class="pop-win">
      <p style="width:100%;padding-top:0.2rem;height:0.8rem;background:#ededed;">
        <button style="float:left;margin-left: 0.2rem;font-size:0.4rem;color:#1f53e7;background:none;" @click="btnClick('cancel')">取消</button>
        <button style="float:right;margin-right:0.2rem;font-size:0.4rem;color:#1f53e7;background:none;" @click="btnClick('sure')">确定</button>
      </p>
      <mt-picker :slots="loanPurposes" @change="onValuesChange" :visible-item-count="5" :show-toolbar="false"></mt-picker>
    </mt-popup>
  </div>
</template>
<script>
// 接口环境配置信息
import appConstant from '../../util/constant'
import SelectOrg from '@/view/business/selectOrg'
import { Indicator } from 'mint-ui';

export default {
  name: 'addCredit',
  components: {
    SelectOrg
  },
  data() {
    return {
      msg: 'addCredit',
      hightInput: false, // 输入最高还款额
      phoneInput: false, // 推荐人手机号
      nameInput: false, // 推荐人姓名
      shwoOrgCheck: false, // 面审机构
      btns: [
        { 'tag': '1', 'label': '12月' },
        { 'tag': '2', 'label': '24月' },
        { 'tag': '3', 'label': '36月' }
      ],
      index: '', // 按钮标志
      isActive: false,
      month: '', // 传给后台的 月份
      submitAcitve: false, // 提交按钮 状态
      loanAmt: '', // 借款金额
      custId: '', // 客户id
      intrMob: '', // 推荐人手机号
      intrMobName: '', // 推荐人姓名
      loanAmt: '', // 借款金额
      loanTerm: '', // 借款期限
      eachTermAmt: '', // 每期最高可还款金额
      insurancePlan: '', // 加入保险计划 0否 1是
      searchId: '', // 融360-爬取信息
      account: '', // 融360登录账户
      jxlToken: '', // 聚信立token
      tdBlackBox: '', // 同盾设备指纹
      tdClientType: '', // 客户端类型
      appOrgCode: '', // 机构编号  根据推荐人手机号查询推荐人姓名时获取
      appOrgName: '', // 机构名称 根据推荐人手机号查询推荐人姓名时获取
      // tipShow: '',
      alentText: '',
      isTelSaler: '', // 是否电销人员  0:否  1:是
      userName: '', // 用户名称
      tipShow: false,
      showSelectOrg: false, // 显示选择机构子组件
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
      isPassVerify: '',
      bankCardVerify: '',
      bankCardNo: '',
      isOcrVerify: '',
      isTdAuth: '',
      tdBlackBox: '',
      tdClientType: '',
      isSelect: false, // 标志是否是选择回来的机构
      loanPurpose: '', // 借款用途
      loanPurposeTxt: '',
      loanPurposeShow: false, // 借款用途 显示
      tempLoanPurpose: '', // 临时 loanPurpose
      tempLoanPurposes: [], // 临时 借款用途数组
      loanPurposes: [{
        flex: 1,
        values: [],
        className: 'slot1',
        textAlign: 'center'
      }],
      modeType: '',
      productId: ''
    }
  },
  watch: {
    intrMob: function(newIntrMob, oldIntrMob) {

    },
    //离开路由 数据从本地取
    '$router' (to, from) {
      console.log('router-router-router-router')
      if (from.name == 'AddCredit' && to.name == 'SelectOrg') {
        console.log(from)
        console.log(to)
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == 'CreditList' && this.appOrgName && this.isTelSaler == '1') {
      // 电销
      localStorage.remoteItem('addOrg');
    }
    next();
  },
  mounted() {
    // 产品模式
    this.modeType = this.$route.query.modeType;
    // 产品id
    this.productId = this.$route.query.productId;


    this.addObj = JSON.parse(localStorage.getItem('addObj'));
    this.certCode = localStorage.getItem('certCode');
    this.custId = localStorage.getItem('custId');
    this.custName = localStorage.getItem('custName');
    this.mobile = localStorage.getItem('mobile');
    console.log(this.addObj)
    if (this.addObj) {
      this.isSelect = true;
      this.loanAmt = this.addObj.loanAmt;
      this.loanTerm = this.addObj.loanTerm;
      this.eachTermAmt = this.addObj.eachTermAmt;
      this.index = this.addObj.index;
      this.month = this.addObj.month;
      this.intrMob = this.addObj.intrMob;
      this.intrMobName = this.addObj.intrMobName;
      this.insurancePlan = this.addObj.insurancePlan;
      this.appOrgCode = this.addObj.appOrgCode;
      this.appOrgName = this.addObj.appOrgName;
      this.id = this.addObj.id;
      this.isTelSaler = this.addObj.isTelSaler;
      this.loanPurpose = this.addObj.loanPurpose;
      this.loanPurposeTxt = this.addObj.loanPurposeTxt;
    }
    this.checkAuth();
    this.getCertiInfo();
    // 获取借款用途
    this.getLoanPurposes();
  },
  methods: {
    btnClick: function(type) {
      switch (type) {
        case 'cancel':
          this.loanPurposeShow = false;
          break;
        case 'sure':
          this.loanPurposeShow = false;
          this.loanPurposeTxt = this.tempLoanPurpose;
          console.log(this.loanPurposeTxt)
          console.log(this.tempLoanPurpose)
          break;
      }
    },
    onValuesChange(picker, values) {
      console.log('=======================')
      console.log(values);
      this.tempLoanPurpose = values[0]
      console.log(this.tempLoanPurpose)
    },
    // 获取借款用途
    getLoanPurposes: function() {
      Indicator.open();
      this.post('/authcredit/getLoanPurpose', {}).then(res => {
        Indicator.close();
        console.log(res)
        if (res.data.code == '100000') {
          var tempArr = res.data.data;
          this.tempLoanPurposes = res.data.data;
          tempArr.map(item => {
            console.log(item);
            this.loanPurposes[0].values.push(item.name);
          })
        }
      })
    },
    // 查询是否授信接口
    checkAuth: function() {
      Indicator.open();
      this.post('/socialFund/checkAuth', {
          custName: this.custName,
          certCode: this.certCode, // 银行卡号
          mobile: this.mobile,
          orgType: '00', // 机构类型  聚信立
          userId: this.custName + '-' + this.certCode + '-app'
        })
        .then(res => {
          Indicator.close();
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
            this.jxlToken = res.data.data.token;
            this.search_id = res.data.data.search_id;
            this.account = res.data.data.account;
          }
        })
    },
    // 获取认证信息
    getCertiInfo: function() {
      Indicator.open();
      this.post('/account/getCertiInfo', { custId: this.custId })
        .then(res => {
          Indicator.close();
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
    // 借款金额检测
    checkLoanAmt: function(value) {
      if (parseInt(this.loanAmt.split('.')[0].replace(',', '')) % 1000 != 0 && this.loanAmt) {
        console.log('=======')
        var sel = this;
        //失败
        this.tipShow = true;
        this.alentText = '借款金额为1000整数倍数';
        this.loanAmt = '';
        setTimeout(function() { sel.tipShow = false; }, 3000);
        return;
      }
      if (this.loanAmt && (parseInt(this.loanAmt.split('.')[0].replace(',', '')) < 10000 || parseInt(this.loanAmt.split('.')[0].replace(',', '')) > 200000)) {
        var sel = this;
        this.tipShow = true;
        this.alentText = '输入数值在10000~200000之间';
        this.loanAmt = '';
        setTimeout(function() { sel.tipShow = false; }, 3000);
        return;
      }
      if (this.loanAmt)
        this.loanAmt = (parseInt(this.loanAmt.split('.')[0].replace(',', ''))).toLocaleString() + '.00';
    },
    // 可接受最高还款额
    checkEachTermAmt: function() {
      if (this.eachTermAmt) {
        if (parseInt((this.eachTermAmt.split('.')[0]).replace(',', '')) < 500 ||
          parseInt(this.eachTermAmt.split('.')[0].replace(',', '')) > 100000) {
          var sel = this;
          this.tipShow = true;
          this.alentText = '请输入500~100000之间的数值';
          this.eachTermAmt = '';
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      }
      if (this.eachTermAmt)
        this.eachTermAmt = (parseInt(this.eachTermAmt.split('.')[0].replace(',', ''))).toLocaleString() + '.00';
    },
    checkIntrMob: function() {
      var regexp = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      if (this.intrMob && (this.intrMob.length != 11 || !regexp.test(this.intrMob))) {
        var sel = this;
        this.tipShow = true;
        this.alentText = '请输入11位电话号码';
        this.intrMob = '';
        setTimeout(function() { sel.tipShow = false; }, 3000);
        return;
      }
      if (this.intrMob) {
        // 这里需要根据推荐人手机号 来请求相关的推荐人 , 面审机构(直销)
        this.getSmUsers(); // 查询推荐人信息
      }
    },
    // 期限选择
    clickBtn: function(item, tag, index) {
      switch (item.label) {
        case '12月':
          this.index = '1';
          this.month = '1';
          this.loanTerm = '12';
          break;
        case '24月':
          this.index = '2';
          this.month = '2';
          this.loanTerm = '24';
          break;
        case '36月':
          this.index = '3';
          this.month = '3';
          this.loanTerm = '36';
          break;
      }
    },
    // 展示 同意投保及指定受益人证明书
    showProtocol: function(type) {
      console.log('点击  协议')
      switch (type) {
        case 'agree':
          window.location.href = appConstant.protocol + 'agreeInsureCertificate.html';
          break;
        case 'credit':
          window.location.href = appConstant.protocol + 'loanProtocol.html';
          break;
        case 'notificationLanBusiness':
          // 借款业务告知书
          window.location.href = appConstant.protocol + 'notificationLanBusiness.html';
          break;
        case 'letterOfCredit':
          // 信用承诺书
          window.location.href = appConstant.protocol + 'letterOfCredit.html';
          break;
      }
    },
    // 根据手机号 查询  推荐人信息
    getSmUsers: function() {
      Indicator.open();
      this.post('/accep/getSmUsers', {
        id: '', // 系统用户 id
        userCode: '', // 用户编码
        userName: '', // 用户名称
        tel: this.intrMob, // 用户电话
        roleCode: '', // 用户角色编码 直销人员: AX02
      }).then(res => {
        Indicator.close();
        console.log(res)
        if (res.data.code == '100000') {
          // 得到结果 更改面审机构 显示状态
          this.shwoOrgCheck = true;
          this.appOrgCode = res.data.data[0].orgCode; // 机构编号
          this.isTelSaler = res.data.data[0].isTelSaler; // 是否电销 0:否  1:是 
          // 电销不显示
          if (this.isTelSaler == '0') {
            this.appOrgName = res.data.data[0].orgName; // 机构名称
          }
          this.intrMobName = res.data.data[0].userName; // 手机号查询的推荐人姓名
        } else {
          var sel = this;
          this.tipShow = true;
          this.alentText = '无当前推荐人，请重新输入！';
          this.intrMob = '';
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })
    },
    // 清空按钮\
    clearHight: function() {
      console.log('清空 最高还款额')
      this.eachTermAmt = '';
    },
    clearPhone: function() {
      console.log('清空 推荐人手机号')
      this.intrMob = '';
      this.appOrgName = '';
      this.intrMobName = '';
    },
    // 提交
    submit: function() {
      // 找对应的 loanPurpose code
      this.tempLoanPurposes.forEach(item => {
        if (item.name == this.loanPurposeTxt) {
          this.loanPurpose = item.code;
        }
      })
      // 电销不需要保险
      if (this.modeType == '0') {
        this.insurancePlan = '';
      }
      if (this.modeType != '0') {
        this.insurancePlan == '1' ? this.insurancePlan = 1 : this.insurancePlan = 0;
      }
      Indicator.open();
      this.post('/authcredit/saveAuthCredit', {
        custId: this.custId, // 客户id  
        intrMob: this.intrMob, // 推荐人手机号
        intrMobName: this.intrMobName, // 推荐人姓名 
        loanAmt: (this.loanAmt.split('.')[0]).replace(',', ''), // 借款金额  
        loanTerm: this.loanTerm, // 借款期限  
        eachTermAmt: (this.eachTermAmt.split('.')[0]).replace(',', ''), // 每期最高可还款金额 
        insurancePlan: this.insurancePlan, // 加入保险计划  0否 1是
        // searchId: this.search_id, // 融360-爬取信息 
        // account: this.account, // 融360登录账户  
        // jxlToken: this.jxlToken, // 聚信立token  
        // tdBlackBox: this.tdBlackBox, // 同盾设备指纹  
        // tdClientType: this.tdClientType, // 客户端类型 
        appOrgCode: this.appOrgCode, // 机构编号 根据推荐人手机号查询推荐人姓名时获取
        appOrgName: this.appOrgName, // 机构名称 根据推荐人手机号查询推荐人姓名时获取
        loanPurpose: this.loanPurpose, // 借款用途 
        modeType: this.modeType, // 模式类型 -> 首页模式列表
        productId: this.productId, // 产品id -> 产品列表

      }).then(res => {
        Indicator.close();
        if (res.data.code == "100000") {
          // this.$router.replace('/addCreditSuccess');
          var sel = this;
          this.alentText = '提交成功，请耐心等待授信结果！';
          this.tipShow = true;
          setTimeout(function() {
            sel.tipShow = false;
            sel.$router.push('/home');
          }, 3000);
          return;
        } else {
          var sel = this;
          this.alentText = res.data.msg;
          this.tipShow = true;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })
    },
    // 选择面审机构
    selectOrg: function() {
      console.log('选择面审机构')
      var addObj = {
        loanAmt: this.loanAmt, // 借款金额
        loanTerm: this.loanTerm, // 借款期限
        eachTermAmt: this.eachTermAmt, // 可接受的最高还款额
        index: this.index, // btn
        month: this.month, // btn
        intrMob: this.intrMob, // 推荐人手机号
        intrMobName: this.intrMobName, // 推荐人姓名
        insurancePlan: this.insurancePlan, // 加入保险计划
        appOrgCode: this.appOrgCode,
        appOrgName: this.appOrgName,
        isTelSaler: this.isTelSaler,
        // 借款用途
        loanPurpose: this.loanPurpose,
        loanPurposeTxt: this.loanPurposeTxt
      }
      localStorage.setItem('addObj', JSON.stringify(addObj));
      this.$router.push('/selectOrg');
    },
    // 是否加入保险计划
    onClick: function(e) {
      console.log(e.target.checked)
      if (e.target.checked)
        this.insurancePlan = '1';
      else
        this.insurancePlan = '0';

    },
  }
}

</script>
<style scoped>
/*添加授信*/

.add-credit {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(-180deg, #f8f9ff 3%, #f9f9f9 96%);
  overflow: auto;
  margin-bottom: 1rem;
}

.title {
  width: 100%;
  height: 0.5rem;
  line-height: 0.5rem;
  margin: 0.2rem 0;
  color: #000;
}







/*头部部分*/

.add-credit .top {
  background: rgba(255, 255, 255, 0.89);
  box-shadow: 0 0.02rem 0.34rem 0 rgba(39, 52, 125, 0.25);
  border-radius: 0.12rem;
  margin: 0.3rem 0.5rem;
  height: 3.42rem;
  padding: 0.2rem 0.4rem;
  text-align: left;
}

.top .money {
  border-bottom: 0.01rem solid #a2b9f1;
  /*opacity: 0.39;*/
  margin: 0.2rem 0;
  width: 100%;
  height: 0.5rem;
}

.top .money .icon {
  display: inline-block;
  width: 0.3rem;
  height: 0.3rem;
  background: url(/static/images/home_cyan_rmb@2x.png) no-repeat;
  background-size: 0.23rem 0.3rem;
}

.top .money input {
  font-family: PingFangSC-Regular;
  font-size: 0.36rem;
  color: #212c68;
  letter-spacing: -0.37px;
  text-align: left;
  height: 0.5rem;
  background: transparent;
  z-index: 100;
  margin: 0.1rem;
  padding: 0;
  margin: 0;
}


.btn-item {
  border: 1px solid #a2b9f1;
  width: 1.5rem;
  height: 0.6rem;
  line-height: 0.6rem;
  float: left;
  text-align: center;
  margin: 0 0.2rem;

  border-radius: 0.1rem;
}

.btn-normal {}

.active {
  background-image: linear-gradient(-216deg, #59d3f2 7%, #6496f5 100%);
  color: #fff;
}



.center {
  margin: 0.5rem;
}







/* 输入 item*/

.input-item {
  width: 100%;
  /*margin: 0 0.4rem;*/
  background: rgba(255, 255, 255, 0.89);
  box-shadow: 0 2px 14px 0 rgba(39, 52, 125, 0.05);
  height: 0.88rem;
  margin-bottom: 0.1rem;
  position: relative;
}


.input-item .icon {
  display: inline-block;
  float: left;
  width: 0.58rem;
  height: 0.3rem;
  background: url(/static/images/bussine_yewu_bg@2x.png) no-repeat left;
  background-size: 0.58rem 0.3rem;
  transform: rotate(-90deg);
  position: absolute;
  top: 0.3rem;
  left: -0.15rem;
}







/* 显示 */

.input-item .normal-item {
  height: 100%;
  line-height: 0.88rem;
  width: calc( 100% - 0.88rem);
  text-align: left;
}







/* 显示输入框 */

.input-item .value-item {
  height: 100%;
  line-height: 0.88rem;
  width: calc( 100% - 0.3rem);
  float: left;
  /*text-indent: 0.5rem;*/
}

.input-item .value-item .title {
  /*width: 40%;*/
  height: 100%;
  line-height: 0.88rem;
  text-align: left;
  display: inline-block;
  margin: 0;
  float: left;
  padding-left: 0.5rem;
  width: calc( 45% - 0.5rem);
  font-size: 0.28rem;
  width: 45%;
}







/* 输入框 */

.input-item .value-item .input {
  /*width: 55%;*/
  line-height: 0.88rem;
  float: left;
  text-align: right;
  width: 50%;
  width: 40%;
  font-size: 0.28rem;
  /*height: 50%;*/
  /*padding: 0.2rem 0;*/
  background: transparent;
  color: #212c68;
}







/* 关闭按钮 */

.input-item .value-item .close {
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

.show-insurance {
  margin-top: 0.4rem;
  width: 100%;
  height: 0.4rem;
}







/*底部 提交 + 协议*/

.bottom {
  margin: 0.5rem;
  color: #000;
  height: 2rem;
  margin-bottom: 1rem;
}







/* 提交按钮 */

.submit-btn {
  width: 100%;
  height: 0.8rem;
  background-image: linear-gradient(-216deg, #59d3f2 7%, #2da8e1 100%);
  border-radius: 0.1rem;
  line-height: 0.8rem;
  color: #fff;
  font-size: 0.34rem;
  margin-bottom: 0.2rem;
}

.submit-btn-normal {
  width: 100%;
  height: 0.8rem;
  background-image: linear-gradient(-216deg, #59d3f2 7%, #2da8e1 100%);
  border-radius: 0.1rem;
  line-height: 0.8rem;
  color: #fff;
  font-size: 0.34rem;
  margin-bottom: 0.2rem;
  opacity: 0.6;
}







/* 保险计划 勾选框 */

.input-checkbox {
  display: inline-block;
  vertical-align: middle;
  float: left;
  height: 0.35rem;
  margin-right: 0.1rem;
}

.input-label {
  float: left;
  line-height: 0.35rem;
}







/* 选择机构 */

.select-org-class {
  position: absolute;
  top: 0px;
  left: 0px;
}







/*checkbox*/

.check-box {
  width: 0.24rem;
  height: 0.24rem;
  position: relative;
  float: left;
  margin-right: 0.1rem;
}

.check-box label {
  cursor: pointer;
  position: absolute;
  width: 0.24rem;
  height: 0.24rem;
  top: 0;
  left: 0;
  background: #eee;
  border: 1px solid #ddd;
}

.check-box label:after {
  opacity: 0;
  content: '';
  position: absolute;
  width: 0.09rem;
  height: 0.05rem;
  background: transparent;
  top: 0.06rem;
  left: 0.07rem;
  border: 0.03rem solid #333;
  border-top: none;
  border-right: none;

  --webkit-transform: rotate(-45deg);
  --moz-transform: rotate(-45deg);
  --moz-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  transform: rotate(-45deg);
}







/**
 * Create the hover event of the tick
 */


/*.check-box label:hover::after {
  opacity: 0.0;
}*/


/**
 * Create the checkbox state for the tick
 */

.check-box input[type=checkbox]:checked+label:after {
  opacity: 1;
}

.check-box input[type=checkbox]:disabled+label:after {
  opacity: 1;
}







/*借款用途*/

.pop-win {
  width: 100%;
  height: auto;
}

.pop-win li {
  width: 100%;
  height: 0.5rem;
}

.picker {
  /*padding-top: 0.8rem!important;*/
}

</style>
