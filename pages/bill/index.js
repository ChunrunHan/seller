var sliderWidth = 50; // 需要设置slider的宽度，用于计算中间位置
var md5 = require('../../utils/md5');
var base64 = require('../../utils/base64');
var ajax = require('../../utils/ajax');
var apiUser = '1314353'
var apiKey = '11e38823-8ce9-43e0-bf18-52c1e4adb8ca'
Page({
  data: {
    tabs: ["收入", "支出"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    goods: [{ name: 'haha', url: '../billinfo/index', icon: '../../images/logo.jpg', money: '10' }, { name: 'haha', url: '../billinfo/index', icon: '../../images/logo.jpg', money: '20' }, { name: 'haha', url: '../billinfo/index', icon: '../../images/logo.jpg', money: '30' }],
    mobile: '../../images/mobile.png',
    json:{
      LogisticCode: ''
    },
    expressName: '',
    ceshi: {
       OrderCode: '',
       ShipperCode: 'SF',
       LogisticCode: "118954907573"
    }

  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowWidth);
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 4,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
        console.log(that.data.sliderLeft)
      }
    });
  },
  onShow: function(e){
    var that = this;
    var ceshi = { 'OrderCode': '', 'ShipperCode': 'SF', 'LogisticCode': "118954907573" }
    ceshi = JSON.stringify(ceshi);
    var keyvalue = '56da2cf8-c8a2-44b2-b6fa-476cd7d1ba17'

    console.log(ceshi);
    var all = ceshi + keyvalue;
    console.log(all);
    console.log(md5(all));
    console.log(encodeURIComponent(base64.encode(md5(ceshi + keyvalue)))); //NThjYTM2OGFhZDJjMGQ5ZjMxMGU3NzhjYzg3NDEwM2M%3D
    // console.log(base64.encode(all))
    // // console.log(encodeURIComponent(base64.encode(all)))
    // var result = base64.encode(md5(all, "UTF-8"), "UTF-8");
    // console.log(result);
    // console.log(encodeURIComponent(result, "UTF-8"));  //NThjYTM2OGFhZDJjMGQ5ZjMxMGU3NzhjYzg3NDEwM2M%3D
  

  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  onPullDownRefresh: function(e){
    console.log("下拉");
  },
  onReachBottom: function(e){
    console.log("上拉");
  },
  goCash:function(e){
    wx.navigateTo({
      url: '../cash/index',
    })
  },
  goRecharge:function(){
    wx.navigateTo({
      url: '../recharge/index',
    })
  },
  openCamera: function (e) {
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res);
        that.setData({
          'json.LogisticCode': res.result
        });
        that.getCompany()
      }
    })

  },
  getCompany: function(){
    var that = this;
    console.log(that.data.json);
    var json = that.data.json;
    var RequestData = JSON.stringify(json);
    console.log('RequestData  ' + RequestData);
    var RequestDataEn = encodeURIComponent(RequestData);
    console.log(encodeURIComponent(base64.encode(md5(RequestData + apiKey)))); 
    var DataSign = encodeURIComponent(base64.encode(md5(RequestData + apiKey)));
    console.log(DataSign);
    var data = {
      RequestData: RequestDataEn
      // EBusinessID: apiUser,
      // RequestType: '2002',
      // DataSign: DataSign,
      // DataType:'2'
    };
    console.log(JSON.stringify(data));
    var url = 'http://api.kdniao.cc/Ebusiness/EbusinessOrderHandle.aspx?EBusinessID=' + apiUser + '&RequestType=2002' + '&DataSign=' + DataSign + '&DataType=2' + '$RequestData=' + data ;
    console.log(url);
    ajax.post(url).then(function (res) {
      console.log(JSON.stringify(res));
    }).catch(function (err) {
      console.log(err)
    })
    // wx.request({
    //   url: 'http://api.kdniao.cc/Ebusiness/EbusinessOrderHandle.aspx',
    //   method: 'POST',
    //   data: body,
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   dataType: 'JSON',
    //   success: function (res) {
    //     console.log(res);
    //     console.log(res.data)
    //   }
    // })
  },
   formSubmit: function (e) {
    let formId = e.detail.formId;
    console.log('form发生了submit事件，推送码为：', formId)

  }

});