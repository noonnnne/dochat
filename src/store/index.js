import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    currentUser: null,
    sessionList: undefined,
    singleChatList: null, // 单聊
    groupChatList: null, // 群聊
    currentSessionId: -1
  },

  getters: {
    // get current session id
    currentSessionData(state) {
      if (state.sessionList) {
        return state.sessionList.filter(item =>
          item.id === Number(state.currentSessionId))[0]
      }
      return null
    }
  },

  mutations: {
    setState(state, payload) {
      if (payload.key === undefined && payload.value === undefined) {
        Object.keys(payload).forEach(key => {
          state[key] = payload[key]
        })
      } else if (payload.key === 'array') {
        Object.keys(key => {
          state[key] = payload.value[key]
        })
      } else {
        state[payload.key] = payload.value
      }
    },

    addContact(state, payload) {
      const temp = [...state.currentUser.contacts]
      temp.push(payload)
      state.currentUser.contacts = [...temp]
    },

    joinGroup(state, payload) {
      const temp = [...state.currentUser.groups]
      temp.push(payload)
      state.currentUser.groups = [...temp]
    },

    updateUserBaseInfo(state, payload) {
      state.currentUser.nickname = payload.nickname
      state.currentUser.birthday = payload.birthday
      state.currentUser.gender = payload.gender
      state.currentUser.autograph = payload.autograph
      state.currentUser.pinyin = payload.pinyin
      state.currentUser.avatar = payload.avatar
    }
  }

})

export default store
