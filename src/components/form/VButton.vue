<template>
  <div class="v-button">
    <a
      href="javascript:void(0)"
      class="button"
      :class="[ valid ? animation : '' ,fullWidth === 'true' ? 'fullWidth' : '' ]"
      @click="clickHandler">
      {{ name }}
    </a>
  </div>
</template>

<script>
export default {
  name: 'v-button',
  props: {
    name: String,
    valid: Boolean,
    animation: String,
    fullWidth: String
  },
  methods: {
    clickHandler() {
      if (this.$props.valid) {
        this.$emit('doClick')
      }
    }
  },
  mounted() {
  }
}
</script>

<style lang='scss'>
@import '../../style/base.scss';
.button{
  @include borderBtn(60%, 70px, $cbd);
  margin: 0 auto;
  margin-top: 50px;
  font-size: 24px;

  &.fullWidth {
    @include borderBtn(100%, 70px, $amaranth);
    background: #fff;
    border-color: #fff;
    font-weight: 900;
  }
}
</style>
