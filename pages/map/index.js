Page({
  data: {
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap');
    this.getLocation();
    wx.chooseLocation()
    // this.getCenterLocation();
    // this.moveToLocation();
    // this.translateMarker();
  },
  getLocation: function(){
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        // var latitude = res.latitude
        // var longitude = res.longitude
        var latitude = 111
        var longitude = 111
        var speed = res.speed
        var accuracy = res.accuracy
        console.log()
        that.mapCtx.moveToLocation()
      }
    })
  }
})