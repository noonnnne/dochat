<template>
  <div class="chat font-0">
    <communication-side/>
    <main-content/>>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import CommunicationSide from '../components/CommunicationSide'
import MainContent from '../components/MainContent'

export default {
  name: 'chat',
  computed: {
    ...mapState([
      'socket',
      'currentUser'
    ])
  },
  methods: {
    ...mapMutations([
      'setState'
    ])
  },
  components: {
    CommunicationSide,
    MainContent
  },
  created() {
    // eslint-disable-next-line
    const socket = io('localhost:3000')
    this.setState({
      key: 'socket',
      value: socket
    })
  }
}
</script>

<style lang="scss">
</style>
