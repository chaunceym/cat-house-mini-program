// components/removeList/removeList.js
const db = wx.cloud.database()

Component({
  /**
   * 组件的属性列表
   */
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {
    messageId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  lifetimes: {
    attached: function(){
      console.log(this.data.messageId)
      db.collection('users').doc(this.data.messageId).field({
        avatarUrl: true,
        nickName: true
      }).get().then(result=>{
        console.log(result)
        this.setData({
          userInfo: result.data
        })
      })
    }
  }
})
