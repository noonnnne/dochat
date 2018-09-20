import { mapState, mapMutations } from 'vuex'


export default {
  computed: {
    ...mapState([
      'currentUser'
    ])
  },

  methods: {
    ...mapMutations([
      'setState'
    ]),

    fetch(event, data, toast = true) {
      return new Promise(resolve => {
        this.$socket.emit(event, data, res => {
          if (typeof res === 'string') {
            if (toast) {
              this.$loading({
                lock: true,
                text: res
              })
            }
            resolve([res, null])
          } else {
            resolve([null, res])
          }
        })
      })
    }
  }
}
