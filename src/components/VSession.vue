<template>
  <div
    class="session-item_inner px-padding-lr30 padding-tb10 width-100"
    :class="{ 'bg-active': active }"
    @click="$emit('handle-session-click', sessionInfo)"
  >
    <div class="session__item-avatar-wrap">
      <v-avatar
        size="smaller"
        :avatarUrl="showAvatar"
      >
      </v-avatar>
    </div>

    <div class="session-content">
      <p class="px-font-14 color-fff px-margin-t4">
        {{ showName }}
      </p>
      <p
        class="px-font-12 color-e1 over-text px-line-20 px-height-20 px-margin-t2"
        v-if="getLastestMessage && getLastestMessage.type !== 'file'"
        v-html="getLastestMessage.content"
      />
      <p class="px-font-12 color-e1 over-text px-line-20 px-height-20 px-margin-t2" v-else-if="getLastestMessage">[文件]</p>
    </div>

    <div class="session-tip" v-if="getLastestMessage">
      <p class="session-msg-time px-font-12 color-e1 px-margin-t6">
        {{ fromNow(sessionInfo.createTime) }}
      </p>
    </div>
  </div>
</template>

<script>

import VAvatar from '../components/VAvatar'

export default {
  components: {
    VAvatar
  },

  props: {
    sessionInfo: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    showName() {
      return this.sessionInfo.isGroup
        ? this.sessionInfo.from.name
        : (this.sessionInfo.from.nickname || this.sessionInfo.from.name)
    },

    showAvatar() {
      return this.sessionInfo.isGroup ? this.sessionInfo.from.avatar : this.sessionInfo.from.avatar
    },

    getLastestMessage() {
      if (this.sessionInfo.sessionList.length) {
        return this.sessionInfo.sessionList[this.sessionInfo.sessionList.length - 1]
      }
      return null
    }
  },

  methods: {
    fromNow(val) {
      return this.$moment(new Date(val)).fromNow()
    }
  }
}
</script>

<style lang="scss">
@import '../style/global.scss';

.session-item_inner{
  display: flex;
  .session-item__avatar-wrap {
    width: 40px;
  }

  .session-content {
    flex: 1;
    margin-left: 10px;

    .face {
      border: none;
      margin-top: -4px;
      transform: scale(.7);
      & + .face {
        margin-left: -8px;
      }
    }
  }

  .session-tip {
    width: 80px;
  }
}

.face {
  width: 28px;
  height: 28px;
  font-size: 0;
  text-indent: -999em;
  border-bottom: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
  cursor: pointer;
  background: url('../../static/emoji/emoji.png') no-repeat;

  @for $i from 0 through 14 {
    @for $j from 0 through 11 {
      &.emoji#{$i + $j*15} {
        background-position: (2-($i * 32))+px (2-($j * 32))+px;
      }
    }
  }
}
</style>

