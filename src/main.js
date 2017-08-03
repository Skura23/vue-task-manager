// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// main文件是src文件夹入口 (step1)
// 各类公共文件插件等先在main.js引入
import Vue from 'vue'
// 引入app组件 (step2)
import App from './App'
// 获取路由器
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // router, 为es6语法, 表示router: router
  router,
  template: '<App/>',
  components: { App }
})
