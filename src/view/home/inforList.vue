<!-- 消息中心-列表页 -->
<template>
  <div class="inforList">
    <div v-show="showLists" ref="listWrapper" class="listWrapper">
      <ul>
        <li v-for="(item,index) in list" :key='index' @click="goContent(item)">
          <h4 :class="{opacity:item.state == 1}">
            <label class="type">{{item.messageType}}</label>
            {{item.title}}
            <label class="unreadMessage" v-show="item.state==0"></label>
          </h4>
          <p :class="{opacity:item.state == 1}">
            <span class="time">{{item.pushTime}}</span>
          </p>
        </li>
      </ul>
    </div>
    <div v-show="showList" class="noMessageList">
      <p>暂时没有消息哦！</p>
      <img src="/static/images/inforBg.png">
    </div>
    <div v-show="noShowList">
      
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
      flag: this.$route.query.flag,
      showList: false,
      showLists:false,
      noShowList:true,
      custId: '', //客户id
      list: [],
      options: {
        pullDownRefresh: {
          threshold: 30, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
          stop: 20 // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
        },
        pullUpLoad: {
          threshold: -20 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
        },
        click: true,
        probeType: 3,
        startY: 0,
        scrollbar: false
      },
      pageParam: {
        pageNum: 1, //当前页数 pageParam
        numPerPage: 10, //每页记录数 pageParam
      }, //分页聚合对象
      totalPage: '', //总页数
      currentPage: '', //当前页  
    }
  },
  created() {
    console.log(this.flag);
    //yes 有未读 no没有未读消息
    /*if (this.flag == 'yes') {
      this.showList = true;
    } else if (this.flag == 'no') {
      this.showList = false;
    };*/
    this.custId = localStorage.getItem('custId');
    this.$nextTick(() => {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.listWrapper, {})
        console.log(this.scroll)
      };
      this._initScroll()
      this.getList(this.pageParam);
    })
  },
  methods: {
    _initScroll() {
      this.listScroll = new BScroll(this.$refs.listWrapper, this.options);
      console.log(this.listScroll);
      // 下拉
      this.listScroll.on('pullingDown', () => {
        // 刷新数据的过程中，回弹停留在距离顶部还有20px的位置
        //开始加载提示框
        Indicator.open('加载中...');
        this.list = [] // 重置数据
        this.pageParam.pageNum = 1 // 重置分页数
        this.getList(this.pageParam) //获取数据方法   
      })
      // 上拉
      this.listScroll.on('pullingUp', () => {
        console.log(this.totalPage);
        //开始加载提示框
        Indicator.open('加载中...');
        if (this.currentPage < this.totalPage) { //判断是否继续上拉刷新
          //alert("***********");
          this.getList(this.pageParam) //获取数据方法   
        }
      })
    },
    pullingDownUp() {
      this.listScroll.finishPullDown()
      this.listScroll.finishPullUp()
      this.listScroll.refresh() //重新计算元素高度
    },
    getList(param) {
      Indicator.open('加载中...');
      this.post('/message/getMessageList', { custId: this.custId, pageParam: param }).then(res => {
        //关闭加载提示框
        Indicator.close();
        if (res.data.code == '100000') {
          this.totalPage = res.data.data.pageCount;
          if (this.pageParam.pageNum === 1) {
            this.list = [];
          }
          this.list = this.list.concat(res.data.data.recordList); //拼接字符串的方法；
          console.log(this.list)
          console.log(this.list.length)
          if (this.list.length > 0) {
            this.showLists = true;
            this.noShowList = false;
            this.showList=false;
            // return
            for (var i = 0; i < this.list.length; i++) {
              //日期
              if(typeof(this.list[i].pushTime) == 'number'){
                this.list[i].pushTime = this.judgeDate(this.list[i].pushTime);
              };
              //消息类型
              if (this.list[i].messageType == '0') {
                this.list[i].messageType = '公告'
              } else if (this.list[i].messageType == '1') {
                this.list[i].messageType = '通知'
              } else if (this.list[i].messageType == '2') {
                this.list[i].messageType = '反馈'
              };
            };
          } else {
            this.showLists = false;
            this.noShowList = false;
            this.showList=true;
          };
          this.pageParam.pageNum += 1;
          this.$nextTick(() => {
            this.pullingDownUp()
          });
        } else {
          return;
        }
      })
    },
    judgeDate(flage) {
      //判断月份是否大于10
      //console.log(flage);
      console.log(flage,typeof(flage))
      if (flage) {
        var newMonth = new Date(flage).getMonth() + 1;
        if (newMonth >= 10) {
          newMonth = newMonth;
        } else {
          newMonth = '0' + newMonth;
        };
        //判断日是否大于10
        var newDate = new Date(flage).getDate();
        if (newDate >= 10) {
          newDate = newDate;
        } else {
          newDate = '0' + newDate;
        };
        //判断小时是否大于10
        var h = new Date(flage).getHours();
        h = h < 10 ? ('0' + h) : h;
        //判断分钟是否大于10
        var minute = new Date(flage).getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        //判断秒是否大于10
        var second = new Date(flage).getSeconds();
        second = second < 10 ? ('0' + second) : second;
        return flage = new Date(flage).getFullYear() + '-' + newMonth + '-' + newDate + ' ' + h + ':' + minute + ':' + second;
      }

    },
    goContent(item) {
      localStorage.setItem('inforContent',item.content);
      //this.$router.push({ path: '/content', query: { content: item.content,id:item.id } })
      this.$router.push({ path: '/content', query: { id:item.id} })
    },
  },
}

</script>
<style scoped>
.inforList {
  width: 100%;
  height: 100%;
  background: #f6f6f6;
  overflow: auto;
  overflow-x: hidden;
}

.inforList ul {
  width: 100%;
}

.inforList ul li {
  background: #ffffff;
  box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.10);
  border-radius: 6px;
  width: 7rem;
  height: 1.62rem;
  margin: 0 auto;
  margin-bottom: .2rem;
  position: relative;
}

.inforList ul li:nth-of-type(1) {
  margin-top: .3rem;
}

.inforList ul li h4 {
  width: 6.2rem;
  color: #080808;
  font-size: .3rem;
  padding: .29rem 0 .2rem .33rem;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.inforList ul li h4 .unreadMessage {
  position: absolute;
  top: .3rem;
  right: .25rem;
  background: #ff7676;
  width: .21rem;
  height: .21rem;
  border-radius: 100%;
}

.inforList p {
  width: 100%;
  text-align: left;
}

.time {
  text-align: left;
  padding-left: .33rem;
  color: #7b7b7b;
  font-size: .26rem;
}

.type {
  width: .94rem;
  height: .5rem;
  display: inline-block;
  line-height: .36rem;
  text-align: center;
  font-size: .24rem;
  color: #fff;
  background: url(/static/images/infor_type.png) no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: -.04rem;
}

.opacity {
  opacity: .5;
}

.noMessageList {
  width: 100%;
  height: 100%;
}

.noMessageList p {
  color: #344b67;
  font-size: .32rem;
  text-align: center;
  padding: 1.1rem 0 .75rem;
}

.noMessageList img {
  width: 4.18rem;
  height: 5.09rem;
}

.listWrapper {
  width: 100%;
  height: calc(100% - 1rem);
  overflow: hidden;
}

</style>
