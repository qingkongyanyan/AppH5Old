<!-- 关于我们 -->
<template>
  <div class="about-us">
    <p>
      诺远普惠咨询有限公司(简称“诺远普惠”)，是专门为有创业、深造、周转、消费等正当资金需求的小微企业主及个人客户推荐广泛的借款资金来源渠道。诺远普惠以人性化的服务，完善的风控体系，成为同行业中一支以黑马姿态突起的新生力量。公司于2015年成立，总部位于北京、并在上海、广州、济南、青岛、哈尔滨、沈阳、大连、武汉、成都、杭州、南京、苏州、西安、合肥等100多个建立全国性的服务网络，现有近7000名员工，服务客户近20万名。
    </p>
    <p>
      诺远普惠APP隶属于北京诺远普惠咨询有限公司，该平台主要为平台用户提供实名认证、活体检测、资料采集等快速预约办理服务。
    </p>
  </div>
</template>
<script>
export default {
  name: 'aboutUs',
  data() {
    return {
      msg: 'aboutUs'
    }
  },
  mounted() {
    console.log('关于我们');
  }
}

</script>
<style scoped>
.about-us {
  padding: 0.3rem;
  margin: 0;
  font-family: '微软雅黑';
}

p {
  font-size: 0.3rem;
  margin: 0.1rem auto;
  padding: 0 0.1rem 0 0.1rem;
  text-indent: 2em;
  text-align: left;
}

</style>
