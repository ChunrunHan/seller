var appInstance = getApp()
var ajax = require('../../utils/ajax');
console.log(appInstance.globalData) // I am global data

Page({
  data: {
    img: '../../images/logo.jpg',
    mobile: '',
    password: '',
    inputType: 'password',
    autoLogin: true,
    showPass: false

  },
  onLoad: function (options) {
    // Do some initialize when page load.

  },
  onReady: function () {
    // Do something when page ready.
  },
  onShow: function () {
    // Do something when page show.
  },
  onHide: function () {
    // Do something when page hide.
  },
  onUnload: function () {
    // Do something when page close.
  },
  onPullDownRefresh: function () {
    // Do something when pull down.
  },
  onReachBottom: function () {
    // Do something when page reach bottom.
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
  },
  onPageScroll: function () {
    // Do something when page scroll
  },
  // Event handler.
  viewTap: function () {
    this.setData({
      text: 'Set some data for updating view.'
    }, function () {
      // this is setData callback
      console.log()
    })
  },
  goIndex: function () {
    // ajax.get(url).then(function(data){

    // }).catch(function(status){
    //   wx.showToast({
    //     title: status,
    //     icon: 'success',
    //     duration: 2000
    //   })
    // })

    wx.navigateTo({
      url: '../index/index'
    })
  },
  clearMobile: function(){
    this.setData({
      mobile: ''
    })
  },
  showPassword: function(){
    console.log(this.data.inputType);
    if (this.data.inputType == 'password'){
      this.setData({
        inputType: 'text',
        showPass: true
      })
    }else{
      this.setData({
        inputType: 'password',
        showPass: false
      })
    }
  },
  customData: {
    hi: 'MINA'
  }
})