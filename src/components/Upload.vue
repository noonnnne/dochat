<template>
  <div
    class="upload display-ib font-0 position-r"
    :class="{
      beforeUpload: uploadStatus === 0,
      uploading: uploadStatus === 1,
      [externalCls]: true
    }"
    @click="triggerSelect"
  >
    <slot v-if="uploadStatus === 0"></slot>

    <div
      v-if="uploadStatus === 1"
      class="upload-percent-bar"
      :data-percent="`${uploadPercent}%`"
    >
      <div
        class="upload-percent height-100"
        :style="{
          width: `${uploadPercent}%`
        }"
      />
    </div>

    <div v-if="uploadStatus === 2" class="width-100 height-100 uploading-wrapper position-r">
      <img
        class="width-100 height-100"
        :src="url"
        alt=""
      >
    </div>

    <p v-else>上传失败</p>
  </div>
</template>

<script>
import readDiskFile from '../utils/readDiskFile'

export default {
  name: 'upload',

  props: {
    externalCls: {
      type: String,
      default: ''
    },

    uploadStatus: {
      type: Number,
      default: 0 // 0 未上传  1 上传中  2 上传完成  3 上传失败
    },

    uploadPercent: {
      type: Number,
      default: 0
    },

    url: {
      type: String,
      default: ''
    }
  },

  methods: {
    async triggerSelect() {
      const image = await readDiskFile('blob', 'image/png,image/gif,image/jpg,image/jpeg')

      this.$emit('get-file', image)
    }
  }
}
</script>

<style lang="scss">
.upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &.uploading {
    border-style: solid;
  }

  &.beforeUpload {
    &:hover {
      border-color: #409EFF;
    }
  }

  .uploading-wrapper {
    &:hover {
      &:before {
        position: absolute;
        content: '更换';
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        color: #fff;
        line-height: 100px;
        font-size: 14px;
        text-align: center;
        background: rgba(0, 0, 0, .4);
      }
    }
  }

  .upload-percent-bar {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 8px;
    border-radius: 8px;

    .upload-percent {
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 8px;
      background: #2080f0;
      transition: width .3s ease-in;
    }

    &:before {
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      content: attr(data-percent);
      font-size: 12px;
    }
  }
}
</style>
