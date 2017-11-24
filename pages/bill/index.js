var sliderWidth = 100; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["收入", "支出"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    goods: [{ name: 'haha', url: '../billinfo/index', icon: '../../images/logo.jpg', money: '10' }, { name: 'haha', url: '../billinfo/index', icon: '../../images/logo.jpg', money: '20' }, { name: 'haha', url: '../billinfo/index', icon: '../../images/logo.jpg', money: '30' }],
    mobile: '../../images/mobile.png'

  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
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
  }
});