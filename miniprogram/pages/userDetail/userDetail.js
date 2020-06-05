// miniprogram/pages/userDetail/userDetail.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFriend: false,
    userData: {},
    havePhone: false,
    haveWxNumber: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  callSomeone(){
    wx.makePhoneCall({
      phoneNumber: this.data.userData.phone
    })
  },
  copyWxNumber(){
    wx.setClipboardData({
      data: this.data.userData.wxNumber
    }).then(result=>{
      wx.showToast({
        title: '复制成功'
      })
    })
  },
  addSomeone(){
    console.log(app.userInfo._id)

    if(app.userInfo._id){
      db.collection('message').add({
        data: {
          userId: this.data.userData._id,
          list: [app.userInfo._id]
        }
      }).then(result=>{
        wx.showToast({
          title: '申请成功'
        })
      })
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
  onLoad: function (options) {
    const id = options.id
    db.collection('users').doc(id).get().then(result=>{
      this.setData({
        userData: result.data
      })
      if(result.data.phone !== ''){
        this.setData({
          havePhone: true
        })
      }
      if(result.data.wxNumber !== ''){
        this.setData({
          haveWxNumber: true
        })
      }
    })
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