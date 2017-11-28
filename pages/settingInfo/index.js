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
    list: [{ name: '修改密码', url: '', icon: '../../images/passwd.png', url: '../password/index' }, { name: '修改手机号', url: '', icon: '../../images/phone.png', url: '../mobile/index' }]

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
  clearStorage: function(e){
    console.log('清除所有');
    var that = this;
    var index = e.currentTarget.id;
    console.log(typeof index);
    if(parseInt(index)){
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

