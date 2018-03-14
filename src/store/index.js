import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    currentUser: null,
    sessionList: [],
    singleChatList: [], // 单聊
    groupChatList: [], // 群聊
    currentSessionId: null
  },
  getters: {
    // get current session id
    currentSessionData(state) {
      return state.sessionList.find(item => item.id === Number(state.currentSessionId))
    }
  },
  mutations: {
    setState(state, payload) {
      if (payload.key === 'array') {
        for (let key in payload.value) {
          state[key] = payload.value[key]
        }
      } else {
        state[payload.key] = payload.value
      }
    },
    // add session
    addSession(state, payload) {
      state.sessionList.push({
        sessionId: payload.sessionId,
        isSingle: payload.isSingle,
        lastMsg: payload.lastMsg,
        fromUserId: payload.fromUserId,
        timeStamp: new Date().getTime()
      })
    }
  }
})

export default store
