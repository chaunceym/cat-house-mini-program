// components/search/search.js
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
    inputValue: ''
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
    clearInputValue(){
      this.setData({
        inputValue: '',
        isCancel: false
      })
    }
  }
})
