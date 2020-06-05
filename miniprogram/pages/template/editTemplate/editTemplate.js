// miniprogram/pages/template/editTemplate/editTemplate.js
const app = getApp()
const db = wx.cloud.database()
const editTypes = {
  avatar: 'avatarUrl',
  nickname: 'nickName',
  phone: 'phone',
  weixin: 'wxNumber',
  signature: 'signature',
  location: 'isLocation'
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editType: '',
    inputValue: '',
    toLocationTemplate: false,
    toAvatarTemplate: false,
    toTextTemplate: false
  },
  getInputValue(event){
    this.setData({
      inputValue: event.detail.value
    })
  },
  updateAvatar(){
    const {editType,inputValue} = this.data
    wx.showLoading({
      title: '上传中'
    })
    const cloudPath = `userAvator/${app.userInfo._openid}${Date.now()}.jpg`
    wx.cloud.uploadFile({
      cloudPath, // 上传至云端的路径
      filePath: this.data.inputValue, // 小程序临时文件路径
    }).then(result=>{
      const fileId = result.fileID
      db.collection('users').doc(app.userInfo._id).update({
        data:{
          [editType]: inputValue
        }
      }).then(result=>{
        console.log(result)
        wx.hideLoading()
        wx.showToast({
          title: '上传成功'
        })
        app.userInfo[editType] = inputValue
      })
    })
  },
  updateText(){
    const {editType,inputValue} = this.data
    wx.showLoading({
      title: '更新中',
    })
    db.collection('users').doc(app.userInfo._id).update({
      data:{
        [editType]: inputValue
      }
    }).then(result=>{
      wx.hideLoading()
      wx.showToast({
        title: '更新成功'
      })
      app.userInfo[editType] = inputValue
    })
  },
  submitInputValue(event){
    const {editType} = this.data
    if(editType === 'avatarUrl'){
      this.updateAvatar()
    }else{
      this.updateText()
    }
  },
  toggleAvatar(){
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (result)=> {
        console.log(result)
        // tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          inputValue: result.tempFilePaths[0]
        })
      }
    })
  },
  switchChange(event){
    this.setData({
      inputValue: event.detail.value
    })
    const {editType,inputValue} = this.data
    db.collection('users').doc(app.userInfo._id).update({
      data:{
        [editType]: inputValue
      }
    }).then(result=>{
      console.log(result)
      app.userInfo[editType] = inputValue
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const inputOldValueKey = editTypes[options.type]
    this.setData({
      editType: editTypes[options.type],
      inputValue: app.userInfo[inputOldValueKey]
    })
    if(this.data.editType === 'isLocation'){
      this.setData({
        toLocationTemplate: true
      })
    }else if(this.data.editType === 'avatarUrl'){
      this.setData({
        toAvatarTemplate: true
      })
    }else{
      this.setData({
        toTextTemplate: true
      })
    }
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
})