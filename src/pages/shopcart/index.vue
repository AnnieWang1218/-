<template>
  <div>
    <view v-if="isEmpty" class="empty">
        <img src="../../../static/img/kong.png" alt="">
        <text style="color:#666;font-size:12px;">购物车还是空的</text>
        <text style="color:#999;font-size:10px;">快去逛逛吧</text>
    </view>
    <view v-else>
      <!-- 商店名称 -->
      <view class="title">
        <view class="iconfont icon-dianpu"></view>
        <text>品优购生活馆</text>
      </view>
      <!-- 购物车商品详情 -->
      <view class="goods">
        <view class="good" v-for="(item,index) in localGoodsList" :key="index">
          <view @click="sel(index)" :class="['sels',item.isSel?'activeSel':'sel']"></view>
          <view class="pic">
            <img :src="item.goods_small_logo" alt>
          </view>
          <view class="goodsIntr">
            <view class="intr">{{item.goods_name}}</view>
            <view class="price">¥&nbsp;{{item.goods_price}}</view>
            <view>
              <view class="nums">
                <view class="num">
                  <text
                    @click="minus(item)"
                    class="jian"
                    :style="{color:item.goods_num<=1?'#ccc':'#222'}"
                  >-</text>
                  <text class="resul">{{item.goods_num}}</text>
                  <text class="add" @click="add(item)">+</text>
                </view>
                <text @click="del(index,item)" class="del">|&nbsp;删除</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 底部结算栏 -->
      <view class="footer">
        <!-- 全选 -->
        <view class="allSel" @click="allSel">
          <view :class="[isAllSel?'activeSel':'sel']"></view>
          <text>全选</text>
        </view>
        <!-- 运费 -->
        <view class="sum">
          <view class="total">
            合计:
            <text>¥ {{getAllMoney}}</text>
          </view>
          <view class="yunfei">包含运费</view>
        </view>
        <!-- 去结算 -->
        <view class="pay" @click='topay'>去结算 ({{getsum}})</view>
      </view>
    </view>
  </div>
</template>
<script>
import {
  getLocalGoods,
  minusGoods,
  addGood,
  delGoods
} from "../common/shopcarStorage";
export default {
  data() {
    return {
      localGoodsList: [],
      isAllSel: true,
      isEmpty:true
    };
  },
  //计算属性
  computed: {
    //得到合计金额
    getAllMoney() {
      let sumcount = 0;
      this.localGoodsList.forEach(item => {
          if(item.isSel){
            sumcount += item.goods_num * item.goods_price;
          }
      });
      return sumcount;
    },
    //得到合计数量
    getsum() {
      let count = 0;
      this.localGoodsList.forEach(item => {
          if(item.isSel){
              count += item.goods_num;
          }
      });
      return count;
    }
  },
  // 购物车商品显示需要在onshow中,因为onload只要页面未清除,只会加载一次
  onShow() {
    this.getLocalGoodsData();
  },
  methods: {
    //获取保存在本地的商品数据
    //获取本地存储的数据,发送网络请求,获取数据
    async getLocalGoodsData() {
      let localGoods = getLocalGoods();
      console.log(localGoods);
      let localArr = Object.keys(localGoods);
      if(localArr.length===0){
          this.isEmpty = true
          return
      }
      this.isEmpty = false
      let res = await this.$axios.get(
        `goods/goodslist?goods_ids=${localArr.join(",")}`
      );
      //给每一项加上对应的数量
      res.data.message.forEach(item => {
        item.goods_num = localGoods[item.goods_id];
        item.isSel = true;
      });
      this.localGoodsList = res.data.message;
      console.log(this.localGoodsList);
    },
    //全选及全不选
    allSel() {
      this.isAllSel = !this.isAllSel;
      this.localGoodsList.forEach(item => {
        item.isSel = this.isAllSel;
      });
    },
    //单个商品选中及不选中
    sel(index) {
      this.localGoodsList[index].isSel = !this.localGoodsList[index].isSel;
      // 利用开关思想,进行判断全选以及全不选
      let allsel = true;
      //利用数组的some方法.foreach没办法进行中途跳出
      this.localGoodsList.some(item => {
        if (!item.isSel) {
          allsel = false;
          return true;
        }
      });
      this.isAllSel = allsel;
    },
    //商品减
    minus(item) {
      this.localGoodsList.forEach((item1, index) => {
        if (item.goods_id === item1.goods_id) {
          item1.goods_num--;
          if (item1.goods_num === 0) {
            this.localGoodsList.splice(index, 1);
          }
        }
      });
      minusGoods(item);
    },
    //商品加
    add(item) {
      this.localGoodsList.forEach((item1, index) => {
        if (item.goods_id === item1.goods_id) {
          item1.goods_num++;
        }
      });
      addGood(item);
    },
    //删除商品
    del(index, item) {
      wx.showModal({
        title: "提示", //提示的标题,
        content: "请确认是否删除", //提示的内容,
        showCancel: true, //是否显示取消按钮,
        cancelText: "取消", //取消按钮的文字，默认为取消，最多 4 个字符,
        cancelColor: "#000000", //取消按钮的文字颜色,
        confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: "#3CC51F", //确定按钮的文字颜色,
        success: res => {
          if (res.confirm) {
            this.localGoodsList.forEach((item2, index2) => {
              if (index === index2) {
                this.localGoodsList.splice(index, 1);
              }
            });
            delGoods(item);
          }
        }
      });
    },
    //去结算
    topay(){
        let ids = []
        this.localGoodsList.forEach(item=>{
            if(item.isSel){
                ids.push(item.goods_id)
            }
        })
        if(ids.length===0){
            wx.showToast({
              title: '请选择商品再进行结算', //提示的内容,
              icon: 'none', //图标,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
            return
        }
        wx.navigateTo({ url: `/pages/pay/main?ids=${ids.join(',')}`});
    }
  }
};
</script>
<style lang='less' scoped>
.empty{
    margin-top: 150rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img{
        width: 70px;
        height: 70px;
    }
    text{
        margin-top: 30rpx;
    }

}
.title {
  display: flex;
  padding: 20rpx 0 20rpx 20rpx;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  text {
    color: #bbb;
    margin-left: 20rpx;
    font-size: 12px;
  }
}
.goods {
  .good {
    padding: 20rpx 0;
    border-top: 1px solid #eee;
    background-color: #fff;
    display: flex;
    align-items: center;
    .sels {
      width: 55rpx;
      height: 55rpx;
      margin: 0 10rpx;
      background: url(https://mcart.jiuxian.com/statics/images/cart/catIcon.png)
        no-repeat;
      // background-position: 0 -230rpx;
      // 将整体的图片大小缩小一倍,图片本身就会缩小一倍去适应盒子
      background-size: 300rpx 300rpx;
      &.activeSel {
        background-position: 0 -230rpx;
      }
      &.sel {
        background-position: -48rpx -230rpx;
      }
    }
    .pic {
      width: 210rpx;
      height: 210rpx;
      border: 1px solid #ccc;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .goodsIntr {
      flex: 1;
      margin: 0 20rpx;
      display: flex;
      flex-direction: column;
      .intr {
        font-size: 12px;
      }
      .price {
        margin-top: 10rpx;
        color: rgb(255, 45, 74);
        font-size: 14px;
      }
      .nums {
        margin-top: 10rpx;
        display: flex;
        justify-content: space-between;
        .num {
          display: flex;
          text {
            display: flex;
            justify-content: center;
            align-items: center;
            &.add {
              padding: 6rpx 15rpx;
              border: 1px solid #ccc;
            }
            &.jian {
              padding: 6rpx 15rpx;
              border: 1px solid #ccc;
            }
            &.resul {
              border-top: 1px solid #ccc;
              border-bottom: 1px solid #ccc;
              padding: 6rpx 25rpx;
              font-size: 10px;
            }
          }
        }
        .del {
          color: #666;
          font-size: 12px;
        }
      }
    }
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  display: flex;
  height: 100rpx;
  justify-content: space-between;
  align-items: center;
  color: #666;
  .allSel {
    margin: 0 80rpx 0 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    view {
      width: 55rpx;
      height: 55rpx;
      background: url(https://mcart.jiuxian.com/statics/images/cart/catIcon.png)
        no-repeat;
      // background-position: 0 -230rpx;
      // 将整体的图片大小缩小一倍,图片本身就会缩小一倍去适应盒子
      background-size: 300rpx 300rpx;
      &.activeSel {
        background-position: 0 -230rpx;
      }
      &.sel {
        background-position: -48rpx -230rpx;
      }
    }
    text {
      margin-left: 5rpx;
      font-size: 12px;
    }
  }
  .sum {
    flex: 2;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    view {
      margin-bottom: 10rpx;
      text {
        color: rgb(255, 45, 74);
      }
    }
  }
  .pay {
    font-size: 14px;
    height: 100%;
    width: 200rpx;
    background-color: rgb(255, 45, 74);
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>