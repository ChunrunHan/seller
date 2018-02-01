//index.js
var app = getApp()
var device = wx.getSystemInfoSync()
var ajax = require("../../utils/ajax.js")
var oss = require('../../utils/oss');
var urlBase = app.urlBase;
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
    listnum: true,
    startX: 0, //开始坐标
    startY: 0

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
      page: 0,
      goods:[]
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
          datalist[i].isTouchMove = false;
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
        console.log("没数据啊")
        if (that.data.page == 0){
          console.log('显示提示啊');
          that.setData({
            listnum: false
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
  },
  // 滑动事件
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.goods.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      goods: this.data.goods
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.goods.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      goods: that.data.goods
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  // 复制商品
  copyGoods: function(e){
    wx.showLoading({
      title: '复制中',
    })
    console.log(e.target.id);
    var that = this;
    var goodsId = e.target.id;
    var url = `${app.urlBase}/mall/goods/copy/${goodsId}`
    console.log(url);
    ajax.get(url).then(function (data) {
      wx.hideLoading();
      console.log(JSON.stringify(data));
      var statusCode = data.statusCode;
      if (data.data.errCode == 0) {
        that.setData({
          page: 0,
          goods: []
        });
        that.getGoodslist();

      } else {
        oss.statusHandler(statusCode);
      }
    }).catch(function (status) {
      wx.hideLoading();
      console.log(status)
      oss.statusHandler(status);
    })

  },
  // 删除商品
  openConfirm: function(e){
    console.log(e.target.id);
    var that = this;
    console.log(e.currentTarget.id);
    var delId = e.currentTarget.id;
    wx.showModal({
      title: '警告',
      content: '确定删除该商品',
      confirmText: "是",
      cancelText: "否",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          that.delGoods(delId);
        } else {
          console.log('取消删除')
        }
      }
    });
  },
  delGoods: function (id) {
    var that = this;
    wx.showLoading({
      title: '删除中',
    })
    var url = urlBase + '/mall/goods/' + id;
    ajax.del(url).then(function (data) {
      console.log('got from server: ' + JSON.stringify(data));
      var statusCode = data.statusCode;
      //	判断删除操作
      var data = data.data;
      if (data.code === 0) {
        wx.showToast({
          title: '删除成功',
        });

        that.setData({
          page: 0,
          goods: []
        });
        that.getGoodslist();
       

      } else if (data.code == 581) {
        wx.showToast({
          title: '商品不存在',
          image: '../../images/alert.png',
          duration: 2000
        })
      } else {
        oss.statusHandler(statusCode);
      }

    }).catch(function (status) {
      console.log('删除商品请求' + status)
      oss.statusHandler(status);
    });
  },

})

