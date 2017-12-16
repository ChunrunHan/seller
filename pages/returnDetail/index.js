//index.js
var app = getApp()
var ajax = require('../../utils/ajax');
var urlBase = app.urlBase;
var oss = require('../../utils/oss');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    reason:'',
    amount:'',
    time:'',
    agree: true,
    reject: true
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   console.log(options);
   var orderId = options.orderId;
   this.getOrderDetail(orderId);
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
    var that = this;
 
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
  previewImage: function (e) {
    var imgs = this.data.files;
    console.log(this.data.files)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },
  getOrderDetail: function(id){
    var that = this;
    wx.showLoading();
    console.log(id);
    var url = `${urlBase}/mall/order/refund_list/${id}`;
    console.log(url);
    ajax.get(url).then(function (data) {
      wx.hideLoading();
      console.log(JSON.stringify(data));
      var statusCode = data.statusCode;
      var dataList = data.data;
      if (dataList.errCode == 0) {
        that.setData({
          time: dataList.dataList[0].time,
          reason: dataList.dataList[0].reason,
          amount: dataList.dataList[0].amount
        })
        var imgs = dataList.dataList[0].images.split(':');
        var imgURL = [];
        for (var i = 0; i < imgs.length; i++) {
          var a = `https://dev.yezhubao.net/oss_mall/${app.bucket}/${imgs[i]}`;
          console.log(a)
          imgURL.push(a)
        }
        that.setData({
          files: imgURL
        })
      }
    }).catch(function (status) {
      console.log(status)
      oss.statusHandler(status);
      console.log(status)
    })
  },
  hiddenMask: function(e){
    var that = this;
    console.log(e.target.id);
    console.log(typeof e.target.id)
    var status = e.target.id;
    if(parseInt(status)){
      console.log('确认退款')
      that.setData({
        agree: true
      })
    }else{
      console.log('拒绝退款')
      that.setData({
        reject: true
      })
    }
  },
  dealReturn: function(e){
    var that = this;
    console.log(e.target.id);
    console.log(typeof e.target.id)
    var status = e.target.id;
    if (parseInt(status)) {
      console.log('确认退款')
      that.setData({
        agree: false
      })
    } else {
      console.log('拒绝退款')
      that.setData({
        reject: false
      })
    }
  }




})

