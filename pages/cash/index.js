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
      sellerId: "",
      channel: 1,
      amount: ""
    },
    totalAssets:0  // 可用金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        console.log(res.data);
      },
    })
    wx.getStorage({
      key: 'sellerId',
      success: function (res) {
        console.log(res.data);
      },
    })
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
    this.clearInput();
    console.log(typeof this.data)
    console.log(JSON.stringify(this.data))
    this.setData({
      'data.sellerId':app.sellerId
    })
    this.getAccount();
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
  goCashinfo: function(){
    wx.navigateTo({
      url: '../cashInfo/index'
    })
  },
  openConfirm: function () {
    wx.showModal({
      title: '警告',
      content: '确定删除改地址',
      confirmText: "是",
      cancelText: "否",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          console.log('删除成功')
        } else {
          console.log('取消删除')
        }
      }
    });
  },
  getMoney: function (e) {
    console.log('提现金额', e.detail.value)
    this.setData({
      'data.amount': e.detail.value
    });
    console.log(this.data.data);
  },
  getAccount: function(e){
    wx.showLoading({
      title: '',
    })
    var that = this;
    var url = urlBase + '/paycenter/balance/seller';
    console.log(url);
    ajax.get(url).then(function (data) {
      wx.hideLoading();
      console.log('商家余额： ' + JSON.stringify(data));
      var data = data.data;
      if (data.code === 0) {
        var balance = data.additional;
        that.setData({
          totalAssets: balance
        })
      }

    }).catch(function (status) {
      wx.hideLoading();
      console.log('获取可提现金额:' + status);
      oss.statusHandler(status);
    });
  },
  getCashAll: function(){
    var that = this;
    that.setData({
      'data.amount': that.data.totalAssets
    })
  },
  submitCash: function(e){
    var that = this;
    console.log(that.data.data.amount)
    var amount = that.data.data.amount;
    console.log(typeof amount)
    if (amount == "" || parseFloat(amount) == 0){
      wx.showToast({
        title: '金额不能为0！',
        image: '../../images/alert.png',
        duration: 2000
      })
    } else if (parseFloat(amount)<0){
      wx.showToast({
        title: '余额输入不正确',
        image: '../../images/alert.png',
        duration: 2000
      })
    } else if (parseFloat(amount) > parseFloat(that.data.totalAssets)){
      wx.showToast({
        title: '金额超出总金额',
        image: '../../images/alert.png',
        duration: 2000
      })
    } else{
      var content = '你确认提现' + amount + '元';
      wx.showModal({
        title: '提现提示',
        content: content,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            amount = parseFloat(amount);
            that.setData({
              'data.amount': amount
            })
              //  弹出确认体现框
            that.saveCash();

          } else if (res.cancel) {
            console.log('用户点击取消')

          }
        }
      })

    }
   
  },
  saveCash: function(){
    wx.showLoading({
      title: '',
    })
    var that = this;
    var json = that.data.data;
    console.log(json);
    var url = urlBase + '/mall/financial/cashadvance';
    console.log(url);
    ajax.post(url, json).then(function (data) {
      console.log(data);
      wx.hideLoading();
      var statusCode = data.statusCode;
      var data = data.data;
      if (data.code === 0) {
        wx.showToast({
          title: '提现申请成功',
          duration: 2000,
          success:function(){
            setTimeout(function(){
              that.clearInput();
              that.getAccount();
            },2000)
            
          }
        })
        
       
      } else if (data.code != 0 && statusCode == 200){
        wx.showToast({
          title: data.message,
          image: '../../images/alert.png',
          duration: 2000
        })
        
      }else{
        oss.statusHandler(statusCode);
      }

    }).catch(function (status) {
      wx.hideLoading();
      console.log('添加提现申请' + status)
      oss.statusHandler(status);
      wx.showToast({
        title: '请求超时',
        image: '../../images/alert.png',
        duration: 2000
      })
    })
  },
  clearInput: function(){
    this.setData({
      'data.amount':''
    })
  }

})

