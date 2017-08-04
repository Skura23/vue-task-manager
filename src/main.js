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
  el: '#app2',
  // router, 为es6语法, 表示router: router
  router,
  // 表示加载的模板 替换为<div>hello a</div>测试
  // 标签名不区分大小写, APP也可以
  template: '<app/>',
  components: { App }
})

// 最后, main.js被注入到index.html
