<!-- 还款查询详情 -->
<template>
  <div class="repaymentQueryDetail">
    <div class="list-wrapper">
      <div class="list-wrapper-div">
        <div class="wrapper-top">
          <ol>
            <li>拖欠期数：<span class="font-size24">{{repaymentRow.arrTermSum}}期</span></li>
            <li>逾期天数：<span class="font-size24">{{repaymentRow.arrDaysSum}}天</span></li>
          </ol>
        </div>
        <div class='wrapper-center'>
          <p>{{repaymentRow.repayAmtSum}}</p>
          <p>当前应还总额（元）</p>
        </div>
        <div class='wrapper-bottom'>
          <div class="first-div">
            <ol>
              <li v-show="repaymentRow.currTerm>0">{{repaymentRow.currTerm-1}}/{{repaymentRow.loanTerm}}</li>
              <!-- contAmt -->
              <li v-show="repaymentRow.currTerm==0">{{repaymentRow.currTerm}}/{{repaymentRow.loanTerm}}</li>
              <li>已还期数</li>
            </ol>
          </div>
          <div class="second-div">
            <ol>
              <li>{{repaymentRow.contAmt}}</li>
              <li>签约金额（元）</li>
            </ol>
          </div>
        </div>
      </div>
      <!-- 列表 -->
      <ul :class="[{activeUls:repaymentRow.accountState == '02'},'uls']">
        <li v-for="(item,index) in items" :key='index' class="list-li">
          <div class="left-div">
            <ol>
              <li>第{{item.period}}期</li>
              <li>还款日期<span class="font-size24">{{item.repayDate}}</span></li>
            </ol>
          </div>
          <div class="center-div">
            <ol>
              <li v-show="item.overFlag=='1' || item.overFlag=='2'">逾期</li>
              <li v-show="item.overFlag=='0'"></li>
            </ol>
          </div>
          <div class="right-div">
            <ol>
              <li v-show="item.payoffFlag=='00'" class="redColor">未结清</li>
              <li v-show="item.payoffFlag=='01'">正常结清</li>
              <li v-show="item.payoffFlag=='02'">提前结清</li>
              <li v-show="item.payoffFlag=='03'">逾期结清</li>
              <li class="font-size24">{{item.actualEachTermAmtSum}}</li>
            </ol>
          </div>
        </li>
      </ul>
    </div>
    <!-- 弹框 -->
    <div class="tip" v-show="tipShow" @click="tipShow=false">
      <!-- <p> -->
      <span>{{alertText}}</span>
      <!-- </p> -->
    </div>
    <p class="bottom-button" v-show="showJqing" @click="showPdf(repaymentRow.payOffCertUrl)">结清证明</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      proTypeTxt: '',
      contAmt: '',
      contNo: '',
      ploanTerm: '',
      items: '',
      lists: '',
      id: '',
      showJqing: false,
      repaymentRow: '', //带过来的信息
      activeUls: '',
      alertText: '',
      contPdfFileUrl: '', //获取到的 pdf 地址
      url: '',
      tipShow: false
    }
  },
  mounted() {
    // 拿到 pdf 显示地址
    // this.getPdfUrl();
    this.repaymentRow = JSON.parse(localStorage.getItem('repaymentRow'));
    //签约金额
    if (String(this.repaymentRow.repayAmtSum).indexOf('.') != -1) {
      //有小数点，判断小数位数
      if (String(this.repaymentRow.repayAmtSum).length - (String(this.repaymentRow.repayAmtSum).indexOf('.') + 1) == 1) {
        this.repaymentRow.repayAmtSum = this.repaymentRow.repayAmtSum.toLocaleString() + '0';
      } else {
        this.repaymentRow.repayAmtSum = this.repaymentRow.repayAmtSum.toLocaleString();
      }
    } else {
      //不含小数点
      this.repaymentRow.repayAmtSum = this.repaymentRow.repayAmtSum.toLocaleString() + '.00';
    };
    //列表
    this.items = this.repaymentRow.repayRecycleList;
    for (var i = 0; i < this.items.length; i++) {
      //日期格式
      var newMonth = new Date(this.items[i].repayDate).getMonth() + 1;
      if (newMonth == 10 || newMonth > 10) {
        //console.log('00000')
        newMonth = newMonth;
      } else if (newMonth < 10) {
        newMonth = '0' + newMonth;
      };
      var newDate = new Date(this.items[i].repayDate).getMonth() + 1;
      if (newDate == 10 || newDate > 10) {
        //console.log('00000')
        newDate = newDate;
      } else if (newDate < 10) {
        newDate = '0' + newDate;
      };
      this.items[i].repayDate = new Date(this.items[i].repayDate).getFullYear() + '-' + (new Date(this.items[i].repayDate).getMonth() + 1) + '-' + newDate;
      //金额
      if (String(this.items[i].eachTermAmtSum).indexOf('.') != -1) {
        //有小数点，判断小数位数
        if (String(this.items[i].eachTermAmtSum).length - (String(this.items[i].eachTermAmtSum).indexOf('.') + 1) == 1) {
          this.items[i].eachTermAmtSum = this.items[i].eachTermAmtSum.toLocaleString() + '0';
        } else {
          this.items[i].eachTermAmtSum = this.items[i].eachTermAmtSum.toLocaleString();
        }
      } else {
        //不含小数点
        this.items[i].eachTermAmtSum = this.items[i].eachTermAmtSum.toLocaleString() + '.00';
      };
    }; //for循环结束
    if (this.repaymentRow.accountState == '02') {
      this.showJqing = true;
    };
    console.log(this.repaymentRow);



  },
  methods: {
    // getPdfUrl() {
    //   this.post('/common/urls', {}).then(res => {
    //     if (res.data.code == '100000') {
    //       this.contPdfFileUrl = res.data.data.contPdfFileUrl;
    //       this.url = this.contPdfFileUrl+"?'a'='123'"
    //       // window.location.href = this.url;
    //     } else {
    //       var sel = this;
    //       //失败
    //       this.tipShow = true;
    //       this.alertText = res.data.msg;
    //       setTimeout(function() { sel.tipShow = false; }, 3000);
    //       return;
    //     }
    //   })
    // },
    showPdf(url) {
      console.log(url);
      if (!url) {
        var sel = this;
        //失败
        this.tipShow = true;
        this.alertText = '暂无此证明, 请联系专属客户经理';
        setTimeout(function() { sel.tipShow = false; }, 3000);
        return;
      }
      // window.location.href = this.contPdfFileUrl + '?url=' +url;
      this.$router.push({ name: 'repaymentQueryPdf', params: { url: url } });
    },
  },
}

</script>
<style type="text/css" scoped>
.repaymentQueryDetail {
  width: 100%;
  height: 100%;
  background: #f6f6f6;
}

.list-wrapper {
  width: 100%;
  height: 100%;
  /*height: 13.3rem;*/
  overflow: auto;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
}

.list-wrapper-div {
  width: 100%;
  height: 3.5rem;
  background: url(/static/images/repayment_topBGView@2x.png) no-repeat;
  background-size: 100% 100%;
}

.wrapper-top {
  width: 100%;
  height: .48rem;
}

.wrapper-top ol li {
  float: left;
  line-height: .48rem;
  font-size: .24rem;
  color: #4076fe;
}

.wrapper-top ol li:nth-of-type(1) {
  margin-left: .68rem;
}

.wrapper-top ol li:nth-of-type(2) {
  margin-left: .8rem;
}

.wrapper-center {
  width: 100%;
  height: 1.64rem;
}

.wrapper-center p:nth-of-type(1) {
  padding-top: .47rem;
  font-size: .48rem;
  color: #fff;
  text-align: center;
}

.wrapper-center p:nth-of-type(2) {
  font-size: .34rem;
  color: #fff;
  text-align: center;
}

.wrapper-bottom {
  width: 100%;
  height: 1.38rem;
}

.wrapper-bottom .first-div {
  float: left;
  width: 50%;
  height: 100%;
  text-align: left;
}

.wrapper-bottom .first-div ol li:nth-of-type(1),
.wrapper-bottom .first-div ol li:nth-of-type(2) {
  padding: .31rem 0 0 .68rem;
  font-size: .3rem;
  color: #fff;
  width: 1.2rem;
  text-align: center;
}

.wrapper-bottom .first-div ol li:nth-of-type(3) {
  padding-left: .68rem;
  font-size: .24rem;
  color: #fff;
  width: 1.2rem;
  text-align: center;
}

.wrapper-bottom .second-div {
  float: right;
  width: 50%;
  height: 100%;
  text-align: right;
}

.wrapper-bottom .second-div ol li:nth-of-type(1) {
  padding: .31rem .68rem 0 0;
  font-size: .3rem;
  color: #fff;
}

.wrapper-bottom .second-div ol li:nth-of-type(2) {
  padding-right: .54rem;
  font-size: .24rem;
  color: #fff;
}

.uls {
  width: 100%;
  /*height: calc(100% - 3.5rem );*/
  height: auto;
  /*overflow: auto;*/
}

.list-wrapper .activeUls {
  /*width: 100%;
  height: auto;
  overflow: auto;
  padding-bottom: 1rem;*/
  margin-bottom: 1rem;
}

.uls .list-li {
  width: 100%;
  height: 1.36rem;
  background: #fff;
  margin-bottom: .09rem;
}

.uls .list-li:last-child {
  margin-bottom: 1.5rem;
}

.uls .list-li .left-div {
  float: left;
  width: 50%;
  text-align: left;
  padding-left: .5rem;
}

.uls .list-li .left-div li:nth-of-type(1) {
  font-size: .26rem;
  color: #333333;
  padding: .37rem 0 .04rem 0;
}

.uls .list-li .left-div li:nth-of-type(2) {
  font-size: .24rem;
  color: #666666;
}

.uls .list-li .left-div li:nth-of-type(2) span {
  padding-left: .1rem;
}

.uls .list-li .center-div {
  width: 20%;
  float: left;
  text-align: center;
}

.uls .list-li .center-div li:nth-of-type(1) {
  font-size: .26rem;
  color: #333333;
  padding: .37rem 0 .04rem 0;
}

.uls .list-li .right-div {
  float: right;
  width: 30%;
  text-align: right;
  padding-right: .4rem;
}

.uls .list-li .right-div li.redColor {
  color: #ff7676;
  font-size: .26rem;
  padding-top: .33rem;
}

.uls .list-li .right-div li:nth-of-type(2),
.uls .list-li .right-div li:nth-of-type(3),
.uls .list-li .right-div li:nth-of-type(4) {
  font-size: .26rem;
  color: #333333;
  padding-top: .33rem;
  /* padding-right:.13rem; */
}

.uls .list-li .right-div li:nth-of-type(5) {
  font-size: .24rem;
  color: #666666;
  padding-right: -.1rem;
}

.bottom-button {
  width: 100%;
  height: .99rem;
  background-image: linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%);
  position: fixed;
  left: 0;
  bottom: 0;
  font-size: .34rem;
  color: #fff;
  text-align: center;
  line-height: .99rem;
}

.hetongListRemak {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(51, 51, 51, 0.7);
}

.hetongList {
  width: 96%;
  height: auto;
  margin-left: 2%;
  position: absolute;
  bottom: .1rem;
  left: 0;
  /* background: #f6f6f6; */
}

.hetongList p {
  width: 100%;
  height: .88rem;
  background: #fff;
  line-height: .88rem;
  font-size: .28rem;
  color: #2da8e1;
  margin-top: .2rem;
  border-radius: 0.1rem;
  font-weight: 800;
}

.hetongList ul {
  width: 100%;
  height: auto;
  border-radius: 0.1rem;
}

.hetongList ul li {
  width: 100%;
  height: .88rem;
  background: #fff;
  line-height: .88rem;
  font-size: .28rem;
  color: #2da8e1;
  border-bottom: 1px solid #eeeeee;
  /* margin-bottom: .1rem; */
}

.hetongList ul li:nth-of-type(1) {
  border-radius: 0.1rem 0.1rem 0 0;
}

.hetongList ul li:nth-last-of-type(1) {
  border-radius: 0 0 0.1rem 0.1rem;
}

.hetongList ul li a {
  font-size: .28rem;
  color: #2da8e1;
}



/* .mybox-leave-active,.mybox-enter-active{
    transition:  all 1s ease; 
  }
  .mybox-leave-active,.mybox-enter{
    height:0px !important;
  }
  .mybox-leave,.mybox-enter-active{
    height: 500px;
  } */

</style>
