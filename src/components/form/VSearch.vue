<template>
  <div class="v-search px-padding-lr30 px-height-40">
    <input
      class="width-100 height-100 display-b px-line-40 px-padding-10 px-font-16 radius-4"
      type="search"
      :placeholder="placeholder">
  </div>
</template>

<script>
export default {
  props: {
    placeholder: String
  },
  methods: {
    triggerSearch() {
      this.$emit('doSearch')
    }
  }
}
</script>

<style lang="scss">
input {
  border: none;
}
</style>
