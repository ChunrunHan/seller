//index.js
var app = getApp()
var device = wx.getSystemInfoSync()
console.log(device.windowHeight);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    boxHeight: device.windowHeight - 80,
    list: [{ name: '服务热线', icon: '../../images/call.png', content: '13361213969' }, { name: '客服邮箱', icon: '../../images/email.png', content: 'service@yezhubao.net' }, { name: '微信公众号', icon: '../../images/wx.png', content: '小区业主宝' }]

  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.title);
   
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
    // 清除所有图片
    app.globalData.addPhoto = [];
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
    console.log('下拉');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  scrolltoupper: function () {
    console.log('滚动到顶部触发');
  },
  scrolltolower: function () {
    console.log('滚动到底部触发');
  },
  callMobile: function(e){
    console.log(e.currentTarget.id);
    if (e.currentTarget.id == '0'){
      console.log('拨打打电话');
      wx.makePhoneCall({
        phoneNumber: '13361213969' //仅为示例，并非真实的电话号码
      })
    }
  }

})

