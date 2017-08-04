<template>
  <!-- 这里的类名用于style,外部无法获取 -->
  <div id="app1">
    <img src="./assets/logo.png">
    <router-view></router-view>
    <test></test>
  </div>
</template>

<script>
import Test from '@/components/test/test';

export default {
  name: 'app',
  components: {
    Test
  }
}
</script>

<style>
#app1 {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
