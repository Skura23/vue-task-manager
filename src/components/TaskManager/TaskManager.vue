<template>
  <div class="task-manager">
    <div class="top-bar">
      日常任务管理器
    </div>
    <div class="main">
      <div class="l-side0 bo-r">
        <div class="cont-wra bo-b">
          <div class="menus" v-for="menu in tasks">
              <p>{{menu.name}}</p>
              <ul>
                <li>123</li>
              </ul>
          </div>
        </div>
        <div class="footer">新增分类</div>
      </div>
      <div class="l-side1 bo-r">
        <div class="header bo-b">
          <span class="on">所有</span>
          <span>已完成</span>
          <span>未完成</span>
        </div>
        <div class="cont-wra bo-b">
          <div class="day-wra">
            <p>2017-1-1</p>
            <ul>
              <li>test1</li>
              <li>test2</li>
            </ul>
          </div>
          <div class="day-wra">
            <p>2017-1-1</p>
            <ul>
              <li>test3</li>
              <li>test4</li>
            </ul>
          </div>
        </div>
        <div class="footer">新增任务</div>
      </div>
      <div class="content">
        <div class="header title bo-b">
          <div>标题</div>
          <div class="operate">
            <span>标记完成</span>
            <span>编辑</span>
            <span>删除</span>
          </div>
        </div>
        <div class="header date bo-b">日期</div>
      </div>
    </div>
  </div>
</template>

<script type='text/babel'>
import axios from 'axios'

export default {
  data() {
    return {
      tasks: []
    }
  },
  created() {
    axios.get('static/data.json').then((res) => {
      console.log(res.data)
      this.tasks = res.data.tasks
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
      .cont-wra
        flex 1
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

.header
  flex 0 0 $hei
  line-height $hei
  background $bac
  text-indent $indent

.day-wra
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
  li
    @extend .day-wra li
  p
    @extend .day-wra p

</style>