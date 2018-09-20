<template>
  <div class="position-r">
    <!-- 登录 -->
    <div
      class="wrapper login-wrapper px-padding-lr50 overflow-h radius-8 bg-fff"
      v-show="isLogin">
      <div class="title margin-t60 margin-b30 px-line-45 px-font-32 position-r color-amaranth">
        登录
      </div>

      <VInput
        name="account"
        type="text"
        data-name="帐号"
        form="login"
        reg=".{6,10}"
        @captureValue="solveInput"
      >
      </VInput>

      <VInput
        name="password"
        type="password"
        data-name="密码"
        form="login"
        reg=".{6,10}"
        @captureValue="solveInput"
      />
      <VButton
        name="Go"
        :valid="login.valid"
        animation="turnCorrect"
        @doClick="doLogin"
      />

      <a
        class="forget-pwd display-b text-center margin-t55 color-bd"
        href="javascript:void(0)"
      >
        忘记密码
      </a>
    </div>
    <!-- 注册 -->
    <div
      class="wrapper register-wrapper px-padding-lr50 overflow-h radius-8"
      ref="regist"
      v-show="!isLogin"
    >
      <div class="title margin-t60 margin-b30 px-line-45 px-font-32 position-r color-fff">
        注册
      </div>

      <VInput
        name="account"
        type="text"
        data-name="帐号"
        color="white"
        form="regist"
        reg=".{6,10}"
        @captureValue="solveInput"
      />

      <VInput
        name="password"
        type="password"
        data-name="密码"
        color="white"
        form="regist"
        reg=".{6,10}"
        @captureValue="solveInput"
      />

      <VInput
        name="repassword"
        type="password"
        data-name="确认密码"
        color="white"
        form="regist"
        reg=".{6,10}"
        @captureValue="solveInput"
      />

      <VButton
        name="NEXT"
        @doClick="doRegist"
        :valid="regist.valid"
        :fullWidth="true"
      />
    </div>
    <!-- 切换按钮 -->
    <div
      class="switch-btn position-a px-width-140 px-height-140 percent-radius-50 bg-amaranth px-right-296 px-top-30"
      ref="switch-btn"
      @click="switchLoginRegist(true)"
    />
  </div>
</template>

<script>
import platform from 'platform'
import VInput from '@/components/form/VInput'
import VButton from '@/components/form/VButton'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'login',
  data() {
    return {
      login: {
        account: '',
        password: '',
        valid: false
      },
      regist: {
        account: '',
        password: '',
        repassword: '',
        valid: false
      },
      isLogin: true
    }
  },

  components: {
    VInput,
    VButton
  },

  computed: {
    ...mapState([
      'currentUser'
    ])
  },

  methods: {
    ...mapMutations([
      'setState'
    ]),

    validForm(name) {
      const form = this[name]
      if (form) {
        const properties = Object.keys(form)
        this[name].valid = properties.every(item => (item === 'valid' ? true : this[name][item]))
      }
    },

    solveInput(data) {
      const currentForm = this[data.form]
      if (currentForm) {
        const property = Object.keys(currentForm)
        if (property && (property.indexOf(data.name) !== -1)) {
          this[data.form][data.name] = data.value
          this.validForm(data.form)
        }
      }
    },

    switchLoginRegist(flag) {
      const btn = this.$refs['switch-btn']
      if (this.isLogin) {
        if (flag) {
          btn.classList.add('rotate')
        } else {
          btn.classList.remove('rotate')
        }
        btn.classList.remove('anim-reverse')
        this.$refs.regist.classList.add('bg-extend')
        this.$refs.regist.classList.remove('anim-reverse')
      } else {
        btn.classList.add('anim-reverse')
        this.$refs.regist.classList.add('anim-reverse')
      }

      if (flag) {
        this.isLogin = !this.isLogin
      }
    },

    doLogin() {
      this.$socket.emit('login', {
        account: this.login.account,
        password: this.login.password,
        os: platform.os.family,
        browser: platform.name,
        environment: platform.description
      }, res => {
        this.$localCache.set('token', res.token)
        this.setState({
          currentUser: res
        })
        this.$router.push('/chat')
      })
    },

    doRegist() {
      this.$socket.emit('regist', {
        account: this.regist.account,
        password: this.regist.password,
        pinyin: `yonghu${this.regist.account}`,
        nickname: `用户${this.regist.account}`,
        os: platform.os.family,
        browser: platform.name,
        environment: platform.description
      }, res => {
        this.resetAP()
        this.isLogin = true
        this.switchLoginRegist()
        this.login.account = res.account
      })
    },

    resetAP() {
      const data = {
        account: '',
        password: '',
        valid: false
      }
      this.login = { ...data }
      this.regist = { ...data }
    }
  }
}
</script>

<style lang="scss">
@import '../style/base.scss';
@import '../style/global.scss';

.wrapper{
  margin: 0 auto;
  width: 460px;
  height: 550px;

  .title{
    &:before{
      position: absolute;
      left: -50px;
      content: '';
      width: 6px;
      height: 100%;
    }
  }

  .v-input{
    & + .v-input{
      margin-top: 10px;
    }
  }

  &.login-wrapper{
    .title{
      &:before{
        background: $amaranth;
      }
    }
  }

  &.register-wrapper{
    .title{
      &:before{
        background: #fff;
      }
    }
  }
}

.switch-btn {
  &::after,
  &::before {
    position: absolute;
    top: 56px;
    left: 68px;
    width: 4px;
    height: 28px;
    background: #fff;
    content: '';
  }

  &::before{
    transform-origin: center center;
    transform: rotateZ(90deg)
  }
}
</style>
