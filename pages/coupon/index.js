//index.js
var sliderWidth = 120; // 需要设置slider的宽度，用于计算中间位置
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
      "kind": 0,  //0：用户主动领取，1：自动领取优惠券，2：定向优惠券，商家发送到用户账户
      "type": 1,  //1：满减，2：折扣，3：满赠，4：新人
      "title": "",
      "startTime": '',
      "endTime": '',
      "count": '', //优惠券张数
      "validityStartTime": '',
      "validityEndTime": '',
      "pickupSource": 3, //领取优惠券的途径，0：无限制（业主宝商城、团购都可以领取），1：业主宝商城，2：盛华优选公众号，3：盛华优选小程序，4：乐拼青岛小程序
      "useSource": 3, //使用优惠券的途径，0：无限制（业主宝商城、团购都可以领取），1：业主宝商城，2：盛华优选公众号，3：盛华优选小程序，4：乐拼青岛小程序
      "rule": {
        "count": 1, //单个用户可领取的本优惠券张数（例：取值为2，每个用户最多只能领取2张；0，不限制）
        "amountLimit": "", //必须满足的金额，单位为分。0，为不限制。如果
        "catgoryGoodsLimit": "", //同一分类商品数量最小购买限制(例：0，不限制；2，最少购买两件includeCategory所标明分类中的商品才可以使用此优惠券)
        "decrease": "", //满足条件后减少的金额
        "includeCategory": "", //优惠券所包含的分类
        "sellerGoodsLimit": "", //同一个商家购买的商品最小值的数量限制（0，不限制）
        "excludeGoods": '', //不参与优惠活动的商品
        "includeGoods": '', //优惠券所包含的商品
        "discount":'', //折扣
        "giftGoodsID": '' //赠品
      }
    },
    tabs: ["优惠券发放", "优惠券管理"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    listnum:true, //是否隐藏提示
    nowtime:'', //当前时间
    typeText: ['满减','折扣', '满赠', '新人',],
    typeIndex: 0,
    kindText: ['用户主动领取优惠券', '用户自动领取优惠券', '定向优惠券，商家发送到用户账户'],
    kindIndex: 0,
    useStartTime:'',
    useEndTime: '',
    endTime:'',
    startTime:'',
    goodsUse: '', //使用商品
    giftGoodsID: '' //赠品




  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id) //ff80b5b5610c7d7301610dc06f8a0018:火烧啊
    var that = this;
    if (options.id){
      var sendValue = options.id.split(":");
      if (sendValue[2] == 'use'){
        that.setData({
          "data.rule.includeGoods": sendValue[0],
          "goodsUse": sendValue[1]
        })
        console.log(that.data)
      }else{
        that.setData({
          "data.rule.giftGoodsID": sendValue[0],
          "giftGoodsID": sendValue[1]
        })
      }
    }
   
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
    console.log(JSON.stringify(this.data));
    var that = this;
    var nowtime = oss.NowTimer();
    console.log(nowtime);
    this.data.nowTime = nowtime;
   
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
  bindTypeChange: function (e) {
    console.log(parseInt(e.detail.value) + 1);
    var couponType = parseInt(e.detail.value) + 1
    this.data.data.type = couponType;
    this.setData({
      typeIndex: e.detail.value,
      'data.rule.discount':'',
      'data.rule.decrease': '',
      'data.rule.giftGoodsID': ''

    });
    console.log(JSON.stringify(this.data.data));
  },
  bindKindChange: function (e) {
    console.log(parseInt(e.detail.value));
    var couponKind = parseInt(e.detail.value)
    this.data.data.kind = couponKind;
    this.setData({
      kindIndex: e.detail.value
    });
    console.log(JSON.stringify(this.data.data));
  },
  startTimeChange: function (e) {
    console.log(e.detail.value);
    var starttime = oss.timeToLong(e.detail.value, "start");
    var current = oss.currentTime();
    console.log('当前时间' + current);
    console.log('开始时间' + starttime);
    if (starttime < current) {
      wx.showModal({
        title: '注意',
        content: '优惠券开始领取时间大于当前时间，小于领取结束时间。',
      })
    } else {
      this.setData({
        startTime: e.detail.value
      });
      this.data.data.startTime = starttime;
    }

  },
  endTimeChange: function (e) {
    console.log(e.detail.value);
    var endtime = oss.timeToLong(e.detail.value, "end");
    var starttime = this.data.data.startTime;
    console.log(starttime);
    var current = oss.currentTime();
    console.log(current);
    console.log(starttime);
    if (endtime < current || endtime < starttime) {
      wx.showModal({
        title: '注意',
        content: '优惠券领取结束时间大于领取开始时间、当前时间。',
      })
    } else {
      this.setData({
        endTime: e.detail.value
      });
      this.data.data.endTime = endtime;
    }
  },
  useStartTimeChange: function (e) {
    console.log(e.detail.value);
    var starttime = oss.timeToLong(e.detail.value, "start");
    var current = oss.currentTime();
    console.log('当前时间' + current);
    console.log('开始时间' + starttime);
    if (starttime < current) {
      wx.showModal({
        title: '注意',
        content: '优惠券开始使用时间大于当前时间，小于结束使用时间。',
      })
    } else {
      this.setData({
        useStartTime: e.detail.value
      });
      this.data.data.validityStartTime = starttime;
    }

  },
  useEndTimeChange: function (e) {
    console.log(e.detail.value);
    var endtime = oss.timeToLong(e.detail.value, "end");
    var starttime = this.data.data.useStartTime;
    console.log(starttime);
    var current = oss.currentTime();
    console.log(current);
    console.log(starttime);
    if (endtime < current || endtime < starttime) {
      wx.showModal({
        title: '注意',
        content: '优惠券使用结束时间大于开始使用时间、当前时间。',
      })
    } else {
      this.setData({
        useEndTime: e.detail.value
      });
      this.data.data.validityEndTime = endtime;
    }

  },
  getCouponCount: function (e) {
    console.log(e.detail.value);
    this.data.data.rule.count = e.detail.value
    console.log(JSON.stringify(this.data));
  },
  getCouponAmountLimit: function(e){
    console.log(e.detail.value);
    this.data.amountLimit = e.detail.value
    this.setData({
      'data.rule.amountLimit': e.detail.value*100
    })
    console.log(JSON.stringify(this.data.data));
  },
  getCouponDecrease: function (e) {
    console.log(e.detail.value);
    this.data.decrease = e.detail.value
    this.setData({
      'data.rule.decrease': e.detail.value * 100
    })
    console.log(JSON.stringify(this.data.data));
  },
  getCouponDiscount: function (e) {
    console.log(e.detail.value);
    this.data.discount = e.detail.value
    this.setData({
      'data.rule.discount': e.detail.value / 10
    })
    console.log(JSON.stringify(this.data.data));
  },
  showGoods: function(e){
    console.log(e.currentTarget.id);
    if (e.currentTarget.id == 'use'){
      wx.navigateTo({
        url: '../selectGoods/index?id=use',
      })
    }else{
      wx.navigateTo({
        url: '../selectGoods/index?id=man',
      })
    }
  },















  // 生成优惠券
  putCoupon: function (e) {
    var that = this;
    console.log(JSON.stringify(that.data.data));
   
    // if (allData.name == '' || allData.oldPrice == '' || allData.singlePrice == '' || allData.leaderPrice == '' || allData.memberPrice == '' || allData.startTime == '' || allData.endTime == '' || allData.timeoutLimit == '' || allData.unit == '' || allData.remaining == '' || oldimg == "" || oldmemo == "") {
    //   wx.showModal({
    //     title: '注意',
    //     content: '商品所有属性为必填项，且商品图片和商品描述图至少上传一张。',
    //   })
    // } else if (allData.startTime > allData.endTime) {
    //   wx.showModal({
    //     title: '注意',
    //     content: '开始时间不能大于结束时间',
    //   })
    // } else if (allData.sellLocations.length == 0) {
    //   wx.showModal({
    //     title: '注意',
    //     content: '请选择销售地区',
    //   })
    // } else {
     
    //   console.log('上传的数据' + JSON.stringify(that.data.data));
    //   wx.showLoading({
    //     title: '添加中',
    //   })
    //   var newgoods = that.data.data;
    //   console.log('上传的数据' + JSON.stringify(newgoods));
    //   var url = urlBase + '/mall/goods/group';
    //   ajax.post(url, newgoods).then(function (data) {
    //     wx.hideLoading();
    //     console.log(data);
    //     console.log(JSON.stringify(data));
    //     if (data.data.code == 0) {
    //       wx.showToast({
    //         title: '添加成功',
    //         duration: 2000
    //       })
    //       wx.navigateBack({
    //         url: '../goodsAdd/index'
    //       })
    //     } else {
    //       oss.statusHandler(data.statusCode);
    //       // wx.showToast({
    //       //   title: '添加失败',
    //       //   image: '../../images/alert.png',
    //       //   duration: 2000
    //       // })
    //     }

    //   }).catch(function (status) {
    //     wx.hideLoading();
    //     console.log(status.errMsg);
    //     wx.showToast({
    //       title: '请求超时',
    //       image: '../../images/alert.png',
    //       duration: 2000
    //     })
    //   });

    // }
  }




})

