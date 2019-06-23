<template>
  <div v-if="goods_detail">
    <!-- 1.0 轮播图 -->
    <swiper indicator-dots autoplay circular indicator-active-color="#fff">
        <block v-for="item in goods_detail.pics" :key="item.pics_id">
            <swiper-item>
                <image mode="aspectFill" :src="item.pics_mid" @click='previewImg(item.pics_big_url)'></image>
            </swiper-item>
        </block>
    </swiper>
    <!-- 2.0 商品的基本信息 -->
    <view class="product-info">
      <view class="product-head">
        <text class="price">￥{{goods_detail.goods_price}}</text>
      </view>
      <view class="product-body">
        <view class="product-name">{{goods_detail.goods_name}}</view>
        <view class="product-like">
          <view class="iconfont icon-shoucang"></view>
          <text>收藏</text>
        </view>
      </view>
      <view class="product-foot">
        <text>快递：免运费</text>
      </view>
    </view>
    <!-- 3.0 促销信息 -->
    <view class="part">
      <view class="part-item part-line">
        <text class="note">促销
        </text>
        <text class="color-main description">满300减30元
        </text>
      </view>
      <view class="part-item">
        <text class="note">已选
        </text>
        <text class="description">黑色/S/1件
        </text>
      </view>
    </view>
    <!-- 4.0 收获地址 -->
    <view class="part" @click='chooseAddress'>
      <view class="part-item">
        <text class="note">送至</text>
        <view v-if='address'>
            {{address.provinceName}} {{address.cityName}} {{address.countyName}}
        </view>
        <view v-else>
          <text>请选择收货地址</text>
        </view>
        <view style="float:right;" class="iconfont icon-jiantouyou"></view>
      </view>
    </view>
    <!-- 5.0 tabs栏目的展示 -->
    <view class="content">
      <!-- 标题 -->
      <view class="introImg">
        <text @click="sel(index)" :class="[selIndex === index ? 'active':'']" v-for='(item,index) in tabs' :key='index'>{{item}}</text>
      </view>
      <!-- 内容区 -->
      <!-- 图片区域 -->
      <view>
        <view v-if="selIndex===0" class="imgContent">
         <view v-html="goods_detail.goods_introduce"></view>
        </view>
        <!-- 参数区 -->
        <view v-else class="csContent">
          <view v-for="item1 in goods_detail.attrs" :key='item1.attr_id'>
              <text>{{item1.attr_name}}</text>
              <text>{{item1.attr_value}}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 底部区域 -->
    <view class="footer">
        <!-- 联系客服 -->
        <view class="kefu">
          <view class="iconfont .icon-kefu"></view>
          <text>联系客服</text>
        </view>
        <!-- 购物车 -->
        <view class="kefu" @click="toShopCar">
          <view class="iconfont icon-gouwuche"></view>
          <text>购物车</text>
        </view>
        <!-- 加入购物车 -->
        <view class="toCar" @click="saveGoods">加入购物车</view>
        <!-- 立即购买 -->
        <view class="payfor">立即购买</view>
    </view>
  </div>
</template>

<script>
import {addGoods} from '../common/shopcarStorage'
export default {
  data(){
    return {
      goods_detail:null, // 商品信息
      address:null, // 收获地址
      tabs:['图文介绍','规格参数'],
      selIndex:0
    }
  },
  onLoad(options){
    // 获取商品详情的数据
    this.getGoodsDetailData(options.goods_id)
    // 去本地取我们的地址信息，如果有，则赋值给address
    if(wx.getStorageSync('address')){//如果有值.就赋值
        this.address = wx.getStorageSync('address')
    }
  },
  methods:{
    async getGoodsDetailData(goods_id){
      const res = await this.$axios.get(`goods/detail?goods_id=${goods_id}`)
      this.goods_detail = res.data.message
      console.log(res.data.message);
    },
    //点击收货地址事件:授权只出现一次.地址确定之后才会到success.点否就是失败
    chooseAddress(){
        wx.chooseAddress({
            success: res=>{
              console.log(res);
                //拼接一个完整的地址
                res.comAddress = `${res.provinceName}${res.cityName}${res.countyName}${res.detailInfo}`
                this.address= res
                //如果客户授权了,还需要将地址存储到本地.
                wx.setStorageSync('address',res)              
            },
            fail:(err)=>{
                console.log(err);
                //返回的信息是这一段,就代表是客户拒绝了.需要提醒用户授权
                if (err.errMsg === 'chooseAddress:fail auth deny'){
                    wx.showModal({
                    title: '提示',
                    content: '请去我的页面打开授权',
                    showCancel:false,
                    confirmText:'确定',
                    confirmColor:'#ff2d4a',
                      success:res=>{
                        if(res.confirm){
                          console.log('1111');
                           wx.switchTab({url: '/pages/my/main'})
                        }
                      }
                  })
              }
          }
      })
    },
    // 预览图片
    //参数是当前点击的图片地址
    previewImg(img){
        //利用map方法:将数组中按照一定的要求返回一个新数组
        let newImg = this.goods_detail.pics.map(item=>{
            return item.pics_big_url
        })
        wx.previewImage({
            //要求是个数组,里面的是字符串.当前数据不满足要求,需要从每个数组中将对应的数据单独取出,组成新数组
            urls:newImg,
            current:img
        })
    },
    //tab切换栏
    sel(index){
      this.selIndex=index
    },
    //加入购物车
    saveGoods(){
      wx.showToast({
        title: '成功加入购物车',
        image: '/static/img/duigou.png',
        duration: 2000
      })
      let good_id = this.goods_detail.goods_id
      //将商品加入购物车
      addGoods({
        goods_id:good_id,
        goods_num:1
      })
    },
    //购物车
    toShopCar(){
      wx.switchTab({
        url:'/pages/shopcart/main'
      })
    }
  }
}
</script>

<style lang="less" scoped>
swiper{
  width:750rpx;
  height: 400rpx;
  image{
    width:750rpx;
    height: 400rpx;
  }
}
.product-info {
  display: flex;
  flex-direction: column;
  height: 300rpx;
  background-color: #fff;
  padding: 0 16rpx;
}

.product-head {
  height: 38rpx;
  padding: 40rpx 0;
}

.product-head .price {
  color: #ff2d4a;
  font-size: 50rpx;
  // margin-left: 10rpx;
}

.product-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-body .product-name {
  font-size: 34rpx;
  width: 546rpx;
  height: 88rpx;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-body .product-like {
  width: 50rpx;
  height: 78rpx;
  border-left: 1rpx solid #ddd;
  padding-left: 46rpx;
  margin-right: 30rpx;
  color: #999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text{
    font-size: 12px;
  }
}

.product-foot {
  font-size: 30rpx;
  color: #999;
  margin-top: 34rpx;
}

.part {
  background-color: #fff;
  margin: 20rpx 0;
  font-size: 32rpx;
  color: #999;
  &-line:after {
    content: '';
    height: 1rpx;
    width: 734rpx;
    background-color: #ddd;
    display: block;
    position: absolute;
    bottom: -1rpx;
  }
  &-item {
    display: flex;
    padding: 28rpx 16rpx;
    position: relative;
    align-items: center;
    // justify-content: space-between;
  }
}
.part .note {
  color: #333;
  margin-right: 40rpx;
}

.part .description {
  width: 490rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
}
.part .color-main {
  color: #ff2d4a;
}
//tab切换栏区
.content{
  background-color: #fff;
  margin-bottom: 100rpx;
}
.introImg{
  margin-top: 20rpx;
  // height: 500px;
  background-color: #fff;
  display: flex;
  text{
    flex:1;
    display:flex;
    padding: 20rpx 0;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    &.active{
      border-bottom:5px solid #ff2d4a;
    }
  }
}
.csContent{
  padding: 20rpx 0 40rpx 0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  view{
    display: flex;
    margin: 0 20rpx;
    align-items: center;
    height: 100rpx;
    border: 1px solid #bbb;
    &:nth-child(2){
      border-top: 0px solid #bbb;
    }
    text{
      flex: 1;
      display: flex;
      align-items: center;
      color: #666;
      height: 100rpx;
      padding-left: 40rpx;
      &:nth-child(2n){
        border-left: 1px solid #bbb;
    }
    }
  }
}
// 底部区域
.footer{
  background-color: #ffffff;
  height: 100rpx;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  // z-index: 2;
  display: flex;
  flex-wrap: nowrap;
  .kefu{
    padding: 30rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text{
      margin-top: 5px;
      color: #333;
      font-size: 12px;
    }
  }
  .toCar{
    padding:0 45rpx;
    height: 100%;
    display: flex;
    background-color: rgb(232, 165, 3);
    align-items: center;
    font-size: 16px;
    color: #fff;
  }
  .payfor{
    flex: 1;
    height: 100%;
    display: flex;
    background-color: #ff2d4a;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #fff;
  }

}

</style>

