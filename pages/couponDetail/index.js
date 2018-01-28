//index.js
var sliderWidth = 100; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
var ajax = require('../../utils/ajax');
var oss = require('../../utils/oss');
var urlBase = app.urlBase;


Page({
  data: {
    data: { 
      "kind": 1,  //1：普通优惠券（自动领），2：定向优惠券  (0：用户主动领取 不用)
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
        "giftGoodsID": '', //赠品
        "includeSeller": "" //包含的商家
      }
    },
    tabs: ["基本信息", "使用情况"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    listnum: true, //是否隐藏提示
    nowtime:'', //当前时间
    typeText: ['满减','折扣', '满赠', '新人',],
    kindText: ['普通优惠券', '定向优惠券'],
    page: 0,
    size: 10,
    lock: true,
    currentTime: ''




  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(app.sellerId) 
    console.log(options.value)
    var currentTime = new Date().getTime();
    this.setData({
      currentTime
    })
    var that = this;
    var datalist = JSON.parse(options.value);
    datalist.validityStartTime = oss.formatDate(datalist.validityStartTime);
    datalist.couponEndTime = datalist.validityEndTime
    datalist.validityEndTime = oss.formatDate(datalist.validityEndTime);
    datalist.endTime = oss.formatDate(datalist.endTime);
    datalist.startTime = oss.formatDate(datalist.startTime);
    datalist.rule.includeGoodsName = datalist.rule.includeGoodsName || "不限";
    datalist.kindtext = that.data.kindText[datalist.kind-1];
    datalist.typetext = that.data.typeText[datalist.type-1];
    that.setData({
      'data': datalist
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - 100) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          sliderW: sliderWidth,
          "data.rule.includeSeller": app.sellerId
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

    console.log(e.currentTarget.id)
    if (e.currentTarget.id == 1){
      this.getCouponsUse();
    }else{
      this.setData({
        page: 0,
        coupons: [],
        listnum: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
    console.log(JSON.stringify(this.data));
    var that = this;
    var nowtime = oss.NowTimer();
    console.log('当前时间'+nowtime);
    this.data.nowTime = nowtime;
   
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
  // 冻结优惠券
  frozenCoupon:function(e){
    console.log(e.target.id)
    var that = this;
    var tag = e.target.id;
    wx.showModal({
      title: '提示',
      content: '确定冻结该优惠券',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.putFrozenCoupon(tag);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  putFrozenCoupon: function(tag){
    wx.showLoading({
      title: '冻结中',
    })
    let url = `${app.urlBase}/mall/coupon/seller/lock/${tag}`;
    console.log(url);
    ajax.put(url,{}).then(function(res){
      wx.hideLoading();
      console.log('优惠券冻结：'+JSON.stringify(res));
      if(res.data.code == 0){
        wx.showToast({
          title: '冻结成功',
        })
        wx.navigateBack({})
      }else{
        wx.showModal({
          title: '注意',
          content: '冻结失败',
        })
      }
    }).catch(function (status){
      wx.hideLoading();
      oss.statusHandler(status);
    })
    
  },
  // 优惠券使用情况
  getCouponUseAuto:function(){
    var that = this;
    this.setData({
      page: 0
    });
    that.getCouponsUse();
  },
  scrolltoupper:function(e){
    console.log('滚动到头部了')
    this.getCouponAuto();
  },
  scrolltolower:function(e){
    console.log('滚动到底部了');
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
      that.getCouponsUse();
    }
  },
  getCouponsUse:function(e){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    that.setData({
      lock: false
    })
    var page = that.data.page
    var url = app.urlBase + `/mall/coupon/seller/detail/${that.data.data.tag}/${page}/${that.data.size}`;
    console.log(url);
    ajax.get(url).then(function (data) {
      wx.hideLoading();
      console.log('优惠券使用情况'+JSON.stringify(data));
      var statusCode = data.statusCode;
      if (data.data.errCode == 0) {
        var datalist = data.data.dataList;
        for (var i = 0; i < datalist.length; i++) {
          datalist[i].time = oss.formatDate(datalist[i].time);
        }
        console.log(JSON.stringify(data.data.dataList))
        if (that.data.page == 0) {
          console.log('第一次加载数据')
          that.setData({
            couponUse: data.data.dataList,
            listnum: true
          })
        } else {
          that.setData({
            couponUse: that.data.couponUse.concat(data.data.dataList)
          })
        }
        that.setData({
          lock: true
        })

      } else if (data.data.errCode == 1) {
        console.log("没数据啊")
        if (that.data.page == 0) {
          console.log('显示提示啊');
          that.setData({
            listnum: false
          })
        } else {
          wx.showToast({
            title: '已加载全部',
          })
          that.setData({
            lock: false
          })

        }


      } else {
        oss.statusHandler(statusCode);
      }
    }).catch(function (status) {
      console.log(status)
      that.setData({
        lock: false
      })
      oss.statusHandler(status);
      console.log(status)
    })
  }




})

