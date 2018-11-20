// api 配置
import Vue from 'vue'
import axios from 'axios'
import store from '../../store/store'
import * as types from '../../store/types'
// RSA 环境配置
import rsaConstant from '../rsaConstant'
// 接口环境配置信息
import appConstant from '../constant'
import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';

axios.defaults.baseURL = appConstant.baseUrl;



axios.defaults.timeout = 30000;
axios.defaults.headers.post['Content-Type'] = 'text/plain;charset=UTF-8';
axios.defaults.headers.post['x-requested-with'] = 'XMLHttpRequest';
// axios.defaults.headers.post['Accept'] = 'text/plain;charset=UTF-8';
axios.defaults.headers.post['version'] = '2.0.0';
axios.defaults.headers.post['client'] = '1';
var tempImei = localStorage.getItem('imei');
if (!tempImei)
  tempImei = new Date().getTime() + '00';

axios.defaults.headers.post['imei'] = tempImei;
localStorage.setItem('imei', tempImei);
// 这里 imei 不能永远不能清除

// 开启设置 cookie
axios.defaults.withCredentials = true;
let cancel, promiseArr = {};
const CancelToken = axios.CancelToken;
// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (store.state.token) {
      config.headers['x-session-token'] = `${store.state.token}`;
      // config.headers['client'] = '1';
      // config.headers['version'] = '2.0.0';
      // config.headers['imei'] = 
    }
    return config
  },
  err => {
    return Promise.reject(err)
  },
)

// 响应拦截器
axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.resolve(error.response)
})

export default {
  install: function(Vue, options) {
    // get 请求
    Vue.prototype.get = function(url, param) {
        return new Promise((resolve, reject) => {
          axios({
            method: 'get',
            url,
            params: param,
            cancelToken: new CancelToken(c => {
              cancel = c
            })
          }).then(res => {
            resolve(res)
          })
        })
      },
      // post 请求
      Vue.prototype.post = function(url, param) {
        // Encrypt with the public key...
        // var encrypt = new JSEncrypt();
        // encrypt.setPublicKey(rsaConstant.publicKey);
        // var str = encrypt.encryptLong2(JSON.stringify(param))

        // console.log('加密前:',JSON.stringify(param));
        // console.log(typeof JSON.stringify+'')
        // console.log('加密后:',str);
        // var decrypt = new JSEncrypt();
        //     decrypt.setPrivateKey(`MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBALb2E42dlQNKIMYlDU+5KdcTMsutsme0Jy1/jJPAYbYZBb4sjO8hNpoVieslMkd0/UCKUH855ovUsCFCxiIw40xYsXPydeepvBX+ipaaNwitdn8IesPJS7QN+awRqVuJxSi1ab7KDAr5j2o0ROdlPZW150IwCUZ3tJmEBPw1nAtJAgMBAAECgYEArAusCWAkbsp3FTxkTxKEaK2x91unxuLecGdfjtS6TV0sTE9iW790s+ILJiZ9KDq3psgpt+l/hQAEe9JptF8abOgY6VN+080n3hUhaL9etCGS6XUPc7sFT2WLO/WYHJKzExVmbcCTtGtAN/0p09YK8CL2xMpHVMzUuxc0IQdakoECQQDxE7nE4rH8niCJJxPUxzFOU1ruPijCAtNZx2GSGHg5Z94N9nC7SV1yGsGoJpReGFL7iEDJVKD+ceVfHOlnmrCRAkEAwkloOcuoT4yM5tukO5mw5VqEp5HH0b9ZSIi0f0qgR/7a3gtro3B6YX1LKc5SbiZPlcqKrMNDmZ0x/IY8p4yLOQJABy0+J4VUJSAT+eFG7turNRi4KUWCcxwgbJjJ586ArbzQ2HuQqZKqjH4Na9MSMabpuYE55IR3cnuzh1xV+naZcQJABxOLY0eCqtsQqrvnQHB5m/DvEfdiUsZoZxbrlBNQwS6MJDhARGStYG2i1jP4lqB4l5kX8fDuvmKWVn9BKE0bKQJBAIXK5D2NMpZaMheoCbZwQyT2n9mJcP7JjXoCgM0zCHtLxTfFgZ+L7hEpNRTMQd0c/08veytvKH+LVMYdIZLy+6w=`);
        // console.log(decrypt.decryptLong2(str))

        return new Promise((resolve, reject) => {
          axios({
            method: 'post',
            url,
            data: param,
            cancelToken: new CancelToken(c => {
              cancel = c
            })
          }).then(res => {
            // var decrypt = new JSEncrypt();
            // decrypt.setPrivateKey(rsaConstant.publicKey);
            // // 返回解密后的数据
            // resolve(decrypt.decryptLong2(res.split('\"')[1]))
            // console.log(res.data.code)
            if (res.data.code == '100006' || res.data.code == '100003' || res.data.code == '100004') {
              // localStorage.clear();
              MessageBox({
                title: '提示',
                message: res.data.msg,
                showCancelButton: false
              }).then(action => {
                Indicator.close();
                this.$store.commit(types.LOGOUT)
                this.$router.push('/')
              });
              // 其他设备登录, 
              return;
            }
            resolve(res)
          })
        })
      }
  }
}
