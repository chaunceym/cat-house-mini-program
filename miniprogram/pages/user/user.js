// miniprogram/pages/user/user.js
const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    userInfo: {},
    isLogin: false,
    disabled: true
  },
  getLocation(){
    wx.getLocation({
      type: 'gcj02 ',
      success: (res)=> {
        this.latitude = res.latitude
        this.longitude = res.longitude
      }
     })
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
          createAt: new Date(),
          isLocation: true,
          latitude: this.latitude,
          longitude: this.longitude,
          location: db.Geo.Point(this.longitude,this.latitude),
          friendsList: [],
          pets: ''
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
  getMessage(){
    db.collection('message').where({
      userId: app.userInfo._id
    }).watch({
      onChange: function(snapshot) {
        if(snapshot.docChanges.length !== 0){
          const list = snapshot.docChanges[0].doc.list
          if(list.length){
            wx.showTabBarRedDot({
              index: 2
            })
            app.userMessage = [...list]
          }else{
            wx.hideTabBarRedDot({
              index: 2,
            })
          }
        }
      },
      onError: function(err) {
        console.error('no catch the message', err)
      }
    })
  },
  onLoad: function (options) {
    this.getLocation()
    wx.cloud.callFunction({
      name: 'login',
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
        this.getMessage()
      })
    })
  },
})