// miniprogram/pages/user/user.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isLogin: false,
    disabled: true
  },
  bindGetUserInfo(event){
    const userInfo = event.detail.userInfo
    if(!this.data.isLogin && userInfo){
      db.collection('users').add({
        data: {
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          signature: '',
          phone: '',
          favor: 0,
          wxNumber: '',
          createAt: new Date()
        }
      }).then(result=>{
        db.collection('users').doc(result._id).get().then(result=>{
          app.userInfo = JSON.parse(JSON.stringify(result.data)) 
          this.setData({
            userInfo: app.userInfo,
            isLogin: true
          })
        })
      })
    }
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
    wx.cloud.callFunction({
      name: 'login',
      data:{}
    }).then(result=>{
      db.collection('users').where({
        _openid: result.result.openid
      }).get().then(result=>{
        if(result.data.length === 0){
          this.setData({
            disabled: false
          })
          return
        }
        app.userInfo = JSON.parse(JSON.stringify(result.data[0]))
        this.setData({
          userInfo: app.userInfo,
          isLogin: true
        })
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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