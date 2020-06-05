// miniprogram/pages/user/user.js
const db = wx.cloud.database()
const app = getApp()
Page({
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
          createAt: new Date(),
          isLocation: true
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
    console.log(app.userInfo)
    db.collection('message').where({
      userId: app.userInfo._id
    }).watch({
      onChange: function(snapshot) { 
        const {list} = snapshot.docChanges[0].doc
        if(list.length){
          wx.showTabBarRedDot({
            index: 2
          })
          app.userMessage = [...list]
        }
      },
      onError: function(err) {
        console.error('no catch the message', err)
      }
    })
  },
  onLoad: function (options) {
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