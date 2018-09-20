import { mapState, mapMutations } from 'vuex'

const SESSION_PREFIX = 'dochat'

export default {
  computed: {
    ...mapState(['sessionList', 'currentSessionId'])
  },

  methods: {
    ...mapMutations(['setState']),

    getSessionList() {
      const sessionList = this.$localCache.get(`${SESSION_PREFIX}-session`)
      this.setState({
        sessionList: JSON.parse(sessionList) || []
      })
    },

    addSession(obj, isFromMe = false) {
      if (isFromMe && !obj.isGroup) {
        this.addSessionContent(obj)
      } else {
        this.pushNewSession(obj)
      }
    },

    pushNewSession(obj) {
      if (obj.isGroup) {
        this.solveGroupMessage(obj)
      } else {
        this.solvePrivateMessage(obj)
      }
      this.setSessionList()
    },


    solveGroupMessage(message) {
      const tempFrom = { ...message.toDetail }
      const tempTo = message.from._id
      const tempToDetail = { ...message.from }

      message.from = tempFrom
      message.to = tempTo
      message.toDetail = tempToDetail

      const index = this.isInSessionList(message.from._id, true)
      const messageContent = {
        content: message.content,
        from: message.toDetail,
        type: message.type
      }

      let sessionList
      let tempSession
      let innerSessionList
      if (index === -1) {
        sessionList = [...this.sessionList]
        tempSession = { ...message }
        innerSessionList = []
      } else {
        sessionList = [...this.sessionList]
        tempSession = [...this.sessionList][index]
        innerSessionList = [...this.sessionList][index].sessionList
      }

      innerSessionList.push(messageContent)
      tempSession.sessionList = innerSessionList
      if (index !== -1) {
        sessionList.splice(index, 1, tempSession)
      } else {
        sessionList.push(tempSession)
      }
      this.setState({ sessionList })
    },

    solvePrivateMessage(message) {
      const index = this.isInSessionList(message.to)
      const messageContent = {
        content: message.content,
        from: message.from,
        type: message.type
      }

      let sessionList
      let tempSession
      let innerSessionList
      if (index === -1) {
        sessionList = [...this.sessionList]
        tempSession = { ...message }
        innerSessionList = []
      } else {
        sessionList = [...this.sessionList]
        tempSession = [...this.sessionList][index]
        innerSessionList = [...this.sessionList][index].sessionList
      }

      innerSessionList.push(messageContent)
      tempSession.sessionList = innerSessionList
      if (index !== -1) {
        sessionList.splice(index, 1, tempSession)
      } else {
        sessionList.push(tempSession)
      }
      this.setState({ sessionList })
    },

    addSessionContent(obj) {
      const index = this.isInSessionList(obj.to)

      const tempFrom = { ...obj.toDetail }
      const tempTo = obj.from._id
      const tempToDetail = { ...obj.from }

      const tempSession = { ...obj }
      if (index === -1) {
        const sessionList = [...this.sessionList]
        sessionList.push(tempSession)
        this.setState({ sessionList })
      } else {
        tempSession.from = tempFrom
        tempSession.to = tempTo
        tempSession.toDetail = tempToDetail
        const sessionList = [...this.sessionList]
        const sessionContent = sessionList[index].sessionList ? sessionList[index].sessionList : []
        sessionContent.push({
          content: tempSession.content,
          from: obj.from,
          type: tempSession.type
        })

        tempSession.sessionList = sessionContent
        sessionList.splice(index, 1, tempSession)
        this.setState({
          sessionList
        })
      }
    },

    setSessionList() {
      this.$localCache.set(`${SESSION_PREFIX}-session`, JSON.stringify(this.sessionList))
    },

    isInSessionList(id, isGroup = false) {
      if (this.sessionList === undefined) {
        this.getSessionList()
      }

      if (!this.sessionList.length) {
        return -1
      }

      if (isGroup) {
        const index = this.sessionList.findIndex(item => item.from._id === id)
        return index
      }

      const index = this.sessionList.findIndex(
        item => (((item.to === id) && (item.from._id === this.currentSessionId))
          || (item.from._id === id && this.currentUser._id === item.to)) && !item.isGroup
      )

      console.log('------------->')
      console.log(id, index)

      return index
    }
  }
}
