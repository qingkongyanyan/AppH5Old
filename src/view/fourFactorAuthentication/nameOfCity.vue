<!-- 四要素认证-开户行所在城市名称 -->
<template>
  <div class="nameOfCity">
    <!-- <mt-search v-model="value" autofocus :result.sync="cityResult" placeholder="请输入开户行所在城市名称">
    </mt-search> -->
    <div class="mint-search">
      <input type="text" v-model='seachcity' placeholder="请输入开户行所在城市名称" @focus="aa = true" @blur="aa = false">
      <img src="/static/images/close.png" v-show='aa && seachcity && seachcity.length > 0' @click="seachcity=''">
    </div>
    <!-- 默认显示的内容 -->
    <ul class="bugs-ul bugs-title">
      <li class="bug-title" style="text-align:left;">
        <span class="bug-title-icon"></span>
        <label class="bug-title-text">城市名称（请选择一条信息）</label>
      </li>
    </ul>
    <div ref="listWrapper" class="listWrapper">
      <ul class="bugs-ul contsin-ul" v-show="listShow">
        <li v-for="(item,index) in result" :key='index' @click="clickBtnItem(item)">
          {{item.cityName}}
        </li>
      </ul>
    </div>
    
  </div>
</template>
<script>
import BScroll from 'better-scroll'
import { Indicator } from 'mint-ui';
// 节流函数
const delay = (function() {
  let timer = 0;
  return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();
export default {
  data() {
    return {
      value: '',
      result:[],
      listShow: true, // 用来控制 
      showDetail: false, // 详情展示
      aa:false,
      seachcity:'',
      newArry: [],
      newResult: [],
      checkValue: '',
      escrowagency: '', // 如不传，默认为融宝：04
      cityName: '', // 支持模糊搜索
      //pageNum: '', // 当前页数	pageParam
      //numPerPage: 2000, // 每页记录数	
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
        numPerPage: 20,
        pageNum: 1
      },
      totalPage: '',//总页数
      currentPage:'',//当前页	      
    }
  },
  /*mounted() {
    this.getSmBankCityList();
  },*/
  created() {
    //this.certCode = localStorage.getItem('certCode');
    console.log(this.certCode);
    this.$nextTick(() => {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.listWrapper, {})
        console.log(this.scroll)
        };
      this._initScroll()
      this.setData()
    })
  },
  watch: {
  //watch title change
    seachcity() {
      delay(() => {
      this.cityName = this.seachcity;
      this.pageParam.pageNum = 1;
      this.result = [] // 重置数据
      this.setData();
      }, 300);
    },
  },
  computed: {
    cityResult() {
      this.newArry = [];
      this.newResult = [];
      for (var i = 0; i < this.result.length; i++) {
        this.newArry.push(this.result[i]);
      };
      console.log('00000000000000');
      return this.newResult = this.newArry.filter(item => new RegExp(this.value, 'i').test(item.cityName));
      //console.log(this.newResult);
    }
  },
  methods: {
    _initScroll() {
      this.listScroll = new BScroll(this.$refs.listWrapper, this.options);
      console.log(this.listScroll);
      // 下拉
      this.listScroll.on('pullingDown', () => {
        //alert("33333333333");
        // 刷新数据的过程中，回弹停留在距离顶部还有20px的位置
        //开始加载提示框
        Indicator.open('加载中...');
        this.result = [] // 重置数据
        this.pageParam.pageNum = 1 // 重置分页数
        this.setData() //获取数据方法   
      })
      // 上拉
      this.listScroll.on('pullingUp', () => {
        console.log(this.totalPage);
        //开始加载提示框
        Indicator.open('加载中...');
        if (this.currentPage < this.totalPage) { //判断是否继续上拉刷新
          //alert("***********");
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
      //Indicator.open('加载中...');
      this.post('/bank/smBankCityList', {
        cityName: this.cityName, // 支持模糊搜索
        pageParam:this.pageParam
      }).then(res => {
        //关闭加载提示框
        Indicator.close();
        if (res.data.code == '100000') {
          this.totalPage = res.data.data.pageCount;
          if (this.pageParam.pageNum === 1) {
              this.result = [];
          }
          this.result = this.result.concat(res.data.data.recordList); //拼接字符串的方法；
          this.pageParam.pageNum += 1;
          //this.result = res.data.data.recordList;
          this.$nextTick(() => {       
            this.pullingDownUp()
          });
        } else {
          var sel = this;
          this.alentText = res.data.msg;
          this.tipShow = true;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })
    },
    /*seachCity(){
      this.cityName = this.seachcity;
      this.pageParam.pageNum = 1;
      this.result = [] // 重置数据
      this.setData();
    },*/
    clickBtnItem(item) {
      localStorage.setItem("cityObj", JSON.stringify(item));
      localStorage.setItem('from','back');
      this.$router.go(-1);


    },
  },
}

</script>
<style type="text/css" scoped>
.nameOfCity {
  width: 100%;
  height: 100%;
  background: #f6f6f6;
}

.mint-search {
  height: 1.18rem;
  position: relative;
}
.mint-search input{
  width: calc(100% - .4rem );
  height: .88rem;
  margin-top: .1rem;
  border-radius: .44rem;
  padding-left: .38rem;
  font-size: .28rem;
}
.mint-search img{
  position: absolute;
  width: .28rem;
  height: .28rem;
  right: .24rem;
  top: 50%;
  margin-top: -.18rem;
}


/* 所有的数据列表 */

.bugs-title {
  width: 100%;
  height: .88rem;
  background: #fff;
  border-bottom: 0.5px solid #f6f6f6;
}

.bugs-title li {
  background: none!important;
  height: 1rem;
  margin: 0 0.3rem;
}
.contsin-ul{
  width: 100%;
  background: #fff;
}
.contsin-ul li{
  width: 92%;
  margin-left: 4%;
  border-bottom: 1px solid #eeeeee;
  background: #fff;
}
.bugs-ul li {
  height: 0.88rem;
  line-height: 0.88rem;
  text-align: left;
  font-size: 0.28rem;
  /*background: url(../../../static/images/more_arrow@2x.png) no-repeat right;*/
  background-size: 0.15rem 0.24rem;
  text-align: center;
}



/* 问题列表 title*/

.bug-title {}

.bug-title-icon {
  /*background: url(../../../static/images/mine_qs_hot_bg@2x.png) no-repeat left;*/
  width: 0.05rem;
  height: 0.3rem;
  display: inline-block;
  vertical-align: middle;
  line-height: 0.88rem;
}

.bug-title-text {
  font-size: .28rem;
  color: #333333;
  padding-left: .17rem;
}



/*问题详情*/

.question-detail {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 10rem;
  z-index: 99;
  background: #f6f6f6;
}

/* .nameOfCity .contsin-ul{
  padding: 0;
  text-align: center;
  height: calc(100% - 1.05rem );
  overflow: auto;
} */
.listWrapper{
  width: 100%;
  height: calc(100% - 2.7rem);
  overflow: hidden;
}
</style>
