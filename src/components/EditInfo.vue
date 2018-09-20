<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="80px"
    class="demo-ruleForm"
  >
    <el-form-item label="头像">
      <upload
        @get-file="upload"
        :upload-status="uploadStatus"
        :upload-percent="uploadPercent"
        :url="ruleForm.imageUrl"
        external-cls="px-height-100 px-width-100"
      >
        <i class="avatar-uploader-icon iconfont icon-tianjia px-font-20"></i>
      </upload>
    </el-form-item>

    <el-form-item label="帐号" prop="account">
      <el-input :disabled="true" v-model="ruleForm.account" />
    </el-form-item>

    <el-form-item label="昵称" prop="nickname">
      <el-input v-model="ruleForm.nickname" />
    </el-form-item>

    <el-form-item
      label="出生日期"
      prop="birthday"
      required
    >
      <el-date-picker
        type="date"
        placeholder="选择日期"
        v-model="ruleForm.birthday"
        style="width: 100%;"
      />
    </el-form-item>
    <el-form-item
      label="性别"
      prop="gender"
    >
      <el-radio-group v-model="ruleForm.gender">
        <el-radio label="男"></el-radio>
        <el-radio label="女"></el-radio>
        <el-radio label="保密"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="签名" prop="autograph">
      <el-input
        type="textarea"
        v-model="ruleForm.autograph"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="modify">立即修改</el-button>
      <el-button @click="$emit('close-dialog')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import {
  Form,
  FormItem,
  Button,
  Input,
  Radio,
  RadioGroup,
  DatePicker
} from 'element-ui'
import * as qiniu from 'qiniu-js'
import 'pinyin4js'
import Upload from '../components/Upload'
import SocketMixin from '../mixins/socketMixin'

export default {
  name: 'EditInfo',

  components: {
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Button.name]: Button,
    [Input.name]: Input,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [DatePicker.name]: DatePicker,
    Upload
  },

  mixins: [
    SocketMixin
  ],

  computed: {
    ...mapState(['currentUser']),

    getGender() {
      let res
      if (this.gender) {
        switch (this.gender) {
          case 'male': {
            res = '男'
            break
          }
          case 'female': {
            res = '女'
            break
          }
          default: {
            res = '保密'
          }
        }
      } else {
        res = '保密'
      }
      return res
    },

    generateGender() {
      let res
      switch (this.ruleForm.gender) {
        case '保密': {
          res = 'unknown'
          break
        }
        case '男': {
          res = 'male'
          break
        }
        case '女': {
          res = 'female'
          break
        }
        default: {
          res = 'unknown'
        }
      }
      return res
    }
  },

  data() {
    return {
      uploadStatus: 2, // 0 未上传 1 上传中 2 上传完成 3 上传失败
      uploadPercent: 0,
      ruleForm: {
        account: '',
        nickname: '',
        birthday: '',
        gender: '',
        autograph: '',
        imageUrl: ''
      },
      rules: {
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
        ],
        birthday: [
          { type: 'date', required: true, message: '请选择出生日期', trigger: 'change' },
          { type: 'date', required: true, message: '请选择出生日期', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ]
      }
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    ...mapMutations(['updateUserBaseInfo']),

    init() {
      this.ruleForm.account = this.currentUser.account
      this.ruleForm.nickname = this.currentUser.nickname
      this.ruleForm.gender = this.getGender
      this.ruleForm.birthday = new Date(this.$moment(this.currentUser.birthday).format('YYYY-MM-DD')).toString()
      this.ruleForm.autograph = this.currentUser.autograph || ''
      this.ruleForm.imageUrl = this.currentUser.avatar
    },

    modify() {
      this.$socket.emit('updateUser', {
        account: this.ruleForm.account,
        nickname: this.ruleForm.nickname,
        gender: this.generateGender,
        birthday: this.ruleForm.birthday,
        autograph: this.ruleForm.autograph,
        avatar: this.ruleForm.imageUrl,
        pinyin: PinyinHelper.convertToPinyinString(this.ruleForm.nickname, '', PinyinFormat.WITHOUT_TONE)
      }, res => {
        this.updateUserBaseInfo(res)
        this.$emit('close-dialog')
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
            console.log(res)
            that.uploadStatus = 1
            that.uploadPercent = Math.floor(res.total.percent)
          },

          error(e) {
            console.log(e)
            console.log('修改头像失败')
          },

          async complete(info) {
            that.ruleForm.imageUrl = `${token.urlPrefix + info.key}`
            that.uploadStatus = 2
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
</style>
