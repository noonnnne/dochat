<template>
  <div
    class="avatar position-r display-ib"
    :class="{'px-padding-3': size !== 'smaller'}"
    @click="$emit('handle-avatar')"
  >
    <p
      class="px-font-12 color-green px-margin-b5 over-text px-width-50"
      v-if="nickname"
    >
      {{ nickname }}
    </p>
    <img
      :src="avatarUrl"
      :class="[
                (size === 'smaller') && 'px-width-40 px-height-40',
                (size === 'small') && 'px-width-50 px-height-50',
                (size === 'big') && 'px-width-160 px-height-160',
                (shape === 'circle') && 'percent-radius-50 shadow'
              ]"
    >
    <span
      v-if="showStatus"
      class="position-a percent-radius-50"
      :class="[
                type === 'online' && 'bg-online',
                size === 'smaller' && 'px-right-2 px-bottom-4 px-width-8 px-height-8',
                size === 'small' && 'px-right-4 px-bottom-6 px-width-10 px-height-10',
                size === 'big' && 'px-right-16 px-bottom-16 px-width-16 px-height-16'
              ]"
    >
    </span>
  </div>
</template>
<script>
export default {
  props: {
    type: String,

    size: {
      type: String,
      default: 'small'
    },

    showStatus: {
      type: Boolean,
      default: false
    },

    shape: {
      type: String,
      default: 'circle'
    },

    avatarUrl: {
      type: String,
      default: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4048446268,4268796217&fm=27&gp=0.jpg'
    },

    nickname: String
  }
}
</script>

<style lang="scss">

</style>
