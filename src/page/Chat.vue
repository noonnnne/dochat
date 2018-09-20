<template>
  <div class="chat font-0" v-if="currentUser">
    <div class="communication-side ib-top bg-green radius-px-tr8 radius-px-br8 position-r">
      <div class="communication-side__head px-padding-30">
        <div class="color-fff px-line-30 ib-middle">
          <img
            class="px-width-30 px-height-30"
            :src="currentUser.avatar"
            :alt="`${currentUser.nickname}的头像`"
          >
          <h4 class="nickname ib-middle px-font-16 px-width-150 over-text px-margin-l10">
            {{ currentUser.nickname }}
          </h4>
        </div>

        <el-popover
          ref="popover"
          placement="right"
          width="160"
          trigger="click"
        >
          <i class="more iconfont icon-101 px-font-28 color-fff cursor-p fr" slot="reference"/>
          <ul>
            <li class="px-font-16 hover-color px-line-30" @click="toggleDialog">
              <i
                class="el-icon-edit-outline px-margin--t2 ib-middle px-font-21 color-c999 px-margin-r10"
              />
              编辑资料
            </li>
            <li class="px-font-16 ib-middle px-margin-t5 hover-color px-line-30" @click="exit">
              <i class="iconfont px-margin--t2 ib-middle icon-qiehuanzuhu px-font-20 color-c999 px-margin-r10 hover-color"/>
              注销
            </li>
          </ul>
        </el-popover>

        <el-popover
          ref="popover"
          placement="right"
          width="400"
          trigger="click"
        >
          <i
            class="add iconfont icon-add px-font-28 color-fff cursor-p px-margin-r10 fr"
            slot="reference"
            ref="add"
          />
          <v-tool :value="`add-friends`" @exit-tool="exitTool"/>
        </el-popover>
      </div>
      <!--<v-search placeholder="Search Here..."/>-->
      <v-nav
        :active-nav="currentTab"
        @solve-nav-select="selectNav"
      />

      <div class="communication-left-box overflow-a">
        <template v-if="currentTab === 'message-box'">
          <div
            class="session-list"
            v-if="sessionList.length"
          >
            <div
              class="session-item"
              v-for="(session, index) in sessionList"
              :key="index"
            >
              <v-session-item
                :active="session.from._id === currentSessionId"
                :session-info="session"
                @handle-session-click="selectSession"
                @mouse-down="handleContextMenu('session', $event)"
              />
            </div>
          </div>
          <div
            class="px-font-14 color-fff px-padding-t50 text-center"
            v-else
          >
            暂时没有发起聊天~
          </div>
        </template>
        <template v-else-if="currentTab === 'contact-box'">
          <v-contact
            empty-text="你还没有添加任何好友~"
            :contacts="classificationByFirstLetter(currentUser.contacts, true)"
            @handle-contact="solveContact"
          />
        </template>
        <template v-else-if="currentTab === 'group-box'">
          <v-contact
            empty-text="你还没有加入任何群聊~"
            attr="name"
            :is-group="true"
            :contacts="classificationByFirstLetter(currentUser.groups)"
            @handle-contact="solveContact"
          />
        </template>
        <!--<template v-else-if="currentTab === 'function-box'">-->
          <!--<v-contact-->
            <!--empty-text="你还没有加入任何群聊~"-->
            <!--attr="name"-->
            <!--:contacts="classificationByFirstLetter(currentUser.groups)"-->
          <!--/>-->
        <!--</template>-->
      </div>
    </div>
    <main-content ref="main" @send-message-finished="solveScroll"/>
    <el-dialog
      title="编辑个人资料"
      :visible.sync="centerDialogVisible"
      :append-to-body="true"
      width="40%"
      center
    >
      <edit-info @close-dialog="centerDialogVisible = false"/>
    </el-dialog>

    <context-menu
      v-if="showContextMenu"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { Dialog, Button } from 'element-ui'
import VSearch from '../components/form/VSearch'
import VNav from '../components/VNav'
import VMessage from '../components/VMessage'
import VContact from '../components/VContact'
import MainContent from '../components/MainContent'
import VSessionItem from '../components/VSession'
import VTool from '../components/VTool'
import EditInfo from '../components/EditInfo'
import ContextMenu from '../components/ContextMenu'
import SocketMixin from '../mixins/socketMixin'
import SessionMixin from '../mixins/session'
import generateNotification from '../utils/Notification'

export default {
  name: 'chat',

  components: {
    VSearch,
    VNav,
    VMessage,
    VContact,
    MainContent,
    VSessionItem,
    VTool,
    [Dialog.name]: Dialog,
    [Button.name]: Button,
    EditInfo,
    ContextMenu
  },

  mixins: [
    SocketMixin,
    SessionMixin
  ],

  data() {
    return {
      currentTab: 'contact-box',
      centerDialogVisible: false,
      showContextMenu: false
    }
  },

  computed: {
    ...mapState([
      'currentUser',
      'currentSessionId',
      'sessionList'
    ])
  },

  created() {
    this.getSessionList()
    this.$socket.on('message', data => {
      generateNotification(data)
      this.addSession(data)
      this.setState({
        currentSessionId: data.from._id
      })
      this.currentTab = 'message-box'
      this.$nextTick(() => {
        if (this.currentSessionId !== -1) {
          this.solveScroll()
        }
      })
    })
  },

  methods: {
    ...mapMutations([
      'setState'
    ]),

    toggleDialog() {
      this.centerDialogVisible = !this.centerDialogVisible
    },

    selectNav(name) {
      this.currentTab = `${name}-box`
    },

    exitTool() {
      this.$refs.add.click()
    },

    // 按首字母分类
    classificationByFirstLetter(list, isContact = false) {
      if (!list.length) {
        return {}
      }
      const res = {}
      for (let i = 97; i < 123; i += 1) {
        const letter = String.fromCharCode(i)
        if (isContact) {
          res[letter] = list.filter(item => item.to.pinyin.startsWith(letter)).sort((a, b) => a - b)
        } else {
          res[letter] = list.filter(item => item.pinyin.startsWith(letter)).sort((a, b) => a - b)
        }
      }
      return res
    },

    selectSession(session) {
      this.setState({
        currentSessionId: session.from._id
      })
      this.$nextTick(() => {
        const chatContentDiv = this.$refs.main.$refs['chat-content']
        const currentScrollHeight = chatContentDiv.scrollHeight
        const scrollTop = currentScrollHeight - chatContentDiv.offsetHeight
        chatContentDiv.scrollTop = scrollTop
      })
    },

    solveContact(contact, isGroup = false) {
      const sessionList = [...this.sessionList]
      const { _id, account, avatar, nickname } = { ...this.currentUser }

      let isExist
      if (isGroup) {
        isExist = !!this.sessionList.some(item => item.from._id === contact._id)
      } else {
        isExist = !!this.sessionList.some(item => item.from._id === contact.to._id)
      }

      if (!isExist) {
        const newSession = {
          from: isGroup ? contact : contact.to,
          content: '',
          sessionList: [],
          isGroup,
          to: this.currentUser._id,
          toDetail: isGroup ? this.currentUser : { _id, account, avatar, nickname },
          createTime: Date.now()
        }
        sessionList.push(newSession)
      }

      this.currentTab = 'message-box'
      this.setState({
        sessionList,
        currentSessionId: isGroup ? contact._id : contact.to._id
      })
    },

    solveScroll() {
      const chatContentDiv = this.$refs.main.$refs['chat-content']

      if (chatContentDiv) {
        const timer = setInterval(() => {
          const currentScrollTop = chatContentDiv.scrollTop
          const currentOffsetHeight = chatContentDiv.offsetHeight

          if (currentOffsetHeight === chatContentDiv.scrollHeight) {
            clearInterval(timer)
          }

          if ((currentScrollTop + chatContentDiv.offsetHeight) < chatContentDiv.scrollHeight) {
            chatContentDiv.scrollTop = currentScrollTop + 20
          } else {
            clearInterval(timer)
          }
        }, 20)
      }
    },

    exit() {
      this.$localCache.delete('token')
      this.$router.replace('/')
    },

    handleContextMenu() {
      console.log('11111s')
    }
  }
}
</script>

<style lang="scss">
@import '../style/global.scss' ;

.communication-side__head {
  span {
    float: right;
    display: inline-block;
    vertical-align: middle;
  }
}

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

li.hover-color {
  &:hover {
    cursor: pointer;
    color: #0BA360 !important;

    i {
      color: #0BA360 !important;
    }
  }
}
</style>
