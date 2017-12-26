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
    time:'',
    agree: true,
    reject: true,
    userId:'',
    orderId:'',
    rejectText:'',
    autoFocus: false,
    autoFocusM: false,
    title:''
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   console.log(options);
   var allId = options.orderId;
   console.log(allId);
   var that = this;
   var orderID = allId.split(":")[0];
   var userID = allId.split(":")[1];
   var amount = allId.split(":")[2];
   var fromPage = allId.split(":")[3];
   console.log(fromPage);
   if(parseInt(fromPage)){
      that.setData({
        title: '订单处理详情'
      })
      wx.setNavigationBarTitle({
        title: '订单处理详情'
      })
   }else{
     that.setData({
       title: '申请退货详情'
     })
     wx.setNavigationBarTitle({
       title: '申请退货详情'
     })
   }
   console.log(typeof fromPage);
   console.log(amount)
   this.setData({
     userId: userID,
     orderId: orderID,
     amount: amount,
     newAmount: amount
   })
   this.getOrderDetail(orderID);
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
      console.log(JSON.stringify(data));
      var statusCode = data.statusCode;
      var dataList = data.data;
      if (dataList.errCode == 0) {
        console.log(dataList.dataList);
        console.log(dataList.dataList.length);
        for (var j = 0; j < dataList.dataList.length; j++) {
          var imgURL = [];
          if (dataList.dataList[j].images) {
            var imgs = dataList.dataList[j].images.split(":");
            for (var i = 0; i < imgs.length; i++) {
              var a = `${app.ossHost}/${that.data.userId}/${imgs[i]}`;
              console.log(a)
              imgURL.push(a)
            }
            dataList.dataList[j].imgURL = imgURL;
            that.setData({
              files: that.data.files.concat(imgURL)
            })
          } else {
            continue;
          }
        }
        that.setData({
          dataList: dataList.dataList
        })
      }

      // wx.hideLoading();
      // console.log(JSON.stringify(data));
      // var statusCode = data.statusCode;
      // var dataList = data.data;
      // if (dataList.errCode == 0) {
      //   that.setData({
      //     time: dataList.dataList[0].time,
      //     reason: dataList.dataList[0].reason,
      //     amount: dataList.dataList[0].amount,
      //     newAmount: dataList.dataList[0].amount
      //   })
      //   var imgs = dataList.dataList[0].images.split(':');
      //   var imgURL = [];
      //   for (var i = 0; i < imgs.length; i++) {
      //     var a = `https://dev.yezhubao.net/oss_mall/${that.data.userId}/${imgs[i]}`;
      //     console.log(a)
      //     imgURL.push(a)
      //   }
      //   that.setData({
      //     files: imgURL
      //   })
      // }


      wx.hideLoading();
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
        agree: true,
        newAmount: that.data.amount,
        autoFocusM: false
      })
    }else{
      console.log('拒绝退款')
      that.setData({
        reject: true,
        rejectText: '',
        autoFocus: false
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
        agree: false,
        autoFocusM: true
      })
    } else {
      console.log('拒绝退款')
      that.setData({
        reject: false,
        autoFocus: true
      })
    }
  },
  submitSend: function(e){
    var that = this;
    console.log(that.data.agree)
    console.log(that.data.reject)
    // console.log(typeof num)
    if (that.data.agree == false){
      // 确认退款
      var num = that.data.newAmount;
      console.log(num);
      console.log('确认退款')
      if (isNaN(num)){
        wx.showToast({
          title: '格式不正确',
          image: '../../images/alert.png',
          duration: 2000
        });
      } else if (/^((0?)|([1-9]\d*?))(.\d{1,2})?$/.test(num)) {
        //如果输入正确做什么处理，这里根据实际情况可修改
        if (num < 0) {
          wx.showToast({
            title: '不能小于0元',
            image: '../../images/alert.png',
            duration: 2000
          });
        } else if (num > parseFloat(that.data.amount)) {
          wx.showToast({
            title: '不能大于总金额',
            image: '../../images/alert.png',
            duration: 2000
          });
        } else{
          console.log(num.toString());
          num = num.toString();
          var json = {
            orderId: that.data.orderId,
            deny: false,
            amount: num,
            reason: ''
          }
          that.returnResult(json);
        }
       

      } else {
        wx.showToast({
          title: '只保留两位小数',
          image: '../../images/alert.png',
          duration: 2000
        });
        console.log(Math.round(num * 100) / 100);
        that.setData({
          newAmount: Math.round(num * 100) / 100
        })
        return;
      }
    }
    // 拒绝退款
    if (that.data.reject == false){
      if (that.data.rejectText == ''){
        wx.showToast({
          title: '拒绝原因必填',
          image: '../../images/alert.png',
          duration: 2000
        });
      } else{
        var json = {
          orderId: that.data.orderId,
          deny: true,
          reason: that.data.rejectText
        }
        that.returnResult(json);
      }
    }
  },
  // // 退款金额改变
  changeMoney:function(e){
    var that = this;
    console.log(e.detail.value)
    var num = e.detail.value;
    that.setData({
      newAmount: num
    })

  },
  returnResult:function(json){
  wx.showLoading()
   console.log('处理结果');
   var url = `${urlBase}/mall/order/response_refund`;
   console.log(url);
   console.log(json);
   ajax.post(url, json).then(function (res) {
     wx.hideLoading()
     console.log(JSON.stringify(res));
     if (res.data.code == 0) {
       console.log('退货处理成功');
       wx.showToast({
         title: '退货处理成功',
       })
       setTimeout(function(){
         wx.navigateBack()
       },2000)
      
       console.log(res);
     } else {
       oss.statusHandler(res.statusCode);
     }


   }).catch(function (err) {
     if (err.errMsg == "request: fail timeout") {
       wx.showToast({
         title: '请求超时',
         image: '../../images/alert.png',
         duration: 2000
       })
     } else {
       wx.showToast({
         title: '处理失败',
         image: '../../images/alert.png',
         duration: 2000
       })
     }
   })
  },
  getReject: function(e){
    console.log(e.detail.value)
    this.setData({
      rejectText: e.detail.value
    })
  }





})

