<!-- 添加授信成功 -->
<template>
  <div>
    <div class="credit-container credit-watit" v-show="true">
      <div class="msg font-size34">
        <!-- 您未发起有效的授权申请 -->
        <p class="font-size30">提交成功,请耐心等待授信结果!</p>
        <p class="font-size30">可在[业务]-[授信]查看授信结果</p>
      </div>
      <div class="back-btn" @click="backClick">
      	返回
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: 'backClick'
    }
  },
  methods: {
    backClick: function() {
      console.log('点击返回按钮')
      this.$router.replace('/businessList');
      // this.$router.go(-1);
    }
  }
}

</script>
<style scoped>
/*授信列表 内容 */

.credit-container {
  width: 100%;
  height: 100%;
  background: #fff;
}








/* 列表无数据 提示*/

.credit-container .msg {
  display: block;
  width: 100%;
  text-align: center;
  padding-top: 5rem;
}









/*耐心等待审核结果*/

.credit-watit {
  background-image: url(../../../static/images/mine_success@2x.png);
  background-position: center 20%;
  background-repeat: no-repeat;
  background-size: 2rem;
}


.credit-watit p{
  height: 0.5rem;
  line-height: 0.5rem;
}


/* 返回按钮 */

.back-btn {
  height: 0.8rem;
  margin-left: 0.3rem;
  margin-right: 0.3rem;
  background-image: linear-gradient(-216deg, #59d3f2 7%, #2da8e1 100%);
  border-radius: 0.1rem;
  line-height: 0.8rem;
  font-size: 0.34rem;
  color: #fff;
  margin-top: 0.4rem;
}

</style>
