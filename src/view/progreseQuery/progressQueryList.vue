<!-- 进度查询 列表 -->
<template>
  <div class="progress-query-list">
    <!-- <div class="list-wrapper" v-show="dataSource.length"> -->
      <ul class="list-wrapper" v-show="dataSource.length">
        <li v-for="item in dataSource" class="list-item" @click="goDetail(item)">
          <div class="top item-div">
            <div class="left">
              <span class="icon font-size26" v-show="!item.productOptionalTxt">信用贷</span>
              <span class="icon font-size26" v-show="item.productOptionalTxt">{{item.productOptionalTxt}}</span>
            </div>
            <div class="right font-size26">{{item.loanProgressTxt}}</div>
          </div>
          <div class="center item-div">
            <div class="left font-size36">{{item.loanAmt}}</div>
            <div class="right font-size30">{{item.appDate}}</div>
          </div>
          <div class="bottom item-div">
            <div class="left font-size24">申请额度(元)</div>
            <div class="right font-size24">申请日期</div>
          </div>
        </li>
      </ul>
    <!-- </div> -->
    <div class="noInformation" v-show="!dataSource.length && !isLoading">
      <p>
        <img src="/static/images/loan_empty_nor@2x.png">
        <span>未发现有效的业务信息</span>
      </p>
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
      msg: 'progressQuery',
      dataSource: [],
      isLoading: true,
      tipShow: false,
      alertText: '',
      arr: [{
          title: '待面签',
          flag: false,
        },
        {
          title: '审批中',
          flag: false,
        },
        {
          title: '审批通过',
          date: '',
          flag: false,
        },
        {
          title: '待放款',
          flag: false,
        },
        {
          title: '放款成功',
          date: '',
          flag: false,
        },
        {
          title: '还款中',
          flag: false,
        },
        {
          title: '已结清',
          date: '',
          flag: false,
        }
      ],
    }
  },
  mounted() {
    this.certCode = localStorage.getItem('certCode');
    this.getList();
  },
  methods: {
    // 进度列表
    getList() {
      Indicator.open();
      this.isLoading = true;
      this.post('/loanProgress/listLoanProgress', {
        certCode: this.certCode
      }).then(res => {
        Indicator.close();
        if (res.data.code == '100000') {
          console.log('==========')
          if (res.data.data.length) {
            for (let i = 0; i < res.data.data.length; i++) {
              let item = {};
              item.applyId = res.data.data[i].applyId;
              item.productOptional = res.data.data[i].productOptional;
              item.productOptionalTxt = res.data.data[i].productOptionalTxt;
              item.loanAmt = res.data.data[i].loanAmt;
              item.appDate = res.data.data[i].appDate;
              item.auditDate = res.data.data[i].auditDate;
              item.accDate = res.data.data[i].accDate;
              item.payoffDate = res.data.data[i].payoffDate;
              item.busiState = res.data.data[i].busiState;
              item.busiStateTxt = res.data.data[i].busiStateTxt;
              item.loanProgress = res.data.data[i].loanProgress;
              item.loanProgressTxt = res.data.data[i].loanProgressTxt;
              item.contAmt = res.data.data[i].contAmt;
              item.modeType = res.data.data[i].modeType;

              if (item.contAmt) {
                var tempArr = (item.contAmt + '').split('.');
                console.log(tempArr)
                if (tempArr.length > 1) {
                  item.contAmt = (parseInt(tempArr[0])).toLocaleString() + '.' + tempArr[1];
                } else {
                  item.contAmt = (parseInt(tempArr[0])).toLocaleString() + '.00';
                }
              } else {
                item.contAmt = '0.00';
              }

              if (item.loanAmt) {
                var tempArr2 = (item.loanAmt + '').split('.');
                if (tempArr2.length > 1) {
                  item.loanAmt = (parseInt(tempArr2[0])).toLocaleString() + '.' + tempArr2[1];
                } else {
                  item.loanAmt = (parseInt(tempArr2[0])).toLocaleString() + '.00';
                }
              } else {
                item.loanAmt = '0.00';
              }

              if (item.appDate) {

                let appDateY = new Date(item.appDate).getFullYear();
                let appDateM = new Date(item.appDate).getMonth() + 1;
                if (appDateM < 10) {
                  appDateM = '0' + appDateM;
                }
                let appDateD = new Date(item.appDate).getDate();
                if (appDateD < 10) {
                  appDateD = '0' + appDateD;
                }
                item.appDate = appDateY + '-' + appDateM + '-' + appDateD;
              }
              //  结清时间
              if (item.payoffDate) {

                let payoffDateY = new Date(item.payoffDate).getFullYear();
                let payoffDateM = new Date(item.payoffDate).getMonth() + 1;
                if (payoffDateM < 10) {
                  payoffDateM = '0' + payoffDateM;
                }
                let payoffDateD = new Date(item.payoffDate).getDate();
                if (payoffDateD < 10) {
                  payoffDateD = '0' + payoffDateD;
                }
                item.payoffDate = payoffDateY + '-' + payoffDateM + '-' + payoffDateD;
              }
              this.dataSource.push(item);
            }
          }
          console.log(this.dataSource);
          this.isLoading = false;
        } else {
          Indicator.close();
          var sel = this;
          sel.alertText = res.data.msg;
          sel.tipShow = true;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })
    },
    // 详情
    goDetail(item) {
      console.log('详情');
      console.log(item)
      // 状态
      // 待面签
      if (item.loanProgress == '0') {
        this.arr[0].title = '待面签';
        this.arr[0].flag = true;
      }
      // 审批中
      if (item.loanProgress == '1') {
        this.arr[0].title = '待面签';
        this.arr[0].flag = true;
        this.arr[1].title = '审批中'
        this.arr[1].flag = true;
      }
      // 2-审批通过,
      if (item.loanProgress == '2') {
        this.arr[0].title = '待面签';
        this.arr[0].flag = true;
        this.arr[1].title = '审批中'
        this.arr[1].flag = true;
        this.arr[2].title = '审批通过';
        this.arr[2].flag = true;
        let auditDateY = new Date(item.auditDate).getFullYear();
        let auditDateM = new Date(item.auditDate).getMonth() + 1;
        if (auditDateM < 10) {
          auditDateM = '0' + auditDateM;
        }
        let auditDateD = new Date(item.auditDate).getDate();
        if (auditDateD < 10) {
          auditDateD = '0' + auditDateD;
        }
        this.arr[2].date = '日期: ' + auditDateY + '-' + auditDateM + '-' + auditDateD;
      }
      // 3-审批未通过,
      if (item.loanProgress == '3') {
        this.arr[0].title = '待面签';
        this.arr[0].flag = true;
        this.arr[1].title = '审批中'
        this.arr[1].flag = true;
        this.arr[2].title = '审批未通过';
        this.arr[2].flag = true;
        let auditDateY = new Date(item.auditDate).getFullYear();
        let auditDateM = new Date(item.auditDate).getMonth() + 1;
        if (auditDateM < 10) {
          auditDateM = '0' + auditDateM;
        }
        let auditDateD = new Date(item.auditDate).getDate();
        if (auditDateD < 10) {
          auditDateD = '0' + auditDateD;
        }
        this.arr[2].date = '日期: ' + auditDateY + '-' + auditDateM + '-' + auditDateD;
      }
      // 4-待放款,
      if (item.loanProgress == '4') {
        this.arr[0].flag = true;
        this.arr[0].title = '待面签';
        this.arr[1].flag = true;
        this.arr[1].title = '审批中'
        this.arr[2].flag = true;
        this.arr[2].title = '审批通过';
        let auditDateY = new Date(item.auditDate).getFullYear();
        let auditDateM = new Date(item.auditDate).getMonth() + 1;
        if (auditDateM < 10) {
          auditDateM = '0' + auditDateM;
        }
        let auditDateD = new Date(item.auditDate).getDate();
        if (auditDateD < 10) {
          auditDateD = '0' + auditDateD;
        }
        this.arr[2].date = '日期: ' + auditDateY + '-' + auditDateM + '-' + auditDateD;
        this.arr[3].flag = true;
        this.arr[3].title = '待放款';
      }
      // 5-放款成功,
      if (item.loanProgress == '5') {
        this.arr[0].flag = true;
        this.arr[0].title = '待面签';
        this.arr[1].flag = true;
        this.arr[1].title = '审批中'
        this.arr[2].flag = true;
        this.arr[2].title = '审批通过';
        let auditDateY = new Date(item.auditDate).getFullYear();
        let auditDateM = new Date(item.auditDate).getMonth() + 1;
        if (auditDateM < 10) {
          auditDateM = '0' + auditDateM;
        }
        let auditDateD = new Date(item.auditDate).getDate();
        if (auditDateD < 10) {
          auditDateD = '0' + auditDateD;
        }
        this.arr[2].date = '日期: ' + auditDateY + '-' + auditDateM + '-' + auditDateD;
        this.arr[3].flag = true;
        this.arr[3].title = '待放款';
        this.arr[4].flag = true;
        this.arr[4].title = '放款成功';
        let accDateY = new Date(item.accDate).getFullYear();
        let accDateM = new Date(item.accDate).getMonth() + 1;
        if (accDateM < 10) {
          accDateM = '0' + accDateM;
        }
        let accDateD = new Date(item.accDate).getDate();
        if (accDateD < 10) {
          accDateD = '0' + accDateD;
        }
        this.arr[4].date = '日期: ' + accDateY + '-' + accDateM + '-' + accDateD;
      }
      // 6-放款失败,
      if (item.loanProgress == '6') {
        this.arr[0].flag = true;
        this.arr[0].title = '待面签';
        this.arr[1].flag = true;
        this.arr[1].title = '审批中'
        this.arr[2].flag = true;
        this.arr[2].title = '审批通过';
        let auditDateY = new Date(item.auditDate).getFullYear();
        let auditDateM = new Date(item.auditDate).getMonth() + 1;
        if (auditDateM < 10) {
          auditDateM = '0' + auditDateM;
        }
        let auditDateD = new Date(item.auditDate).getDate();
        if (auditDateD < 10) {
          auditDateD = '0' + auditDateD;
        }
        this.arr[2].date = '日期: ' + auditDateY + '-' + auditDateM + '-' + auditDateD;
        this.arr[3].flag = true;
        this.arr[3].title = '待放款';
        this.arr[4].flag = true;
        this.arr[4].title = '放款失败';
        let accDateY = new Date(item.accDate).getFullYear();
        let accDateM = new Date(item.accDate).getMonth() + 1;
        if (accDateM < 10) {
          accDateM = '0' + accDateM;
        }
        let accDateD = new Date(item.accDate).getDate();
        if (accDateD < 10) {
          accDateD = '0' + accDateD;
        }
        this.arr[4].date = '日期: ' + accDateY + '-' + accDateM + '-' + accDateD;
      }
      // 7-还款中,
      if (item.loanProgress == '7') {
        this.arr[0].flag = true;
        this.arr[0].title = '待面签';
        this.arr[1].flag = true;
        this.arr[1].title = '审批中'
        this.arr[2].flag = true;
        this.arr[2].title = '审批通过';
        let auditDateY = new Date(item.auditDate).getFullYear();
        let auditDateM = new Date(item.auditDate).getMonth() + 1;
        if (auditDateM < 10) {
          auditDateM = '0' + auditDateM;
        }
        let auditDateD = new Date(item.auditDate).getDate();
        if (auditDateD < 10) {
          auditDateD = '0' + auditDateD;
        }
        this.arr[2].date = '日期: ' + auditDateY + '-' + auditDateM + '-' + auditDateD;
        this.arr[3].flag = true;
        this.arr[3].title = '待放款';
        this.arr[4].flag = true;
        this.arr[4].title = '放款成功';
        let accDateY = new Date(item.accDate).getFullYear();
        let accDateM = new Date(item.accDate).getMonth() + 1;
        if (accDateM < 10) {
          accDateM = '0' + accDateM;
        }
        let accDateD = new Date(item.accDate).getDate();
        if (accDateD < 10) {
          accDateD = '0' + accDateD;
        }
        this.arr[4].date = '日期: ' + accDateY + '-' + accDateM + '-' + accDateD;
        this.arr[5].title = '还款中';
        this.arr[5].flag = true;
      }
      // 8-已结清
      if (item.loanProgress == '8') {
        this.arr[0].flag = true;
        this.arr[0].title = '待面签';
        this.arr[1].flag = true;
        this.arr[1].title = '审批中'
        this.arr[2].flag = true;
        this.arr[2].title = '审批通过';
        let auditDateY = new Date(item.auditDate).getFullYear();
        let auditDateM = new Date(item.auditDate).getMonth() + 1;
        if (auditDateM < 10) {
          auditDateM = '0' + auditDateM;
        }
        let auditDateD = new Date(item.auditDate).getDate();
        if (auditDateD < 10) {
          auditDateD = '0' + auditDateD;
        }
        this.arr[2].date = '日期: ' + auditDateY + '-' + auditDateM + '-' + auditDateD;
        this.arr[3].flag = true;
        this.arr[3].title = '待放款';
        this.arr[4].flag = true;
        this.arr[4].title = '放款成功';
        this.arr[4].date = '日期: ' + new Date(item.accDate).getFullYear() + '-' + (new Date(item.accDate).getMonth() + 1) + '-' + new Date(item.accDate).getDate();
        this.arr[5].flag = true;
        this.arr[5].title = '还款中';
        this.arr[6].flag = true;
        this.arr[6].title = '已结清';
        this.arr[6].date = '日期: ' + new Date(item.payoffDate).getFullYear() + '-' + (new Date(item.payoffDate).getMonth() + 1) + '-' + new Date(item.payoffDate).getDate();
      };
      if(item.modeType == '6'){
        this.arr = this.arr.splice(1,this.arr.length-1);
      }else{
        this.arr = this.arr;
      };
      this.$router.push({
        name: 'progressQueryDetail',
        params: {
          contAmt: item.contAmt,
          loanAmt: item.loanAmt,
          productOptionalTxt: item.productOptionalTxt,
          detail: this.arr
        }
      });
    }
  }
}

</script>
<style scoped>
.progress-query-list {
  width: 100%;
  height: 100%;
  background: #f6f6f6;
}

.progress-query-list .list-wrapper {
  width: 100%;
  height: 100%;
  /*background: #fff;*/
  overflow: auto;
  height: 100%;
  float: left;
  /*margin-bottom: 2rem;*/
}



/*.progress-query-list .main {
  width: 100%;
  height: 100%;
  overflow: auto;
  height: calc( 100% - 3rem );
  float: left;
}*/

.progress-query-list .list-item {
  width: auto;
  height: 1.97rem;
  background: #fff;
  margin-top: 0.2rem;
  padding:0.35rem 0.78rem 0.35rem 0.3rem
}

.progress-query-list .list-item:last-child{
  margin-bottom: 1.5rem;
}

.progress-query-list .list-item .icon {
  display: inline-block;
  width: 1.5rem;
  height: 0.36rem;
  background: url(../../../static/images/loan_cate_bg_nor@2x.png) center no-repeat;
  background-size: 100%;
  color: #fff;
  line-height: 0.36rem;
  text-align: center;
}

.progress-query-list .list-item:first-child {
  margin-top: 0;
}

.progress-query-list .item-div div {
  width: 50%;
  height: 100%;
  float: left;
}

.progress-query-list .item-div .left {
  text-align: left;
}

.progress-query-list .item-div .right {
  text-align: right;
}

.progress-query-list .list-item .top {
  width: 100%;
  height: 0.72rem;
  line-height: 0.72rem;
}

.progress-query-list .list-item .top .right {
  font-family: PingFangSC-Regular;
  color: #333333;
  text-align: right;
}

.progress-query-list .list-item .center {
  width: 100%;
  height: 0.8rem;
  line-height: 0.8rem;
}

.progress-query-list .list-item .center .left {
  font-family: PingFangHK-Regular;
  color: #333333;
  text-align: left;
}

.progress-query-list .list-item .center .right {
  font-family: PingFangHK-Regular;
  color: #333333;
  text-align: right;
}

.progress-query-list .list-item .bottom {
  width: 100%;
  height: 0.53rem;
  line-height: 0.53rem;
}

.progress-query-list .list-item .bottom .left {
  font-family: PingFangHK-Regular;
  color: #666666;
  text-align: left;
}

.progress-query-list .list-item .bottom .right {
  font-family: PingFangHK-Regular;
  color: #666666;
  text-align: right;
}

/* 签约信息为空时 */

.noInformation {
  width: 100%;
  height: 100%;
}

.noInformation p {
  width: 56%;
  height: 8.73rem;
  padding: 2rem 22% 0;
}

.noInformation p img {
  width: 1.69rem;
  height: 1.99rem;
  padding-bottom: .26rem;
  display: block;
  padding-left: calc(50% - 0.84rem);
}

.noInformation p span {
  font-size: .34rem;
  color: #666666;
  display: block;
}

</style>
