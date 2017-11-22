//index.js
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
      available: true,
      description: '',
      images: '',
      name: '',
      oldPrice: '',
      singlePrice: '',
      leaderPrice: '',
      memberPrice: '',
      buyerLimit: 3,
      isSupportSevenDaysRefund: false,
      isSupportOneDayArrive: false,
      startTime: '',
      endTime: '',
      timeoutLimit: 24,
      sellerId: '',
      unit: '个',
      remaining: '',
      sellLocations: []
    },
    people: ['3人', '4人', '5人', '6人', '7人', '8人', '9人', '10人'],
    peopleIndex: 0,
    day: ["24小时", "48小时", "72小时"],
    dayIndex: 0,
    memo: '',
    memoLength: 0,
    files: [],
    zones: [],
    areaShow: true,
    endTime: '',
    startTime: '',
    nowTime: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var nowtime = oss.NowTimer();
    console.log(nowtime);
    this.data.nowTime = nowtime;
    oss.ceshi();
    console.log(this.data.data.name)
    //  图片添加
    console.log(app.globalData.addPhoto);
    this.setData({
      files: app.globalData.addPhoto
    })

    try {
      var value = wx.getStorageSync('bigData');
      if (value) {
        console.log(value);
        console.log(typeof value);
        that.setData({
          data: value
        })
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log()
    console.log(app.globalData.addPhoto);
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
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // that.setData({
        //   files: that.data.files.concat(res.tempFilePaths)
        // });
        // var tempFilePaths = res.tempFilePaths[0]
        // console.log(tempFilePaths);

        // wx.navigateTo({
        //   url: `../upload/upload?src=tempFilePaths`
        // })

        const src = res.tempFilePaths;
        // wx.redirectTo({
        //   url: '',
        // })
        // wx.navigateTo({
        //   url: '',
        // })
        // wx.setStorage({
        //   key: "key",
        //   data: that.data.data,
        // })
        try {
          wx.setStorageSync('bigData', that.data.data)
        } catch (e) {
        }
        wx.redirectTo({
          url: `../upload/upload?src=${src}`
        })
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  showMap: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res.name);
        console.log(res.address);
        console.log(res.latitude);
        console.log(res.longitude);
        var json = {
          name: res.name,
          longitude: res.longitude,
          latitude: res.longitude
        }
        // that.data.zones = that.data.zones.concat(json);
        that.setData({
          zones: that.data.zones.concat(json)
        })
        console.log(that.data.zones);


      },
    })
  },
  //  销售地区
  areaSwitch: function (e) {
    var that = this;
    console.log(e.detail.value);
    this.setData({
      areaShow: e.detail.value
    });

  },
  //  删除指定小区
  delZones: function (e) {
    console.log(e);
    var id = e.currentTarget.id;
    var zones = this.data.zones;
    zones.splice(id, 1);
    this.setData({
      zones: zones
    });
    console.log(JSON.stringify(this.data.zones));
  },
  //  删除图片
  delImage: function (e) {
    var that = this;
    console.log(e.currentTarget.id);
    console.log(e.currentTarget.dataset.name);
    var index = e.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: '确定删除该照片',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var files = that.data.files;
          console.log(files);
          files.splice(index, 1);
          that.setData({
            files: files
          });
          app.globalData.addPhoto = that.data.files;
          console.log('删除后' + that.data.zones);
          console.log('全局图片' + app.globalData.addPhoto)

        } else if (res.cancel) {
          console.log('用户点击取消')

        }
      }
    });
  },
  getMemo: function (e) {
    console.log(e.detail.value.length);
    this.setData({
      memoLength: e.detail.value.length,
      memo: e.detail.value
    });
    this.data.data.description = e.detail.value;
    console.log(JSON.stringify(this.data));
  },
  getName: function (e) {
    console.log(e.detail.value);
    this.data.data.name = e.detail.value
    console.log(JSON.stringify(this.data));
  },
  getAvailable: function (e) {
    console.log(e.detail.value);
    this.data.data.available = e.detail.value
    console.log(JSON.stringify(this.data.data));
  },
  getOldPrice: function (e) {
    console.log(e.detail.value);
    this.data.data.oldPrice = e.detail.value
    console.log(JSON.stringify(this.data.data));
  },
  getUnit: function (e) {
    console.log(e.detail.value);
    this.data.data.unit = e.detail.value
    console.log(JSON.stringify(this.data.data));
  },
  getRemaining: function (e) {
    console.log(e.detail.value);
    this.data.data.remaining = e.detail.value
    console.log(JSON.stringify(this.data.data));
  },
  getIsSupportOneDayArrive: function (e) {
    console.log(e.detail.value);
    if (e.detail.value) {
      wx.showModal({
        title: '注意',
        content: '当日达必须当日送达',
      });
    }
    this.data.data.isSupportOneDayArrive = e.detail.value
    console.log(JSON.stringify(this.data.data));
  },
  getIsSupportSevenDaysRefund: function (e) {
    console.log(e.detail.value);
    if (e.detail.value) {
      wx.showModal({
        title: '注意',
        content: '买家退货后，商家7天后资金到账',
      });
    }
    this.data.data.isSupportSevenDaysRefund = e.detail.value
    console.log(JSON.stringify(this.data.data));
  },
  bindPeopleChange: function (e) {
    console.log(parseInt(e.detail.value) + 3);
    var buyerLimit = parseInt(e.detail.value) + 3
    this.data.data.buyerLimit = buyerLimit;
    this.setData({
      peopleIndex: e.detail.value
    });
    console.log(JSON.stringify(this.data.data));
  },
  getSinglePrice: function (e) {
    console.log(e.detail.value);
    this.data.data.singlePrice = e.detail.value;
    console.log(JSON.stringify(this.data.data));
  },
  getLeaderPrice: function (e) {
    console.log(e.detail.value);
    this.data.data.leaderPrice = e.detail.value;
    console.log(JSON.stringify(this.data.data));
  },
  getMemberPrice: function (e) {
    console.log(e.detail.value);
    this.data.data.memberPrice = e.detail.value;
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
        content: '开始时间大于当前时间，小于结束时间。',
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
        content: '结束时间大于开始时间、当前时间。',
      })
    } else {
      this.setData({
        endTime: e.detail.value
      });
      this.data.data.endTime = endtime;
    }


  },
  timeoutChange: function (e) {
    console.log(e.detail.value);
    var time = parseInt(e.detail.value) + 1;
    time = time * 24;
    this.setData({
      dayIndex: e.detail.value
    })
    console.log(time);
    this.data.data.timeoutLimit = time;
    console.log(JSON.stringify(this.data.data))
  },
  stsUpdate: function () {
    var url = urlBase + '/mall/oss/sign/seller';

  },
  saveGoods: function (e) {
    var that = this;
    console.log(this.data.areaShow);
    if (this.data.areaShow) {
      var json = {
        name: "全青岛",
        longitude: 120.33,
        latitude: 36.07
      }
      that.data.data.sellLocations = [];
      that.data.data.sellLocations.push(json);
    } else {
      that.data.data.sellLocations = that.data.zones;
    }
    var allData = that.data.data;
    var oldimg = that.data.files.join(":");
    console.log(oldimg);


    console.log(JSON.stringify(this.data.data));
    allData.remaining = parseInt(allData.remaining);
    if (allData.name == '' || allData.oldPrice == '' || allData.singlePrice == '' || allData.leaderPrice == '' || allData.memberPrice == '' || allData.startTime == '' || allData.endTime == '' || allData.timeoutLimit == '' || allData.unit == '' || allData.remaining == '' || oldimg == "") {
      wx.showModal({
        title: '注意',
        content: '除商品备注可以不填，其他属性为必填项，且图片至少上传一张。',
      })
    } else {
      var newImg = [];
      var path = that.data.files;
      console.log(JSON.stringify(path));
      for (var i = 0; i < path.length; i++) {
        oss.ossUpload(path[i]).then(function (file) {
          console.log('upload done:' + file);
          newImg.push(file);
          // console.log('imgsource!!!!!!!!!!!!!: ' + imgsource);
          // if (imgsource == 'descImg') {
          //   console.log('描述图片！');
          //   showDescImgDetail(file, path);
          //   descImgNum++;
          //   imgDescShow(descImgNum);
          // } else {
          //   console.log('商品图片！')
          //   showImgDetail(file, path);
          //   imgNum++;
          //   imgaddShow(imgNum);
          // }


        }).fail(function (status) {
          console.log('failed to upload');

        });
      }

    }
  }




})

