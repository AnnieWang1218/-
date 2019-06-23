import { log } from "util";

//处理购物车里的数据

//定义key值
const key = 'Goods'


//获取本地存储的数据
export const getLocalGoods = ()=>{
    return wx.getStorageSync(key) || {}
}

//添加购物车
export const addGoods = (goods)=>{
    //取出本地数据,在本地数据的基础上++
    const localGoods = getLocalGoods()
    console.log(localGoods);
    //进行判断:如果商品id存在本地存储中,就取出值加上传进来的数量值.如果不在,就将id与数量存入本地存储中
    if(localGoods[goods.goods_id]){
        localGoods[goods.goods_id] += goods.goods_num
    }else{
        localGoods[goods.goods_id] = goods.goods_num
    }
    //将最终的结果存入本地中
    wx.setStorageSync(key,localGoods)
}
//商品加
export const addGood = (goods)=>{
    //取出本地数据,在本地数据的基础上++
    const localGoods = getLocalGoods()
    console.log(localGoods);
    //进行判断:如果商品id存在本地存储中,就取出值加上传进来的数量值.如果不在,就将id与数量存入本地存储中
    if(localGoods[goods.goods_id]){
        localGoods[goods.goods_id] ++
    }
    //将最终的结果存入本地中
    wx.setStorageSync(key,localGoods)
}
//商品减
export const minusGoods = (goods)=>{
       //取出本地数据,在本地数据的基础上++
       const localGoods = getLocalGoods()
       console.log(localGoods);
       //进行判断:如果商品id存在本地存储中,就取出值加上传进来的数量值.如果不在,就将id与数量存入本地存储中
       if(localGoods[goods.goods_id]){
           localGoods[goods.goods_id] --
       }
       if(localGoods[goods.goods_id]===0){
           delete localGoods[goods.goods_id]
       }
       //将最终的结果存入本地中
       wx.setStorageSync(key,localGoods)
}
//删除
 export const delGoods = (goods)=>{
    const localGoods = getLocalGoods()
    delete localGoods[goods.goods_id]
    wx.setStorageSync(key,localGoods)
 }