<template>
  <div class="v-contact">
    <div class="px-font-14 text-center color-fff px-padding-t50" v-if="empty">
      {{ emptyText }}
    </div>
    <template v-else>
      <dl
        v-for="letter in Object.keys(contacts)"
        v-if="contacts[letter].length"
        :key="letter"
      >
        <dt class="px-font-14 px-padding-lr15 px-line-30 color-ccc bg-opacity-1">
          {{ letter | toUpper }}
        </dt>
        <dd
          class="px-padding-lr15 padding-tb10 contact-bottom-border cursor-p"
          v-for="(contact, index) in contacts[letter]"
          :key="index"
          @click.stop="$emit('handle-contact', contact, isGroup)"
        >
          <v-avatar
            size="smaller"
            type="online"
            shape="square"
            :avatar-url="isGroup ? contact.avatar : contact.to.avatar"
            :show-status="show"
          />
          <span class="px-font-16 px-margin-l10 ib-middle color-fff">
          {{ isGroup ? contact.name : contact.to.nickname }}
        </span>
        </dd>
      </dl>
    </template>
  </div>
</template>

<script>
import VAvatar from './VAvatar'

export default {
  name: 'v-contact',

  components: {
    VAvatar
  },

  filters: {
    toUpper(val) {
      return val.toUpperCase()
    }
  },

  computed: {
    empty() {
      return Object.values(this.contacts).every(item => item.length === 0)
    }
  },

  data() {
    return {
      show: false
    }
  },

  props: {
    contacts: {
      type: Object,
      required: true
    },

    emptyText: {
      type: String,
      required: true
    },

    attr: String,

    isGroup: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">

</style>
