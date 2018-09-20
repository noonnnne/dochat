<template>
  <div class="group-member-pane height-100 color-c888">
    <div
      class="px-width-60 px-padding-lr5 display-ib font-0 px-margin-r10"
      v-if="showMembers"
      v-for="(member, index) in showMembers"
      :key="index"
    >
      <div class="px-width-50 px-height-50 cursor-p" @click="$emit('handle-member', member)">
        <img
          class="width-100 height-100"
          :src="member.avatar"
          alt=""
        >
      </div>
      <p class="color-c888 px-font-12 text-center px-line-30 px-height-30 one-line">
        {{ member.nickname }}
      </p>
    </div>

    <div v-else>
      加载中...
    </div>
  </div>
</template>

<script>
import SocketMixin from '../mixins/socketMixin'

export default {
  name: 'GroupMemberPane',

  mixins: [SocketMixin],

  props: {
    members: {
      type: Array,
      default() {
        return []
      }
    }
  },

  data() {
    return {
      showMembers: null
    }
  },

  mounted() {
    this.fetch('searchUsersByIds', {
      userIds: this.members
    }).then(res => {
      this.showMembers = res[1]
    })
  }
}
</script>

<style scoped>

</style>
