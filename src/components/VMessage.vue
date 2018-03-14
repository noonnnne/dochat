<template>
  <div
    class="v-message position-r px-padding-lr30 font-0 color-fff cursor-p"
    :class="{'bg-active': active}">
    <i v-if="active"
       class="position-a display-n px-left-10 percent-top-50
         translate-y-50 iconfont icon-close">
    </i>
    <div class="position-r message cursor-p px-padding-tb12">
      <v-avatar type='online' size='small'></v-avatar>
      <div class="message-content ib-top">
        <p class="name px-width-160 one-line px-font-18 px-line-30 px-margin-t5">凡生</p>
        <p class="message-word px-width-200 one-line  px-font-14 color-opacity-gray">佛魔修成聚一身，盖世无双绝尘伦</p>
      </div>
      <div class="message-count ib-top px-font-14 px-line-50" v-if="true">
        <span class="display-ib px-font-12 color-msg-tip bg-fff px-width-20 px-height-20 px-line-20 percent-radius-50 text-center">9</span>
      </div>
    </div>
  </div>
</template>

<script>
import VAvatar from './VAvatar'

export default {
  props: {
    active: String
  },
  components: {
    VAvatar
  }
}
</script>

<style lang="scss">
@import '../style/global.scss';
.v-message {
  &:hover {
    .icon-close {
      display: block !important;
    }
  }
}

.message{
  display: flex;

  .message-content {
    flex: 1;
  }

  .avatar {
    margin-right: 15px;
  }
}
</style>
