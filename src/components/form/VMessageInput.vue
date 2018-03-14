<template>
  <div class="vmessage-input width-100 px-line-60 px-height-180 px-padding-lr20 bg-bgbg position-a bottom-0">
    <v-tool-bar></v-tool-bar>
    <textarea
      class="bd-none bg-bgbg width-100 px-height-100 px-font-16 overflow-a ib-middle px-line-20"
      style="resize: none;"
      placeholder="说点什么吧~">
    </textarea>
  </div>
</template>

<script>
import VToolBar from '../VToolBar'

export default {
  components: {
    VToolBar
  }
}
</script>

<style lang="scss">
@import '../../style/global.scss';
</style>
