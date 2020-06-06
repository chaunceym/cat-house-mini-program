// components/removeList/removeList.js
const db = wx.cloud.database()
const app = getApp()
const cmd = db.command
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {
    messageId: String
  },
  data: {
    userInfo: {}
  },
  methods: {
    removeM(){
      db.collection('message').where({
        userId: app.userInfo._id
      }).get().then(result=>{
        const {list} = result.data[0]
        const newList = list.filter(element=>element !== this.data.messageId)
        wx.cloud.callFunction({
          name: 'update',
          data: {
            collection: 'message',
            where: {
              userId: app.userInfo._id
            },
            data: {
              list: newList
            }
          }
        }).then(result=>{
          this.triggerEvent('myevent', newList)
        })
      })
    },
    removeMessage(){
      wx.showModal({
        title: '提示',
        content: '确认删除?',
        success: res => {
          if (res.confirm) {
            this.removeM()
          }
        }
      })
    },
    agreeMessage(){
      db.collection('users').doc(app.userInfo._id).update({
        data: {
          friendsList: cmd.unshift(this.data.messageId)
        }
      }).then(result=>{
        wx.cloud.callFunction({
          name: 'update',
          data: {
            collection: 'users',
            doc: this.data.messageId,
            data: `{friendsList: cmd.unshift('${app.userInfo._id}')}`
          }
        }).then(result=>{
          this.removeM()
        })
      })
    }
  },
  lifetimes: {
    attached: function(){
      db.collection('users').doc(this.data.messageId).field({
        avatarUrl: true,
        nickName: true
      }).get().then(result=>{
        this.setData({
          userInfo: result.data
        })
      })
    }
  }
})
