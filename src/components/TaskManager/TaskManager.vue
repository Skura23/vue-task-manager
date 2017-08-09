<template>
  <div class="task-manager">
    <div class="top-bar">
      日常任务管理器
    </div>
    <div class="main">
      <div class="l-side0 bo-r">
        <div class="cont-wra bo-b">
          <div class="menu" v-for="cate in taskManager">
            <p @click.stop="selectCate(cate)">{{cate.category}}</p>
            <ul>
              <li v-for="submenu in cate.submenu" @click.stop="selectSub(submenu, cate.submenu)">{{submenu.name}}</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <div class="bo-r" @click="addMenu">新增分类</div>
          <div @click="addSubmenu">新增子分类</div>
        </div>
      </div>
      <div class="l-side1 bo-r">
        <div class="header bo-b">
          <span class="on">所有</span>
          <span>已完成</span>
          <span>未完成</span>
        </div>
        <div class="cont-wra bo-b">
          <div class="cont-inner">
            <template v-if="isCate">
              <template v-for="submenu in category.submenu">
                <div class="day-wra" v-for="(task, $index) in submenu.tasks">
                  <p>{{ task.date }}</p>
                  <ul>
                    <li @click="getTask(task, $index)">{{ task.title }}</li>
                  </ul>
                </div>
              </template>
            </template>
            <template v-else>
              <div class="day-wra" v-for="(task, $index) in tasks">
                <p>{{ task.date }}</p>
                <ul>
                  <li @click="getTask(task, $index)">{{ task.title }}</li>
                </ul>
              </div>
            </template>
          </div>
        </div>
        <div class="footer" @click="modiTask('add')">新增任务</div>
      </div>
      <div class="content" v-show="!showEditor">
        <div class="header title bo-b">
          <div>标题: {{showedTask.title}}</div>
          <div class="operate">
            <span @click="showedTask.done = true">标记完成</span>
            <span @click="modiTask('edit')">编辑</span>
            <span>删除</span>
          </div>
        </div>
        <div class="header date bo-b">日期: {{showedTask.date}}</div>
        <div class="text-cont">{{showedTask.content}}</div>
      </div>
      <div class="content" v-show="showEditor" :class="{editor:showEditor}">
        <div class="header title bo-b">
          <div>标题:
            <input type="text" ref="title" :value="isEditCmd ? showedTask.title : ''">
          </div>
        </div>
        <div class="header date bo-b">日期:
          <input type="text" ref="date" :value="isEditCmd ? showedTask.date : ''">
        </div>
        <div class="text-cont bo-b">
          <span>正文:</span>
          <textarea name="" id="" cols="30" rows="10" ref="content" :value="isEditCmd ? showedTask.content : ''"></textarea>
        </div>
        <div class="footer">
          <span @click="confirmModi">确定</span>
          <span @click="cancelModi">取消</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type='text/babel'>
import axios from 'axios'

export default {
  data() {
    return {
      // 各级data数据
      category: [],
      taskManager: [],
      submenu: [],
      submenus: [],
      tasks: [],
      showedTask: {},
      // category: null,
      isCate: false,
      // 是否选中的flag
      menuChosen: false,
      subChosen: false,
      taskChosen: false,
      isEditCmd: false,
      // 是否显示编辑
      showEditor: false,
      test: 'testa',
      taskIndex: null
    }
  },
  methods: {
    getTask(task, index) {
      if (this.showEditor) {
        return false
      }
      this.showedTask = task;
      console.log(task)
      this.taskIndex = index;
      this.taskChosen = true;
    },
    // 增加, 编辑task
    modiTask(type) {
      // console.log(type)
      if (type === 'edit') {
        if (this.taskChosen) {
          this.isEditCmd = true;
          this.showEditor = true;
        } else {
          alert('未选中任务');
          return false;
        }
      }
      if (type === 'add') {
        if (this.subChosen) {
          this.showEditor = true
        } else {
          alert('未选中子目录');
          return false;
        }
      }
    },
    // 取消修改
    cancelModi() {
      var res = confirm('确定取消编辑么?');
      if (res) {
        this.showEditor = false;
        this.isEditCmd = false;
      }
      // this.isEditCmd = false;
    },
    // 修改task后询问
    confirmModi() {
      var task = {};
      // alert()
      task.title = this.$refs.title.value.trim();
      task.time = Date.now();
      task.date = this.getFormattedDate()
      // task.date = this.$refs.date.value.trim();
      task.content = this.$refs.content.value.trim();
      task.done = false;
      // console.log(task)
      if (this.isEditCmd) {
        // this.taskIndex
        this.tasks[this.taskIndex] = task;
        this.showedTask = task;
      } else {
        this.tasks.push(task)
      }
      this.showEditor = false;
      // 重置editCmd
      this.isEditCmd = false;
    },
    addMenu() {
      var str = '';
      str = prompt('输入目录名称:').trim();
      str && this.taskManager.push({ category: str })
    },
    addSubmenu() {
      var str = '';
      if (!this.menuChosen) {
        alert('请先选择目录或子目录');
        return false;
      } else {
        str = prompt('输入子目录名称:').trim();
        str && this.submenus.push({ name: str })
      }
    },
    selectCate(cate) {
      if (this.showEditor) {
        return false
      }
      this.menuChosen = true;
      this.subChosen = false;
      this.isCate = true;
      this.category = cate;
      this.submenus = cate.submenu;
      // this.tasks = this.category.tasks;
      console.log(this.category)
    },
    selectSub(submenu, submenus) {
      if (this.showEditor) {
        return false
      }
      this.menuChosen = true;
      this.subChosen = true;
      this.isCate = false;
      this.submenu = submenu;
      this.submenus = submenus;
      this.tasks = this.submenu.tasks;
      this.arrangeTasksByDate()
    },
    arrangeTasksByDate() {
      console.log(this.tasks);
      var tasks = this.tasks;
    },
    _test() {
      console.log(this.test)
    },
    getFormattedDate() {
      var date = new Date();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hour = date.getHours();
      var min = date.getMinutes();
      var sec = date.getSeconds();
      month = (month < 10 ? '0' : '') + month;
      day = (day < 10 ? '0' : '') + day;
      hour = (hour < 10 ? '0' : '') + hour;
      min = (min < 10 ? '0' : '') + min;
      sec = (sec < 10 ? '0' : '') + sec;
      var str = date.getFullYear() + '-' + month + '-' + day + '_' + hour + ':' + min + ':' + sec;
      /* alert(str); */
      return str;
    }
  },
computed: {
  _date() { }
},
created() {
  axios.get('static/data.json').then((res) => {
    // this.tasks = res.data.tasks
    this.taskManager = res.data.taskManager
    console.log(this.taskManager)
  })
}
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
@import "../../assets/stylus/mixin"

#some {
  .tst1 { 
    color: red;
  }
  .tst2 { 
    @extend #some .tst1
  }
}

.task-manager
  display flex
  flex-direction column
  height 100%
  .top-bar
    flex 0 0 49px
    text-indent: 20px;
    background: #DDDDDD;
    border-bottom: 1px solid #D5D5D5;
    font-size: 20px;
    color: #535353;
    font-weight: bold;
    display flex
    flex-direction column
    justify-content: center
  .main
    flex 1 0 auto
    display flex
    flex-direction row
    >div
      display flex
      flex-direction column
      .footer
        flex 0 0 $hei
        line-height $hei
        text-indent $indent
        cursor pointer
        background $bac
      .cont-wra
        flex 1
        height 0
        overflow-y auto
    // .tst1
    //   color red
    
    .l-side1
      flex 0 0 250px
      background $bac
      .header
        display flex
        justify-content space-around
        align-items: center;
        span
          display block
          padding 0 5px
          height 25px
          line-height @height
          text-indent initial
          cursor pointer
          &.on
            background #fff
            border 1px solid #D5D5D5
      .cont-wra
        background #fff
        
        
    .content
      flex 1
      min-width 500px
      .date
        background #FAFAEE
      .title
        display flex
        >div:first-child
          font-weight bold
          font-size 18px
          flex 1
        .operate
          flex 0 0 160px
          display flex
          justify-content space-around
          text-indent initial
          span
            cursor pointer
      .text-cont
        flex 1
        padding 20px 0 0 15px
.header
  flex 0 0 $hei
  line-height $hei
  background $bac
  text-indent $indent

.main .day-wra
  p
    height 30px
    line-height @height
    padding-left 10px
    background #fafaee
    font-style italic
    border-bottom 1px solid #d5d5d5
  li
    cursor pointer
    padding-left 15px
    height 30px
    line-height @height
    &.on
      background $bac
          
.l-side0
  flex 0 0 250px
  background $bac
  .menu
    li
      @extend .main .day-wra li
      padding-left 20px
    p
      @extend .main .day-wra p
      font-style normal
      background $bac
      border-bottom 0
      cursor pointer
  .cont-wra
    padding-top 10px
  .footer
    display flex
    div
      flex: 1 1 0
      
.selected
  background #fff!important

.editor 
  *
    font-size 14px!important
    font-weight normal!important
  .text-cont span
    vertical-align top
    display inline-block
  .footer
    display flex
    justify-content: space-around;
    align-items center
    span
      height 30px
      line-height @height
      text-indent 0
      padding 0 7px
      &:hover
        border-bottom 1px solid #535353
  input
    height 25px
    margin-left 10px
    padding-left 6px
    border 1px solid rgb(169, 169, 169);
  textarea
    margin-left 10px
    text-indent 5px
    
</style>