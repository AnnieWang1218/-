<template>
  <div>
    <view class="top">
      <view v-if="address" class="address">
          <view class="name">
              <text>收货人: {{address.userName}}</text><text>{{address.telNumber}}</text>
          </view>
          <view class="takeGoods">
              <text>收货地址: {{address.comAddress}}</text>
          </view>
      </view>
      <view @click='chooseAddress'  v-else class="newaddress">
        <view>+ 新增地址</view>
      </view>
    </view>
    <view class="content">
        <img src="../../../static/img/cart_border@2x.png" alt>
        <view class="goods" v-for="item in goodsList" :key='item.goods_id'>
            <view class="img">
                <img :src="item.goods_small_logo" alt="">
            </view>
            <view class="con">
                <view class="name">{{item.goods_name}}</view>
                <view class="pri">
                    <text class="price">¥ {{item.goods_price}}</text>
                    <text class="num">x {{item.goods_num}}</text>
                </view>
            </view>
        </view>
    </view>
  </div>
</template>
<script>
import {getLocalGoods} from '../common/shopcarStorage'
import chooseAddress from '../../mixins/addAddress'
export default {
    mixins: [chooseAddress],
    data(){
        return {
            goodsList:[],
        }
    },
    onLoad(options){
        //options 地址栏的参数
        console.log(options);
        //获取数据,渲染页面
        this.getGoodsListData(options.ids)
        //获取本地地址.并赋值给address
        if(wx.getStorageSync('address')){
            this.address=wx.getStorageSync('address')
        }
        console.log(this.address);

    },
    methods:{
        //获取商品数据
        async getGoodsListData(ids){
            let localGoods = getLocalGoods()
            console.log(localGoods);
            let res = await this.$axios.get(`goods/goodslist?goods_ids=${ids}`)
            console.log(res);
            res.data.message.forEach(item=>{
                item.goods_num = localGoods[item.goods_id]
            })
            this.goodsList = res.data.message
        }
    }
}
</script>
<style lang='less' scoped>
.top {
    background-color: #fff;
    height: 230rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  .newaddress {
    height: 100rpx;
    width: 360rpx;
    background-color: #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    view {
      font-size: 12px;
    }
  }
  .address{
      margin: 0 40rpx;
      display: flex;
      width: 100%;
      height: 100%;
      flex-direction: column;
      .name{
          flex:1;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .takeGoods{
            flex:1;
            display: flex;
            align-items: center;
        }
      text{
          font-size: 12px;
      }
  }
}

.content {
    background-color: #fff;
    img{
        height: 10rpx;
        width: 100%;
    }
    .goods{
        margin-top: 10rpx;
        display: flex;
        border-top: 1px solid #ccc;
        .img{
            width: 200rpx;
            height: 200rpx;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .con{
            flex:1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin: 0 30rpx;
            .name{
                font-size: 14px;
            }
            .pri {
                display: flex;
                justify-content: space-between;
                .price{
                    font-size: 18px;
                    color: rgb(255, 45, 74);
                    font-weight: 600;
                }
                .num{
                    color: #666;
                    font-size: 18px;
                }
            }
        }
    }
}
</style>