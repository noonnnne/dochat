import Vue from 'vue'
import Router from 'vue-router'
/* eslint-disable */
const LoginRegist = r => require.ensure([], () => r(require('../page/LoginRegist')), 'login-regist')
const Chat = r => require.ensure([], () => r(require('../page/Chat.vue')), 'chat')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'LoginRegist',
      component: LoginRegist
    },
    {
      path: '/chat',
      name: 'Chat',
      component: Chat
    }
  ]
})
