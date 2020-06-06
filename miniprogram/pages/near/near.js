// miniprogram/pages/near/near.js
const app = getApp()
const db = wx.cloud.database()
const cmd = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '',
    latitude: '',
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getLoaction(){
      wx.getLocation({
        type: 'gcj02 ',
        success: (res)=> {
          const latitude = res.latitude
          const longitude = res.longitude
          this.setData({longitude,latitude})
          db
          .collection('users')
          .doc(app.userInfo._id)
          .update({data:{latitude,longitude,location:[longitude,latitude]}})
          .then(result=>{})
          this.getGeo()
        }
       })   
  },
  markerTap(event){
   const id = event.markerId
   wx.navigateTo({
     url: `/pages/userDetail/userDetail?id=${id}`,
   })
  },
  getGeo(){
db.collection('users').where({
  location: cmd.geoNear({
    geometry: db.Geo.Point(this.data.longitude,this.data.latitude),
    minDistance: 0,
    maxDistance: 5000,
  }),
  isLocation: true
}).field({
  longitude: true,
  latitude: true,
  avatarUrl: true
}).get().then(result=>{
  const {data} = result
  let geoInfo = []
  if(data.length){
    for(let i=0;i<data.length;i++){
      geoInfo.push({
        iconPath: data[i].avatarUrl,
        id: data[i]._id,
        latitude: data[i].latitude,
        longitude: data[i].longitude,
        width: 40,
        height: 40
      })
    }
    this.setData({
      markers: geoInfo
    })
  }
})
  },
  onLoad: function (options) {
    this.getLoaction()
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
    this.getLoaction()
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