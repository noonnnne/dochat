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
        dataName="用户名"
        form="login"
        reg=".{6,10}"
        @captureValue="solveInput">
      </VInput>
      <VInput
        name="password"
        type="password"
        dataName="密码"
        form="login"
        reg=".{6,10}"
        @captureValue="solveInput">
      </VInput>
      <VButton
        name="Go"
        :valid="login.valid"
        animation="turnCorrect"
        @doClick="doLogin">
      </VButton>
      <a class="forget-pwd display-b text-center margin-t55 color-bd" href="javascript:void(0)">忘记密码</a>
    </div>
    <!-- 注册 -->
    <div
      class="wrapper register-wrapper px-padding-lr50 overflow-h radius-8"
      ref="regist"
      v-show="!isLogin">
      <div class="title margin-t60 margin-b30 px-line-45 px-font-32 position-r color-fff">
        注册
      </div>
      <VInput
        name="account"
        type="text"
        dataName="用户名"
        color="white"
        form="regist"
        reg=".{6,10}"
        @captureValue="solveInput">
      </VInput>
      <VInput
        name="password"
        type="password"
        dataName="密码"
        color="white"
        form="regist"
        reg=".{6,10}"
        @captureValue="solveInput">
      </VInput>
      <VInput
        name="repassword"
        type="password"
        dataName="确认密码"
        color="white"
        form="regist"
        reg=".{6,10}"
        @captureValue="solveInput">
      </VInput>
      <VButton
        name="NEXT"
        :valid="regist.valid"
        @doClick="doRegist"
        fullWidth=true>
      </VButton>
    </div>
    <!-- 切换按钮 -->
    <div class="switch-btn position-a px-width-140 px-height-140 percent-radius-50 bg-amaranth px-right-296 px-top-30"
      @click="switchLoginRegist($event)">
    </div>
  </div>
</template>

<script>
import VInput from '@/components/form/VInput'
import VButton from '@/components/form/VButton'
import { mapState, mapMutations } from 'vuex'
import resource from '../resource/index'

export default {
  name: 'login',
  data () {
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
      let form = this[name]
      if (form) {
        let properties = Object.keys(form)
        this[name].valid = properties.every(item => {
          return item === 'valid' ? true : this[name][item]
        })
      }
    },
    solveInput(data) {
      let currentForm = this[data.form]
      if (currentForm) {
        let property = Object.keys(currentForm)
        if (property && (property.indexOf(data.name) !== -1)) {
          this[data.form][data.name] = data.value
          this.validForm(data.form)
        }
      }
    },
    switchLoginRegist(e) {
      if (this.isLogin) {
        e.target.classList.add('rotate')
        e.target.classList.remove('anim-reverse')
        this.$refs.regist.classList.add('bg-extend')
        this.$refs.regist.classList.remove('anim-reverse')
      } else {
        e.target.classList.add('anim-reverse')
        this.$refs.regist.classList.add('anim-reverse')
      }
      this.isLogin = !this.isLogin
    },
    doLogin() {
      resource.login({
        account: this.login.account,
        password: this.login.password
        // mock: true
      }).then((res) => {
        let data = res.data
        console.log(data)
        if (data.data && res.status === 200) {
          this.setState({
            key: 'currentUser',
            value: data.data[0]
          })
          this.$router.push({
            name: 'Chat'
          })
        }
      })
    },
    doRegist() {
      resource.regist({
        account: this.regist.account,
        password: this.regist.password
      }).then((res) => {
        let data = res.data
        console.log(data)
      })
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
