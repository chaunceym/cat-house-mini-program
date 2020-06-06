// components/search/search.js
const app = getApp()
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isCancel: false,
    inputValue: '',
    isFocus: false,
    searchHistory: [],
    usersList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getInputValue(event){
      const inputValue = event.detail.value
      if(inputValue){
        this.setData({
          isCancel: true,
          inputValue
        })
      }
    },
    exitSearch(){
      this.setData({
        isFocus: false
      })
      const detail= {
        isFocus: false
      }
      this.triggerEvent('myevent', detail)
    },
    toFocus(event){
      wx.getStorage({
        key: 'searchHistory',
        success: (result)=>{
          const {data} = result
          if(data){
            this.setData({
              searchHistory: data
            })
          }
        }
      })
      this.setData({
        isFocus: true
      })
      const detail= {
        isFocus: true
      }
      this.triggerEvent('myevent', detail)
    },
    confirmSearch(event){
      const {value} = event.detail
      let cloneSearchHistory = [...this.data.searchHistory]
      cloneSearchHistory.unshift(value)
      wx.setStorage({
        data: [...new Set(cloneSearchHistory)],
        key: 'searchHistory',
      })
      this.searchUserByKeywords(value)
    },
    removeStorage(){
      wx.removeStorage({
        key: 'searchHistory',
        success: () => {
          this.setData({
            searchHistory: []
          })
        }
      })
    },
    clearInputValue(){
      this.setData({
        inputValue: '',
        isCancel: false
      })
    },
    searchUserByKeywords(keyword){
      db.collection('users').where({
        nickName: db.RegExp({
          regexp: keyword,
          options: 'i'
        })
      }).field({
        nickName: true,
        avatarUrl: true
      }).get().then(result=>{
        this.setData({
          usersList: result.data
        })
      })
    },
    searchUserByHistory(event){
      const {text} = event.target.dataset
      this.setData({
        inputValue: text,
        isCancel: true
      })
      this.searchUserByKeywords(text)
    }
  }
})
