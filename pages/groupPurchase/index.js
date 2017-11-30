//index.js
var app = getApp()
var device = wx.getSystemInfoSync()
var ajax = require("../../utils/ajax.js")
var oss = require('../../utils/oss');
console.log(device.windowHeight);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    boxHeight: device.windowHeight - 80,
    // goods: [{ name: 'haha', url: '../goodsEdit/index', icon: '../../images/logo.jpg', status: '已下架' }, { name: 'haha', url: '../goodsEdit/index', icon: '../../images/logo.jpg', status: '已下架' }, { name: 'haha', url: '../login/index', icon: '../../images/logo.jpg', status: '已下架' }],
    goods:[],
    page: 0,
    pageSize: 20,
    lock: false,
    listnum: false

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
    var that = this;
    app.globalData.addPhoto = [];
    this.setData({
      page: 0
    });
    that.getGoodslist();
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
    var that = this;
    this.setData({
      page: 0
    });
    that.getGoodslist();
  },
  scrolltolower: function () {
    console.log('滚动到底部触发');
    // 上拉加载
    var that = this;
    var lock = this.data.lock;
    if (lock) {
      console.log(that.data.page++);
      var page = that.data.page++;
      console.log(page);
      this.setData({
        page: page
      });
      console.log(that.data.page);
      that.getGoodslist();
    }
    
   
  },
  goAdd: function(){
    wx.navigateTo({
      url: '../goodsAdd/index',
    })
  },
  getGoodslist: function(e){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    that.setData({
      lock: false
    })
    var page = that.data.page
    var url = app.urlBase + '/mall/goods/seller_list_group/' + app.sellerId + '/' + page +'/' + that.data.pageSize; 
    console.log(url);
    ajax.get(url).then(function(data){
      wx.hideLoading();
      console.log(JSON.stringify(data));
      var statusCode = data.statusCode;
      if(data.data.errCode == 0){
        var datalist = data.data.dataList;
        for (var i = 0; i < datalist.length;i++){
          console.log(datalist[i].id);
          datalist[i].url = '../goodsEdit/index?goodsId=' + datalist[i].id;
          if (datalist[i].available == true){
            datalist[i].icon = '../../images/true.png'
            datalist[i].status = '销售中'
          }else{
            datalist[i].icon = '../../images/false.png'
            datalist[i].status = '已下架'
          }
        }
        console.log(that.data.page)
        if (that.data.page == 0){
          console.log('第一次加载数据')
          that.setData({
            goods: data.data.dataList,
            listnum: true
          })
        }else{
          that.setData({
            goods: that.data.goods.concat(data.data.dataList)
          })
        }
        that.setData({
          lock: true
        })
          
      } else if (data.data.errCode == 1){
        if (that.data.page == 0){
          that.setData({
            listnum: true
          })
        }else{
          wx.showToast({
            title: '已加载全部',
          })
          that.setData({
            lock: false
          })

        }
        

      }else{
        oss.statusHandler(statusCode);
      }
    }).catch(function(status){
      console.log(status)
      that.setData({
        lock: false
      })
      oss.statusHandler(status);
      console.log(status)
    })
  }

})

