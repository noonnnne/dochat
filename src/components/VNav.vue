<template>
  <ul class="v-nav px-padding-lr30">
    <tooltip
      class="item"
      effect="dark"
      content="消息"
      placement="top"
    >
      <li
        class="ib-bottom iconfont px-font-30 cursor-p icon-xiaoxi"
        :class="whiteOrGray('message-box')"
        @click="doNavTab('message')"
      >
      </li>
    </tooltip>
    <tooltip
      class="item"
      effect="dark"
      content="联系人"
      placement="top"
    >
      <li
        class="ib-bottom iconfont px-font-30 cursor-p icon-qunzu"
        :class="whiteOrGray('contact-box')"
        @click="doNavTab('contact')"
      >
      </li>
    </tooltip>
    <tooltip
      class="item"
      effect="dark"
      content="群组"
      placement="top"
    >
      <li
        class="ib-bottom iconfont px-font-32 cursor-p icon-tongxunlu"
        :class="whiteOrGray('group-box')"
        @click="doNavTab('group')"
      >
      </li>
    </tooltip>
    <!--<tooltip-->
      <!--class="item"-->
      <!--effect="dark"-->
      <!--content="其他功能"-->
      <!--placement="top"-->
    <!--&gt;-->
      <!--<li-->
        <!--class="ib-bottom iconfont px-font-32 cursor-p icon-gongnengguanli"-->
        <!--:class="whiteOrGray('function-box')"-->
        <!--@click="doNavTab('function')"-->
      <!--&gt;-->
      <!--</li>-->
    <!--</tooltip>-->
  </ul>
</template>

<script>
import { Tooltip } from 'element-ui'

export default {
  components: {
    Tooltip
  },

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
      this.$emit('solve-nav-select', name)
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
