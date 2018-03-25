<template>
  <ul class="v-nav px-padding-lr30">
    <li
      class="ib-bottom iconfont px-font-30 cursor-p icon-xiaoxi"
      :class="whiteOrGray('message-box')"
      @click="doNavTab('message')"
    >
    </li>
    <li
      class="ib-bottom iconfont px-font-30 cursor-p icon-qunzu"
      :class="whiteOrGray('contact-box')"
      @click="doNavTab('contact')"
    >
    </li>
    <li
      class="ib-bottom iconfont px-font-32 cursor-p icon-tongxunlu"
      :class="whiteOrGray('group-box')"
      @click="doNavTab('group')"
    >
    </li>
    <li
      class="ib-bottom iconfont px-font-32 cursor-p icon-gongnengguanli"
      :class="whiteOrGray('function-box')"
      @click="doNavTab('function')"
    >
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    activeNav: String
  },
  computed: {
  },
  methods: {
    whiteOrGray(name) {
      return this.$props.activeNav === name ? 'color-fff' : 'color-cf'
    },
    doNavTab(name) {
      this.$emit('solveNavSelect', name)
    }
  }
}
</script>

<style lang="scss">
@import '../style/global.scss';

.v-nav {
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
