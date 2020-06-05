// miniprogram/pages/userDetail/userDetail.js
const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    isFriend: false,
    userData: {},
    havePhone: false,
    haveWxNumber: false
  },
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
  toLogin(){
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
  },
  applyForAddSomeone(){
    const appId = app.userInfo._id
    const userId = this.data.userData._id
    db
    .collection('message')
    .where({userId})
    .get()
    .then(result=>{
      if(result.data.length){ //更新
        if(result.data[0].list.indexOf(appId) >= 0){
          wx.showToast({
            title: '已申请',
          })
        }else{
          wx
          .cloud
          .callFunction({
            name: 'update',
            data: {
              collection: 'message',
              where: {userId},
              data: `{list: cmd.unshift('${appId}')}`
            }
          })
          .then(result=>{
            wx.showToast({
              title: '申请成功',
            })
          })
        }
      }else{ // 添加
        db
        .collection('message')
        .add({data: {userId,list: [appId]}})
        .then(result=>{
          wx.showToast({
            title: '申请成功',
          })
        })
      }
    })
  },
  addSomeone(){
    const appId = app.userInfo._id
    if(appId){
      this.applyForAddSomeone()
    }else{
      this.toLogin()  
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
})