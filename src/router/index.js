import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store'
import * as types from '../store/types'
import HelloWorld from '@/components/HelloWorld'
//登录
import Login from '@/view/login/login'
// import Login from '@/view/login'

//忘记密码
import forgetPassword from '@/view/login/forgetPassword'
//注册账号
import signUp from '@/view/login/signUp'
//设置密码
import setPassword from '@/view/login/setPassword'
// 修改密码
import changePassword from '@/view/login/changePassword'
//手机验证码登录
import mobileCodeLogin from '@/view/login/mobileCodeLogin'
//首页
import newHome from '@/view/home/home'
//首页
import Home from '@/view/home/newHome'

//首页
import aa from '@/view/home/aa'


//极速模式
import turboMode from '@/view/home/turboMode'
//工薪模式
import payrollModel from '@/view/home/payrollModel'
//同业模式
import interbankModel from '@/view/home/interbankModel'
//首页-消息中心
import content from '@/view/home/content'
//首页-消息中心列表
import inforList from '@/view/home/inforList'
//首页-授信攻略
import creditStrategy from '@/view/home/creditStrategy'
//首页-立即授信-开启权限
import openPermissions from '@/view/components/openPermissions'
//首页-立即授信-基础认证
import basicAuthentication from '@/view/components/basicAuthentication'
//业务
import businessList from '@/view/business/businessList'
//签约-列表
import signAContractList from '@/view/signAContract/signAContract-list'
//签约-合同协议
import agreement from '@/view/signAContract/agreement'
//签约-填写验证码
import securityCode from '@/view/signAContract/securityCode'
//签约-签约成功
import signSuccessful from '@/view/signAContract/signSuccessful'
//签约-签约合并
//import newAgreement from '@/view/signAContract/newAgreement'
//四要素认证
import fourFactorAuthentication from '@/view/fourFactorAuthentication/fourFactorAuthentication'
//四要素认证-开户行名称
import nameOfBack from '@/view/fourFactorAuthentication/nameOfBack'
//四要素认证-开户行所在城市名称
import nameOfCity from '@/view/fourFactorAuthentication/nameOfCity'
//四要素认证-认证成功
import siyaosuSucess from '@/view/fourFactorAuthentication/siyaosuSucess'
//四要素认证-认证中
import siyaosuWait from '@/view/fourFactorAuthentication/siyaosuWait'

// 银行卡变更
import changeBankCard from '@/view/mine/fourFactorAuthentication'
// 支付签约   payContract
import payContract from '@/view/mine/payContract'

//实名-ocr
import realName from '@/view/realName/realName'
import getVideoResult from '@/view/realName/getVideoResult'
import Business from '@/view/business'
import Mine from '@/view/mine'
// 疑难解答
import BugQuestion from '@/view/mine/bugQuestion'
// 疑难解答详情
import BugQuestionDetail from '@/view/mine/questionDetail'
// 意见反馈
import FeedBack from '@/view/mine/feedBack'
// 关于我们
import AboutUs from '@/view/mine/aboutUs'
// 授信列表
import CreditList from '@/view/business/creditList'
// 添加授信
import AddCredit from '@/view/business/addCredit'
// 添加授信 提交成功
import AddCreditSuccess from '@/view/business/addCreditSuccess'
// 授信详情
import CreditInfo from '@/view/business/creditInfo'
// 选择门店
import SelectOrg from '@/view/business/selectOrg'
// 合同查询-列表
import contractInquiryList from '@/view/contractInquiry/contractInquiryList'
// 合同查询-详情
import contractInquiryDetail from '@/view/contractInquiry/contractInquiryDetail'
// 合同查询-pdf
import pdf from '@/view/contractInquiry/pdf'
// 还款查询-列表
import repaymentQueryList from '@/view/repaymentQuery/repaymentQueryList'
// 还款查询-详情
import repaymentQueryDetail from '@/view/repaymentQuery/repaymentQueryDetail'
// 还款查询-pdf
import repaymentQueryPdf from '@/view/repaymentQuery/repaymentQueryPdf'
//我的账户-更换手机号
import myAccount from '@/view/mine/myAccount/myAccount'
//我的账户-更换手机号-验证码
import myAccountCode from '@/view/mine/myAccount/myAccountCode'
//我的账户-更换手机号-变更
import myAccountChange from '@/view/mine/myAccount/myAccountChange'
// 进度查询
import progressQueryList from '@/view/progreseQuery/progressQueryList'
// 进度详情
import progressQueryDetail from '@/view/progreseQuery/progressQueryDetail'

import {
  getCookie
} from '@/util/util'

Vue.use(Router)

const routes = [
  // {
  //   path: '/',
  //   name: 'HelloWorld',
  //   component: HelloWorld
  // },
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: {
      title: "登录",
      requireAuth: false,
      keepAlive: false
    }
  },
  {
    path: '/forgetPassword',
    name: 'forgetPassword',
    component: forgetPassword,
    meta: {
      title: "忘记密码",
      requireAuth: false,
      keepAlive: false
    }
  },
  {
    path: '/changePassword',
    name: 'changePassword',
    component: changePassword,
    meta: {
      title: '修改登录密码',
      requireAuth: true,
      keepAlive: false
    }
  },
  {
    path: '/signUp',
    name: 'signUp',
    component: signUp,
    meta: {
      title: "注册账号",
      requireAuth: false,
      keepAlive: false
    }
  },
  {
    path: '/setPassword',
    name: 'setPassword',
    component: setPassword,
    meta: {
      title: "设置密码",
      requireAuth: false,
      keepAlive: false
    }
  },
  {
    path: '/mobileCodeLogin',
    name: 'mobileCodeLogin',
    component: mobileCodeLogin,
    meta: {
      title: "验证码登录",
      requireAuth: false,
      keepAlive: false
    }
  },
  //首页-立即授信-基础认证
  {
    path: '/basicAuthentication',
    name: 'basicAuthentication',
    component: basicAuthentication,
    meta: {
      title: "基础认证",
      requireAuth: true,
      keepAlive: false
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页',
      requireAuth: true, // 添加字段, 表示进入路由需要登录
      keepAlive: false
    }
  },
  {
    path: '/newHome',
    name: 'newHome',
    component: newHome,
    meta: {
      title: '首页',
      requireAuth: true, // 添加字段, 表示进入路由需要登录
      keepAlive: false
    }
  },
  {
    path: '/aa',
    name: 'aa',
    component: aa,
    meta: {
      title: '首页',
      requireAuth: true, // 添加字段, 表示进入路由需要登录
      keepAlive: false
    }
  },
  {
    path: '/turboMode',
    name: 'turboMode',
    component: turboMode,
    meta: {
      title: '极速模式',
      requireAuth: true, // 添加字段, 表示进入路由需要登录
      keepAlive: false
    }
  },
  {
    path: '/payrollModel',
    name: 'payrollModel',
    component: payrollModel,
    meta: {
      title: '工薪模式',
      requireAuth: true, // 添加字段, 表示进入路由需要登录
      keepAlive: false
    }
  },
  {
    path: '/interbankModel',
    name: 'interbankModel',
    component: interbankModel,
    meta: {
      title: '同业模式',
      requireAuth: true, // 添加字段, 表示进入路由需要登录
      keepAlive: false
    }
  },
  {
    path: '/content',
    name: 'content',
    component: content,
    meta: {
      title: '消息中心',
      requireAuth: true, // 添加字段, 表示进入路由需要登录
      keepAlive:false
    }
  },
  {
    path: '/inforList',
    name: 'inforList',
    component: inforList,
    meta: {
      title: '消息中心',
      requireAuth: true, // 添加字段, 表示进入路由需要登录
      keepAlive:false
    }
  },
  //首页-授信攻略
  {
    path: '/creditStrategy',
    name: 'creditStrategy',
    component: creditStrategy,
    meta: {
      title: "授信攻略",
      requireAuth: false,
      keepAlive: false
    }
  },
  {
    path: '/openPermissions',
    name: 'openPermissions',
    component: openPermissions,
    meta: {
      title: "开启权限",
      requireAuth: false,
      keepAlive: false
    }
  },
  {
    path: '/businessList',
    name: 'businessList',
    component: businessList,
    meta: {
      title: "业务",
      requireAuth: true,
      keepAlive: false
    }
  },
  {
    path: '/signAContractList',
    name: 'signAContractList',
    component: signAContractList,
    meta: {
      title: "签约列表",
      requireAuth: true,
      keepAlive: false
    }
  },
  // 合同协议
  {
    path: '/agreement',
    name: 'agreement',
    component: agreement,
    meta: {
      title: "合同协议",
      requireAuth: true,
      keepAlive: false
    }
  },
  {
    path: '/securityCode',
    name: 'securityCode',
    component: securityCode,
    meta: {
      title: "填写验证码",
      requireAuth: false,
      keepAlive: false
    }
  },
  // 签约成功
  {
    path: '/signSuccessful',
    name: 'signSuccessful',
    component: signSuccessful,
    meta: {
      title: "签约成功",
      requireAuth: true,
      keepAlive: false
    }
  },
  // 签约合并
  /*{
    path: '/newAgreement',
    name: 'newAgreement',
    component: newAgreement,
    meta: {
      title: "签约",
      requireAuth: true,
      keepAlive:false
    }
  },*/
  // 四要素认证
  {
    path: '/fourFactorAuthentication',
    name: 'fourFactorAuthentication',
    component: fourFactorAuthentication,
    meta: {
      title: "四要素认证",
      requireAuth: true,
      keepAlive: false
    }
  },
  // 开户行名称
  {
    path: '/nameOfBack',
    name: 'nameOfBack',
    component: nameOfBack,
    meta: {
      title: "开户行名称",
      requireAuth: true,
      keepAlive: false
    }
  },
  // 开户行所在城市名称
  {
    path: '/nameOfCity',
    name: 'nameOfCity',
    component: nameOfCity,
    meta: {
      title: "开户行所在城市名称",
      requireAuth: true,
      keepAlive: false
    }
  },
  // 四要素认证结果
  {
    path: '/siyaosuSucess',
    name: 'siyaosuSucess',
    component: siyaosuSucess,
    meta: {
      title: "认证结果",
      requireAuth: true,
      keepAlive: false
    }
  },
  // 四要素认证中
  {
    path: '/siyaosuWait',
    name: 'siyaosuWait',
    component: siyaosuWait,
    meta: {
      title: "认证中",
      requireAuth: true,
      keepAlive: false
    }
  },
  // 身份认证
  {
    path: '/realName',
    name: 'realName',
    component: realName,
    meta: {
      title: "身份认证",
      requireAuth: true,
      keepAlive: false
    }
  },
  // 身份认证
  {
    path: '/getVideoResult',
    name: 'getVideoResult',
    component: getVideoResult,
    meta: {
      title: "肖像认证",
      requireAuth: true,
      keepAlive: false
    }
  },
  // 业务受理
  {
    path: '/business',
    name: 'Business',
    component: Business,
    meta: {
      title: '业务受理',
      requireAuth: true, // 添加字段, 表示进入路由需要登录
      keepAlive: false
    }
  },
  {
    path: '/mine',
    name: 'Mine',
    component: Mine,
    meta: {
      title: '我的账户',
      requireAuth: true, // 添加字段, 表示进入路由需要登录
      keepAlive: false
    }
  },
  // 疑难解答
  {
    path: '/bugQuestion',
    name: 'BugQuestion',
    component: BugQuestion,
    meta: {
      title: '疑难解答',
      requireAuth: true,
      keepAlive: false
    }
  },
  // 疑难解答详情
  {
    path: '/bugQuestionDetail',
    name: 'BugQuestionDetail',
    component: BugQuestionDetail,
    meta: {
      title: '疑难解答',
      requireAuth: true,
      keepAlive: false
    }
  },
  // 意见反馈
  {
    path: '/feedBack',
    name: 'FeedBack',
    component: FeedBack,
    meta: {
      title: '意见反馈',
      requireAuth: true,
      keepAlive: false
    }
  },
  // 关于我们
  {
    path: '/aboutUs',
    name: 'AboutUs',
    component: AboutUs,
    meta: {
      title: '关于我们',
      requireAuth: true,
      keepAlive: false
    }
  },
  // 授信列表
  {
    path: '/creditList',
    name: 'CreditList',
    component: CreditList,
    meta: {
      title: '授信列表',
      requireAuth: true,
      keepAlive: false
    }
  },
  // 添加授信
  {
    path: '/addCredit',
    name: 'AddCredit',
    component: AddCredit,
    meta: {
      title: '添加授信',
      requireAuth: true,
      keepAlive: false
    }
  },
  // 添加授信 提交成功
  {
    path: '/addCreditSuccess',
    name: 'AddCreditSuccess',
    component: AddCreditSuccess,
    meta: {
      title: '提交成功',
      requireAuth: true,
      keepAlive: false
    }
  },
  // 授信详情
  {
    path: '/creditInfo/:id',
    name: 'CreditInfo',
    component: CreditInfo,
    meta: {
      title: '授信详情',
      requireAuth: true,
      keepAlive: false
    }
  },
  // 选择门店
  {
    path: '/selectOrg',
    name: 'SelectOrg',
    component: SelectOrg,
    meta: {
      title: '面审机构',
      requireAuth: true,
      keepAlive: false
    }
  },
  //合同查询
  {
    path: '/contractInquiryList',
    name: 'contractInquiryList',
    component: contractInquiryList,
    meta: {
      title: '合同查询',
      requireAuth: true,
      keepAlive: false
    }
  },
  //合同查询
  {
    path: '/contractInquiryDetail',
    name: 'contractInquiryDetail',
    component: contractInquiryDetail,
    meta: {
      title: '合同协议',
      requireAuth: true,
      keepAlive: false
    }
  },
  //合同查询-pdf
  {
    path: '/pdf',
    name: 'pdf',
    component: pdf,
    meta: {
      title: '合同详情',
      requireAuth: true,
      keepAlive: false
    }
  },
  //还款查询-列表
  {
    path: '/repaymentQueryList',
    name: 'repaymentQueryList',
    component: repaymentQueryList,
    meta: {
      title: '还款信息',
      requireAuth: true,
      keepAlive: false
    }
  },
  //还款查询-详情
  {
    path: '/repaymentQueryDetail',
    name: 'repaymentQueryDetail',
    component: repaymentQueryDetail,
    meta: {
      title: '还款详情',
      requireAuth: true,
      keepAlive: false
    }
  },
  //还款查询-详情
  {
    path: '/repaymentQueryPdf',
    name: 'repaymentQueryPdf',
    component: repaymentQueryPdf,
    meta: {
      title: '还款详情',
      requireAuth: true,
      keepAlive: false
    }
  },
  //我的账户-更换手机号
  {
    path: '/myAccount',
    name: 'myAccount',
    component: myAccount,
    meta: {
      title: '更换手机号',
      requireAuth: true,
      keepAlive: false
    }
  },
  // 进度查询列表
  {
    path: '/progressQueryList',
    name: 'progressQueryList',
    component: progressQueryList,
    meta: {
      title: '进度查询',
      requireAuth: true,
      keepAlive: false
    }
  },
  // 进度详情
  {
    path: '/progressQueryDetail',
    name: 'progressQueryDetail',
    component: progressQueryDetail,
    meta: {
      title: '进度详情',
      requireAuth: true,
      keepAlive: false
    }
  },
  //我的账户-更换手机号-验证码
  {
    path: '/myAccountCode',
    name: 'myAccountCode',
    component: myAccountCode,
    meta: {
      title: '填写验证码',
      requireAuth: true,
      keepAlive: false
    }
  },

  //我的账户-更换手机号-变更
  {
    path: '/myAccountChange',
    name: 'myAccountChange',
    component: myAccountChange,
    meta: {
      title: '填写验证码',
      requireAuth: true,
      keepAlive: false
    }
  },
  // 修改银行卡号
  {
    path: '/changeBankCard',
    name: 'changeBankCard',
    component: changeBankCard,
    meta: {
      title: '四要素变更',
      requireAuth: true,
      keepAlive: false
    }
  },
  // 支付签约
  {
    path: '/payContract',
    name: 'payContract',
    component: payContract,
    meta: {
      title: '支付签约',
      requireAuth: true,
      keepAlive: false
    }
  }
];
/*const scrollBehavior = function(to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
};*/
/*const scrollBehavior = function(to, from) {
  setTimeout(() => {
    window.scrollTo(0, 0)
  }, 200)
};*/

// 页面刷新时，重新赋值token
if (window.localStorage.getItem('token')) {
  store.commit(types.LOGIN, window.localStorage.getItem('token'))
}

const router = new Router({ routes})
// 路由 登录 拦截
router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title;
  document.body.scrollTop = 0;
  if (to.meta.requireAuth) {
    // if (getCookie("sessionId") !== "") {
    //   window.document.title = to.meta.title;
    //   next();
    // }
    // if (store.state.token) {// 通过 vuex state 获取当前的 token 是否存在 
    //   next();
    // }
    // 否则进登录页面
    // 
    if (store.state.token) { // 通过vuex state获取当前的token是否存在
      next();
    } else {
      next({
        path: '/',
        query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next();
  }
})
export default router;
