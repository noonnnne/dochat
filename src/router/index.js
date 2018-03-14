import Vue from 'vue'
import Router from 'vue-router'
import LoginRegist from '@/page/LoginRegist'
import Chat from '@/page/Chat'

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
