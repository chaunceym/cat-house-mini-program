// miniprogram/pages/message/message.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userMessage: [],
    hasMessage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
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
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})