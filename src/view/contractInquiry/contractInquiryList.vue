<!-- 合同查询列表 -->
<template>
  <div class="contractInquiryList">
    <!-- <div style="display:none;"> -->
    <div class="list-wrapper" ref="listWrapper" v-show="showList">
      <ul class="ul">
        <li v-for="(item,index) in items" @click="goDetail(item)" :key='index' class="list-li">
          <div class="first-div">
            <ol>
              <li v-show="item.proTypeTxt">{{item.proTypeTxt}}</li><!-- 信用贷 -->
              <!-- <li v-show="!item.proTypeTxt">信用贷</li> -->
              <!-- 信用贷 -->
              <li>{{item.contAmt}}</li><!-- contAmt -->
              <li>签约金额（元）</li>
            </ol>
          </div>
          <div class="second-div">
            <ol>
              <li>{{item.contNo}}</li><!-- XY(苏)借字(2016)第014244号 -->
              <li>{{item.contSignDate}}</li>
              <li>签约日期</li>
            </ol>
          </div>
        </li>
      </ul>
    </div>
    <div class="noInformation" v-show="!showList">
      <p>
        <img src="/static/images/loan_empty_nor@2x.png">
        <span>未发现有效的业务信息</span>
      </p>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
  data() {
    return {
      items: [],
      showList:true,
      certCode:'',
      options: {
        pullDownRefresh: {
          threshold: 30, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
          stop: 20 // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
        },
        pullUpLoad: {
          threshold: -20 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
        },
        //pullDownRefresh: false, //关闭下拉
        //pullUpLoad: false, // 关闭上拉
        click: true,
        probeType: 3,
        startY: 0,
        scrollbar: false
      },
      pageParam: {
        numPerPage: 10,
        pageNum: 1
      },
      pageCount: '',//总页数
      currentPage:'',//当前页
    }
  },
  created() {
    this.certCode = localStorage.getItem('certCode');
    console.log(this.certCode);
    this.$nextTick(() => {
      this._initScroll()
      this.setData()
    })
  },
  methods: {
    goDetail(row) {
      console.log(row);
      localStorage.setItem('contractRow', JSON.stringify(row));
      this.$router.push('/contractInquiryDetail')
    },
    _initScroll() {
      this.listScroll = new BScroll(this.$refs.listWrapper, this.options);
      console.log(this.listScroll);
      // 下拉
      this.listScroll.on('pullingDown', () => {
        // 刷新数据的过程中，回弹停留在距离顶部还有20px的位置
        this.items = [] // 重置数据
        this.pageParam.pageNum = 1 // 重置分页数
        this.setData() //获取数据方法   
      })
      // 上拉
      this.listScroll.on('pullingUp', () => {
        if (this.currentPage < this.totalPage) { //判断是否继续上拉刷新
           this.setData() //获取数据方法   
        }
      })
    },
    pullingDownUp() {
      this.listScroll.finishPullDown()
      this.listScroll.finishPullUp()
      this.listScroll.refresh() //重新计算元素高度
    },
    setData() {
      this.post('/cont/contBasicInfoList',{
			  	certCode: this.certCode,
			    pageParam: {
			        numPerPage: 10,
			        pageNum: 1
			    },
			  }).then(res=>{
			  	if (res.data.status) {
              this.totalPage = res.data.data.pageCount;
              if (this.pageParam.pageNum === 1) {
                  this.items = [];
              };
              this.items = this.items.concat(res.data.data.recordList); //拼接字符串的方法
              this.pageParam.pageNum += 1;
              if(res.data.data.recordList.length>0){
                this.items = res.data.data.recordList;
                for(var i=0;i<this.items.length;i++){
                    //批准金额 如果有小数点且有两位小数，直接赋值，否则加小数点，并补全小数位
                    //
                    //
                    // if(String(this.items[i].contAmt).indexOf('.') != -1){
                    //   //有小数点，判断小数位数
                    //   if(String(this.items[i].contAmt).length - (String(this.items[i].contAmt).indexOf('.')+1) == 1){
                    //     this.items[i].contAmt = this.items[i].contAmt.toLocaleString() + '0';
                    //   }else{
                    //     this.items[i].contAmt = this.items[i].contAmt.toLocaleString();
                    //   }
                    // }else{
                    //   //不含小数点
                    //   this.items[i].contAmt = this.items[i].contAmt.toLocaleString() + '.00';
                    // }; 

                    // 更改千分位逻辑 
                    var tempArr = String(this.items[i].contAmt).split('.');
                    if(tempArr.length>1){
                      this.items[i].contAmt = parseInt(tempArr[0]).toLocaleString() + '.'+tempArr[1];
                    }else{
                       this.items[i].contAmt = parseInt(tempArr[0]).toLocaleString()+'.00';
                    }

                    if(!this.items[i].proTypeTxt){
                      this.items[i].proTypeTxt = '信用贷'
                    }



                    //将时间戳转为年月日格式
                    var newMonth = new Date(this.items[i].contSignDate).getMonth()+1;
                    if(newMonth==10 || newMonth>10){
                      newMonth = newMonth;
                    }else{
                        newMonth = '0'+newMonth;
                    };
                    var newDate = new Date(this.items[i].contSignDate).getDate();
                    if(newDate==10 || newDate>10){
                      newDate = newDate;
                    }else{
                        newDate = '0'+newDate;
                    };
                    this.items[i].contSignDate = new Date(this.items[i].contSignDate).getFullYear()+'-'+newMonth+'-'+newDate;
                }//for循环结束
              }else{
                this.showList = false;
              };//if结束
              this.$nextTick(() => {       
                this.pullingDownUp()
              });
          }else{
              this.showList = false;
          }
                
          /*}else{
            this.showList = false;
          }*/
			      
			  });
    },

  },
}

</script>
<style type="text/css" scoped>
.contractInquiryList {
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

.contractInquiryList ul {
  width: 100%;
  height: auto;
  height: calc( 100% - 3rem );
}

.contractInquiryList ul li.list-li {
  width: 100%;
  height: 2rem;
  background: #fff;
  margin-bottom: .2rem;
}
.contractInquiryList ul li.list-li:last-child{
  margin-bottom: 1.5rem;
}

.contractInquiryList ul li div {
  width: 50%;
  height: 100%;
}

.contractInquiryList ul li div.first-div {
  /* padding: .39rem 0 0 .53rem; */
  float: left;
  text-align: left;
  width: 36%;
}

.contractInquiryList ul li div.second-div {
  padding: .36rem .53rem 0 0;
  float: right;
  text-align: right;
  width: 64%;
}
/* .contractInquiryList ul li div.first-div ol li{
  width: 46%;
  text-align: center;
} */

.contractInquiryList ul li div.first-div ol li:nth-of-type(1) {
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

.contractInquiryList ul li div ol li:nth-of-type(2) {
  margin-left: .5rem;
  font-size: .36rem;
  color: #333333;
  padding-top: .06rem;
  padding-bottom: .03rem;
}
.contractInquiryList ul li div ol li:nth-of-type(3) {
  font-size: .24rem;
  color: #666666;
  margin-left: .5rem;
}
.contractInquiryList ul li div.second-div ol li:nth-of-type(1){
  padding-right: .14rem;
  font-size: .24rem;
  color: #333333;
}
.contractInquiryList ul li div.second-div ol li:nth-of-type(2){
  font-size: .3rem;
  color: #333333;
  padding: .13rem .14rem .07rem 0;
}
.contractInquiryList ul li div.second-div ol li:nth-of-type(3){
  padding-right: .14rem;
  font-size: .24rem;
  color: #666666;
}

/* 签约信息为空时 */

.noInformation {
  width: 100%;
  height: 100%;
  background:#fff;
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
  padding-left:calc(50% - 0.84rem);
}

.noInformation p span {
  font-size: .34rem;
  color: #666666;
  display: block;
}

</style>
