<template>
  <!-- 这里的类名用于style,外部无法获取 -->
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// 插入各组件 (step 0)
import TaskManager from '@/components/TaskManager/TaskManager';
// import Test from '@/components/test/test';
import axios from 'axios';
// import jQuery from 'jQuery';
// window.jQuery = jQuery

export default {
  name: 'app',
  components: {
    // Test,
    TaskManager
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
#app
  height 100%
</style>
