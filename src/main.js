// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import {
  Message,
  Loading,
  Button,
  Popover
} from 'element-ui'
import WebStorageCache from 'web-storage-cache'
import moment from 'moment'
import IO from 'socket.io-client'
import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store/index'

moment.locale('zh-CN')

Vue.use(Button)
Vue.use(Popover)

Vue.config.productionTip = false
Vue.prototype.$moment = moment
Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service
Vue.prototype.$sessionCache = new WebStorageCache({
  storage: 'sessionStorage'
})
Vue.prototype.$localCache = new WebStorageCache()
Vue.prototype.$socket = new IO('localhost:3000')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store
})
