import { mapState } from 'vuex'

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState([
      'currentSessionId',
      'socket'
    ])
  },
  methods: {
    sendMsg() {
      this.socket.emit('message', {
        from: {
          name: '待之以桃',
          uid: '123123'
        },
        content: '测试消息发送'
      })
    }
  }
}
