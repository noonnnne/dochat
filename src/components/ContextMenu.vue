<template>
  <div
    class="position-f context-menu"
    :style="{
      top: `${point.x}px`,
      left: `${point.y}px`
    }"
  >
    菜单
  </div>
</template>

<script>
  export default {
    name: 'ContextMenu',

    props: {
      point: {
        type: Object,
        default() {
          return { x: 0, y: 0 }
        }
      }
    }
  }
</script>

<style lang="scss">

</style>
