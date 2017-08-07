import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import TaskManager from '@/components/TaskManager/TaskManager'
import Test from '@/components/test/test.vue'

// npm安装的模块, 需要vue.use引入
Vue.use(Router)

// 配置路由
export default new Router({
  routes: [
    {
      path: '/',
      name: 'TaskManager',
      component: TaskManager
    },
    {
      path: '/test',
      name: 'Test',
      component: Test
    }
  ]
})
