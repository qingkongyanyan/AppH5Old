<template>
  <div class="home">
    <!-- 无网络上显示页面 -->
    <div class="home_no" v-show="noNet">
      <p @click="resetLocation">
        <img src="/static/images/localtion2@2x.png">
        <span>正在定位中...</span>
      </p>
      <p></p>
      <p>立即刷新</p>
    </div>
    <div class="home_page" v-show="!noNet">
      <div class="home_first">
        <p class="home_lunbo">
          <!-- <img src="/static/images/localtion2.png">
          <b-map-component></b-map-component> -->
          <mt-swipe :auto="3000" class="swiper">
            <mt-swipe-item v-for="(item,index) in list">
              <img :src="item.picUrl" @click="goUrl(item.jumpAddress)">
            </mt-swipe-item>
          </mt-swipe>
          <img src="/static/images/localtion2@2x.png" class="locationImg">
          <b-map-component></b-map-component>
          <label class="inforImg" v-show="noShowInfor"></label>
          <img src="/static/images/home_infor@2x.png" class="inforImg" v-show="showInfors" @click.stop="geInforList('no')">
          <img src="/static/images/home_infor2@2x.png" class="inforImg" v-show="showInfor" @click.stop="geInforList('yes')">
        </p>
      </div>
      <div class="home_second">
        <!-- <img src="/static/images/informatiion.png">
        <span>诺远普惠客户服务热线：400-010-6886</span> -->
        <img src="/static/images/informatiion.png">
        <span v-show="noShowText"></span>
        <span v-show="showText">诺远普惠客户服务热线：400-010-6886</span>
        <div class="text-container" v-show="showTexts">
          <transition class="inner-container2" name="slide" mode="out-in">
            <p class="text2" :key="text.id" @click="goContent(text)">{{text.val}}</p>
          </transition>
        </div>
      </div>
      <div class="home_three">
        <ul>
          <li @click="goJiSu">
            <p>极速模式</p>
            <p><span>线上审批</span><label>最快30分钟放款</label></p>
          </li>
          <li @click="goGongXin">
            <p>工薪模式</p>
            <p><span>人工审批</span><label>大额优选</label></p>
          </li>
          <li @click="goTongYe">
            <p>同业模式</p>
            <p><span>保单 / 平安薪易贷用户优选</span></p>
          </li>
        </ul>
      </div>
      
    </div>
    <Tabbar class="tab-bar"></Tabbar>
    <!-- 弹框 -->
    <div class="tip" v-show="tipShow" @click="tipShow=false">
      <!-- <p> -->
      <span>{{alentText}}</span>
      <!-- </p> -->
    </div>
  </div>
</template>
<script type="text/javascript">
import Tabbar from '../tabbar'
import BMapComponent from './bmap'
import { MessageBox } from 'mint-ui';
import { Swipe, SwipeItem } from 'mint-ui';
const totalDuration = 2000;
export default {
  data() {
    return {
      noNet: false,
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
      alertText: '',
      tempDataSource: '',
      smTipShow: false,
      tipShow:false,
      alentText:'',
      list: [],
      textArr: [{ title: '' }],
      showText: false,
      noShowText:true,
      showTexts:false,
      number: 0,
      showInfor: false,
      showInfors:false,
      noShowInfor:true,
    }
  },
  components: {
    Tabbar,
    BMapComponent
  },
  computed: {
    text() {
      return {
        id: this.number,
        val: this.textArr[this.number] ? this.textArr[this.number].title : '',
        content: this.textArr[this.number] ? this.textArr[this.number].content : '',
        messageId: this.textArr[this.number] ? this.textArr[this.number].id : '',
        textArr: this.textArr[this.number] ? this.textArr[this.number] : '',
      }
    }
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
    };

    this.judgeInfor();
    this.getSwipe();
    this.getText();
    this.startMove();
  },
  methods: {
  	//跳转到极速模式
  	goJiSu(){
  		this.$router.push('/turboMode');
      /*var sel = this;
          //失败
          this.tipShow = true;
          this.alentText = '敬请期待！';
          setTimeout(function() { sel.tipShow = false; }, 1500);
          return;*/
  	},
  	//跳转到工薪模式
  	goGongXin(){
  		this.$router.push('/payrollModel');
  	},
  	//跳转到同业模式
  	goTongYe(){
  		this.$router.push('/interbankModel');
  	},
    //轮播
    getSwipe() {
      this.post('/carouselPic/getCarouselPicList').then(res => {
        if (res.data.code == '100000') {
          this.list = res.data.data;
          /*console.log(this.list);
          console.log(this.list.length);
          console.log(document.querySelector(".mint-swipe-indicators"));*/
          var swipeButton = document.querySelector(".mint-swipe-indicators");
          if(this.list.length == 1){
            swipeButton.style.display = 'none';
          }else{
            swipeButton.style.display = 'block';
          }
        }
      })
    },
    goUrl(url) {
      /*var reg = /^((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)$/;*/
      var timestamp = Date.parse(new Date());
      if(url){
        window.location.href = url;
        //window.location.href = url+'?date='+timestamp;
        /*if(reg.test(url)){
          window.location.href = url;
        }*/
      };
    },
    //文字滚动
    getText() {
      this.post('message/getLoopMessage', { custId: this.custId }).then(res => {
        if (res.data.code == '100000') {
          if (res.data.data.length > 0) {
            this.textArr = res.data.data;
            console.log(this.textArr);
            this.showTexts = true;
            this.noShowText = false;
            this.showText = false;
          } else {
            this.showText = true;
            this.showTexts = false;
            this.noShowText = false;
            console.log(this.textArr);
          }
        };
      })
    },
    startMove() {
      let timer = setTimeout(() => {
        if (this.number === this.textArr.length - 1) {
          this.number = 0;
        } else {
          this.number += 1;
        }
        this.startMove();
      }, totalDuration)
    },
    //文字轮播进入内容页
    goContent(item) {
      console.log(item);
      //return
      localStorage.setItem('inforContent',item.content);
      this.$router.push({ path: '/content', query: { id:item.messageId } });
      /*this.$router.push({ path: '/content', query: { item: item.textArr,content:item.content,id:item.messageId } });*/
    },
    //判断是否有未读消息
    judgeInfor() {
      this.post('message/getUnreadNum', { custId: this.custId }).then(res => {
        if (res.data.code == '100000') {
          console.log(this.showInfor);
          if (res.data.data > 0) {
            this.showInfor = true;
            this.showInfors = false;
            this.noShowInfor = false;
          } else {
            this.showInfor = false;
            this.showInfors = true;
            this.noShowInfor = false;
          }
        }
      })
    },
    //进入消息中心
    geInforList(flag) {
      this.$router.push({ path: '/inforList', query: { flag: flag } });
    },
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
    },
    //重新获取定位
    resetLocation() {
      alert("123");
      this.noNet = false;
    },
  },
}

</script>
<style scoped>
.home {
  width: 100%;
  height: 100%;
  background: #f6f6f6;
}

.home_no {
  width: 100%;
  height: 100%;
  margin-bottom: 1rem;
}

.home_no p:nth-of-type(1) {
  width: 100%;
  height: 2.17rem;
}

.home_no p:nth-of-type(2) {
  width: 4.64rem;
  height: 2.82rem;
  margin: 0 auto;
  /* margin: 2.17rem 0 1.06rem 1.44rem; */
  background: url(/static/images/home-bj.png) no-repeat;
  background-size: 100% 100%;
}

.home_no p:nth-of-type(3) {
  width: 4.64rem;
  height: 1rem;
  background: #ffffff;
  box-shadow: 0 14px 24px 0 rgba(162, 185, 241, 0.47);
  border-radius: 100px;
  font-size: .48rem;
  line-height: 1rem;
  color: #a2b9f1;
  text-align: center;
  margin: 0 auto;
  margin-top: 1.06rem;
}

.home_no p:nth-of-type(1) img {
  width: .5rem;
  height: .5rem;
  padding: .14rem .07rem 0 .2rem;
  display: block;
  float: left;
}

.home_no p:nth-of-type(1) span {
  padding-left: .07rem;
  color: #21335b;
  font-size: .28rem;
  float: left;
  padding-top: .13rem;
}

.home_page {
  width: 100%;
  height: 100%;
  margin-bottom: 1rem;
}

.home_first {
  width: 100%;
  height: 3.22rem;
}

.home_second {
  width: 100%;
  height: .79rem;
  line-height: .79rem;
  /* background: pink; */
}

.home_three {
  width: 100%;
  height: calc(100% - 4.01rem);
}

.home_lunbo {
  width: 100%;
  height: 100%;
  /* background: url(/static/images/banner0222@2x.png) no-repeat;
  background-size: 100% 100%; */
  position: relative;
}

.home_lunbo .swiper img {
  position: absolute;
  left: 0;
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;
}

.home_lunbo img.locationImg {
  position: absolute;
 /*  width: .26rem;
 height: .38rem; */
  left: .2rem;
  top: .14rem;
  display: block;
  float: left;
  width: .5rem;
  height: .5rem;
}

.home_lunbo img.inforImg {
  position: absolute;
  /* width: .34rem;
  height: .36rem; */
  right: .42rem;
  top: .14rem;
  display: block;
  float: right;
  width: .5rem;
  height: .5rem;
}

.home_lunbo span {
  position: absolute;
  left: .88rem;
  top: .14rem;
  color: #21335b;
  font-size: .28rem;
  float: left;
}

.home_second img {
  width: .35rem;
  height: .33rem;
  padding: .16rem .06rem 0 5%;
  float: left;
}

.home_second span {
  display: inline-block;
  width: calc(90% - .35rem);
  height: .79rem;
  color: #475669;
  font-size: .24rem;
  text-align: left;
  float: left;
}

.home_three ul {
  width: 100%;
  height: 100%;
}

.home_three ul li {
  width: 90%;
  height: 2.04rem;
  margin-bottom: .29rem;
  margin-left: 5%;
}

.home_three ul li:nth-of-type(1) {
  background: url(/static/images/hone_jisu.png) no-repeat;
  background-size: 100% 100%;
}

.home_three ul li:nth-of-type(2) {
  background: url(/static/images/home_gongxin.png) no-repeat;
  background-size: 100% 100%;
}

.home_three ul li:nth-of-type(3) {
  background: url(/static/images/home_tongye.png) no-repeat;
  background-size: 100% 100%;
}

.home_three ul li p:nth-of-type(1) {
  font-size: .48rem;
  color: #fff;
  padding-top: .46rem;
  text-align: center;
  padding-bottom: .22rem;
}

.home_three ul li p:nth-of-type(2) label {
  font-size: .28rem;
  color: #fff;
  text-align: center;
}

.home_three ul li p:nth-of-type(2) span {
  padding-right: .12rem;
  font-size: .28rem;
  color: #fff;
  text-align: center;
}

.text-container {
  display: inline-block;
  width: calc(90% - .4rem);
  height: .79rem;
  line-height: .79rem;
  color: #475669;
  font-size: .24rem;
  text-align: left;
  float: left;
  overflow: hidden;
}

.text-container p{
  font-size: .26rem;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text2 {
  margin: 0;
}

@keyframes myMove {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-150px);
    }
  }

.inner-container {
  animation: myMove 5s linear infinite;
  animation-fill-mode: forwards;
}

.inner-container2 {
  animation: myMove2 3s linear infinite;
  animation-fill-mode: forwards;
}

@keyframes myMove2 {
  0% {
    transform: translateY(0);
  }

  10% {
    transform: translateY(-10px);
  }

  20% {
    transform: translateY(-10px);
  }

  30% {
    transform: translateY(-20px);
  }

  40% {
    transform: translateY(-20px);
  }

  50% {
    transform: translateY(-30px);
  }

  60% {
    transform: translateY(-30px);
  }

  70% {
    transform: translateY(-40px);
  }

  80% {
    transform: translateY(-40px);
  }

  90% {
    transform: translateY(-50px);
  }

  100% {
    transform: translateY(-50px);
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s linear;
}

.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-enter {
  transform: translateY(10px);
  opacity: 0;
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
  font-size: .34rem;
  opacity: 0.8;
  background: #000000;
  border-radius: 10px;
  /* padding: .81rem .56rem;
  margin-top: 3.74rem; */
  padding: .6rem .76rem;
  margin-top: 4.24rem;
  display: inline-block;
}
</style>
