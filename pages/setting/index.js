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
    list: [{ name: '账号管理', url: '', icon: '../../images/user.png', optype: 'navigate',url: '../settingInfo/index' }, { name: '商家信息', url: '', icon: '../../images/seller.png', optype: 'navigate',url:'../sellerInfo/index' }],
    listTwo: [{ name: '版本号', url: '', icon: '../../images/version.png', version: '1.0.21' }, { name: '注销', url: '../login/index', icon: '../../images/restart.png'  }]

  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    console.log('全局图片' + app.globalData.addPhoto);
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
  clearStorage: function(e){
    console.log('清除所有');
    var that = this;
    var index = e.currentTarget.id;
    console.log(typeof index);
    wx.hideLoading();
    if(parseInt(index)){
      wx.showLoading({
        title: '',
      })
    //  注销
      try {
        wx.clearStorageSync()
        wx.reLaunch({
          url: '../login/index',
        })
      } catch (e) {
       
      }
     
    }else{
    //  版本号
    }
  }

})

