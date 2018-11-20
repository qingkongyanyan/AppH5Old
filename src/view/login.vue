<template>
  <div>
    <p>
      我是登录页面
    </p>
    <button @click="login">登录</button>
    <button @click="getImgCheckCode">获取验证码</button>
    <button @click="shangtang">商汤</button>
    <button @click="yunyingshang">运营商</button>
    <button @click="tongdun">同盾-设备指纹</button>
  </div>
</template>
<script>
import ThridContent from '../util/thridConstant.js'
import TongDun from '../util/tongdun.js'
export default {
  data() {
    return {
      msg: 'login'
    }
  },
  mounted() {
    console.log('进入登录页面');
  },
  methods: {
    login: function() {
      console.log('login')
      this.post('/account/custLogin', {
        "password": "9cbf8a4dcb8e30682b927f352d6559a0",
        "loginType": "0",
        "imgCheckCodeId": "463357982038556672",
        "imgCheckCode": "uug3",
        "mobile": "13260656059"
      }).then(res => {
        console.log(res)
        if (res.data.code == '100000') {
          // 成功
          this.$router.push('/home')
        } else {
          // 失败
        }
      })
    },
    getImgCheckCode: function() {
      this.post('/account/getImgCheckCode', {

      }).then(res => {

      })
    },
    // 商汤
    shangtang: function() {
      console.log('商汤')
    },
    // 运营商
    yunyingshang: function() {
      console.log('运营商')
      window.location.href = ThridContent.JUXINLI_CARRIER_BASEURL +
        "/h5/authorize/telecom?api_key=" +
        ThridContent.JUXINLI_CARRIER_APIKEY +
        "&user_id=" +
        "李飞" +
        "-" +
        "141181199107160055" +
        "-h5&id_card_num=" +
        "141181199107160055" +
        "&phone=" +
        "18201111111" +
        "&name=" +
        "李飞" +
        "&theme=2da8e1";
    },
    // 同盾
    tongdun: function() {
      console.log('同盾-设备指纹 测试')

      // 调用接口获取blackBox字段，请确保上述初始化代码已经执行，切勿在刚执行完的时候才执行
      var black_box = _fmOpt.getinfo();
      console.log('同盾')
      console.log(black_box)

    }
  }
}

</script>
