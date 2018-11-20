<!-- 合同查询详情 -->
<template>
  <div class="contractInquiryDetail">
    <!-- <div style="display:none;"> -->
    <div class="list-wrapper" ref="listWrapper">
      <div class='div-top'>
        <div class="first-div">
          <ol>
            <li>{{proTypeTxt}}</li>
            <!-- 信用贷 -->
            <li>{{contAmt}}</li>
            <!-- contAmt -->
            <li>签约金额（元）</li>
          </ol>
        </div>
        <div class="second-div">
          <ol>
            <li>{{contNo}}</li>
            <!-- XY(苏)借字(2016)第014244号 -->
            <li>{{ploanTerm}}</li>
            <li>借款期限（月）</li>
          </ol>
        </div>
      </div>
      <ul class="uls">
        <li v-for="(item,index) in items" :key='index' class="list-li">
          <div class="left-div">
            <ol>
              <li>第{{item.period}}期</li>
              <li>还款日期<span class="font-size24">{{item.repayDate}}</span></li>
            </ol>
          </div>
          <div class="right-div">
            <ol>
              <li>{{item.eachTermAmt}}</li>
              <li>还款金额（元）</li>
            </ol>
          </div>
        </li>
      </ul>
    </div>
    <p class="bottom-button" @click="showHetong">电子合同</p>
    <div class="hetongListRemak" v-show="showList">
      <div class="hetongList" id="hetongList">
        <ul>
          <li v-for="(list,index) in lists" :key='index' @click.stop="clickPdf(list)">
            <a>《{{list.contName}}》</a>
            <!-- <p v-show='showPdf' is="pdfDiv" v-bind:pathUrl="list.signContFileSavePath">111</p> -->
          </li>
        </ul>
        <p @click="showList=false">取消</p>
      </div>
    </div>
    <!-- 弹框 -->
    <div class="tip" v-show="tipShow" @click="tipShow=false">
      <!-- <p> -->
      <span>{{alertText}}</span>
      <!-- </p> -->
    </div>
    <!-- <transition name="mybox"> -->
    <!-- </transition> -->
  </div>
</template>
<script>
//import pdfDiv from './pdf'
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
      showList: false,
      showPdf: false,
      alertText: '',
      tipShow:false
    }
  },
  mounted() {
    this.id = JSON.parse(localStorage.getItem('contractRow')).id;
    console.log(this.id);
    this.getContBasicInfo();
  },
  /*components: {
    pdfDiv
  },*/
  methods: {
    getContBasicInfo() {
      this.post('/cont/contBasicInfo', {
        mainContId: this.id
      }).then(res => {
        if (res.data.status == true) {
          this.proTypeTxt = res.data.data.proTypeTxt ? res.data.data.proTypeTxt : '信用贷'; //信用贷
          if (String(res.data.data.contAmt).indexOf('.') != -1) {
            //有小数点，判断小数位数
            if (String(res.data.data.contAmt).length - (String(res.data.data.contAmt).indexOf('.') + 1) == 1) {
              res.data.data.contAmt = res.data.data.contAmt.toLocaleString() + '0';
            } else {
              res.data.data.contAmt = res.data.data.contAmt.toLocaleString();
            }
          } else {
            //不含小数点
            res.data.data.contAmt = res.data.data.contAmt.toLocaleString() + '.00';
          };
          this.contAmt = res.data.data.contAmt; //金额
          this.contNo = res.data.data.contNo; //合同编号
          this.ploanTerm = res.data.data.ploanTerm; //期限
          // console.log(res.data.data.contRepayPlans);
          if (res.data.data.contRepayPlans.length > 0) {
            this.items = res.data.data.contRepayPlans;
            for (var i = 0; i < this.items.length; i++) {
              //批准金额 如果有小数点且有两位小数，直接赋值，否则加小数点，并补全小数位
              if (String(this.items[i].eachTermAmt).indexOf('.') != -1) {
                //有小数点，判断小数位数
                if (String(this.items[i].eachTermAmt).length - (String(this.items[i].eachTermAmt).indexOf('.') + 1) == 1) {
                  this.items[i].eachTermAmt = this.items[i].eachTermAmt.toLocaleString() + '0';
                } else {
                  this.items[i].eachTermAmt = this.items[i].eachTermAmt.toLocaleString();
                }
              } else {
                //不含小数点
                this.items[i].eachTermAmt = this.items[i].eachTermAmt.toLocaleString() + '.00';
              };
              //将时间戳转为年月日格式
              //console.log(this.items[i].repayDate);
              var newMonth = new Date(this.items[i].repayDate).getMonth() + 1;
              console.log(newMonth);
              console.log(typeof(newMonth));
              if (newMonth == 10 || newMonth > 10) {
                console.log('00000')
                newMonth = newMonth;
              } else if (newMonth < 10) {
                newMonth = '0' + newMonth;
              };
              var newDate = new Date(this.items[i].repayDate).getDate();
              if (newDate == 10 || newDate > 10) {
                newDate = newDate;
              } else {
                newDate = '0' + newDate;
              };
              this.items[i].repayDate = new Date(this.items[i].repayDate).getFullYear() + '-' + newMonth + '-' + newDate;
            } //for循环结束
          };
          if (res.data.data.contEspContBasicInfos && res.data.data.contEspContBasicInfos.length > 0) {
            this.lists = res.data.data.contEspContBasicInfos;
          };
        }
      })
    },
    showHetong() {
      if (!this.lists) {
        var sel = this;
        //失败
        this.tipShow = true;
        this.alertText = '未查找到相关合同';
        setTimeout(function() { sel.tipShow = false; }, 3000);
        return;
      }
      this.showList = !this.showList;
      console.log(this.showList);
    },
    clickPdf(list) {
      console.log(list.signContFileSavePath);

      this.$router.push({ name: 'pdf', params: { list: list.signContFileSavePath } });
      //this.$router.push('pdf');
    },
  },
}

</script>
<style type="text/css" scoped>
.contractInquiryDetail {
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
}

.div-top {
  width: 100%;
  height: 2rem;
  background: #fff;
  margin-bottom: .2rem;
}

.div-top div.first-div {
  /* padding: .39rem 0 0 .53rem; */
  float: left;
  text-align: left;
  width: 40%;
}

.div-top div.second-div {
  padding: .36rem .4rem 0 0;
  float: right;
  text-align: right;
  width: 60%;
}

.div-top div.first-div ol li:nth-of-type(1) {
  margin-left: .22rem;
  margin-top: .35rem;
  width: 1.46rem;
  height: .38rem;
  line-height: .38rem;
  text-align: center;
  font-size: .26rem;
  color: #fff;
  background: url(/static/images/loan_cate_bg_nor@2x.png) no-repeat;
  background-size: 1.44rem 0.38rem;
}

.div-top div ol li:nth-of-type(2) {
  margin-left: .5rem;
  font-size: .36rem;
  color: #333333;
  padding-top: .06rem;
  padding-bottom: .03rem;
}

.div-top div ol li:nth-of-type(3) {
  font-size: .24rem;
  color: #666666;
  margin-left: .5rem;
}

.div-top div.second-div ol li:nth-of-type(1) {
  font-size: .24rem;
  color: #333333;
  padding-right: .13rem;
}

.div-top div.second-div ol li:nth-of-type(2) {
  font-size: .3rem;
  color: #333333;
  padding: .13rem .84rem .07rem 0;
}

.div-top div.second-div ol li:nth-of-type(3) {
  padding-right: 0rem;
  font-size: .24rem;
  color: #666666;
}

.uls {
  width: 100%;
  height: calc(100% - 3.5rem);
  overflow: auto;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.uls .list-li {
  width: 100%;
  height: 1.36rem;
  background: #fff;
  margin-bottom: .09rem;
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

.uls .list-li .right-div {
  float: right;
  width: 50%;
  text-align: right;
  padding-right: .4rem;
}

.uls .list-li .right-div li:nth-of-type(1) {
  font-size: .32rem;
  color: #333333;
  padding-top: .33rem;
  padding-right: .13rem;
}

.uls .list-li .right-div li:nth-of-type(2) {
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
