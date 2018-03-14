<template>
  <div class="chat font-0">
    <communication-side></communication-side>
    <main-content></main-content>
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
    console.log(this.currentUser)
  }
}
</script>

<style lang="scss">
</style>
