<template>
  <div>
    <!-- 轮播图区 -->
    <swiper indicator-dots autoplay circular interval="3000" duration="1000" class="swiper">
      <block v-for="item in swipImg" :key="item.goods_id">
        <navigator :url='item.navigator_url'>
          <swiper-item>
            <image :src="item.image_src" class="slide-image" />
          </swiper-item>
        </navigator>
      </block>
    </swiper>
    <!-- 菜单栏 -->
    <div class="category">
      <div v-for='(item,index) in categoryData' :key='index' class="cat">
        <img :src="item.image_src" />
      </div>
    </div>
    <!-- 楼层区域 -->
    <div class="floors">
      <div v-for='(item,index) in floorData' :key='index'         class="floor">
        <div class="floor-title">
          <img :src="item.floor_title.image_src" >
        </div>
        <div class="floor-body">
            <div class="floor-body-left">
                <img :src="item.product_list[0].image_src" :style="{width:item.product_list[0].image_width+'rpx'}" />
            </div>
            <div class="floor-body-right">
              <image v-if='index1>0' v-for='(item1,index1) in item.product_list' :key='index1' :src="item1.image_src" :style="{width:item1.image_width+'rpx'}"/>
            </div>
        </div>
      </div>
    </div>
    <!-- 底部区域 -->
    <div class="footer">
      <i class="iconfont icon-xiao"></i> 
      <span>我是有底线的哦~</span>
    </div>
    <!-- 回到顶部 -->
    <div v-show="scrollShow">
      <div class="back" @click='backTop'>
        <img src="/static/img/arrow_top@2x.png" />
        <span>顶部</span>
      </div>
    </div>

  </div>
</template>
<script>
export default {
    data(){
      return {
        swipImg:[],
        categoryData:[],
        floorData:[],
        scrollShow:false
      }
    },
    //页面的滚动事件
    //尽量减少在onPageScroll事件中操作data中的数据,需要做条件判断
    onPageScroll(obj){
      if(obj.scrollTop>300){
        if(this.scrollShow) return
        this.scrollShow=true
      }else{
        if(!this.scrollShow) return
        this.scrollShow=false
      }
    },
    methods:{
      //获取轮播图方法
      async getImg(){
          let res = await this.$axios.get('home/swiperdata')
          let {message,meta} = res.data
          if(meta.status === 200){
            this.swipImg= message
          }
      },
      //获取菜单栏数据
      async getCategoryData(){
        let res = await this.$axios.get('home/catitems')
        let {message,meta} = res.data
        // console.log(res.data);
        if(meta.status === 200){
          this.categoryData = message
        }
      },
      //获取楼层数据
      async getFloorData(){
        let res = await this.$axios.get('home/floordata')
        let {meta,message} = res.data
        if(meta.status === 200){
          this.floorData = message
        }
      },
      //回到顶部
      backTop(){
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
      }
    },
    onLoad(){
      this.getImg()
      this.getCategoryData()
      this.getFloorData()
    }

};

</script>
<style lang='less' scoped>
.swiper{
  height:400rpx;
  width: 750rpx;
  image{
  height: 100%;
  width: 100%;
  }
}
.category{
  display: flex;
  flex-wrap: nowrap;
  padding: 20rpx 0;
  background-color: #fff;
  .cat{
    flex:1;
    display: flex;
    justify-content: center;
    img{
    width: 120rpx;
    height: 120rpx;
    }
  }
}
.floors{
  background-color: #fff;
  margin-bottom: 20rpx;
  .floor{
    margin-top: 20rpx;
    display: flex;
    flex-direction: column;
    .floor-title{
      width: 100%;
      img{
      width: 100%;
      height: 80rpx;
      }
    }
    .floor-body{
      display: flex;
      .floor-body-right{
        display: flex;
        flex-wrap: wrap;
        image{
          height: 50%;
        }
      }
    }
  }

}
.footer{
  padding: 30rpx 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  span{
    font-size: 12px;
  }
}
.back{
  position: fixed;
  right:60rpx;
  bottom: 60rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background-color:rgba(255, 255, 255, 0.5);
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img{
    width: 24rpx;
    height: 14rpx;
  }
  span{
    margin-top: 20rpx;
    font-size: 12px;

  }
}




</style>