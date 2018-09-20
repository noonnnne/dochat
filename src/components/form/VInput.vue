<template>
  <div
    class="v-input"
    :name="name"
    :data-name="dataName"
    :class="[
      isFocus ? 'focus' : '',
      hasValue ? 'fill' : '',
      color === 'white' ? 'placeholder-white' : ''
    ]"
    @click="focusInput"
  >
    <input
      :class="[color === 'white' ? 'color-fff' : '']"
      :type="type"
      @focus="toggleFocus"
      @blur="toggleFocus"
      @input="judgeInput"
      readonly
      onfocus="this.removeAttribute('readonly');"
    >
  </div>
</template>

<script>
export default {
  name: 'v-input',
  props: {
    name: String,
    dataName: String,
    form: String,
    reg: String,
    type: String,
    color: String
  },

  data() {
    return {
      isFocus: false,
      hasValue: false
    }
  },

  methods: {
    toggleFocus() {
      this.isFocus = !this.isFocus
    },

    focusInput() {
      this.$el.children[0].focus()
    },

    judgeInput(e) {
      const v = e.target.value
      const reg = new RegExp(this.$props.reg)
      if (v) {
        this.hasValue = true
        let realV
        if (reg.test(v)) {
          realV = v
        } else {
          realV = ''
        }
        this.$emit('captureValue', {
          value: realV,
          name: this.$props.name,
          form: this.$props.form
        })
      } else {
        this.$emit('captureValue', {
          value: '',
          name: this.$props.name,
          form: this.$props.form
        })
        this.hasValue = false
      }
    }
  }
}
</script>

<style lang='scss'>
@import '../../style/base.scss';
.v-input{
  position: relative;
  padding-top: 30px;
  width: 100%;

  &:before{
    position: absolute;
    top: 42px;
    transition: all .5s;
    content: attr(data-name);
    color: $c333;
    text-transform: capitalize;
    cursor: text;
  }

  &.placeholder-white {
    &::before {
      color: #fff;
    }

    &.focus{
      &:after {
        width: 100%;
        background: #fff;
      }
    }
  }

  &:after{
    position: absolute;
    content: '';
    bottom: 0;
    left: 0;
    height: 2px;
    width: 80%;
    transition: all .5s;
    background: transparent;
  }

  &.fill,
  &.focus{
    &:before{
      top: 16px;
      font-size: 18px;
      color: $cbd;
    }
  }

  &.focus{
    &:after{
      width: 100%;
      background: $amaranth;
    }
  }

  input{
    width: 100%;
    padding: 10px 0;
    border: none;
    background: transparent;
    border-bottom: 2px solid $cbd;
  }
}
</style>
