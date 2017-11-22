var app = getApp()
var ajax = require('../../utils/ajax');
var md5 = require('../../utils/md5');
console.log(app.urlBase) // I am global data
var urlBase = app.urlBase;

Page({
  data: {
    img: '../../images/logo.jpg',
    mobile: '',
    password: '',
    inputType: 'password',
    autoLogin: true,
    showPass: false
  },
  onLoad: function (options) {
    // Do some initialize when page load.
    var that = this;
    wx.showLoading();
    wx.getStorage({
      key: 'unionId',
      success: function (res) {
        wx.hideLoading();
        console.log(res.data);
        if (res.data != undefined && res.data != ''){
          that.userLogin('', '', '', res.data);
        }
        
      },
      fail: function (){
        wx.hideLoading();
        console.log('失败');
        // wx.showToast({
        //   title: '请重新登录',
        //   image: '../../images/alert.png',
        //   duration: 2000
        // })
      }
    });

  },
  onReady: function () {
    // Do something when page ready.
  },
  onShow: function () {
    // Do something when page show.
  },
  onHide: function () {
    // Do something when page hide.
  },
  onUnload: function () {
    // Do something when page close.
  },
  onPullDownRefresh: function () {
    // Do something when pull down.
  },
  onReachBottom: function () {
    // Do something when page reach bottom.
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
  },
  onPageScroll: function () {
    // Do something when page scroll
  },
  // Event handler.
  viewTap: function () {
    this.setData({
      text: 'Set some data for updating view.'
    }, function () {
      // this is setData callback
      console.log()
    })
  },
  getUserPass: function (e) {
    console.log(e.detail.value);
    this.setData({
      password: e.detail.value
    })
  },
  getUserMobile: function (e) {
    console.log(e.detail.value);
    this.setData({
      mobile: e.detail.value
    })
  },
  goIndex: function () {
    var that = this;
    console.log(this.data.password);
    var userpasswd = this.data.password;
    var usermobile = this.data.mobile;
    if (usermobile == '') {
      wx.showToast({
        title: '手机号不能为空',
        image: '../../images/alert.png',
        duration: 2000
      })
    } else if (userpasswd == '') {
      wx.showToast({
        title: '用户密码不能为空',
        image: '../../images/alert.png',
        duration: 2000
      })
    } else {
      wx.login({
        success: function (res) {
          if (res.code) {
            console.log(res.code);
            that.userLogin(usermobile, userpasswd, res.code,'');
          } else {
            console.log('获取用户登录态失败！' + res.errMsg);
          }
        }
      });
    
    }

  },
  clearMobile: function () {
    this.setData({
      mobile: ''
    })
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
  userLogin: function (mobile, password, jsCode, unionId) {
    wx.showLoading({
      title: '登录中',
    })
    password = md5(password);
    var url = urlBase + "/mall/selleruser/wx_micro_app_login/"+ mobile +'/'+ password +'/'+ jsCode +'/'+ unionId;
    console.log(url);
    ajax.get(url).then(function (data) {
      wx.hideLoading();
      console.log(data);
      if (data.data.errCode == 0){
        wx.setStorage({
          key: "unionId",
          data: data.data.data.unionId
        })
        wx.navigateTo({
          url: '../index/index'
        })
      }else{
        wx.showToast({
          title: data.data.errMsg,
          image: '../../images/alert.png',
          duration: 2000
        })
      }
      
    }).catch(function (status) {
      wx.hideLoading();
      console.log(status);
      wx.showToast({
        title: status,
        image: '../../images/alert.png',
        duration: 2000
      })
    })
  }
})