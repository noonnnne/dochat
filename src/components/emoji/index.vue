<template>
  <div class="emoji-face overflow-h">
    <a
      class="face"
      type="emoji"
      v-for="(emoji, index) in emojiArr"
      :key="index"
      :title="emoji"
      :class="`emoji${index}`"
      @click="$emit('handle-emoji', index)"
    />
  </div>
</template>

<script>
import { EMOJI_ARR } from './index'

export default {
  name: 'index',

  data() {
    return {
      emojiArr: EMOJI_ARR
    }
  }
}
</script>

<style lang="scss">

.emoji-face {
  a {
    float: left;
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
}
</style>
