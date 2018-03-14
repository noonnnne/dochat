<template>
  <div class="v-contact">
    <dl>
      <dt class="px-font-14 px-padding-lr30 px-line-30 color-ccc bg-opacity-1">A</dt>
      <dd class="px-padding-lr30 padding-tb10 contact-bottom-border">
        <v-avatar
          size="smaller"
          type="online"
          shape="square"
          :show-status="show"></v-avatar>
        <span class="px-font-16 px-margin-l10 ib-middle color-fff">爱得太迟-古巨基</span>
      </dd>
      <dd class="px-padding-lr30 padding-tb10 contact-bottom-border">
        <v-avatar
          size="smaller"
          type="online"
          shape="square"
          :show-status="show"></v-avatar>
        <span class="px-font-16 px-margin-l10 ib-middle color-fff">爱得太迟-古巨基</span>
      </dd>
    </dl>
  </div>
</template>

<script>
import VAvatar from './VAvatar'

export default {
  data() {
    return {
      show: false
    }
  },
  props: {

  },
  components: {
    VAvatar
  }
}
</script>

<style lang="scss">

</style>
