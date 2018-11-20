<!-- 开启权限 -->
<template>
  <div class="home-creditStrategy home-openPermissions">
    <div class="icon-class">
      <img class="" src="/static/images/home_openauth@2x.png" alt="授权攻略">
    </div>
    <p class="title">{{creditRequire}}</p>
    <p>
      <div class="sub">
        <ul class="sub-ul">
          <li v-for="item in productAuthConfigs">{{item.authName}}</li>
        </ul>
      </div>
    </p>
    <!-- <p class="foot">以上认证信息，可前往【业务】进行认证</p> -->
    <a class="settingBtn" @click="goSetting()">
      <button>
        知道了
      </button>
    </a>
  </div>
</template>
<script>
//import Tabbar from '../tabbar'
import { Indicator } from 'mint-ui';
export default {
  data() {
    return {
      msg: 123,
      location: '',
      modeId: '', // 产品id
      alertText: '',
      tipShow: false,
      creditRequire: '授信需要授权以下权限', // 授信要求
      productAuthConfigs: [{
        "authName": "地理位置",
        "authType": 0,
        "iconUrl": "123123",
        "must": 0,
        "priority": 2,
        "requestPassId": 2
      }],
      modeType: '', // 模式
    }
  },
  mounted() {
    // 模式
    this.modeType = this.$route.modeType;
    this.getProductList();
    // 这里的权限 需要从产品列表拿
  },
  methods: {
    getProductList() {
      Indicator.open();
      this.post('/product/getProductList', {
        modeType: this.modeType,
        pageParam: {
          pageNum: '1',
          numPerPage: '10',
        }
      }).then(res => {
        Indicator.close();
        console.log(res);
        if (res.data.code == '100000') {
          // 授信要求
          this.creditRequire = res.data.data.creditRequire;
          // 授信权限列表
          this.productAuthConfigs = res.data.data.recordList.productAuthConfigs;


        } else {
          var sel = this;
          sel.alertText = res.data.data.errorMsg;
          sel.tipShow = true;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })
    },
    goSetting() {
      var location = localStorage.getItem('location');
      if (location == false) {
        this.$router.go(-1);
      } else {
        this.$router.replace('/home')
      }
    },
  }
}

</script>
<style scoped>
ul {
  text-align: center;
}

ul>li {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #333333;
  line-height: 30px;
  height: 30px;
  text-align: left;
}

.icon-class {
  text-align: center;
  padding-top: 20px;
}

.icon-class img {
  width: 100px;
  height: 100px;
}

.title {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #333333;
}

.foot {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #666666;
}

.sub {
  margin: 0 auto;
}

.sub-ul {
  margin: 0 auto;
  width: 85px;
}

p {
  text-align: center;
}





/* 按钮 */

.settingBtn {
  font-size: 0.34rem;
  text-decoration: none;
}

.settingBtn button {
  width: 92%;
  height: .8rem;
  background-image: linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%);
  border-radius: 10px;
  color: #fff;
  margin-top: .8rem;
  margin-bottom: .33rem;
  font-size: .34rem;
}

</style>
