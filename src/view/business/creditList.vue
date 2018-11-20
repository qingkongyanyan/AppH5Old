<!-- 授信列表 -->
<template>
  <div class="credit-list background-f6f6f6">
    <!-- 有数据 -->
    <div class="credit-container" v-show="dataSource.length && !isLoading">
      <div v-for="item in dataSource" class="credit-list-item" :class="{
          'credit-list-item-bg-doing':item.authCreditState==0,
          'credit-list-item-bg-success':item.authCreditState==1,
          'credit-list-item-bg-faild':item.authCreditState==2,
          'credit-list-item-bg-end':item.authCreditState==3
        }" @click="getInfo(item)">
        <div class="credit-list-item-title">
          <div class="icon"></div>
          <div class="name label">{{item.custName}}</div>
        </div>
        <div class="credit-list-item-money">
          <div class="icon"></div>
          <div class="money label">{{item.loanAmt}}</div>
        </div>
        <div class="credit-list-item-date">
          <div class="icon"></div>
          <div class="date label">{{item.createDate}}</div>
        </div>
      </div>
      <div style="background:#f6f6f6;height:0.5rem;"></div>
    </div>
    <!-- 无数据 -->
    <!--  -->
    <div class="credit-container credit-empty" v-show="!dataSource.length && !isLoading" >
      <span class="msg font-size34" >
        您未发起有效的授信申请
        <!-- 尊敬的客户,请您耐心等待审核结果! -->
        <!-- {{msg}} -->
      </span>
    </div>
    <!-- 添加授信按钮 -->
 <!--    <div class="credit-add-item" @click="addItem">
      添加授信
    </div> -->
    <!-- 弹框 -->
    <div class="tip" v-show="tipShow" @click="tipShow=false">
      <span>{{alertText}}</span>
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
      <!-- <img src="/static/images/tip-close.png" @click="smTipShow=false"> -->
    </div>
  </div>
</template>
<script>
import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';
export default {
  name: 'creditList',
  data() {
    return {
      msg: '',
      custId: '', // 客户ID
      dataSource: [], // 返回的授信 列表数据
      tempDataSource: [],
      tempDataSource2: [],
      tipShow: false,
      alertText: '',
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
      isLoading: false,
      smTipShow: false,
    }
  },
  mounted() {
    this.custId = localStorage.getItem('custId');
    this.certCode = localStorage.getItem('certCode');
    // this.custId = 'ua6z7t5zjJ89lbuIr1xrIcilko0eklyifIpD';
    this.custName = localStorage.getItem('custName');
    this.mobile = localStorage.getItem('mobile');
    this.getList();
    this.checkAuth();
    this.getCertiInfo();
  },
  methods: {
    goRealName() {
      localStorage.setItem('jichuOrYewu', 'yewuyemian');
      this.$router.push('/realName');
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
          } else {
            var sel = this;
            this.tipShow = true;
            this.alertText = res.data.msg;
            setTimeout(function() { sel.tipShow = false; }, 3000);
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
    // 获取授信列表
    getList: function() {
      this.isLoading = true;
      Indicator.open();
      this.post('/authcredit/getAuthCreditList', {
        custId: this.custId
      }).then(res => {
        console.log(res);
        this.isLoading = false;
        Indicator.close();
        if (res.data.code == '100000') {
          this.tempDataSource = res.data.data;
          console.log(this.tempDataSource);
          console.log(this.tempDataSource[0]);

          for (let i = 0; i < this.tempDataSource.length; i++) {
            let item = this.tempDataSource[i];
            item.custName = item.custName.replace(item.custName.substr(0,1),'*');
            item.loanAmt = (item.loanAmt).toLocaleString() + '.00';
            let Y = new Date(item.createDate).getFullYear();
            let M = new Date(item.createDate).getMonth() + 1;
            let D = new Date(item.createDate).getDate();

            item.createDate = Y + '-' + M + '-' + D;
            this.dataSource.push(item);
          }
          console.log(this.dataSource);

          // this.dataSource = this.tempDataSource.map(item=>{
          //   console.log(item);
          //   item.loanAmt = (item.loanAmt).toLocaleString() + '.00';
          //   item.createDate = new Date(item.createDate);
          // })
        } else if (res.data.code == '10070004') {
          // 未找到相关内容
          this.msg = '您未发起有效的授权申请'
        }
      })
    },
    // 点击详情
    getInfo: function(item) {
      console.log('点击 授信详情');
      if (item.authCreditState == '0') {
        // 授信中  弹窗
        // MessageBox('提示', '尊敬的客户，请您耐心等待审核结果');
        // 
        var sel = this;
        this.tipShow = true;
        this.alertText = '尊敬的客户，请您耐心等待审核结果';
        setTimeout(function() { sel.tipShow = false; }, 3000);
        return;
      }
      this.$router.push({
        name: 'CreditInfo',
        params: { 
          id: item.id
        }
      })
    },
    // 添加授信
    // addItem: function() {
    //   this.getCertiInfo();
    //   this.checkAuth();
    //   console.log('点击添加授信');
    //   // 老用户 未ocr
    //   if (this.isPassVerify == '0' && this.isOcrVerify == '1') {
    //     this.smTipShow = true;
    //     // MessageBox.confirm('实名信息未完善，请您完善！').then(action => {
    //     //   this.$router.push('/realName');
    //     // });
    //     return;
    //   }

    //   // 先判断 地理位置
    //   // 判断定位
    //   var location = localStorage.getItem('location');
    //   console.log(location)
    //   if (location == 'false') {
    //     console.log('打开权限')
    //     this.$router.push('/openPermissions')
    //     return;
    //   }
      
    //   // 已经实名 , 其他有一项未做
    //   if (this.isPassVerify == '0' && this.isOcrVerify == '0' && this.isTdAuth != '3' && this.bankCardVerify != '0' && this.isAuthCarrier != '3' && this.isAuthRong360 != '3') {
    //     // 判断定位
    //     var location = localStorage.getItem('location');
    //     console.log(location)
    //     if (location == 'false') {
    //       console.log('打开权限')
    //       this.$router.push('/openPermissions')
    //       return;
    //     } else {
    //       console.log('基础认证')
    //       this.$router.push('/basicAuthentication')
    //       return;
    //     }
    //   }

    //   if (this.isPassVerify == '0' && this.isOcrVerify == '0' && (this.isTdAuth != '3' || this.bankCardVerify != '0' || this.isAuthCarrier != '3' || this.isAuthRong360 != '3')) {
    //     // 判断定位
    //     var location = localStorage.getItem('location');
    //     console.log(location)
    //     if (location == 'false') {
    //       console.log('打开权限')
    //       this.$router.push('/openPermissions')
    //       return;
    //     } else {
    //       console.log('基础认证')
    //       // this.getList();
    //       this.$router.push('/basicAuthentication')
    //       return;
    //     }
    //   }


    //   // isPassVerify  实名  0:是  1:否
    //   // isOcrVerify    ocr   0:是  1:否
    //   if (this.isPassVerify == '1' || this.isOcrVerify == '1') {
    //     // 判断定位
    //     var location = localStorage.getItem('location');
    //     console.log(location)
    //     if (location == 'false') {
    //       console.log('打开权限')
    //       this.$router.push('/openPermissions')
    //       return;
    //     } else {
    //       console.log('基础认证')
    //       // this.getList();
    //       this.$router.push('/basicAuthentication')
    //       return;
    //     }
    //   }

    //   if (
    //     this.isPassVerify == '0' && this.isOcrVerify == '0' && this.bankCardVerify == '0' && this.isTdAuth == '3' && this.isAuthCarrier == '3' && this.isAuthRong360 == '3') {
    //     this.post('/authcredit/checkAuthCredit', {
    //       certCode: this.certCode,
    //       custName: this.custName,
    //       custId: this.custId
    //     }).then(res => {
    //       if (res.data.code == '100000') {
    //         this.$router.push('/addCredit')
    //       } else {
    //         var sel = this;
    //         //失败
    //         this.tipShow = true;
    //         this.alertText = res.data.msg;

    //         setTimeout(function() { sel.tipShow = false; }, 3000);
    //         return;
    //       }
    //     })
    //     return;
    //   }
    // }
  }
}

</script>
<style scoped>
.credit-list {
  width: 100%;
  height: 100%;
  padding-bottom: 0 !important;
}



/*授信列表 内容 */

.credit-container {
  width: 100%;
  height: 100%;
  /*background: #fff;*/
  overflow: auto;
  height: calc( 100% - 3rem );
  float: left;
}

/*列表 item 样式*/

.credit-list-item {
  width: 100%;
  height: 1.78rem;
  background: #fff;
  margin: 0.15rem 0;
  padding: 0 0.3rem;
  padding-top: 0.1rem;
}

.credit-list-item:nth-child(1) {
  margin-top: 0.05rem;
}

/*根据不通的 数据给不同的样式*/


/*授信中*/

.credit-list-item-bg-doing {
  background-image: url(../../../static/images/appointmentListItem_doing@2x.png);
  background-position: 90%;
  background-repeat: no-repeat;
  background-size: 2rem;
}

/*已成功*/

.credit-list-item-bg-success {
  background-image: url(../../../static/images/appointmentListItem_commit@2x.png);
  background-position: 90%;
  background-repeat: no-repeat;
  background-size: 2rem;
}
























/*已经失败*/

.credit-list-item-bg-faild {
  background-image: url(../../../static/images/appointmentListItem_fail@2x.png);
  background-position: 90%;
  background-repeat: no-repeat;
  background-size: 2rem;
}
























/*已经结束*/

.credit-list-item-bg-end {
  background-image: url(../../../static/images/appointmentDetail_over2@2x.png);
  background-position: 90%;
  background-repeat: no-repeat;
  background-size: 2rem;
}
























/*添加授信列表*/

.credit-list-item div {
  text-align: left;
}

.credit-list-item .icon {
  display: inline-block;
  width: 0.4rem;
  height: 0.4rem;
  float: left;
}

.credit-list-item .label {
  float: left;
  margin-left: 0.3rem;
  line-height: 33%;
}
























/*姓名*/

.credit-list-item-title {
  height: 33%;
  line-height: 33%;
}



.credit-list-item-title .icon {
  background: url(../../../static/images/name_icon@2x.png) no-repeat right;
  background-size: 0.4rem;
  vertical-align: middle;
}

.credit-list-item-title .name {
  opacity: 0.9;
  font-family: PingFangSC-Regular;
  font-size: 0.32rem;
  color: #333333;
  text-align: left;
  line-height: 0.4rem;
}
























/*金额*/

.credit-list-item-money {
  height: 33%;
  line-height: 33%;
}

.credit-list-item-money .icon {
  background: url(../../../static/images/home_tongye_nor@2x.png) no-repeat right;
  background-size: 0.4rem;
  vertical-align: middle;
}

.credit-list-item-money .money {
  opacity: 0.9;
  font-family: PingFangSC-Regular;
  font-size: 0.32rem;
  color: #333333;
  text-align: left;
  line-height: 0.4rem;
}
























/*日期*/

.credit-list-item-date {
  height: 33%;
  line-height: 33%;
}

.credit-list-item-date .icon {
  background: url(../../../static/images/appointmentDate_icon@2x.png) no-repeat right;
  background-size: 0.4rem;
  vertical-align: middle;
}

.credit-list-item-date .date {
  opacity: 0.9;
  font-family: PingFangSC-Regular;
  font-size: 0.32rem;
  color: #333333;
  text-align: left;
  line-height: 0.4rem;
}
























/* 添加授信按钮 */

.credit-add-item {
  position: fixed;
  bottom: 0px;
  left: 0px;
  text-align: center;
  color: #fff;
  background: #2DA8E1;
  width: 100%;
  height: 0.88rem;
  font-size: 0.34rem;
  line-height: 0.88rem;
}
























/*未发起有效的授权申请*/

.credit-empty {
  background-image: url(../../../static/images/loan_empty_nor@2x.png);
  background-position: center 20%;
  background-repeat: no-repeat;
  background-size: 1.69rem 1.99rem;
}
























/*耐心等待审核结果*/

.credit-watit {
  background-image: url(../../../static/images/mine_success@2x.png);
  background-position: center 20%;
  background-repeat: no-repeat;
}
























/* 列表无数据 提示*/

.credit-container .msg {
  display: block;
  width: 100%;
  text-align: center;
  padding-top: 4.5rem;
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
