<template>
  <tabs v-model="activeName" @tab-click="handleClick">
    <tab-pane label="添加好友" name="add-friend">
      <v-search
        ref="contact-keyword"
        placeholder="输入<昵称/帐号>搜索"
        :class-cls="`padding-0`"
        :input-cls="`px-font-13`"
        @do-search="handleSearch"
        @clear="resetSearchInfo"
      />

      <v-result-list
        :list="contactList"
      />
    </tab-pane>
    <tab-pane label="添加群" name="add-group">
      <v-search
        ref="group-keyword"
        placeholder="输入<群名称>搜索"
        :class-cls="`padding-0`"
        :input-cls="`px-font-13`"
        @do-search="handleSearch"
        @clear="resetSearchInfo"
      />

      <v-result-list
        :is-group="true"
        :list="groupList"
      />
    </tab-pane>
    <tab-pane label="创建群" name="create-group">
      <div class="px-margin-b10">
        <p class="text-left px-font-12 px-line-30 color-c999">群昵称</p>
        <el-input placeholder="请输入群昵称" v-model="groupName"/>
      </div>
      <div class="px-margin-b10">
        <p class="text-left px-font-12 px-line-30 color-c999">群介绍</p>
        <el-input placeholder="请输入群介绍" v-model="groupIntro"/>
      </div>
      <div class="px-margin-b10">
        <p class="text-left px-font-12 px-line-30 color-c999">上传群头像</p>
        <upload
          @get-file="upload"
          :upload-status="uploadStatus"
          :upload-percent="uploadPercent"
          :url="imageUrl"
          external-cls="px-height-100 px-width-100"
        >
          <i class="avatar-uploader-icon iconfont icon-tianjia px-font-20"></i>
        </upload>
      </div>
      <el-button type="primary" @click="createGroup">创建</el-button>
    </tab-pane>
  </tabs>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import * as qiniu from 'qiniu-js'
import 'pinyin4js'
import {
  Tabs,
  TabPane,
  Input,
  Button
} from 'element-ui'
import VSearch from './form/VSearch'
import Upload from './Upload'
import VResultList from './VResultList'
import SocketMixin from '../mixins/socketMixin'

export default {
  name: 'VTool',

  components: {
    Tabs,
    TabPane,
    [Input.name]: Input,
    [Button.name]: Button,
    VSearch,
    VResultList,
    Upload
  },

  mixins: [SocketMixin],

  computed: {
    ...mapState(['currentUser'])
  },

  data() {
    return {
      activeName: 'add-friend',
      contactList: [],
      groupList: [],
      imageUrl: '',
      groupName: '',
      groupIntro: '',
      uploadStatus: 0, // 0 未上传 1 上传中 2 上传完成 3 上传失败
      uploadPercent: 0
    }
  },

  methods: {

    ...mapMutations(['joinGroup']),

    handleClick() {
      this.$refs['contact-keyword'].searchWord = ''
      this.$refs['group-keyword'].searchWord = ''
    },

    handleSearch(v) {
      switch (this.activeName) {
        case 'add-friend': {
          this.searchFriend(v)
          break
        }
        case 'add-group': {
          this.searchGroup(v)
          break
        }
        default: { break }
      }
    },

    searchFriend(v) {
      this.fetch('searchUser', {
        searchOpt: v
      }).then(res => {
        this.contactList = res[1].filter(item => item.account !== this.currentUser.account)
      })
    },

    searchGroup(v) {
      this.fetch('searchGroup', v).then(res => {
        this.groupList = res[1]
      })
    },

    async upload(image) {
      const that = this
      //  上传文件
      const [err, token] = await this.fetch('uploadToken', {})
      if (!err) {
        const result = qiniu.upload(image.result, `GroupAvatar/${Date.now()}_${Math.random()}`,
          token.token, { useCdnDomain: true }, {})

        result.subscribe({
          next(res) {
            that.uploadStatus = 1
            that.uploadPercent = res.total.percent
          },

          error(e) {
            console.log(e)
            console.log('上传群头像失败')
          },

          async complete(info) {
            that.imageUrl = `${token.urlPrefix + info.key}`
            that.uploadStatus = 2
          }
        })
      }
    },

    resetGroupInfo() {
      this.groupName = ''
      this.groupIntro = ''
      this.imageUrl = ''
    },

    resetSearchInfo() {
      this.contactList = []
      this.groupList = []
    },

    createGroup() {
      const data = {
        name: this.groupName,
        intro: this.groupIntro,
        pinyin: PinyinHelper.convertToPinyinString(this.groupName, '', PinyinFormat.WITHOUT_TONE),
        avatar: this.imageUrl
      }

      this.$socket.emit('createGroup', data, res => {
        if (res) {
          this.joinGroup(res)
          this.resetGroupInfo()
          this.$message.success('创建成功!')
          this.$emit('exit-tool')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.px-font-13 {
  font-size: 13px !important;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
