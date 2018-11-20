// 运营商
var thirdConstant = {};

var host = location.hostname;

// 最后拼接 地址
var developmentEnv = "10.1.26.203"; // 开发环境
var testEnv = "10.1.26.200"; // 测试环境
var releaseEnv = "precapp.nuoyuan.com.cn"; // 准生产环境
var productionEnv = "nyapp.nuoyuan.com.cn"; // 生产环境

var APIKEY_MOXIE;
//聚信立正式apikey
var JUXINLI_CARRIER_APIKEY;
//聚信立正式地址
var JUXINLI_CARRIER_BASEURL;

// 生产环境
if (host === productionEnv) {
  APIKEY_MOXIE = "dcb122bf822a4d3bbb6950ac6fe862ec";
  // 聚信立正式apikey
  JUXINLI_CARRIER_APIKEY = "132137bef5354d86ba88a78acf50aff5";
  //聚信立正式地址
  JUXINLI_CARRIER_BASEURL = "https://vip.juxinli.com";
} else {
  // // 非生产环境
  // APIKEY_MOXIE = "5433e9eb07694850aa818d64d9f0bcb2";
  // //聚信立测试apikey
  // JUXINLI_CARRIER_APIKEY = "eb98b048478644bcb64305ac25ce3308";
  // //聚信立测试地址
  // JUXINLI_CARRIER_BASEURL = "https://viptest.juxinli.com";

  // 以下全部调用生产地址配置 -- start
  APIKEY_MOXIE = "dcb122bf822a4d3bbb6950ac6fe862ec";
  // 聚信立正式apikey
  JUXINLI_CARRIER_APIKEY = "132137bef5354d86ba88a78acf50aff5";
  //聚信立正式地址
  JUXINLI_CARRIER_BASEURL = "https://vip.juxinli.com";
  // --- end
}

thirdConstant.APIKEY_MOXIE = APIKEY_MOXIE;
//聚信立测试apikey
thirdConstant.JUXINLI_CARRIER_APIKEY = JUXINLI_CARRIER_APIKEY;
//聚信立测试地址
thirdConstant.JUXINLI_CARRIER_BASEURL = JUXINLI_CARRIER_BASEURL

// 导出 rsaConstant
export default thirdConstant;
