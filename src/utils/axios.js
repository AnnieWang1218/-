import Vue from 'vue'
import axios from 'axios'
//配置基准路径
axios.defaults.baseURL = 'https://www.zhengzhicheng.cn/api/public/v1/'
//适配器:修改axios 的底层(默认情况axios 的底层采用的是ajax发送异步请求.但是这种适用于浏览器.小程序端,需要用到wx.request发送请求)
// 发送请求的过程,会先到拦截器---适配器之后再发送请求
axios.defaults.adapter=function(config){
    // console.log(config);
    // 返回一个promise对象,可以用同步的方式使用
    return new Promise((resolve,reject)=>{
        //每个页面需要加载数据,因为数据是异步的,所以,需要有一个数据加载中的提示,并且.数据加载完毕就消失
        wx.showLoading({
            title: '正在加载中...',
          })
        mpvue.request({
            method:config.method,
            url:config.url,
            data:config.url,
            success(res){
                resolve(res)
            },
            fail:(err)=>{
                reject(err)
            },
            complete(){
                wx.hideLoading()
            }
        })
    })


}
Vue.prototype.$axios = axios

export default axios