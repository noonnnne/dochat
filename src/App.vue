<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import platform from 'platform'
import { mapMutations } from 'vuex'
import socketMixin from './mixins/socketMixin'

export default {
  name: 'app',

  mixins: [socketMixin],

  mounted() {
    this.$socket.on('connect', async () => {
      const token = this.$localCache.get('token')
      if (token) {
        const [err, res] = await this.fetch('loginByToken', {
          token,
          os: platform.os.family,
          browser: platform.name,
          environment: platform.description
        }, { toast: false })
        if (!err) {
          this.setState({
            currentUser: res
          })
          this.$router.push('/chat')
        }
      }
    })
  },

  methods: {
    ...mapMutations([
      'setState'
    ]),

    async guest() {
      const [err, res] = await this.fetch('guest', {
        os: platform.os.family,
        browser: platform.name,
        environment: platform.description
      })

      if (!err) {
        this.setState({ currentUser: res })
      }
    }
  }
}
</script>

<style>
@import './style/base.scss';
@import './style/_variable.scss';

#app{
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: 1200px;
  min-width: 1200px;
  background-size: cover;
}
</style>
