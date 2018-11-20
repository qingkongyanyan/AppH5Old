import Vuex from 'vuex'
import Vue from 'vue'
import * as types from './types'

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        user: {},
        token: null,
        title: ''
    },
    mutations: {
        [types.LOGIN]: (state, data) => {
            localStorage.token = data;
            state.token = data;
        },
        [types.LOGOUT]: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('BMap_othersearch_szgzgd')
            localStorage.removeItem('BMap_scommon_efjngs')
            localStorage.removeItem('aboutUsUrl')
            localStorage.removeItem('certCode')
            localStorage.removeItem('custId')
            localStorage.removeItem('custName')
            // localStorage.removeItem('imei')
            localStorage.removeItem('loginInformation')
            localStorage.removeItem('loglevel:webpack-dev-server')
            localStorage.removeItem('mobile')
            localStorage.removeItem('location')
            localStorage.removeItem('from')
            localStorage.removeItem('fromOrBack')
            localStorage.removeItem('jichuOrYewu')
            localStorage.removeItem('bankObj')
            localStorage.removeItem('cityObj')
            localStorage.removeItem('agreeRow')
            localStorage.removeItem('contractRow')//合同查询列表信息
            localStorage.removeItem('repaymentRow')//还款查询列表信息
            localStorage.removeItem('addObj')
            localStorage.removeItem('fourcertCode')
            localStorage.removeItem('bankCardNo')
            localStorage.removeItem('payObj')
            localStorage.removeItem('baseObj')
            localStorage.removeItem('inforContent')
            localStorage.removeItem('questionContent')
            state.token = null
        },
        [types.TITLE]: (state, data) => {
            state.title = data;
        }
    }
})