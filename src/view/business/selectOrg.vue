<!-- 选择面审机构 -->
<template>
  <div class="container">
    <!-- 面审机构选择  省-市-区 -->
    <div class="normal">
      <div class="normal-item select-item" @click="getProvices">
        <span class="require">*</span>
        <span class="title-item">所在省份</span>
        <span class="value-item div-placeholder" v-show="!provice">请选择所在省份</span>
        <span class="value-item" v-show="provice">{{provice}}</span>
      </div>
      <div class="normal-item select-item" @click="getCitys">
        <span class="require">*</span>
        <span class="title-item">所在城市</span>
        <span class="value-item div-placeholder" v-show="!city">请选择所在城市</span>
        <span class="value-item" v-show="city">{{city}}</span>
      </div>
      <div class="normal-item select-item" @click="getOrgs">
        <span class="require">*</span>
        <span class="title-item">面审机构</span>
        <span class="value-item div-placeholder" v-show="!orgName">请选择面审机构</span>
        <span class="value-item" v-show="orgName">{{orgName}}</span>
      </div>
    </div>
    <div class="submit-item font-size34" :class="[isActive?'submit-active':'submit-normal']" @click="clickSure">
      确定
    </div>
    <!-- 遍历地址 -->
    <div class="show-address" v-show="showProvices">
      <div class="normal-item" v-for="item in provices" @click="selectItemProvice(item)">
        {{item.areaName}}
      </div>
    </div>
    <!-- 市 -->
    <div class="show-address" v-show="showCitys">
      <div class="normal-item" v-for="item in citys" @click="selectItemCity(item)">
        {{item.areaName}}
      </div>
    </div>
    <!-- 面审机构 -->
    <div class="show-address" v-show="showOrgs">
      <div class="normal-item" v-for="item in orgs" @click="selectItemOrg(item,'org')">
        {{item.orgName}}
      </div>
    </div>
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
  name: 'selectOrg',
  data() {
    return {
      msg: 'selectOrg',
      dataSource: '', // 返回的所有数据
      provice: '',
      proviceId: '', // 省
      provices: [],
      citys: [],
      orgs: [],
      city: '',
      cityId: '', // 市
      area: '', // 区
      showAddress: false,
      showOrg: false, // 门店
      searchAreas: [], // 选择之后 ,渲染的数据
      type: '', // 标志点击的 项目 省市区
      tipShow: false,
      alertText: '',
      isActive: false,
      id: '', // 机构id
      orgCode: '', // 机构编号
      orgName: '', // 机构名称
      orgs: [], // 门店
      org: '', // 门店信息
      showProvices: false, // 省
      showCitys: false, // 市
      showOrgs: false, // 区
    }
  },
  beforeRouteLeave(to, from, next) {
    to.meta.keepAlive = false; // 让下一个页面缓存
    next();
  },
  watch: {
    provice: function(newProvice, oldProvice) {
      this.city = '';
      this.area = '';
      this.orgCode = '';
      this.orgName = '';
      this.id = '';
    },
    city: function(newCity, oldCity) {
      this.orgCode = '';
      this.orgName = '';
      this.id = '';
    }
  },
  mounted() {
    // this.getSmArea();
    // 获取省
    // this.getProvices();
  },
  componted: {
    isActive: function() {
      return this.provice && this.city && this.area;
    }
  },
  methods: {
    // 请求省
    getProvices: function() {
      this.post('/common/smArea', {
        id: ''
      }).then(res => {
        if (res.data.code == '100000') {
          this.provices = res.data.data;
          if (!this.provices.length > 0) {
            this.showProvices = false;
            this.showCitys = false;
            this.showOrgs = false;
            var sel = this;
            this.tipShow = true;
            this.alertText = '暂未返回数据';
            setTimeout(function() { sel.tipShow = false; }, 3000);
            return;
          } else {
            this.showProvices = true;
          }
        } else {
          var sel = this;
          this.tipShow = true;
          this.alertText = res.data.msg;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })
    },
    // 点击省
    selectItemProvice: function(item) {
      this.proviceId = item.id;
      this.provice = item.areaName;
      this.showProvices = false;
      this.showCitys = false;
      this.showOrgs = false;
      // 请求市
      // this.getCitys(this.proviceId);
    },
    // 请求市
    getCitys: function() {
      if (!this.proviceId) {
        var sel = this;
        //失败
        this.tipShow = true;
        this.alertText = '请先选择省';
        setTimeout(function() { sel.tipShow = false; }, 1000);
        return;
      }
      this.post('/common/smArea', {
        id: this.proviceId
      }).then(res => {
        if (res.data.code == '100000') {
          this.citys = res.data.data;
          if (!this.citys.length > 0) {
            this.showAddress = false;
            this.showOrg = false;
            var sel = this;
            this.tipShow = true;
            this.alertText = '暂未返回数据';
            setTimeout(function() { sel.tipShow = false; }, 3000);
            return;
          } else {
            this.showCitys = true;
          }
        } else {
          var sel = this;
          this.tipShow = true;
          this.alertText = res.data.msg;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })
    },
    // 点击市
    selectItemCity: function(item) {
      this.cityId = item.id;
      this.city = item.areaName;
      this.showProvices = false;
      this.showCitys = false;
      this.showOrgs = false;
      // 请求市
      // this.getCitys(this.proviceId);
    },
    getOrgs: function() {
      if (!this.proviceId) {
        var sel = this;
        //失败
        this.tipShow = true;
        this.alertText = '请先选择省';
        setTimeout(function() { sel.tipShow = false; }, 1000);
        return;
      } else if (!this.cityId) {
        var sel = this;
        //失败
        this.tipShow = true;
        this.alertText = '请先选择市';
        setTimeout(function() { sel.tipShow = false; }, 1000);
        return;
      }
      this.post('/common/smOrg', {
        proviceId: this.proviceId,
        cityId: this.cityId
      }).then(res => {
        console.log(res);
        if (res.data.code == '100000') {
          this.orgs = res.data.data;
          if (this.orgs.length > 0) {
            this.showProvices = false;
            this.showCitys = false;
            this.showOrgs = true;
          } else {
            this.showProvices = false;
            this.showCitys = false;
            this.showOrgs = false;
            var sel = this;
            //失败
            this.tipShow = true;
            this.alertText = res.data.msg;
            setTimeout(function() { sel.tipShow = false; }, 1000);
            return;
          }
        } else {
          this.showProvices = false;
          this.showCitys = false;
          this.showOrgs = false;
          var sel = this;
          //失败
          this.tipShow = true;
          this.alertText = res.data.msg;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })
    },
    // 选择  机构
    selectItemOrg: function(item) {
      this.showProvices = false;
      this.showCitys = false;
      this.showOrgs = false;
      this.id = item.id;
      this.orgName = item.orgName;
      this.orgCode = item.orgCode;
      console.log(item.orgCode)
    },
    getSmArea: function() {
      this.searchAreas = [];
      this.orgs = [];
      this.showAddress = false;
      this.showOrg = false;

      this.post('/common/smArea', {}).then(res => {
        console.log(res);
        if (res.data.code == '100000') {
          this.dataSource = res.data.data;
          for (let i = 0; i < this.dataSource.length; i++) {
            this.provices.push(this.dataSource[i])
          }
        }
      })
    },
    // 点击选择省市区
    checkAddr: function(type) {
      console.log(type)
      switch (type) {
        case 'provice':
          this.searchAreas = this.provices;
          this.type = 'provice';
          break;
        case 'city':
          this.type = 'city';
          console.log('请先选择省份')
          console.log(this.provice);
          if (!this.provice) {
            var sel = this;
            this.tipShow = true;
            this.alertText = '请先选择省份';
            setTimeout(function() { sel.tipShow = false; }, 3000);
            return;
          }
          break;
        case 'org':
          this.type = 'org';
          this.selectOrg(); // 请求面审机构
          console.log('请先选择门店')
          console.log(this.provice);
          console.log(this.city);
          if (!this.provice) {
            var sel = this;
            this.alertText = '请先选择省份';
            this.tipShow = true;
            setTimeout(function() { sel.tipShow = false; }, 3000);
            return;
          }
          if (!this.city) {
            var sel = this;
            this.alertText = '请先选择城市';
            this.tipShow = true;
            setTimeout(function() { sel.tipShow = false; }, 3000);
            return;
          }
          if (!this.orgs) {
            var sel = this;
            this.alertText = '请先选择城市';
            this.tipShow = true;
            setTimeout(function() { sel.tipShow = false; }, 3000);
            return;
          }
          break;
      }
      this.showAddress = true;

    },
    // 选择某项
    selectItem: function(item, flag) {
      this.searchAreas = [];
      this.orgs = [];
      this.showAddress = false;
      this.showOrg = false;
      switch (this.type) {
        case 'provice': // 点击省,给省赋值
          this.provice = item.areaName;
          this.proviceId = item.id;
          this.searchAreas = item.smAreas;
          this.showAddress = false;
          this.showOrg = false;
          this.getCitys(this.proviceId);
          break;
        case 'city': // 点击市,给市赋值
          this.city = item.areaName;
          this.cityId = item.id;
          this.showAddress = false;
          this.showOrg = false;
          this.getOrgs()
          console.log('city city city')
          // this.selectOrg();
          break;
        case 'org': // 点击门店
          this.orgName = item.orgName;
          this.orgCode = item.orgCode;
          this.id = item.id;
          this.showOrg = false;
          this.showAddress = false;
          break;
      }
    },
    // 根据省市,查询 面审机构
    selectOrg: function() {
      console.log('查询面审机构机构')
      this.showAddress = false;
      if (!this.proviceId) {
        var sel = this;
        this.alertText = '请先选择省份';
        this.tipShow = true;
        setTimeout(function() { sel.tipShow = false; }, 3000);
        return;
      }
      if (!this.cityId) {
        var sel = this;
        this.alertText = '请先选择城市';
        this.tipShow = true;
        setTimeout(function() { sel.tipShow = false; }, 3000);
        return;
      }
      this.orgs = [];
      this.showOrg = false;
      this.showAddress = false;
      this.post('/common/smOrg', {
        proviceId: this.proviceId,
        cityId: this.cityId
      }).then(res => {
        console.log(res);
        if (res.data.code == '100000') {
          this.orgs = res.data.data;
          if (this.orgs.length > 0) {
            this.showOrg = true;
          } else {
            this.showOrg = false;
            this.showAddress = false;
            var sel = this;
            //失败
            this.tipShow = true;
            this.alertText = res.data.msg;
            setTimeout(function() { sel.tipShow = false; }, 1000);
            return;
          }
        } else {
          this.showOrg = false;
          this.showAddress = false;
          var sel = this;
          //失败
          this.tipShow = true;
          this.alertText = res.data.msg;
          setTimeout(function() { sel.tipShow = false; }, 1000);
          return;
        }
      })
    },
    clickSure: function() {
      console.log('clickSure')
      if (!this.id || !this.orgCode || !this.orgName) {
        var sel = this;
        //失败
        this.tipShow = true;
        this.alertText = '请选择面审机构';
        setTimeout(function() { sel.tipShow = false; }, 1000);
        return;
      }

      var addObj = JSON.parse(localStorage.getItem('addObj'));
      addObj.orgName = this.orgName;
      addObj.orgCode = this.orgCode;
      addObj.appOrgName = this.orgName;
      addObj.appOrgCode = this.orgCode;
      addObj.id = this.id;
      localStorage.setItem('addObj', JSON.stringify(addObj));

      console.log(addObj)
      // this.$emit('changeState');
      // this.$router.go(-1);
      this.$router.back();
    }
  }
}

</script>
<style scoped>
.container {
  background-image: linear-gradient(-180deg, #f8f9ff 3%, #f9f9f9 96%);
  width: 100%;
  height: 100%;
}

.normal {
  background: #fff;
  padding: 0 0.3rem;
}

.normal-item {
  height: 0.88rem;
  line-height: 0.88rem;
  border-bottom: 1px solid #ededed;
  font-size:0.28rem;
}

.normal-item .title-item {
  width: 50%;
  float: left;
  text-align: left;
  font-family: PingFangSC-Regular;
  font-size: 0.26rem;
  color: #333333;
  text-align: left;
}

.normal-item .value-item {
  width: 40%;
  float: left;
  text-align: right;
  font-family: PingFangSC-Light;
  font-size: 0.28;
  color: #333333;
  text-align: right;
  font-size: 0.28rem;
}












/* 二级选项页面 */

.show-address {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #fff;
}











/* 提交按钮 */

.submit-item {
  margin: 0.3rem;
  border-radius: 0.1rem;
  height: 0.8rem;
  color: #fff;
  line-height: 0.8rem;
}

.submit-normal {
  background-image: linear-gradient(-216deg, #59d3f2 7%, #2da8e1 100%);
}

.submit-active {
  background-image: linear-gradient(-216deg, #59d3f2 7%, #2da8e1 100%);
}


.div-placeholder {
  color: #999999!important;
}

</style>