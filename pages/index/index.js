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
    img: '../../images/logo.jpg',
    money: 1000,
    store: '果果快运',
    grids: [{ name: '团购管理', src: '../../images/tg.png', url: '../groupPurchase/index?title=团购管理' }, { name: '订单管理', src: '../../images/dd.png', url: '../orderList/index' }, { name: '商家提现', src: '../../images/sales.png', url: '../cash/index'}, { name: '基本设置', src: '../../images/sz.png',url: '../setting/index' }, { name: '意见反馈', src: '../../images/yj.png',url:'../feedback/index' }, { name: '联系我们', src: '../../images/lx.png',url: '../about/index' }],
    yesterday: '--',
    today: '--',
    all: '--'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(app.realname);
    this.setData({
      store: app.realName
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //  获取商家收入0 : 所有 1：昨天 2：今天
    this.getSellerMoney(1);
    this.getSellerMoney(2);
    this.getSellerMoney(0);

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '乐拼青岛，趁年轻就要拼。',
      path: '/pages/login/index',
      success: function (res) {
        wx.showToast({
          title: '转发成功',
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败',
        })
      }
    }

  },
  getSellerMoney: function(day){
    var that = this;
    var url = urlBase + '/mall/financial/seller/income/' + app.sellerId +'/'+ day;
    console.log(url);
    ajax.get(url).then(function (data) {
      wx.hideLoading();
      console.log(data);
      console.log(JSON.stringify(data));
      var statusCode = data.statusCode;
      var data = data.data;
      if (data.errCode == 0) {
        if (day == 0){
          that.setData({
            all :data.data
          })
        }else if(day == 1){
          that.setData({
            yesterday: data.data
          })
        }else if(day == 2){
          that.setData({
            today: data.data
          })
        }

   

        

      } else if (statusCode == 200 && data.errCode != 0) {
        wx.showToast({
          title: data.errMsg,
          image: '../../images/alert.png',
          duration: 2000
        })
      } else {
        console.log('失败')
        oss.statusHandler(statusCode)
      }

    }).catch(function (status) {
      wx.hideLoading();
      console.log(status.errMsg);
      wx.showToast({
        title: '请求超时',
        image: '../../images/alert.png',
        duration: 2000
      })
    })
  }
  
})

