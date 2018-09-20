<template>
  <div class="vmessage-input width-100 px-line-20 px-height-180 px-padding-lr20 bg-bgbg
  position-a bottom-0">
    <v-tool-bar
      @select-emoji="getEmoji"
      @upload-file="uploadFile"
    />
    <div
      ref="edit-area"
      class="v-textarea position-a px-left-20 px-right-20 px-top-40 px-bottom-20 px-font-14 overflow-a"
      contenteditable
      @input="handleInput"
    />
    <span
      class="position-a px-font-32 px-right-40 px-bottom-20 iconfont icon-send cursor-p color-green"
      @click="sendMsg"
    />
  </div>
</template>

<script>
import * as qiniu from 'qiniu-js'
import { mapState } from 'vuex'
import session from '../../mixins/session'
import VToolBar from '../VToolBar'
import SocketMixin from '../../mixins/socketMixin'
import { EMOJI_ARR, Word2Emoji } from '../emoji'

export default {
  components: {
    VToolBar
  },

  mixins: [SocketMixin, session],

  computed: {
    ...mapState(['currentUser', 'currentSessionId'])
  },

  data() {
    return {
      inputValue: '',
      emoji: EMOJI_ARR,
      fileUrl: ''
    }
  },

  methods: {
    sendMsg() {
      const data = {
        to: this.currentSessionId,
        type: 'word',
        content: this.inputValue
      }
      console.log(this.currentSessionId)
      if (this.inputValue) {
        this.fetch('sendMessage', data).then(res => {
          this.$parent.$emit('send-message-finished')
          if (!res[0]) {
            if (res[1].isGroup) {
              this.addSession(res[1])
            } else {
              this.addSession(res[1], true)
            }

            this.$refs['edit-area'].innerHTML = ''
            this.inputValue = ''
          }
        })
      }
    },

    handleInput(e) {
      this.inputValue = e.target.innerHTML
    },

    getEmoji(index) {
      this.inputValue += Word2Emoji(index)
      this.$refs['edit-area'].innerHTML = this.inputValue
    },

    async uploadFile(file) {
      const that = this

      //  上传文件
      const [err, token] = await this.fetch('uploadToken', {})
      if (!err) {
        const result = qiniu.upload(file.result, `GroupAvatar/${Date.now()}_${Math.random()}/${file.filename}`,
          token.token, { useCdnDomain: true }, {})

        result.subscribe({
          next(res) {
            that.uploadStatus = 1
            that.uploadPercent = res.total.percent
          },

          error(e) {
            console.log(e)
            console.log('发送文件失败')
          },

          async complete(info) {
            that.fileUrl = `${token.urlPrefix + info.key}`
            that.uploadStatus = 2

            const data = {
              to: that.currentSessionId,
              type: 'file',
              content: {
                name: file.filename,
                size: file.length,
                ext: file.ext,
                url: that.fileUrl
              }
            }
            console.log(that.currentSessionId)
            that.fetch('sendMessage', data).then(res => {
              that.$parent.$emit('send-message-finished')
              if (!res[0]) {
                if (res[1].isGroup) {
                  that.addSession(res[1])
                } else {
                  that.addSession(res[1], true)
                }
              }
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../style/global.scss';

.icon-send {
  opacity: .4;
  transition: opacity .3s ease-in;
  &:hover{
    opacity: 1;
  }
}

.face {
  display: inline-block;
  vertical-align: middle;
  width: 28px;
  height: 28px;
  font-size: 0;
  text-indent: -999em;
  border-bottom: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
  cursor: pointer;
  background: url('../../../static/emoji/emoji.png') no-repeat;

  @for $i from 0 through 14 {
    @for $j from 0 through 11 {
      &.emoji#{$i + $j*15} {
        background-position: (2-($i * 32))+px (2-($j * 32))+px;
      }
    }
  }
}
</style>
