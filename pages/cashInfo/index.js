var sliderWidth = 150; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["待审核", "待转账","已拒绝","已转账"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    goods: [{ name: 'haha', url: '../login/index', icon: '../../images/logo.jpg', status: '已下架' }, { name: 'haha', url: '../login/index', icon: '../../images/logo.jpg', status: '已下架' }, { name: 'haha', url: '../login/index', icon: '../../images/logo.jpg', status: '已下架' }],
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
  }
});