<template>
  <div class="communication-side ib-top bg-green radius-px-tr8 radius-px-br8 position-r">
    <div class="communication-side__head px-padding-30">
      <h2 class="color-fff px-font-28 px-line-28 ib-top">DoChat</h2>
      <i class="more iconfont icon-101 px-font-28 color-fff cursor-p fr"></i>
      <i class="add iconfont icon-add px-font-28 color-fff cursor-p px-margin-r10 fr"></i>
    </div>
    <v-search placeholder="Search Here..."/>
    <v-nav
      :active-nav="currentTab"
      @solveNavSelect="selectNav"
    />

    <div class="communication-left-box overflow-a">
      <template v-if="currentTab === 'message-box'">
        <v-message active='active'></v-message>
        <v-message></v-message>
        <v-message></v-message>
        <v-message></v-message>
        <v-message></v-message>
        <v-message></v-message>
        <v-message></v-message>
      </template>
      <template v-else-if="currentTab === 'contact-box'">
        <v-contact></v-contact>
      </template>
    </div>
  </div>
</template>

<script>
import VSearch from './form/VSearch'
import VNav from './VNav'
import VMessage from './VMessage'
import VContact from './VContact'

export default {
  data() {
    return {
      currentTab: 'contact-box'
    }
  },
  components: {
    VSearch,
    VNav,
    VMessage,
    VContact
  },
  methods: {
    selectNav(name) {
      this.currentTab = `${name}-box`
    }
  }
}
</script>

<style lang="scss">
@import '../style/global.scss' ;

.communication-side {
  width: 360px;
  height: 670px;
}

.more {
  margin-right: -8px;
}

.communication-left-box {
  height: 445px;
}
</style>
