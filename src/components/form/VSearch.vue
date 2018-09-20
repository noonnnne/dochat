<template>
  <div
    class="v-search px-padding-lr30 px-height-40"
    :class="classCls"
  >
    <input
      class="width-100 height-100 display-b px-line-40 px-font-16 px-padding-10 radius-4"
      type="search"
      v-model="searchWord"
      :class="inputCls"
      :placeholder="placeholder"
      @input="triggerSearch"
    >
  </div>
</template>

<script>
export default {
  props: {
    placeholder: String,
    classCls: String,
    inputCls: String
  },

  data() {
    return {
      searchWord: ''
    }
  },

  methods: {
    triggerSearch() {
      if (this.searchWord) {
        this.$emit('do-search', this.searchWord)
      } else {
        this.$emit('clear')
      }
    }
  }
}
</script>

<style lang="scss">


input {
  border: none;
}
</style>
