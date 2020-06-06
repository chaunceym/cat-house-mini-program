// miniprogram/pages/message/message.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    userMessage: [],
    hasMessage: false
  },
  onMyEvent(e){
    this.setData({
      userMessage: []
    },()=>{
      this.setData({
        userMessage: e.detail
      })
    })
    if(!e.detail.length){
      wx.hideTabBarRedDot({
        index: 2,
      })
      this.setData({
        hasMessage: false
      })
    }
    app.userMessage = [...e.detail]
  },
  onShow: function () {
    if(app.userInfo._id){
      if(app.userMessage.length){
        this.setData({
          hasMessage: true,
          userMessage: app.userMessage
        })
      }
    }else{
      wx.showModal({
        title: '提示',
        content: '请登录账号',
        success (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/user/user'
            })
          } else if (res.cancel) {
            return
          }
        }
      })
    }
  }
})