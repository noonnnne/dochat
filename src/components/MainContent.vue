<template>
  <div class="main-content width-100 shadow-block ib-top px-padding-l10 overflow-h">
    <template v-if="currentSessionId !== -1">
      <div class="chat-content position-r">
        <div class="chat-content__hd shadow-bottom position-r">
          <h2 class="px-font-32 px-line-70 px-padding-l10 color-dark position-r z-index-20 bg-f5">
            <span class="px-width-10 px-height-10 percent-radius-50 bg-online ib-top px-margin-t30 bg-online" />
            <span class="position-r">
              {{ getCurrentSessionInfo.name || getCurrentSessionInfo.to.nickname }}
              <i
                class="position-a iconfont icon-jiantouxia vertical-center px-font-20 px-right--30 cursor-p"
                :class="{ clockWiseRotate: showMembers }"
                v-if="getCurrentSessionInfo.name"
                @click="showMembers = !showMembers"
              />
            </span>
          </h2>

          <i
            class="position-a iconfont icon-shrink px-font-30 px-right-20 px-top-20 cursor-p color-c999 z-index-20"
            @click="resetSession"
          />

          <!-- 群成员展示 -->
          <transition name="bounceDown">
            <div
              class="position-a width-100 px-height-200 bg-f5 z-index-10 m-bd-t px-padding-20 shadow-bottom px-bottom--200"
              v-if="getCurrentSessionInfo.name && showMembers"
            >
              <group-member-pane
                :members="getCurrentSessionInfo.members"
                @handle-member="selectMember"
              />
            </div>
          </transition>
        </div>

        <div ref="chat-content" class="chat-message-box px-height-420 overflow-a">
          <v-message-item
            v-if="getCurrentSessionList"
            v-for="(item, index) in getCurrentSessionList"
            :me='isSelf(item)'
            :type='item.word'
            :key="index"
            :content="item"
            @handle-message-avatar="showPersonPane(item.from.nickname, isSelf(item), true)"
          />
        </div>

        <v-message-input ref="message-input"/>
      </div>

      <div
        class="contact-information px-padding-t60 bg-fff shadow-gray position-r z-index-5"
        :class="{'offset-right': !showInfoPane}"
        v-if="showUser"
      >
        <i
          class="position-a px-top-20 px-right-20 iconfont icon-close px-font-24 color-c999 cursor-p"
          @click="toggleInfoPane"
        />
        <div class="contact-avatar flex-center">
          <v-avatar
            type='online'
            size='big'
            :avatar-url="showUser.avatar"
          />
          <div class="px-padding-lr60 px-margin-t20">
            <p class="px-margin-t15 px-font-14 color-c333">
              <span class="px-margin-r10">昵称:</span>
              <span>{{ showUser.nickname }}</span>
            </p>
            <p class="px-margin-t15 px-font-14 color-c333">
              <span class="px-margin-r10">帐号:</span>
              <span>{{ showUser.account }}</span>
            </p>
            <p class="px-margin-t15 px-font-14 color-c333">
              <span class="px-margin-r10">性别:</span>
              <span>{{ showUser.gender | getGenderWord }}</span>
            </p>
            <p class="px-margin-t15 px-font-14 color-c333">
              <span class="px-margin-r10">生日:</span>
              <span>{{ getFormatDate(showUser.birthday) }}</span>
            </p>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="chat-content px-font-20 text-center position-r">
        <svg class="icon px-width-200 position-a" aria-hidden="true">
          <use xlink:href="#icon-xihuwenhuadasha-"></use>
        </svg>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VAvatar from '../components/VAvatar'
import VMessageItem from '../components/VMessageItem'
import VMessageInput from '../components/form/VMessageInput'
import GroupMemberPane from '../components/GroupMemberPane'
import SocketMixin from '../mixins/socketMixin'

export default {
  components: {
    VAvatar,
    VMessageItem,
    VMessageInput,
    GroupMemberPane
  },

  mixins: [SocketMixin],

  filters: {
    getGenderWord(val) {
      if (val === 'unknown') {
        return '保密'
      }
      return val === 'male' ? '男' : '女'
    }
  },

  data() {
    return {
      showInfoPane: false,
      showUser: null,
      showMembers: false
    }
  },

  computed: {
    ...mapState([
      'currentSessionId',
      'sessionList',
      'currentUser'
    ]),

    getCurrentSessionInfo() {
      let index
      index = this.currentUser.contacts.findIndex(item =>
        item.from === this.currentSessionId || item.to._id === this.currentSessionId
      )
      if (index !== -1) {
        return this.currentUser.contacts[index]
      }
      index = this.currentUser.groups.findIndex(item => item._id === this.currentSessionId)
      return this.currentUser.groups[index]
    },

    getCurrentSessionList() {
      const index = this.sessionList.findIndex(item => item.from._id === this.currentSessionId)
      return this.sessionList[index].sessionList
    }
  },

  methods: {
    isSelf(item) {
      return this.currentUser._id === item.from._id
    },

    toggleInfoPane() {
      this.showInfoPane = !this.showInfoPane
    },

    showPersonPane(nickname, isMe, force = false) {
      if (isMe) {
        return
      }

      if (!force) {
        this.toggleInfoPane()
      } else {
        this.showInfoPane = true
      }

      const thisSession = this.sessionList.filter(item => item.from._id === this.currentSessionId)[0]
      let user
      if (thisSession.isGroup) {
        this.fetch('searchUser', {
          nickname
        }).then(res => {
          user = res[1][0]
          this.showUser = { ...user }
        })
          // .members.filter(item => item.account === account)[0]
      } else {
        user = this.currentUser.contacts.filter(item => item.to.nickname === nickname)[0].to
        this.showUser = { ...user }
      }
    },

    selectMember(member) {
      // this.showMembers = false
      this.toggleInfoPane()
      this.showUser = member
    },

    getFormatDate(date) {
      return this.$moment(date).format('YYYY-MM-DD')
    },

    resetSession() {
      this.showMembers = false
      this.setState({ currentSessionId: -1 })
    }
  }
}
</script>

<style lang="scss">
@import '../style/global.scss';

.px-right--30 {
  right: -30px;
}

.main-content {
  display: inline-flex;
  margin-left: -10px;
  width: 850px;
  height: 670px;

  .chat-content {
    flex: 1;

    .icon {
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .contact-information {
    width: 300px;
    transition: margin-right .3s ease-in;
    &.offset-right {
      margin-right: -300px;
    }

    .contact-avatar {
      .avatar {
        img {
          display: block;
          margin: 0 auto;
        }
      }
    }
  }
}


.bounceDown-enter-active, .bounceDown-leave-active {
  transition: bottom .4s, opacity .4s;
}

/*.icon-jiantouxia {*/
  /*transform-origin: center center;*/
  /*transition: transform .3s;*/
  /*&.clockWiseRotate {*/
    /*transform: rotate(90deg);*/
  /*}*/
/*}*/

.px-bottom--200 {
  bottom: -200px;
}

.bounceDown-enter,.bounceDown-leave-to {
  bottom: 0;
  opacity: 0;
}

</style>
