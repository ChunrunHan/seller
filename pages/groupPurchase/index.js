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
    goods: [{ name: 'haha', url: '../login/index', icon: '../../images/logo.jpg', status: '已下架' }, { name: 'haha', url: '../login/index', icon: '../../images/logo.jpg', status: '已下架' }, { name: 'haha', url: '../login/index', icon: '../../images/logo.jpg', status: '已下架' }]

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
  goAdd: function(){
    wx.navigateTo({
      url: '../goodsAdd/index',
    })
  }

})

