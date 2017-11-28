//index.js
var app = getApp()
var ajax = require('../../utils/ajax');
var oss = require('../../utils/oss');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var demo = new QQMapWX({
  key: 'YFBBZ-AJRKO-KAKWM-S55DU-S3K2S-UNBQK' // 必填
});
var urlBase = app.urlBase;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    text: '获取验证码',
    data: {
      mobile: '',
      newMobile: '',
      smscode: ''
    },
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
  getSmscode: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.text);
    var text = e.currentTarget.dataset.text;
    if (that.data.data.mobile == '' || that.data.data.newMobile == "") {
      wx.showModal({
        title: '注意',
        content: '原手机号和新手机不能为空',
      })
      return;
    } else if (that.data.data.mobile == that.data.data.newMobile) {
      wx.showModal({
        title: '注意',
        content: '原手机号和新手机不能相同',
      })
      return;
    } else if (oss.checkMobile(that.data.data.mobile) && oss.checkMobile(that.data.data.newMobile)) {

      if (text == '获取验证码' || text == '重新获取') {
        var value = 60;
        var timer = setInterval(function () {
          if (value !== 0) {
            value--;
            that.setData({
              text: value + 's后重新获取'
            })
          } else {
            clearInterval(timer);
            that.setData({
              text: "重新获取"
            })
          }

        }, 1000)
        that.submitMobile(that.data.data.newMobile,timer);

      }

    }
  },
  getOldMobile: function (e) {
    console.log('老手机号', e.detail.value)
    this.setData({
      'data.mobile': e.detail.value
    })
  },
  getNewMobile: function (e) {
    console.log(e.detail.value);
    this.setData({
      'data.newMobile': e.detail.value
    })
  }, 
  showSmscode:function(e){
    console.log(e.detail.value);
    this.setData({
      'data.smscode': e.detail.value
    })
  },
  submitMobile: function (newMobile, timer) {
    console.log(newMobile)
    var that = this;
    wx.showLoading({
      title: '获取中',
    })
    var url = urlBase + '/mall/selleruser/sms/' + newMobile + '/mobile';
    console.log(url);
    ajax.get(url).then(function (data) {
      console.log('验证码返回数据：' + JSON.stringify(data));
      wx.hideLoading();
      console.log(data.statusCode)
      var statusCode = data.statusCode;
      var data = data.data;
      if (data.code === 0) {
        // mui.toast('请注意查收验证码');
        wx.showToast({
          title: '请注意查收',
        })
      } else if (data.code === 181) {
        wx.showToast({
          title: '手机号已被注册',
        })
        clearInterval(timer);
        that.setData({
          text: "重新获取"
        })
      } else if (data.code === 182) {
        wx.showToast({
          title: '用户不存在',
        })
        clearInterval(timer);
        that.setData({
          text: "获取验证码"
        })
      } else if (data.code === 231) {
        // mui.toast('验证码次数超过限制');
        wx.showToast({
          title: '验证次数超过限制',
        })
        clearInterval(timer);
        that.setData({
          text: "获取验证码"
        })
      } else if (data.code === 232) {
        // mui.toast('验证码依然有效');
        wx.showToast({
          title: '验证码依然有效',
        })
        clearInterval(timer);
        that.setData({
          text: "获取验证码"
        })
      } else{
        console.log(statusCode)
        oss.statusHandler(statusCode)
        clearInterval(timer);
        that.setData({
          text: "获取验证码"
        })
      }

    }).catch(function (status) {
      clearInterval(timer);
      that.setData({
        text: "重新获取"
      })
      wx.hideLoading();
      console.log(status.errMsg);
      wx.showToast({
        title: '请求超时',
        image: '../../images/alert.png',
        duration: 2000
      })
      oss.statusHandler(status);
    });
  },
  modifyMobile: function(e){
    var that = this;
    console.log(that.data.data);
    var data = that.data.data;
    if(data.mobile == '' || data.newMobile == '' || data.smscode == ''){
      wx.showModal({
        title: '注意',
        content: '所有项为必填项',
      })
    }else{
      that.submitNew(data);
    }
  },
  submitNew: function (data) {
    console.log(data)
    wx.showLoading({
      title: '提交中',
    })
    var url = urlBase + '/mall/selleruser/reset/mobile';
    ajax.put(url, data).then(function (data) {
      wx.hideLoading();
      console.log(JSON.stringify(data));
      var data = data.data;
      if (data.code === 85) {
        // mui.toast('用户不存在');
        wx.showToast({
          title: '用户不存在',
          image: '../../images/alert.png',
          duration: 2000
        })

      } else if (data.code === 81) {
        // mui.toast('手机号已经存在');
        wx.showToast({
          title: '手机号已经存在',
          image: '../../images/alert.png',
          duration: 2000
        })

      } else if (data.code === 234) {
        // mui.toast('无效的验证码');
        wx.showToast({
          title: '无效的验证码',
          image: '../../images/alert.png',
          duration: 2000
        })
        

      } else if (data.code === 0) {
        // mui.toast('修改成功,请重新登录');
        wx.showToast({
          title: '修改成功,请重新登录',
        })

        setTimeout(function () {
          oss.restart();
        }, 1000);

      } else if (data.code == 233) {
        // mui.toast('验证码过期');
        wx.showToast({
          title: '验证码过期',
          image: '../../images/alert.png',
          duration: 2000
        })

      }

    }).catch(function (status) {
      wx.hideLoading();
      console.log('提交修改商家用户手机号' + status)
      oss.statusHandler(status);
    });
  }




})

