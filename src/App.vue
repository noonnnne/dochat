<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
@import './style/base.scss';
@import './style/_variable.scss';

#app{
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: 1200px;
  min-width: 1200px;
  background-size: cover;
}
</style>
