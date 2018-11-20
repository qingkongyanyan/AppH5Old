<!-- 授信详情 -->
<template>
  <div>
    <mt-navbar v-model="selected">
      <mt-tab-item id="1">授信结果</mt-tab-item>
      <mt-tab-item id="2">申请信息</mt-tab-item>
    </mt-navbar>
    <!-- tab-container -->
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <!-- 授信结果-未通过  直销 渠道-->
        <div class="credit-info-container credit-info-faild" v-show="state=='2'">
          <span class="msg font-size34">
          <p class="font-size30">
            抱歉您未通过初步审核!
          </p>
          <p class="font-size30">
            综合评分过低
          </p>
          </span>
        </div>
        <!-- 授信结果-通过审核 直销  渠道-->
        <div class="credit-info-container credit-info-success" v-show="(state=='1'||state=='3') &&(modeType=='1'||modeType=='2')">
          <span class="msg font-size30">
          恭喜您 通过初步审核
          </span>
          <div class="need-info">
            <div class="icon"></div>
            
            <ul>
              <li>现需您提供以下资料,到店面签:</li>
              <li></li>
<!--               <li class="li-textarea">
                <textarea style="">{{faceSignInfo}}</textarea>
              </li> -->
              <li>1.身份证原件、复印件</li>
              <li>2.工作证明材料</li>
              <li>具体请以专属客户经理通知为准</li>
            </ul>
          </div>
          <div class='bottom-info font-size30'>
            注:如您已面签,请忽视以上信息,如有疑问请联系您的专属客户经理
          </div>
        </div>
        <!-- 授信结果-通过审核 电销-->
        <div class="credit-info-container credit-info-success" v-show="modeType=='0'">
          <span class="msg font-size30">
          恭喜您 通过初步审核
          </span>
          <div class="need-info need-info-dian">
            <span class="icon"></span>
            <ul>
              <li>请在【业务】 - 【进度查询】查看最新进展</li>
            </ul>
          </div>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <div class="credit-info-container">
          <ul class="info-list">
            <li class="info-item" v-show="dataSource.custName">
              <div class="title">客户姓名</div>
              <div class="label">{{dataSource.custName}}</div>
            </li>
            <li class="info-item" v-show="dataSource.mobile">
              <div class="title">手机号码</div>
              <div class="label">{{dataSource.mobile}}</div>
            </li>
            <li class="info-item" v-show="dataSource.certCode">
              <div class="title">身份证号</div>
              <div class="label">{{dataSource.certCode}}</div>
            </li>
            <li class="info-item" v-show="dataSource.accountCode">
              <div class="title">银行卡号</div>
              <div class="label">{{dataSource.accountCode}}</div>
            </li>
            <li class="info-item" v-show="dataSource.intrMob">
              <div class="title">推荐人手机号</div>
              <div class="label">{{dataSource.intrMob}}</div>
            </li>
            <li class="info-item" v-show="dataSource.intrMobName">
              <div class="title">推荐人姓名</div>
              <div class="label">{{dataSource.intrMobName}}</div>
            </li>
            <li class="info-item" v-show="dataSource.loanAmt">
              <div class="title">借款金额[元]</div>
              <div class="label">{{dataSource.loanAmt}}</div>
            </li>
            <li class="info-item" v-show="dataSource.loanTerm">
              <div class="title">借款期限[月]</div>
              <div class="label">{{dataSource.loanTerm}}</div>
            </li>
            <li class="info-item" v-show="dataSource.loanPurposeTxt">
              <div class="title">借款用途</div>
              <div class="label">{{dataSource.loanPurposeTxt}}</div>
            </li>
            <li class="info-item" v-show="dataSource.eachTermAmt">
              <div class="title">可接受最高还款额[元]</div>
              <div class="label">{{dataSource.eachTermAmt}}</div>
            </li>
            <li class="info-item" v-show="dataSource.insurancePlanTxt && modeType!='0'">
              <div class="title">加入保险计划</div>
              <div class="label">{{dataSource.insurancePlanTxt}}</div>
            </li>
            <li class="info-item" v-show="dataSource.appOrgName">
              <div class="title">面审机构</div>
              <div class="label">{{dataSource.appOrgName}}</div>
            </li>
          </ul>
          <!-- <div class="last-item font-size24">
            已阅读同意
            <span @click="showProtocol('credit')" class='a-link pro-color' @click="showProtocol('credit')">《网络借贷资金存管业务开户协议》</span>
            <span @click="showProtocol('notificationLanBusiness')" class='a-link pro-color'>《借款业务告知书》</span>
            <span @click="showProtocol('letterOfCredit')" class='a-link pro-color'>《信用承诺书》</span>
          </div> -->
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
    <!-- 弹框 -->
    <div class="tip" v-show="tipShow" @click="tipShow=false">
      <!-- <p> -->
      <span>{{alertText}}</span>
      <!-- </p> -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: 'credit-info',
      selected: '1', // 默认
      id: '', // 请求id
      state: '', // 状态 成功失败 列表带
      alertText: '',
      tipShow: false,
      dataSource: '', // 数据
      tempDataSource: '',
      faceSignInfo:'1.身份证原件、复印件↵2.工作证明材料↵3.工作证明材料↵4.工作证明材料↵', // 成功提示
    }
  },
  mounted() {
    console.log(this.$route.params.id)
    this.id = this.$route.params.id;
    // this.state = this.$route.params.state;
    console.log(this.$route.params.state)
    if (this.id)
      this.getInfo();
    else
      this.$router.replace('/creditList')
  },
  methods: {
    showProtocol: function(type) {
      switch (type) {
        case 'credit':
          // http://prenyph.nuoyuan.com.cn/
          window.location.href = appConstant.protocol + 'loanProtocol.html';
          break;
        case 'notificationLanBusiness':
          window.location.href = appConstant.protocol + 'notificationLanBusiness.html';
          break;
        case 'letterOfCredit':
          // 信用承诺书
          console.log(appConstant.protocol + 'letterOfCredit.html')
          window.location.href = appConstant.protocol + 'letterOfCredit.html';
          break;
      }
    },
    getInfo: function() {
      this.post('/authcredit/getAuthCredit', {
        id: this.id
      }).then(res => {
        if (res.data.code == "100000") {
          this.state = res.data.data.authCreditState;
          this.modeType = res.data.data.modeType;// 模式枚举类型
          this.dataSource = res.data.data;
          // this.faceSignInfo = res.data.data.faceSignInfo;// 成功提示
          this.dataSource.custName = '*' + res.data.data.custName.substr(1, 2);
          this.dataSource.mobile = res.data.data.mobile.substr(0, 3) + '****' + res.data.data.mobile.substr(-4);
          this.dataSource.certCode = res.data.data.certCode.replace(res.data.data.certCode.substr(6, 8), '********');

          if (res.data.data.loanAmt) {
            // this.dataSource.loanAmt = parseInt(res.data.data.loanAmt).toLocaleString() + '.00';
            var tempLoanAmt = String(res.data.data.loanAmt).split('.');
            if (tempLoanAmt.length > 1) {
              this.dataSource.loanAmt = parseInt(tempLoanAmt[0]).toLocaleString() + '.' + tempLoanAmt[1];
            } else {
              this.dataSource.loanAmt = parseInt(tempLoanAmt[0]).toLocaleString() + '.00';
            }
          } else {
            this.dataSource.loanAmt = '0.00';
          }

          if (res.data.data.eachTermAmt) {
            // this.dataSource.eachTermAmt = parseInt(res.data.data.eachTermAmt).toLocaleString() + '.00';
            var tempEachtermAmt = String(res.data.data.eachTermAmt).split('.');
            if (tempEachtermAmt.length > 1) {
              this.dataSource.eachTermAmt = parseInt(tempEachtermAmt[0]).toLocaleString() + '.' + tempEachtermAmt[1];
            } else {
              this.dataSource.eachTermAmt = parseInt(tempEachtermAmt[0]).toLocaleString() + '.00';
            }
          } else {
            this.dataSource.eachTermAmt = '0.00';
          }

        } else {
          var sel = this;
          this.tipShow = true;
          this.alertText = res.data.msg;
          setTimeout(function() { sel.tipShow = false; }, 1000);
          return;
        }
      })
    }
  }

}

</script>
<style scoped>
.mint-tab-container {
  height: calc( 100% - 0.46rem);
  overflow: auto;
}

.mint-tab-container-wrap {
  width: 100%;
  height: 100%;
}














/*授信列表 内容 */

.credit-info-container {
  width: 100%;
  height: 100%;
  /*height: auto;*/
  /*background: #fff;*/
  padding-top: 0.5rem;
  overflow: auto;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
}



.credit-info-container .msg {
  display: block;
  width: 100%;
  text-align: center;
  margin-top: 0.5rem;
}














/* 列表无数据 提示*/


/* 审核未通过*/

.credit-info-faild .msg {
  padding-top: 3rem;
}














/* 审核通过  */

.credit-info-success .msg {
  padding-top: 2.5rem;
}

















/*耐心等待审核结果*/

.credit-info-faild {
  background-image: url(../../../static/images/home_authcredit_fail@2x.png);
  background-position: center 10%;
  background-repeat: no-repeat;
  background-size: 2.5rem;
}












/* 审核通过 */

.credit-info-success {
  background-image: url(../../../static/images/home_authcredit_success@2x.png);
  background-position: center 20%;
  background-repeat: no-repeat;
  background-size: 2.5rem;
  background-position: center 0.5rem;
}



















/*申请信息*/

.info-list {
  width: 100%;
  height: auto;
  background: #fff;
  margin-bottom: 1rem;
}

.info-list .info-item {
  margin: 0 0.3rem;
  height: 0.88rem;
  line-height: 0.88rem;
  border-bottom: 1px solid #f6f6f6;
  padding: 0 0.3rem;
}

.info-list .info-item .title {
  width: 50%;
  float: left;
  text-align: left;
  font-size: 0.28rem;
}

.info-list .info-item .label {
  width: 50%;
  float: left;
  text-align: right;
  font-size: 0.28rem;
}















/* 最后一项 */

.last-item {
  font-family: PingFangSC-Regular;
  font-size: 0.24rem;
  color: #333333;
  letter-spacing: -0.54px;
  text-align: left;
  padding: 0 0.4rem;
  line-height: 0.88rem;
  margin-bottom: 1rem;
}












/* 审核通过 需要的资料 */

.need-info {
  /*width: 100%;*/
  background: rgba(255, 255, 255, 0.89);
  box-shadow: 0 2px 34px 0 rgba(39, 52, 125, 0.25);
  border-radius: 0.12rem;
  height: 2.7rem;
  margin: 0 0.4rem;
  /*padding: 0.4rem;*/
  text-align: left;
  line-height: 0.5rem;
  padding-left: 0rem;
  padding-top: 0.1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.need-info .icon {
  background-image: linear-gradient(-216deg, #59d3f2 7%, #6496f5 100%);
  width: 0.12rem;
  height: 2.5rem;
  display: inline-block;
  float: left;
  border-radius: 0 0.2rem 0.2rem 0;
  margin-right: 0.2rem;
}

.need-info li {
  font-size: 0.28rem;
  height: 0.4rem;
}

.bottom-info {
  margin: 0 0.4rem;
  text-align: left;
  line-height: 0.5rem;
}

.mint-tab-item-label {
  font-size: 0.28rem !important;
}

/* 电销成功 提示*/
.need-info-dian{
  height: 0.8rem;
}
.need-info-dian .icon{
  height: 0.65rem;  
}
/*.need-info{
  height: auto;
}*/

.need-info ul{
  height: auto;
  padding-left: 0.3rem;
}
.need-info .li-textarea{
  height: auto;
}
.need-info textarea{
  height: auto;
}
/*.need-info:before{
  content: linear-gradient(-216deg, #59d3f2 7%, #6496f5 100%);
     width: 0.12rem; 
     height: 2.5rem; 
     display: inline-block; 
     float: left; 
     border-radius: 0 0.2rem 0.2rem 0; 
     margin-right: 0.2rem; 
}*/
</style>
