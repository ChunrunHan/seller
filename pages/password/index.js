//index.js
var app = getApp()
var ajax = require('../../utils/ajax');
var oss = require('../../utils/oss');
var md5 = require('../../utils/md5');
var urlBase = app.urlBase;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    text: '获取验证码',
    inputType: 'password',
    showPass: false,
    data: {
      mobile: '',
      newPassword: '',
      smscode: ''
    }






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
    var mobile = that.data.data.mobile;
    console.log(e.currentTarget.dataset.text);
    var text = e.currentTarget.dataset.text;
    if (mobile == '') {
      wx.showToast({
        title: '手机号不能为空',
        image: '../../images/alert.png',
        duration: 2000
      })
    } else if (oss.checkMobile(mobile)) {
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


        }, 1000);
        that.submitMobile(mobile, timer);

      }

    }


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
  getMobile: function (e) {
    console.log('手机号', e.detail.value)
    this.setData({
      'data.mobile': e.detail.value
    })
  },
  submitMobile: function (mobile, timer) {
    var that = this;
    wx.showLoading({
      title: '获取中',
    })
    var url = urlBase + '/mall/selleruser/sms/' + mobile + '/pwd';
    console.log(url);
    ajax.get(url).then(function (data) {
      console.log('验证码返回数据：' + JSON.stringify(data));
      var statusCode = data.statusCode;
      wx.hideLoading();
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
      }else{
        oss.statusHandler(statusCode);
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
  showSmscode: function (e) {
    console.log(e.detail.value);
    var that = this;
    that.setData({
      'data.smscode': e.detail.value
    })
  },
  getNewpass: function (e) {
    console.log(e.detail.value);
    var that = this;
    that.setData({
      'data.newPassword': e.detail.value
    })
  },
  modifyPassword: function (e) {
    var that = this;
    console.log(that.data.data);
    var data = that.data.data;
    if (data.mobile == "" || data.newPassword == "" || data.smscode == "") {
      wx.showModal({
        title: '注意',
        content: '所有项为必填项',
      })
    } else {
      data.newPassword = md5(data.newPassword);
      wx.showLoading({
        title: '修改中',
      })
      console.log(that.data.data);
      var url = urlBase + '/mall/selleruser/reset/password';
      ajax.put(url, data).then(function (data) {
        console.log(JSON.stringify(data));
        wx.hideLoading();
        var statusCode = data.statusCode;
        var data = data.data;
        if (data.code === 182) {
          // mui.toast('用户不存在');
          wx.showToast({
            title: '用户不存在',
            image: '../../images/alert.png',
            duration: 2000
          })

        } else if (data.code === 90) {
          // mui.toast('错误的密码格式');
          wx.showToast({
            title: '错误的密码格式',
            image: '../../images/alert.png',
            duration: 2000
          })

        } else if (data.code === 85) {
          // mui.toast('用户不存在');
          wx.showToast({
            title: '用户不存在',
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
        } else if (data.code === 233) {
          // mui.toast('验证码过期');
          wx.showToast({
            title: '验证码过期',
            image: '../../images/alert.png',
            duration: 2000
          })
        } else if(data.code == 0) {
          // mui.toast('修改成功');
          wx.showToast({
            title: '修改成功',
          })
          setTimeout(function () {
            oss.restart();
          }, 1000);
        }else{
          oss.statusHandler(statusCode);
        }

      }).catch(function (status) {
        wx.hideLoading();
        console.log('修改密码请求' + status)
        oss.statusHandler(status);
      });

    }

  },
  showPassword: function () {
    console.log(this.data.inputType);
    if (this.data.inputType == 'password') {
      this.setData({
        inputType: 'text',
        showPass: true
      })
    } else {
      this.setData({
        inputType: 'password',
        showPass: false
      })
    }
  },



})

