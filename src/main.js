// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store/store'
import "../static/css/index.css"
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import './util/rem'
import FastClick from 'fastclick'
import apiServer from './util/api/apiServer'

import '../static/vue-pdf-shower/lib/dist/pdf.js'
PDFJS.workerSrc = 'pdfShow/lib/dist/pdf.worker.js'
PDFJS.cMapUrl = '/static/web/cmaps/'
PDFJS.cMapPacked = true;
/*import BScroll from 'better-scroll'*/

// if ('addEventListener' in document) {
//     document.addEventListener('DOMContentLoaded', function() {
//         FastClick.attach(document.body);
//     }, false);
// }

Vue.use(MintUI)
Vue.use(apiServer)


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})