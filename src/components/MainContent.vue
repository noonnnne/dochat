<template>
  <div class="main-content shadow-block ib-top px-padding-l10 overflow-h">
    <div class="chat-content position-r">
      <div class="chat-content__hd shadow-bottom">
        <h2 class="px-font-32 px-line-70 px-padding-l10 color-dark">
          <span
            class="px-width-10 px-height-10 percent-radius-50 bg-online ib-top px-margin-t30
                  bg-online"
          >
          </span>
            凡生
        </h2>
      </div>

      <div class="chat-message-box px-height-420 overflow-a">
        <v-message-item
          me='true'
          type='word'
        >
        </v-message-item>
      </div>

      <v-message-input></v-message-input>
    </div>
    <div
      class="contact-information px-padding-t60 bg-fff shadow-gray position-r z-index-5"
      :class="{'offset-right': !showInfoPane}"
    >
      <i
        class="position-a px-top-20 px-right-20 iconfont icon-close px-font-24 color-c999
              cursor-p"
        @click="toggleInfoPane"
      >
      </i>
      <div class="contact-avatar flex-center">
        <v-avatar type='online' size='big'></v-avatar>
      </div>
    </div>
  </div>
</template>

<script>
import VAvatar from '../components/VAvatar'
import VMessageItem from '../components/VMessageItem'
import VMessageInput from '../components/form/VMessageInput'

export default {
  data() {
    return {
      showInfoPane: true
    }
  },
  components: {
    VAvatar,
    VMessageItem,
    VMessageInput
  },
  methods: {
    toggleInfoPane() {
      this.showInfoPane = !this.showInfoPane
    }
  }
}
</script>

<style lang="scss">
@import '../style/global.scss';

.main-content {
  display: inline-flex;
  margin-left: -10px;
  width: 850px;
  height: 670px;

  .chat-content {
    flex: 1;
  }

  .contact-information {
    width: 300px;
    transition: margin-right .3s ease-in;
    &.offset-right {
      margin-right: -300px;
    }
  }
}
</style>
