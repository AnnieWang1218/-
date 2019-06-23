<template>
  <div class="categories">
    <!-- 左边滚动区 -->
    <scroll-view scroll-y class="left" :style="{height:proHeight+'px'}">
      <!-- 一级标题 -->
        <div @click='select(index)'  v-for='(item,index) in catagoriesData' :key='index' :class="['left-title',activeIndex==index ?'left-active':'']">
            {{item.cat_name}}
        </div>
    </scroll-view>
    <!-- 右边滚动区 -->
    <scroll-view scroll-y class="right" :style="{height:proHeight+'px'}">
       <!-- 二级标题 -->
        <div v-for='(item1,index1) in selectedData' :key='index1'>
          <div class="right-title">
            /{{item1.cat_name}}/
          </div>         
          <div class="right-content">
            <!-- 三级内容 -->
            <div v-for='(item2,index2) in item1.children' :key='index2' class="right-content-single">
              <img :src="item2.cat_icon">
              <text>{{item2.cat_name}}</text>
            </div>
          </div>
        </div>

    </scroll-view>
  </div>
</template>

<script>
export default {
    data(){
      return {
        catagoriesData:[],//所有的分类数据
        selectedData:[],//选中的一级标题对应的数据
        activeIndex:0,//当前一级标题的下标
        proHeight:0,//设备可使用的区域的高度
      }
    },
    methods:{
      //获取所有的分类数据
      getCategory(){
        let res = this.$axios.get('categories')
        .then(res=>{
          let {message} = res.data
          this.catagoriesData = message
          console.log(message);
          this.selectedData=message[0].children
        })
      },
      //获取选中的一级标题的数据
      select(index){
        console.log(index);
        //将对应下标的数据赋值给选中的数据
        this.selectedData=this.catagoriesData[index].children
        //将对应的下标赋值给活动下标
        this.activeIndex=index
      }
    },
    onLoad(){
      this.getCategory()
      //获取设备可使用的高度
      const res = wx.getSystemInfoSync()
      this.proHeight = res.windowHeight-10
      console.log(this.proHeight);
  }
}
</script>

<style lang="less" scoped>
.categories{
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  .left{
    width: 180rpx;
    .left-title{
      display: flex;
      justify-content: center;
      padding: 40rpx 0;
      font-size: 12px;
      color: #666;
    }
    .left-active{
      color:#000;
      background-color: #fff;
      position: relative;
      &::before{
        position: absolute;
        content:'';
        top: 0;
        left: 0;
        width:6px;
        height: 100%;
        background-color: #ff2d4a;
      }
    }
  }
  .right{
    flex:1;
    background-color: #fff;
    .right-title{
      display: flex;
      justify-content: center;
      align-items: center;
      color: #666;
      font-size: 14px;
      margin-top: 40rpx;
    }
    .right-content{
      display: flex;
      flex-wrap: wrap;
      .right-content-single{
        margin-top: 40rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 33.33%;
        img{
          width: 100rpx;
          height: 60rpx;
        }
      }
    }
  }
}

</style>
