<template>
  <div class="vmessage-item"
      :class="{'word' : type === 'word',
              'time' : type === 'time'}">
    <div :class="{'me' : me === 'true'}"
      class="message-detail-item px-margin-t30 px-padding-lr30 overflow-h"
      v-if="type === 'word'">
      <v-avatar type="online" show-status="false" size="small"></v-avatar>
      <div class="message-item-box ib-top px-font-14 px-padding-10 px-margin-b15">
        佛魔修成聚一身，盖世无双绝尘伦~
      </div>
    </div>

    <div :class="{'me' : me === 'true'}"
          class="message-detail-item px-line-40 px-font-12 text-center color-ccc"
          v-if="type === 'time'">
      10:30
    </div>
  </div>
</template>

<script>
import VAvatar from './VAvatar'

export default {
  components: {
    VAvatar
  },
  props: {
    me: String,
    type: String
  }
}
</script>

<style lang="scss">
.message-detail-item {
  .message-item-box {
    max-width: 320px;
    line-height: 20px;
    background: #eaeaea;
    border: 1px solid rgba(200, 200, 200, .9);
    border-radius: 8px;
  }

  .avatar {
    margin-right: 15px;
  }

  &.me {
    .message-item-box {
      background: #0BA360;
      color: #fff;
    }

    .avatar,
    .message-item-box {
      float: right;
    }

    .avatar {
      margin-right: 0;
      margin-left: 15px;
    }
  }
}

.vmessage-item {
  &.time {
    & + .vmessage-item {
      .message-detail-item {
        margin-top: 10px !important;
      }
    }
  }

  &:last-child {
    margin-bottom: 10px;
  }
}
</style>
