<!-- 极速模式 -->
<template>
  <div class="turboMode">
    <div class="turboMode_list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
      <div class="zhanwei"></div>
      <div class="turboMode_div" v-for="(item,index) in list" :key='index'>
        <div class="turboMode_top" @click="showSecond(index)">
          <p class="zhanweiP"></p>
          <p>
            <span>{{item.productName}}<!-- 诺远易贷（零担保、无抵押）诺远易贷（零担保、无抵押） --></span>
            <img src="/static/images/jiantouBottom.png" v-show="!item.listShow">
            <img src="/static/images/jiantouTop.png" v-show="item.listShow">
          </p>
          <ul>
            <li class="leftLi">
              <ol>
                <li>
                  <img src="/static/images/money.png">
                  <span>{{item.minAmount}}～{{item.maxAmount}}万</span>
                </li>
                <li>
                  <label>额度(元)</label>
                </li>
              </ol>
            </li>
            <li class="rightLi">
              <ol>
                <li>
                  <span>期限</span>
                  <label>{{item.terms}}月</label>
                </li>
                <li>
                  <label>月费率可低至{{item.minMonthRate}}%</label>
                  <img src="/static/images/monthlyRate.png" @click.stop="showInfo(item)">
                </li>
              </ol>
            </li>
          </ul>
        </div>
        <!-- <div class="turboMode_center" v-show="showSeconds == index"> -->
        <div class="turboMode_center" v-show="item.listShow">
          <div class="turboMode_center_div">
            <div class="textarea-wrapper">
              <div class="content-editable">{{item.creditRequire}}</div>
              <!-- <textarea v-model="item.creditRequire" readonly class="field-textarea"></textarea> -->
            </div>
          </div>
        </div>
        <div class="turboMode_footer">
          <p @click="applicationForCredit(item)">授信申请</p>
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <div class="tip" v-show="tipShow" @click="tipShow=false">
      <span>{{alentText}}</span>
    </div>
    <!-- 实名认证OVR补录状态弹框 -->
    <div class="smTip" v-show="smTipShow">
      <div>
        <p class="smInfo">实名信息未完善，请您完善！</p>
        <p class="smSure">
          <button @click="smTipShow=false">取消</button>
          <button @click="goRealName('smTipShow')">确定</button>
        </p>
      </div>
    </div>
    <!-- 未实名认证弹框 -->
    <div class="smTip" v-show="smShow">
      <div>
        <p class="smInfo">您暂未进行实名认证，请前去认证！</p>
        <p class="smSure">
          <button @click="smShow=false">取消</button>
          <button @click="goRealName('smShow')">确定</button>
        </p>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { InfiniteScroll } from 'mint-ui';
//import autosize from '/src/autosize.js'

export default {
  data() {
    return {
      custId: '',
      custName: '',
      certCode: '',
      isPassVerify: "", //是否实名认证
      isOcrVerify: '', //是否ocr认证
      showSeconds: -1,
      tipShow: false,
      alentText: '',
      /*bottom: true,
      top: false,*/
      list: [],
      loading: true, //为true时不会触发加载更多，false可以触发
      totalNum: 0,
      pageSize: 10,
      pageNum: 1,
      maxAmount: '', //最大金额
      minAmount: '', //最小金额
      terms: '', //期限
      minMonthRate: '', //月费率
      productAuthConfigs: '', //开启权限列表
      minMonthRatedDetails: '', //最低月费率详情说明
      smTipShow: false, //未OCR认证
      smShow: false, //未实名认证
      newArr: [],
      location: '', //判断地理位置是否开启
    }
  },
  mounted() {

    this.custId = localStorage.getItem('custId');
    this.custName = localStorage.getItem('custName');
    this.certCode = localStorage.getItem('certCode');
    this.location = localStorage.getItem('location');
    console.log(this.location);
    this.getList();
  },
  methods: {
    getList() {
      this.post('/product/getProductList', {
        modeType: '0', //模式类型 0：极速，1：工薪，2：同业
        pageParam: {
          pageNum: this.pageNum,
          numPerPage: this.pageSize,
        }
      }) /*{ emulateJSON: true, headers: {} })*/ .then(res => {
        //当请求没有数据时需要显示的内容，需要注意的是如果上一次正好将数据请求完
        //这次请求的数据recordList会为[],就会执行里面的代码，加上this.list.length == 0这个限制条件就不会了
        console.log(res);
        console.log(res.data.code);
        if (res.data.code == "100000") {
          if (res.data.data.recordList.length > 0) {
            for (var i = 0; i < res.data.data.recordList.length; i++) {
              this.productAuthConfigs = res.data.data.recordList[i].productAuthConfigs;
              res.data.data.recordList[i].listShow = false;
            };
            console.log(res.data.data.recordList);
            if (res.data.data.recordList.length == 1) {
              res.data.data.recordList[0].listShow = true;
            };

          }
          if (res.data.data.recordList.length == 0 && this.list.length == 0) {
            this.loading = true;
          } else {
            //有数据并且请求到的数据等于pageSize说明数据库还有多余数据
            if (res.data.data.recordList.length === parseInt(this.pageSize)) {
              for (var i = 0; i < this.pageSize; i++) {
                this.list.push(res.data.data.recordList[i]);
              }
              this.loading = false;
            }
            //有数据但是数据库数据已经被请求完，没有其他数据
            else {
              this.loading = true;
              //this.loadingDom = true;
              for (var i = 0; i < res.data.data.recordList.length; i++) {
                this.list.push(res.data.data.recordList[i]);
              }
            };
            //数据正好请求完，由于前面加了this.list.length == 0限制，会走当前逻辑
            if (res.data.data.recordList.length == 0) {
              this.loading = true;
              //this.loadingDom = true;
            }
          }
        } else if (res.data.code == "100002") {
          var sel = this;
          this.alentText = res.data.msg;
          this.tipShow = true;
          setTimeout(function() { sel.tipShow = false; }, 1500);
          return;
        };
      }, err => {
        console.log('error' + err)
      })
    },
    loadMore() {
      /*this.loading = true;
      setTimeout(() => {
        let last = this.list[this.list.length - 1];
        for (let i = 1; i <= 10; i++) {
          this.list.push(last + i);
        }
        this.loading = false;
      }, 1500);*/
      this.loading = true;
      this.pageNum++;
      this.getList();
    },
    showSecond(index) {
      let tran = this.list;
      tran[index].listShow = !tran[index].listShow;
      this.bottom = !tran[index].listShow;
      this.top = tran[index].listShow;
      this.list = tran;
    },
    showInfo(item) {

      var sel = this;
      this.alentText = item.minMonthRatedDetails;
      this.tipShow = true;
      setTimeout(function() { sel.tipShow = false; }, 1500);
      //event.stopPropagation();
      return;
    },
    //授信申请按钮
    applicationForCredit(item) {
      this.post('/account/getCertiInfo', { custId: this.custId })
        .then(res => {
          if (res.data.code == '100000') {
            this.isPassVerify = res.data.data.isPassVerify;
            this.isOcrVerify = res.data.data.isOcrVerify;
            //0是1否
            if (this.isPassVerify == '0') {
              if (this.isOcrVerify == '0') {
                //授信业务校验
                this.post('/authcredit/checkAuthCredit', {
                  certCode: this.certCode, //证件号码
                  custName: this.custName, //客户姓名
                  custId: this.custId, //客户id
                  productId: item.id, //产品id
                }).then(result => {
                  if (result.data.code == '100000') {
                    //console.log('ceshi1111');
                    //权限校验
                    if (item.productAuthConfigs.length == 0) {
                      //console.log('ceshi2222');
                      // 存储 productId  , modeType
                      localStorage.setItem('baseObj', JSON.stringify({
                        productId: item.id,
                        modeType: '0'
                      }))
                      this.$router.push({
                        path: '/basicAuthentication',
                        query: {
                          productId: item.id,
                          modeType: '0'
                        }
                      });
                    } else {
                      console.log(item.productAuthConfigs.length);
                      for (var i = 0; i < item.productAuthConfigs.length; i++) {
                        //authType：0：开启权限，1：基础认证
                        if (item.productAuthConfigs[i].requestPassId == 1) {
                          this.newArr = item.productAuthConfigs.splice(i, 1);
                          console.log(this.newArr)
                        };
                      };
                      if (this.newArr.length == 0) {
                        //console.log('ceshi3333');
                        // 存储 productId  , modeType
                        localStorage.setItem('baseObj', JSON.stringify({
                          productId: item.id,
                          modeType: '0'
                        }))
                        this.$router.push({
                          path: '/basicAuthentication',
                          query: {
                            productId: item.id,
                            modeType: '0'
                          }
                        });
                      } else {
                        //console.log('ceshi4444');
                        for (var i = 0; i < this.newArr.length; i++) {
                          console.log(this.location);
                          if (this.newArr[i].requestPassId == 1 && this.newArr[i].must == 1 && this.location == 'false') {
                            //return
                            this.$router.push({ path: '/openPermissions', query: { modeType: '0' } });
                            return;
                          } else {
                            // 存储 productId  , modeType
                            localStorage.setItem('baseObj', JSON.stringify({
                              productId: item.id,
                              modeType: '0'
                            }))
                            this.$router.push({
                              path: '/basicAuthentication',
                              query: {
                                productId: item.id,
                                modeType: '0'
                              }
                            });
                          }
                        };
                      }

                    }
                  } else {
                    var sel = this;
                    this.alentText = result.data.msg;
                    this.tipShow = true;
                    setTimeout(function() { sel.tipShow = false; }, 1500);
                    return;
                  }
                })
              } else {
                this.smTipShow = true;
              }
            } else {
              this.smShow = true;
            };
          }
        })
    },

    goRealName(flag) {
      switch (flag) {
        case 'smTipShow':
          localStorage.setItem('jichuOrYewu', 'jisumoshi');
          this.$router.push('/realName');
          break;
        case 'smShow':
          localStorage.setItem('jichuOrYewu', 'jisumoshi');
          this.$router.push('/realName');
          break;
      }
    },
  }
}

</script>
<style scoped>
.turboMode {
  width: 100%;
  height: 100%;
  background: #f6f6f6;
  overflow: auto;
  overflow-x: hidden;
}

.turboMode_list {
  width: 100%;
  height: 100%;
}

.zhanwei {
  width: 100%;
  height: .4rem;
}

.zhanweiP {
  width: 100%;
  height: .32rem;
}

.turboMode_div {
  width: 6.92rem;
  margin: 0 auto;
  margin-bottom: .5rem;
  border-radius: .12rem;
  box-shadow: 0 2px 34px 0 rgba(39, 52, 125, 0.25);
  background: rgba(255, 255, 255, 0.89);
}

.turboMode_top {
  width: 100%;
  height: 2.2rem;
  border-radius: .12rem .12rem 0 0;
  background: rgba(255, 255, 255, 0.89);
}

.turboMode_center {
  width: 100%;
  height: auto;
  background: rgba(255, 255, 255, 0.89);
}

.turboMode_footer {
  width: 100%;
  height: 1.42rem;
  background: rgba(255, 255, 255, 0.89);
  box-shadow: 0 2px 34px 0 rgba(39, 52, 125, 0.25);
  border-radius: .12rem;
  padding-top: .37rem;
}

.turboMode_top p {
  width: 100%;
  height: .48rem;
  line-height: .48rem;
  text-align: left;
}

.turboMode_top p span {
  padding: 0 .1rem 0 .41rem;
  font-size: .34rem;
  color: #333;
}

.turboMode_top p img {
  width: .3rem;
  height: .3rem;
  padding-right: .44rem;
  padding-top: .09rem;
  float: right;
}

.turboMode_top ul {
  width: 100%;
  height: .64rem;
  margin-top: .3rem;
}

.turboMode_top ul ol {
  text-align: left;
}

.turboMode_top ul ol li {
  clear: both;
}

.turboMode_top ul li.leftLi {
  width: 2.75rem;
  height: 100%;
  float: left;
  border-right: 1px solid rgba(162, 185, 241, 0.51);
}

.turboMode_top ul li.rightLi {
  width: calc(100% - 2.8rem);
  height: 100%;
  float: left;
}

.leftLi img {
  width: .23rem;
  height: .3rem;
  padding: 0 .06rem 0 .51rem;
  float: left;
}

.leftLi span {
  float: left;
  color: #212c68;
  font-size: .36rem;
  position: relative;
  top: -.1rem;
}

.leftLi li:nth-of-type(2) label {
  font-size: .24rem;
  position: relative;
  top: -0.1rem;
  left: .87rem;
}

.rightLi ol {
  padding-left: .35rem;
}

.rightLi ol li:nth-of-type(1) span,
.rightLi ol li:nth-of-type(1) label {
  font-size: .26rem;
  color: #333;
}

.rightLi ol li:nth-of-type(2) label {
  font-size: .24rem;
  color: #333;
}

.rightLi ol li:nth-of-type(2) img {
  width: .26rem;
  height: .26rem;
  margin-top: .04rem;
  position: relative;
  top: .03rem;
  padding: 0 .1rem;
}

.turboMode_center .turboMode_center_div {
  /* background-image: linear-gradient(-1deg, rgba(207, 221, 249, 0.27) 9%, #a2b9f1 83%); */
  background:url(/static/images/detail_bg.png) repeat-y;
  border-radius: .12rem;
  width: 6.14rem;
  height: auto;
  margin: 0 auto;
  text-align: left;
  /* padding-left: .19rem; 
  border-top: 1px solid #a2b9f1;*/
  padding: .12rem .1rem .3rem .19rem;
}

.turboMode_footer p {
  width: 4.68rem;
  height: .68rem;
  background-image: linear-gradient(216deg, #59d3f2 7%, #6496f5 100%);
  border-radius: 100px;
  font-size: .26rem;
  line-height: .72rem;
  color: #ffffff;
  margin: 0 auto;
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
  font-size: .32rem;
  opacity: 0.8;
  background: #000000;
  border-radius: 20px;
  padding: .81rem .56rem;
  margin-top: 3.74rem;
  display: inline-block;
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



.textarea-wrapper {
  position: relative;
  display: block;
  width: 100%;
}

.content-editable {
  position: relative;
  /* z-index: -1;
  opacity: 0; */
  display: block;
  width: 100%;
  line-height: normal;
  font-size: .24rem;
  color: #333;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.field-textarea {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  line-height: normal;
  font-size: .24rem;
  color: #333;
  text-align: left;
  resize: none;
  overflow: hidden;
  background-color: transparent;
  outline: none;
}

</style>
