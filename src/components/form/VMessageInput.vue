<template>
  <div class="vmessage-input width-100 px-line-60 px-height-180 px-padding-lr20 bg-bgbg
  position-a bottom-0">
    <v-tool-bar/>
    <v-textarea/>
    <span
      class="position-a px-font-32 px-right-40 px-bottom-20 iconfont icon-send cursor-p color-green"
      @click="sendMsg"
    >
    </span>
  </div>
</template>

<script>
import VToolBar from '../VToolBar'
import VTextarea from './VTextarea'
import MessageManagerMixin from '../../mixins/messageManager'

export default {
  components: {
    VToolBar,
    VTextarea
  },
  mixins: [MessageManagerMixin]
}
</script>

<style lang="scss">
@import '../../style/global.scss';

.icon-send {
  opacity: .4;
  transition: opacity .6s ease-in;
  &:hover{
    opacity: 1;
  }
}
</style>
