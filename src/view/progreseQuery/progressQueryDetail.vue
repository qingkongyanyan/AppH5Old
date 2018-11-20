<!-- 进度详情 -->
<template>
  <div class="progress-query-detail">
    <div class="detail-wrapper">
      <div class="main">
        <!-- 头部信息 -->
        <div class="head">
          <div>
            <span class="title font-size30" v-show="!productOptionalTxt">信用贷</span>
            <span class="title font-size30" v-show="productOptionalTxt">{{productOptionalTxt}}</span>
          </div>
          <div class="head-value">
            <div class="left">
              <div class="value-div">
                {{loanAmt}}
              </div>
              <div class="title-div">
                申请额度(元)
              </div>
            </div>
            <div class="right">
              <div class="value-div">
                {{contAmt}}
              </div>
              <div class="title-div">
                签约额度(元)
              </div>
            </div>
          </div>
        </div>
        <!-- 时间轴 -->
        <ul class="center">
          <li class="list-item" v-for="item in stateArr">
            <div class="left">
              <span class="icon value-icon" v-show="item.flag"></span>
              <span class="icon normal-icon" v-show="!item.flag"></span>
              <div class="line"></div>
            </div>
            <div class="right">
              <div class="title">
                {{item.title}}
              </div>
              <div class="detail">
                {{item.date}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: '',
      loanAmt: '', // 借款金额
      contAmt: '', // 签约额度
      productOptionalTxt: '', // 借款类型说明
      stateArr: [],
    }
  },
  mounted() {
    console.log("进度详情");
    console.log(this.$route.params.detail)
    this.loanAmt = this.$route.params.loanAmt;
    this.contAmt = this.$route.params.contAmt;
    this.productOptionalTxt = this.$route.params.productOptionalTxt;
    this.stateArr = this.$route.params.detail;
    console.log(this.stateArr)
    console.log(this.loanAmt)
    console.log(this.contAmt)
    if (!this.contAmt) {
      this.$router.go(-1);
    }
  }
}

</script>
<style scoped>
.progress-query-detail {
  width: 100%;
  height: 100%;
}

.progress-query-detail .detail-wrapper {
  width: 100%;
  height: 100%;
}

.progress-query-detail .main {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #f6f6f6;
}

.progress-query-detail .main .head {
  padding-top: 0.66rem;
  width: 100%;
  height: 2.94rem;
  background: url(../../../static/images/loan_progress_bg@2x.png) center no-repeat;
  background-size: 100%;
  color: #fff;
}

.progress-query-detail .main .head div {
  text-align: center;
  margin-bottom: 0.2rem;
}

.progress-query-detail .main .head .title {
  border: 1px solid #ffffff;
  border-radius: 0.22rem;
  width: 1.16rem;
  height: 0.38rem;
  padding: 0.05rem;
  display: inline-block;
}

.progress-query-detail .main .center {
  padding-top: 0.2rem;
  height: 9.13rem;
  overflow: auto;
  padding-bottom: 2rem;
}

.progress-query-detail .main .list-item {
  width: 100%;
  height: 1.3rem;
}

.progress-query-detail .main .list-item .left {
  width: 30%;
  height: 100%;
  float: left;
  position: relative;
}

/*最后一条*/
.progress-query-detail .main .list-item:last-child .left .line {
  height: 0.1rem;
}

.progress-query-detail .main .list-item .left .icon {
  box-shadow: 0 0.1rem 0.2rem 0 rgba(0, 0, 0, 0.30);
  border-radius: 018rem;
  width: 0.22rem;
  height: 0.22rem;
  display: inline-block;
  position: absolute;
  left: calc( 50% - 0.11rem);
  top: 0.1rem;
}
.value-icon {
  background-image: linear-gradient(-216deg, #59d3f2 7%, #6496f5 100%);
}

.normal-icon {
  background-image: linear-gradient(-180deg, #eeeeee 0%, #d8d8d8 100%);
}

.progress-query-detail .main .list-item .left .line {
  width: 1px;
  height: 100%;
  background: #ccc;
}

.progress-query-detail .main .list-item .right {
  width: 70%;
  float: right;
  text-align: left;
  padding-top: 0.1rem;
}

.progress-query-detail .main .list-item .right .title {
  font-family: PingFangSC-Regular;
  font-size: 0.3rem;
  color: #333333;
  text-align: left;
}

.progress-query-detail .main .list-item .right .detail {
  font-family: PingFangSC-Regular;
  font-size: 0.24rem;
  color: #666666;
  text-align: left;
}

.progress-query-detail .head-value {
  width: 100%;
}

.progress-query-detail .head-value .left {
  width: 50%;
  float: left;
}

.progress-query-detail .head-value .right {
  width: 50%;
  float: left;
}

.progress-query-detail .head-value .value-div {
  font-size: 0.4rem;
}

.progress-query-detail .head-value .title-div {
  font-size: 0.3rem;
}

</style>
