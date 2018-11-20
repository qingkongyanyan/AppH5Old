<template>
  <div class="basic-authentication">
    <div class="container">
      <div class="require-wrap">
        <p class="basicAuthentication-p">
          <img src="/static/images/loan_title_nor@2x.png">
          <span>必填项</span>
        </p>
        <ul class="basicAuthentication-ul">
          <li v-for="item in requires" @click="requireItemClick(item)">
            <!-- 
              实名认证
              四要素
              运营商
              设备画像
              信用报告

              统一处理状态
             -->
            <!-- icon -->
            <img :src="item.iconUrl" class="li-firstImg">
            <!-- 更多 箭头 , 根据状态来-->
            <img src="/static/images/more_arrow@2x.png" class="li-secondImg" v-show="item.currentStateTxt!='已认证'&&item.currentStateTxt!='认证中'">
            <span>{{item.authName}}</span>
            <!-- 非已认证 -->
            <label v-show="item.currentStateTxt!='已认证' && item.currentStateTxt!='认证中'">
              {{item.currentStateTxt}}
            </label>
            <!-- 认证中 -->
            <label v-show="item.currentStateTxt=='认证中'" class="normal">
              {{item.currentStateTxt}}
            </label>
            <label v-show="item.currentStateTxt=='已认证'" class="activeLabel">
              {{item.currentStateTxt}}
            </label>
          </li>
        </ul>
      </div>
      <div class="option-wrap" v-show="options.length">
        <p class="basicAuthentication-p">
          <img src="/static/images/loan_title_nor@2x.png">
          <span>选填项</span>
          <span v-show="optionsSelNumber>0">{{optionsSelNumberTxt}}</span>
        </p>
        <ul class="basicAuthentication-ul">
          <li v-for="item in options" @click="optionItemClick(item)">
            <!-- icon -->
            <img :src="item.iconUrl" class="li-firstImg">
            <!-- 更多 箭头 , 根据状态来-->
            <img src="/static/images/more_arrow@2x.png" class="li-secondImg" v-show="item.currentStateTxt!='已认证'&&item.currentStateTxt!='认证中'">
            <span>{{item.authName}}</span>
            <!-- 非已认证 -->
            <label v-show="item.currentStateTxt!='已认证' && item.currentStateTxt!='认证中'">
              {{item.currentStateTxt}}
            </label>
            <!-- 认证中 -->
            <label v-show="item.currentStateTxt=='认证中'" class="normal">
              {{item.currentStateTxt}}
            </label>
            <!-- 已认证 -->
            <label v-show="item.currentStateTxt=='已认证'" class="activeLabel">
              {{item.currentStateTxt}}
            </label>
          </li>
        </ul>
      </div>
    </div>
    <!-- 判断条件 -->
    <a class="disable-btn" v-show="!(requireFlag && optionFlag)">
      <button>
        下一步
      </button>
    </a>
    <a class="active-btn" @click="nextFn" v-show="requireFlag && optionFlag">
      <button>
        下一步
      </button>
    </a>
    <div class="tip" v-show="tipShow" @click="tipShow=false">
      <span>{{alertText}}</span>
    </div>
  </div>
</template>
<script>
import { Indicator } from 'mint-ui';
import ThridContent from '../../util/thridConstant.js'
export default {
  name: 'vue-template',
  data() {
    return {
      msg: 'vue-template',
      custName: '',
      custId: '',
      certCode: '',
      mobile: '',
      requires: [], // 必填项
      options: [], // 选填项
      baseStatus: [], // 所有状态
      optionsSelNumber: '',
      optionsSelNumberTxt: '', // 选填项 至少认证条数
      requireFlag: '', // 必填校验
      optionFlag: '', // 选填校验
      tipShow: false,
      alertText: '',
      modeType: '',
      productId: ''
    }
  },
  mounted() {
    var baseObj = JSON.parse(localStorage.getItem('baseObj'));
    if (baseObj != null) {
      this.modeType = baseObj.modeType;
      this.productId = baseObj.productId;
    } else {
      // 产品模式
      this.modeType = this.$route.query.modeType;
      // 产品id
      this.productId = this.$route.query.productId;
    }

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
    this.mobile = localStorage.getItem('mobile');
    if (this.custName && this.custId && this.certCode) {
      this.getAuthList();
    }
    this.baseStatus = JSON.parse(localStorage.getItem('baseStatus'));
  },
  methods: {
    nextFn() {
      // 下一步
      console.log('点击下一步');
      this.$router.replace('/addCredit');
      this.$router.replace({
        path: 'addCredit',
        query: {
          productId: this.productId,
          modeType: this.modeType
        }
      })
    },
    // 点击类型 分流处理
    switchItemType(type, item) {
      switch (item.requestPassId) {
        case 0: // 实名
          break;
        case 1: // 四要素
          if (item.currentStateTxt != '已认证') {
            localStorage.setItem('fromOrBack', 'jichurenzheng');
            this.$router.push('/fourFactorAuthentication')
          }
          break;
        case 2: // 运营商
          if (item.currentStateTxt != '已认证')
            this.gotoYunyingshang();
          break;
        case 3: // 设备画像
          if (item.currentStateTxt != '已认证') {
            this.black_box = this.fmOpt.getinfo();
            this.saveTdAuth();
          }
          break;
        case 4: // 信用报告
          if (item.currentStateTxt != '已认证')
            this.getRong360Auth();
          break;
        case 5: // 网银
          if (item.currentStateTxt != '已认证')
            this.getFuShuAuthUrl('03');
          break;
        case 6: // 公积金
          if (item.currentStateTxt != '已认证')
            this.getFuShuAuthUrl('00');
          break;
        case 7: // 社保
          if (item.currentStateTxt != '已认证')
            this.getFuShuAuthUrl('01');
          break;
      }
    },
    requireItemClick(item) {
      console.log('点击必填:', item.authName);
      if (item.currentStateTxt == '认证中') {
        this.getAuthList('ing');
      } else {
        // 必填项点击
        this.switchItemType('require', item);
      }
    },
    optionItemClick(item) {
      console.log('点击选填:', item.authName);
      if (item.currentStateTxt == '认证中') {
        this.getAuthList();
      } else {
        // 选填项点击
        this.switchItemType('option', item);
      }
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
          this.getAuthList();
        } else {
          var sel = this;
          sel.alertText = res.data.msg;
          sel.tipShow = true;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })
    },
    getFuShuAuthUrl(type) {
      Indicator.open();
      // 富数调用方法
      this.post('/socialFund/getFuShuAuthUrl', {
        custName: this.custName,
        certCode: this.certCode,
        mobile: this.mobile,
        // userId: this.custName + '-' + this.certCode + '-app',
        // applySubNo: '',
        category: type,
        // organization_type: ''
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
    getRong360Auth() {
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
    gotoYunyingshang() {
      // 这里需要先调 查接口,调用 聚信立 / 立木
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
    getAuthList(type) {
      if (!type)
        Indicator.open();
      this.post('/product/getAuthList', {
        productId: this.productId,
        custId: this.custId,
        userId: this.custName + '-' + this.certCode + '-app',
        orgType: '00'
      }).then(res => {
        Indicator.close();
        console.log(res);
        if (res.data.code == "100000") {
          this.requires = res.data.data.require;
          this.options = res.data.data.options;
          // 必填选填 校验
          // 选填项 至少认证条数
          this.optionsSelNumber = res.data.data.optionsSelNumber;
          this.optionsSelNumberTxt = res.data.data.optionsSelNumberTxt;
          this.requireOption();
        }
      })
    },
    // 必填 选填校验
    requireOption() {
      console.log('判断 必填 选填 条件')
      console.log(this.requires)
      console.log(this.options)
      // 必填
      if (this.requires) {
        // 找到返回 false, 并停止, 否则 true
        // 全满足条件 true, 否则 false
        let countRequire = 0;
        // reduce 本次结果作为 下次的 入参
        this.requires.filter(item => {
          console.log('必填:', item.currentStateTxt)
          console.log('==============')
          if (item.currentStateTxt == '已认证') {
            countRequire++
          }
        })
        if (countRequire != this.requires.length)
          this.requireFlag = false;
        else
          this.requireFlag = true;
      }


      // 选填
      if (this.options) {
        let countOption = 0;
        // reduce 本次结果作为 下次的 入参
        this.options.filter(item => {
          console.log('选填:', item.currentStateTxt)
          console.log('==============')
          if (item.currentStateTxt == '已认证') {
            countOption++
          }
        })
        if (countOption < this.optionsSelNumber)
          this.optionFlag = false;
        else
          this.optionFlag = true;
      }
      console.log('必填:', this.requireFlag)
      console.log('选填:', this.optionFlag)
    }
  }
}

</script>
<style scoped>
.basic-authentication {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.container:before,
.container:after {
  display: table;
  content: '';
  clear: both;
}

.require-wrap,
.option-wrap {
  width: 100%;
  height: auto;
}







/* 必填 选填 title*/

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
  min-height: 1rem;
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

.basicAuthentication-ul li .activeLabel {
  color: #2da8e1;
  padding-right: .5rem;
}

.basicAuthentication-ul li .normal {
  padding-right: .5rem;
}

.li-secondImg {
  width: .12rem;
  height: .22rem;
  float: right;
  padding: .32rem 0 0 .38rem;
}







/* 按钮 */

.active-btn {
  font-size: 0.34rem;
  text-decoration: none;
}

.active-btn button {
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
