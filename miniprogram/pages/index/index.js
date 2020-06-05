// miniprogram/pages/index/index.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: [
      '../../images/swiper_images/blue.png',
      '../../images/swiper_images/blue2.png'
    ],
    userList: []
  },
  favorLinks(event){
    const {id} = event.currentTarget.dataset
    wx.cloud.callFunction({
      name: 'update',
      data: {
        collection: 'users',
        doc: id,
        data: `{favor: cmd.inc(1)}`
      }
    }).then(result=>{
      const cloneUserList = JSON.parse(JSON.stringify(this.data.userList))
      console.log(result)
      if(result.result.stats.updated){
        for(let i=0; i<cloneUserList.length; i++){
          if(cloneUserList[i]._id === id){
            cloneUserList[i].favor++
          }
        }
        this.setData({
          userList: cloneUserList
        })
      }
      
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('users').field({
      avatarUrl: true,
      nickName: true,
      favor: true
    }).get().then(result=>{
      this.setData({
        userList: result.data
      })
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