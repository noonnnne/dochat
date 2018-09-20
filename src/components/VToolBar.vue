<template>
  <div class="v-tool-bar px-line-40 px-height-40 font-0">
    <i
      class="iconfont px-font-24 cursor-p color-c999 icon-file"
      title="文件"
      @click="triggerFile"
    />

    <el-popover
      ref="popover"
      placement="top"
      width="475"
      trigger="click"
    >
      <i class="iconfont px-font-24 cursor-p color-c999 px-margin-l10 icon-emoji" slot="reference" title="表情"></i>
      <!--<i class="more iconfont icon-101 px-font-28 color-fff cursor-p fr"/>-->
      <div class="emoji-wrapper">
        <emoji @handle-emoji="handleEmoji"/>
      </div>
    </el-popover>
  </div>
</template>

<script>
import Emoji from '../components/emoji/index.vue'
import { EMOJI_ARR } from './emoji'
import readDiskFile from '../utils/readDiskFile'

export default {
  name: 'v-tool-bar',

  components: {
    Emoji
  },

  data() {
    return {
      emoji: EMOJI_ARR
    }
  },

  methods: {
    handleEmoji(index) {
      this.$emit('select-emoji', index)
    },

    async triggerFile() {
      const file = await readDiskFile('blob')

      this.$emit('upload-file', file)
    }
  }
}
</script>

<style lang="scss">
@import '../style/global.scss';

.emoji-wrapper {
  height: 232px;
  margin: 8px;
  overflow-y: auto;
}
</style>
