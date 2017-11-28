//index.js
var app = getApp()
var ajax = require('../../utils/ajax');
var oss = require('../../utils/oss');
var urlBase = app.urlBase;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: {
     name: '',
     phone: '',
     content: ''
    },
    memoLength:0
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
    console.log(typeof this.data)
    console.log(JSON.stringify(this.data))
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // app.globalData.addPhoto = [];
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // app.globalData.addPhoto = [];
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
  getMemo: function (e) {
    console.log(e.detail.value.length);
    this.setData({
      memoLength: e.detail.value.length,
      'data.content': e.detail.value
    });
    console.log(JSON.stringify(this.data));
  },
  getName: function (e) {
    console.log(e.detail.value);
    this.setData({
      'data.name': e.detail.value
    })
    console.log(JSON.stringify(this.data));
  },
  getMobile: function (e) {
    console.log(e.detail.value);
    this.setData({
      'data.phone': e.detail.value
    })
    console.log(JSON.stringify(this.data));
  },
  submitInfo: function (e) {
    var that = this;
    var data = this.data.data;
    console.log(JSON.stringify(data));
    if (data.name == '' || data.phone == '' || data.content == '') {
      wx.showModal({
        title: '注意',
        content: '意见反馈所有项为必填项',
      })
    } else {
      if(oss.checkMobile(data.phone)){
        console.log('上传的数据' + JSON.stringify(that.data.data));
        that.submitFeedback();

      }
     

    }
  },
  submitFeedback: function(){
    var that = this;
    wx.showLoading({
      title: '提交中',
    })
    var url = urlBase + '/mall/feedback';
    ajax.post(url, that.data.data).then(function (data) {
      wx.hideLoading();
      console.log(data);
      console.log(JSON.stringify(data));
      if (data.data.code == 0) {
        wx.showToast({
          title: '提交成功',
          duration: 2000,
          success:function(){
            setTimeout(function(){
              wx.navigateBack({
                url: '../index/index'
              })
            },2000)
            
          }
        })
        
      } else {
        wx.showToast({
          title: '提交失败',
          image: '../../images/alert.png',
          duration: 2000
        })
      }

    }).catch(function (status) {
      wx.hideLoading();
      console.log(status.errMsg);
      wx.showToast({
        title: '请求超时',
        image: '../../images/alert.png',
        duration: 2000
      })
    });
  }




})

