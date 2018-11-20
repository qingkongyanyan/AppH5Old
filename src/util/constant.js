// 环境变量配置

var appConstant = {};
// 拿到本地 hostname 和本地配的地址对比,
var host = location.hostname;
var port = 80;
var httpType = 'http';
var imgHost = location.hostname; // 图片服务器

var developmentEnv = "10.1.26.203"; // 开发环境
var testEnv = "testnyphh5.nuoyuan.com.cn"; // 测试环境
var releaseEnv = "prenyphh5.nuoyuan.com.cn"; // 准生产环境
var productionEnv = "nyphh5.nuoyuan.com.cn"; // 生产环境
var protocol ;// 协议地址

if (host === productionEnv) {
  httpType = 'https';
  host = "nyapp.nuoyuan.com.cn";
  port = 443;
  imgHost = 'file.nuoyuan.com.cn';
  protocol = 'http://nyph.nuoyuan.com.cn/'
} else if (host === releaseEnv) {
  httpType = 'https';
  host = "precapp.nuoyuan.com.cn";
  port = 443;
  imgHost = 'prefile.nuoyuan.com.cn';
  protocol = 'http://prenyph.nuoyuan.com.cn/'
} else if (host === testEnv) {
  // 测试 200
  httpType = 'http';
  host = "10.1.26.200";
  port = 9180;
  imgHost = '10.1.26.204';
  protocol = 'http://prenyph.nuoyuan.com.cn/'
} else {
  // 开发 203
  httpType = 'http';
  host = "10.1.26.203";
  port = 9180;
  imgHost = '10.1.26.204';
  imgHost = 'prefile.nuoyuan.com.cn';
  protocol = 'http://prenyph.nuoyuan.com.cn/'

  // httpType = 'https';
  // host = "precapp.nuoyuan.com.cn";
  // port = 443;
  // imgHost = 'prefile.nuoyuan.com.cn';
  // protocol = 'http://prenyph.nuoyuan.com.cn/'
}
appConstant.baseUrl = httpType + '://' + host + ':' + port + '/creditapp-web-boss/api/h5';
// appConstant.baseUrl = httpType + '://' + 'precapp.nuoyuan.com.cn' + ':' + port + '/creditapp-web-boss/api/h5';

appConstant.baseImgUrl = 'http://' + imgHost + ':80/';
appConstant.protocol = protocol;// 协议地址 
// 鸿飞本地
// appConstant.baseUrl = 'http://10.1.26.12:9180/creditapp-web-boss/api/h5'
// 导出 appConstant
export default appConstant;