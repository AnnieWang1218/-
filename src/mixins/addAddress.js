export default {
    data(){
        return {
            address:''
        }
    },
    methods: {
        //点击收货地址事件:授权只出现一次.地址确定之后才会到success.点否就是失败
        chooseAddress() {
            wx.chooseAddress({
                success: res => {
                    //拼接一个完整的地址
                    res.comAddress = `${res.provinceName}${res.cityName}${res.countyName}${res.detailInfo}`
                    this.address = res
                    //如果客户授权了,还需要将地址存储到本地.
                    wx.setStorageSync('address', res)
                },
                fail: (err) => {
                    console.log(err);
                    //返回的信息是这一段,就代表是客户拒绝了.需要提醒用户授权
                    if (err.errMsg === 'chooseAddress:fail auth deny') {
                        wx.showModal({
                            title: '提示',
                            content: '请去我的页面打开授权',
                            showCancel: false,
                            confirmText: '确定',
                            confirmColor: '#ff2d4a',
                            success: res => {
                                if (res.confirm) {
                                    console.log('1111');
                                    wx.switchTab({ url: '/pages/my/main' })
                                }
                            }
                        })
                    }
                }
            })
        }
    }
}