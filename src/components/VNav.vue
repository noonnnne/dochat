<template>
  <ul class="v-nav px-padding-lr30">
    <li
      class="ib-bottom iconfont px-font-30 cursor-p icon-xiaoxi"
      :class="[activeNav === 'message-box' ? 'color-fff' : 'color-cf' ]"
      @click="doNavTab('message')"
    >
    </li>
    <li
      class="ib-bottom iconfont px-font-30 cursor-p icon-qunzu"
      :class="[activeNav === 'contact-box' ? 'color-fff' : 'color-cf' ]"
      @click="doNavTab('contact')"
    >
    </li>
    <li
      class="ib-bottom iconfont px-font-32 cursor-p icon-tongxunlu"
      :class="[activeNav === 'group-box' ? 'color-fff' : 'color-cf' ]"
      @click="doNavTab('group')"
    >
    </li>
    <li
      class="ib-bottom iconfont px-font-32 cursor-p icon-gongnengguanli"
      :class="[activeNav === 'function-box' ? 'color-fff' : 'color-cf' ]"
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
  methods: {
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
