<template>
  <div class="task-manager">
    <div class="top-bar">
      日常任务管理器
    </div>
    <div class="main">
      <div class="l-side0 bo-r">
        <div class="cont-wra bo-b">
          <div class="menu " v-for="cate in taskManager">
            <p @click.stop="selectCate($event, cate)" class="_menu">{{cate.category}}</p>
            <ul>
              <li v-for="submenu in cate.submenu" @click.stop="selectSub($event, submenu, cate.submenu)" class="_menu">{{submenu.name}}</li>
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
          <span :class="{on:doneType == 'all'}" @click="chooseDoneType('all')">所有</span>
          <span :class="{on:doneType == 'done'}" @click="chooseDoneType('done')">已完成</span>
          <span :class="{on:doneType == 'undone'}" @click="chooseDoneType('undone')">未完成</span>
        </div>
        <div class="cont-wra bo-b">
          <div class="cont-inner">
            <!-- 这个v-if和下面else里的v-if作用都是控制日期栏的显示, 没有这句话的话
                          即使任务为空日期栏仍会显示, 印象用户体验 -->
  
            <!-- v-if="doneType=='all' ? true : (doneType=='done' ? task.done : !task.done)" -->
            <!-- <div class="day-wra" v-for="(tasks, date, $index) in sortedTasks"> -->
              <!-- 很关键, 这句话控制重复日期栏不显示 -->
              <!-- v-if="$index==0 || (task.date != submenu.tasks[$index-1].date)" -->
              <!-- <p v-if="getRenderedLen">{{ date }}</p> -->
              <ul class="day-wra">
                <li :class="{done: task.done}" @click="getTask($event, task, $index)" v-for=" (task, $index) in tasks" v-if="doneType=='all' ? true : (doneType=='done' ? task.done : !task.done)">{{ task.title }}</li>
              </ul>
            <!-- </div> -->
  
          </div>
        </div>
        <div class="footer" @click="modiTask('add')">新增任务</div>
      </div>
      <div class="content" v-show="!showEditor">
        <div class="header title bo-b">
          <div>标题: {{showedTask.title}}</div>
          <div class="operate">
            <span @click="showedTask.done = true" class="_mark" :style="{ visibility: showedTask.done ? 'hidden':'visible'}">标记完成</span>
            <span @click="modiTask('edit')">编辑</span>
            <span>删除</span>
          </div>
        </div>
        <div class="header date bo-b" v-show="taskChosen">日期: {{getFormattedDate(showedTask.date, false)}}</div>
        <div class="text-cont">{{showedTask.content}}</div>
      </div>
      <div class="content" v-show="showEditor" :class="{editor:showEditor}">
        <div class="header title bo-b">
          <div>标题:
            <input type="text" ref="title" :value="isEditCmd ? showedTask.title : ''">
          </div>
        </div>
        <div class="header date bo-b">日期:
          &nbsp;&nbsp;<span ref="date" v-text="isEditCmd ? showedTask.date : ''"></span>
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
import jquery from 'jquery'

export default {
  data() {
    return {
      // 各级data数据容器
      category: [],
      taskManager: [],
      submenu: [],
      submenus: [],
      tasks: [],
      showedTask: {},
      // category: null,
      // 判断点选的是主目录还是子目录flag
      isCate: false,
      // 是否选中的flag
      menuChosen: false,
      subChosen: false,
      taskChosen: false,
      isEditCmd: false,
      // 是否显示编辑
      showEditor: false,
      test: 'testa',
      taskIndex: null,
      doneType: 'all',
      itemShowed: null
    }
  },
  methods: {
    getTask(ev, task, index) {
      var elem = ev.currentTarget
      this.taskChosenStyHandler(elem)
      if (this.showEditor) {
        return false
      }
      this.showedTask = task;
      // console.log(task)
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
      task.date = Math.floor(+new Date()/1000);
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
      str && this.taskManager.push({ category: str, submenu: [] })
    },
    addSubmenu() {
      var str = '';
      if (!this.menuChosen) {
        alert('请先选择目录或子目录');
        return false;
      } else {
        str = prompt('输入子目录名称:').trim();
        str && this.submenus.push({ name: str, tasks: [] })
      }
    },
    // 点选大目录
    selectCate($event, cate) {
      this.menuChosenStyHandler($event.currentTarget)
      if (this.showEditor) {
        return false
      }
      this.menuChosen = true;
      this.subChosen = false;
      this.isCate = true;
      this.category = cate;
      this.submenus = cate.submenu;
      // 将各sub下各task连接到一个数组
      var tasks = []
      for (var i = 0; i < this.submenus.length; i++) {
        var sub = this.submenus[i];
        tasks = tasks.concat(sub.tasks)
      }
      this.tasks = tasks;
    },
    // 点选子目录
    selectSub($event, submenu, submenus) {
      this.menuChosenStyHandler($event.currentTarget)
      if (this.showEditor) {
        return false
      }
      this.menuChosen = true;
      this.subChosen = true;
      this.isCate = false;
      this.submenu = submenu;
      this.submenus = submenus;
      this.tasks = this.submenu.tasks;
      // console.log(this.tasks)
      // console.log(this.sortedTasks)
    },
    chooseDoneType(type) {
      this.doneType = type
      // var tasks = [];
      // tasks = JSON.parse(JSON.stringify(this.tasks));
      // if (type === 'done') {
      //   // 逆向循环解决.splice(i, 1)重新排序的问题
      //   for (var i = tasks.length - 1; i >= 0; i--) {
      //     var task = tasks[i];
      //     if (!task.done) {
      //       tasks.splice(i, 1)
      //     }
      //   }
      // } else if (type === 'undone') {
      //   for (var t = tasks.length - 1; t >= 0; t--) {
      //     var _task = tasks[t];
      //     if (_task.done) {
      //       tasks.splice(t, 1)
      //     }
      //   }
      // } else {}
      // this.tasks = tasks;
      // console.log(tasks)
    },
    // listShowController(type, task) {
    //   // task.done && (doneType == ('all' || 'done'))
    //   if (type === 'all') {
    //     return true;
    //   } else if (type === 'done' && task.done) {
    //     return true;
    //   } else if (type === 'undone' && !task.done) {
    //     return true
    //   }
    // },
    _test() {
      console.log(this.test)
    },
    // dom 操作
    // 菜单点击选中样式处理
    menuChosenStyHandler(elem){
      var cls = elem.classList[0]
      $('.l-side0').find('.'+cls).removeClass('on')
      $(elem).addClass('on')
    },
    taskChosenStyHandler(elem){
      $('.cont-inner').find('li').removeClass('on')
      $(elem).addClass('on')
      // $('.l-side0').find('.'+cls).removeClass('on')
      // $(elem).addClass('on')
    },
    // timestamp to 2018-05-26 14:22:05
    getFormattedDate(value, onlydate) {
      var date = new Date(value*1000);
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
      var str = date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
      if (onlydate) {
        str = date.getFullYear() + '-' + month + '-' + day
      }
      /* alert(str); */
      // 格式: 2018-05-26_14:22:05
      return str;
    },
    // 数组去重函数
    eliminateDuplicates(arr) {
      var i;
      var len = arr.length;
      var out = [];
      var obj = {};
      for (i = 0; i < len; i++) {
        obj[arr[i]] = 0;
      }
      for (i in obj) {
        out.push(i);
      }
      return out;
    }
  },
  computed: {
    _date() { },
    sortedTasks() {
      var dateArr = [];
      for (var i = 0; i < this.tasks.length; i++) {
        var task = this.tasks[i];
        dateArr.push(task.date)
      }
      dateArr = this.eliminateDuplicates(dateArr)
      var dateObj = {};
      for (var t = 0; t < dateArr.length; t++) {
        var date = dateArr[t];
        var arr = dateObj[date] = [];
        for (var p = 0; p < this.tasks.length; p++) {
          var _task = this.tasks[p];
          if (_task.date === date) {
            arr.push(_task)
          }
        }
      }
      console.log(dateObj)
      return dateObj
    },
    getRenderedLen() {
      var value = this.tasks
      var type = this.doneType
      var zeroLen = false;
      var arr = [];
      for (var i = 0; i < value.length; i++) {
        var task = value[i];
        if (type === 'done') {
          if (task.done) {
            arr.push[task]
          }
        } else if (type === 'undone') {
          if (!task.done) {
            arr.push[task]
          }
        }
      }
      if (arr.length === 0) {
        zeroLen = true;
      }
      if (type === 'all') {
        zeroLen = false;
      }
      return zeroLen
    }
  },
  // filters:{
  //   timeFormat(value, onlydate){
  //     var date = new Date();
  //     var month = date.getMonth() + 1;
  //     var day = date.getDate();
  //     var hour = date.getHours();
  //     var min = date.getMinutes();
  //     var sec = date.getSeconds();
  //     month = (month < 10 ? '0' : '') + month;
  //     day = (day < 10 ? '0' : '') + day;
  //     hour = (hour < 10 ? '0' : '') + hour;
  //     min = (min < 10 ? '0' : '') + min;
  //     sec = (sec < 10 ? '0' : '') + sec;
  //     var str = date.getFullYear() + '-' + month + '-' + day + '' + hour + ':' + min + ':' + sec;
  //     /* alert(str); */
  //     // 格式: 2018-05-26 14:22:05
  //     return str;
  //   }
  // },
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
        background $bac
        .cont-inner
          li.on
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
  ._menu.on
    background #fff!important
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
.done
  color #20c120
  font-weight bold

</style>