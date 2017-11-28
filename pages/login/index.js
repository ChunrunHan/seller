var app = getApp()
var ajax = require('../../utils/ajax');
var md5 = require('../../utils/md5');
var oss = require('../../utils/oss')
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
    var mobile = wx.getStorageSync('mobile');
    var wxOpenId = wx.getStorageSync('wxOpenId');
    console.log(wxOpenId);
    if (wxOpenId != ''){
      this.userLogin(mobile, '', '', wxOpenId);
    }

  },
  onReady: function () {

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
    });
    var oldpass = password;
    if (oldpass != ''){
      password = md5(password);
    }

    var url = urlBase + "/mall/selleruser/wx_micro_app_login/"+ mobile +'/'+ password +'/'+ jsCode +'/'+ unionId;
    console.log(url);
    ajax.get(url).then(function (data) {
      wx.hideLoading();
      console.log(data);
      console.log(JSON.stringify(data));
      var statusCode = data.statusCode;
      var data = data.data;
      if (data.errCode == 0){
        var datalist = data.data;
        app.token = datalist.token;
        app.sellerId = datalist.sellerId;
        app.id = datalist.id;
        app.mobile = datalist.mobile;
        app.realName = datalist.realName;
        app.mobile = datalist.mobile;

        wx.setStorageSync('sellerId', datalist.sellerId)
        wx.setStorageSync('token', datalist.token)
        wx.setStorageSync('mobile', mobile)
        wx.setStorageSync('password', oldpass)
        wx.setStorageSync('wxOpenId', datalist.wxOpenId);

        // wx.setStorage({
        //   key: 'sellerId',
        //   data: datalist.sellerId,
        // })
        // wx.setStorage({
        //   key: 'token',
        //   data: datalist.token,
        // })
        // wx.setStorage({
        //   key: 'mobile',
        //   data: mobile,
        // })
        // wx.setStorage({
        //   key: 'password',
        //   data: oldpass,
        // })
        wx.redirectTo({
          url: '../index/index',
        })

      }else{
        console.log('失败')
        oss.statusHandler(statusCode)
        // wx.showToast({
        //   title: data.errMsg,
        //   image: '../../images/alert.png',
        //   duration: 2000
        // })
      }
      // if (data.data.errCode == 0){
      //   wx.setStorage({
      //     key: "unionId",
      //     data: data.data.data.unionId
      //   })
      //   wx.navigateTo({
      //     url: '../index/index'
      //   })
      // }else{
      //   wx.showToast({
      //     title: "",
      //     image: '../../images/alert.png',
      //     duration: 2000
      //   })
      // }
      
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