<template>
  <div
    class="px-height-300 px-padding-10 px-font-13 overflow-a m-bd-t"
    v-if="!isGroup"
  >
    <table class="width-100 text-center" v-if="list.length">
      <thead class="px-line-25">
        <td>昵称</td>
        <td>帐号</td>
        <td></td>
      </thead>

      <tbody class="px-font-12 px-line-20">
        <tr
          v-for="(item, key) in list"
          :key="key"
        >
          <td>{{ item.nickname }}</td>
          <td>{{ item.account }}</td>
          <td v-if="isAdded(item)">
            已添加
          </td>
          <td
            class="color-link cursor-p"
            @click="handleContact(item)"
            v-else
          >
            添加好友
          </td>
        </tr>
      </tbody>
    </table>

    <div class="text-center px-margin-50" v-if="list.length === 0">
      <-- 没有搜索结果! -->
    </div>
  </div>

  <div v-else>
    <table class="width-100 text-center" v-if="list.length">
      <thead class="px-line-25">
      <td>群名称</td>
      <td>群介绍</td>
      <td></td>
      </thead>

      <tbody class="px-font-12 px-line-20">
      <tr
        v-for="(item, key) in list"
        :key="key"
      >
        <td>{{ item.name }}</td>
        <td>{{ item.intro }}</td>
        <td v-if="isAdded(item)">
          已添加
        </td>
        <td
          class="color-link cursor-p"
          @click="handleGroup(item)"
          v-else
        >
          加入群
        </td>
      </tr>
      </tbody>
    </table>

    <div class="text-center px-margin-50" v-if="list.length === 0">
      <-- 没有搜索结果! -->
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'VResultList',

  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },

    isGroup: {
      default: false,
      type: Boolean
    }
  },

  computed: {
    ...mapState([
      'currentUser'
    ])
  },

  methods: {
    ...mapMutations([
      'addContact',
      'joinGroup'
    ]),

    isAdded(item) {
      if (this.isGroup) {
        return this.currentUser.groups.some(x => x._id === item._id)
      }
      return this.currentUser.contacts.some(x => x.to.account === item.account)
    },

    handleContact(item) {
      this.$socket.emit('addContact', {
        account: item.account,
        userId: item._id
      }, res => {
        this.addContact(res)
      })
    },

    handleGroup(item) {
      this.$socket.emit('joinGroup', {
        groupId: item._id
      }, res => {
        this.joinGroup(res)
      })
    }
  }
}
</script>

<style lang="scss">

</style>
