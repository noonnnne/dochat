<template>
  <div class="vmessage-item"
      :class="{'word' : content.type === 'word',
              'time' : content.type === 'time'}"
  >
    <div
      :class="{'me' : me}"
      class="message-detail-item px-margin-t15 px-padding-lr30 overflow-h"
      v-if="content.type === 'word'"
    >
      <v-avatar
        type="online"
        size="small"
        :nickname="content.from.nickname"
        :show-status="false"
        :avatar-url="!me ? content.from.avatar : currentUser.avatar"
        @handle-avatar="$emit('handle-message-avatar')"
      />
      <div class="message-item-box ib-middle px-font-14 px-padding-10 px-margin-b15" v-html="content.content"/>
    </div>

    <div
      :class="{'me' : me, 'file': content.type === 'file'}"
      class="message-detail-item px-margin-t15 px-padding-lr30 overflow-h"
      v-if="content.type === 'file'"
    >
      <v-avatar
        type="online"
        size="small"
        :nickname="content.from.nickname"
        :show-status="false"
        :avatar-url="!me ? content.from.avatar : currentUser.avatar"
        @handle-avatar="$emit('handle-message-avatar')"
      />
      <div class="message-item-box px-padding-10 overflow-h ib-top">
        <i class="iconfont px-font-40 color-fff ib-top" :class="getFileIcon" />
        <div class="ib-top px-line-20 px-font-14 px-margin-l10">
          <p class="pxmax-width-240 pxmin-width-120 over-text">{{ content.content.name }}</p>
          <p class="px-font-12 px-margin-t5 px-line-15">
            <span>{{ getFileSize }}</span>
            <!--<a class="fr" :download="content.content.name" :href="content.content.url">下载</a>-->
            <a
              class="fr"
              target="_blank"
              :download="content.content.name"
              :href="content.content.url"
            >
              查看
            </a>
          </p>
        </div>
      </div>
    </div>

    <div
      class="message-detail-item px-line-40 px-font-12 text-center color-ccc"
      :class="{'me' : me}"
      v-if="content.type === 'time'"
    >
      10:30
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VAvatar from './VAvatar'

export default {
  components: {
    VAvatar
  },

  computed: {
    ...mapState(['currentUser']),
    getFileIcon() {
      let icon = ''
      switch (this.content.content.ext) {
        case 'txt': {
          icon = 'icon-txticon'
          break
        }
        case 'doc':
        case 'docx': {
          icon = 'icon-word'
          break
        }
        case 'zip': {
          icon = 'icon-zipicon'
          break
        }
        case 'xls': {
          icon = 'icon-zipiconcopy'
          break
        }
        case 'pdf': {
          icon = 'icon-pdf'
          break
        }
        default: {
          icon = 'icon-weishibiewenjianqiapianshang'
        }
      }
      return icon
    },

    getFileSize() {
      const size = this.content.content.size
      const kb = size / 1024
      if (kb < 1024) {
        return `${kb.toFixed(2)}KB`
      }
      return `${(size / (1024 * 1024)).toFixed(2)}MB`
    }
  },

  props: {
    me: {
      type: Boolean,
      default: false
    },

    content: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">

.pxmin-width-120 {
  min-width: 120px;
}

.pxmax-width-240 {
  max-width: 240px;
}

.message-detail-item {

  &.file {
    .message-item-box {
      line-height: 40px;
    }
  }

  .message-item-box {
    max-width: 320px;
    line-height: 20px;
    background: #eaeaea;
    border: 1px solid rgba(200, 200, 200, .9);
    border-radius: 8px;

    .face {
      border: none;
    }
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
