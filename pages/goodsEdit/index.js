//index.js
var app = getApp()
var ajax = require('../../utils/ajax');
var oss = require('../../utils/oss');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var demo = new QQMapWX({
  key: 'YFBBZ-AJRKO-KAKWM-S55DU-S3K2S-UNBQK' // 必填
});
var urlBase = app.urlBase;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: {
      available: '',
      description: '',
      images: '',
      name: '',
      oldPrice: '',
      singlePrice: '',
      leaderPrice: '',
      memberPrice: '',
      buyerLimit: 2,
      sevenDaysRefund: '',
      oneDayArrive: '',
      startTime: '',
      endTime: '',
      timeoutLimit: 24,
      sellerId: '',
      unit: '个',
      remaining: '',
      sellLocations: []
    },

    people: ['2人', '3人', '4人', '5人', '6人', '7人', '8人', '9人', '10人'],
    peopleIndex: 0,
    day: ["24小时", "48小时", "72小时"],
    dayIndex: 0,
    // memo: '',
    // memoLength: 0,
    files: [],
    zones: [],
    memofiles: [],
    areaShow: true,
    endTime: '',
    startTime: '',
    nowTime: ''



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.goodsId);
    var goodsId = options.goodsId;
    this.getGoodsDetail(goodsId);
    // wx.getStorage({
    //   key: 'token',
    //   success: function (res) {
    //     console.log(res.data);
    //   },
    // })
    // wx.getStorage({
    //   key: 'sellerId',
    //   success: function (res) {
    //     console.log(res.data);
    //   },
    // })

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
    console.log(typeof this.data)
    console.log(JSON.stringify(this.data))
    // console.log(app.globalData.addPhoto);
    console.log(JSON.stringify(this.data));
    var that = this;
    var nowtime = oss.NowTimer();
    console.log(nowtime);
    this.data.nowTime = nowtime;
    //  图片添加
    console.log('全局图片' + JSON.stringify(app.globalData.addPhoto));
    this.setData({
      files: app.globalData.addPhoto
    })
    console.log('初始化：', that.data);
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
  openConfirm: function (e) {
    var that = this;
    console.log(e.currentTarget.id);
    var delId = e.currentTarget.id;
    wx.showModal({
      title: '警告',
      content: '确定删除该商品',
      confirmText: "是",
      cancelText: "否",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          that.delGoods(delId);
        } else {
          console.log('取消删除')
        }
      }
    });
  },
  delGoods: function(id){
    wx.showLoading({
      title: '删除中',
    })
    var url = urlBase + '/mall/goods/' + id;
    ajax.del(url).then(function (data) {
      console.log('got from server: ' + JSON.stringify(data));
      var statusCode = data.statusCode;
      //	判断删除操作
      var data = data.data;
      if (data.code === 0) {
        wx.showToast({
          title: '删除成功',
        });
        wx.navigateBack({
          url: '../groupPurchase/index'
        })

      } else if(data.code == 581){
        wx.showToast({
          title: '商品不存在',
          image: '../../images/alert.png',
          duration: 2000
        })
      }else{
        oss.statusHandler(statusCode);
      }

    }).catch(function (status) {
      console.log('删除商品请求' + status)
      oss.statusHandler(status);
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

        const src = res.tempFilePaths;
        wx.navigateTo({
          url: `../upload/upload?src=${src}`
        })

      }
    })
  },
  // 上传商品图片描述
  chooseMemoImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var imgSrc = res.tempFiles[0].path;
        var filesize = res.tempFiles[0].size;
        console.log(imgSrc);
        console.log(filesize);
        var maxsize = 500 * 1024;
        console.log(filesize * 1024)
        if (filesize > maxsize) {
          wx.showModal({
            title: '注意',
            content: '图片不能大于500KB',
          })
        } else {
          wx.showLoading({
            title: '上传中',
          })
          oss.ossUpload(imgSrc).then(function (res) {
            wx.hideLoading();
            console.log(res)
            if (res.statusCode == 200) {
              wx.showToast({
                title: '上传成功',
              });
              console.log(res.filename);
              var img = {
                oldImg: imgSrc,
                newImg: res.filename
              }
              that.setData({
                memofiles: that.data.memofiles.concat(img)
              })
            }
          }).catch(function (status) {
            console.log('failed to upload');
            console.log(status);
            oss.statusHandler(status.statusCode);

          });
        }





      }
    })
  },
  previewImage: function (e) {
    var imgs = this.data.files;
    console.log(this.data.files)
    var showImg = [];
    for (var i = 0; i < imgs.length; i++) {
      console.log(imgs[i].oldImg)
      showImg.push(imgs[i].oldImg);
    }
    console.log(showImg);
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: showImg // 需要预览的图片http链接列表
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
        var latitude = res.latitude;
        var longitude = res.longitude;
        var zone = res.name;
        var province = '';
        var city = '';
        var district = '';


        //  逆地址解析
        demo.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            console.log(JSON.stringify(res));
            console.log(JSON.stringify(res.result.address_component));
            var result = res.result.address_component;
            province = result.province;
            city = result.city;
            district = result.district;
            var json = {
              province: province,
              city: city,
              district: district,
              zone: zone,
              longitude: longitude,
              latitude: latitude
            }
            that.setData({
              zones: that.data.zones.concat(json)
            })
            console.log(that.data.zones);


          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });



        // that.data.zones = that.data.zones.concat(json);



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
    console.log(e.currentTarget.dataset.source);
    var delFrom = e.currentTarget.dataset.source;
    var index = e.currentTarget.id;
    var delfilename = e.currentTarget.dataset.name;

    var delinfo = '确定删除该照片';
    if (delFrom == 'goods') {
      delinfo = '确定删除该商品图片';
    } else {
      delinfo = '确定删除该商品描述图片';
    }
    wx.showModal({
      title: '提示',
      content: delinfo,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var bucket = app.bucket;
          var delfile = [{
            bucket: bucket,
            object: delfilename
          }]
          var urlBase = app.urlBase;
          var url = urlBase + '/mall/oss/delete/seller';
          ajax.post(url, delfile).then(function (res) {
            console.log(JSON.stringify(res));
            var statusCode =res.statusCode;
            if (res.data.code == 0) {
              console.log('删除成功');
              wx.showToast({
                title: '删除成功',
              })
              console.log(res);
              if (delFrom == 'goods') {
                var files = that.data.files;
                console.log(files);
                files.splice(index, 1);
                that.setData({
                  files: files
                });
                app.globalData.addPhoto = that.data.files;
                console.log('全局商品图片' + app.globalData.addPhoto)
              } else {
                var memoFiles = that.data.memofiles;
                console.log(memoFiles);
                memoFiles.splice(index, 1);
                that.setData({
                  memofiles: memoFiles
                });

                console.log('备注图片' + that.data.memofiles);
              }


            } else {
              oss.statusHandler(statusCode);
              // wx.showToast({
              //   title: '删除失败',
              //   image: '../../images/alert.png',
              //   duration: 2000
              // })
            }


          }).catch(function (err) {
            console.log('oss单个文件删除', err)
            if (err.errMsg == "request: fail timeout") {
              wx.showToast({
                title: '删除请求超时',
                image: '../../images/alert.png',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: '删除失败',
                image: '../../images/alert.png',
                duration: 2000
              })
            }


          })

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
    // this.setData({
    //   'data.data.available': e.detail.value
    // });
    console.log(JSON.stringify(this.data));
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
  getoneDayArrive: function (e) {
    var that = this;
    console.log(e.detail.value);
    // if (e.detail.value) {
    //   wx.showModal({
    //     title: '注意',
    //     content: '上午11点之前当日达，11点之后次日送达。',
    //   });
    // }
    wx.showModal({
      title: '注意',
      content: '上午11点之前当日达，11点之后次日送达。',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            "data.oneDayArrive": e.detail.value
          })
        } else if (res.cancel) {
          that.setData({
            "data.oneDayArrive": !e.detail.value
          })
        }
      }

    });
    // this.data.data.oneDayArrive = e.detail.value
    // this.setData({
    //   'data.oneDayArrive': e.detail.value
    // })
    console.log(JSON.stringify(this.data.data));
  },
  getsevenDaysRefund: function (e) {
    var that = this;
    console.log(e.detail.value);
    if (e.detail.value) {
      wx.showModal({
        title: '注意',
        content: '消费者收货七天后，资金到账。',
        success: function (res) {
          if (res.confirm) {
            that.setData({
              "data.sevenDaysRefund": e.detail.value
            })
          } else if (res.cancel) {
            that.setData({
              "data.sevenDaysRefund": !e.detail.value
            })
          }
        }

      });
    }
    
    console.log(JSON.stringify(this.data.data));
  },
  bindPeopleChange: function (e) {
    console.log(parseInt(e.detail.value) + 2);
    var buyerLimit = parseInt(e.detail.value) + 2
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
    this.setData({
      'data.timeoutLimit': time
    })
    console.log(JSON.stringify(this.data.data))
  },
  // 商品修改
  saveGoods: function (e) {
    var that = this;
    console.log(this.data.areaShow);
    if (that.data.areaShow) {
      var json = {
        province: "山东省",
        city: "青岛市",
        district: "",
        zone: "",
        longitude: 120.38299,
        latitude: 36.06623
      }
      // that.setData({
      //   'data.sellLocations': that.data.data.sellLocations.push(json)
      // })
      console.log(json);
      that.data.data.sellLocations = [];
      that.data.data.sellLocations.push(json);
    } else {
      console.log(that.data.zones);
      that.data.data.sellLocations = that.data.zones;
    }

    var allData = that.data.data;
    var oldimg = that.data.files.join(":");
    var oldmemo = that.data.memofiles.join(":");
    console.log('图片啊啊啊啊啊啊啊 ' + oldimg);
    console.log('描述图片啊啊啊啊啊 '+oldmemo);


    console.log(JSON.stringify(this.data.data));
    allData.remaining = parseInt(allData.remaining);
    if (allData.name == '' || allData.oldPrice == '' || allData.singlePrice == '' || allData.leaderPrice == '' || allData.memberPrice == '' || allData.startTime == '' || allData.endTime == '' || allData.timeoutLimit == '' || allData.unit == '' || allData.remaining == '' || oldimg == "" || oldmemo == "") {
      wx.showModal({
        title: '注意',
        content: '商品所有属性为必填项，且商品图片和商品描述图至少上传一张。',
      })
    } else if (allData.startTime > allData.endTime) {
      wx.showModal({
        title: '注意',
        content: '开始时间不能大于结束时间',
      })
    } else if (allData.sellLocations.length == 0) {
      wx.showModal({
        title: '注意',
        content: '请选择销售地区',
      })
    } else {
      var newImg = [];
      var newMemo = [];
      var path = that.data.files;
      var desImg = that.data.memofiles;
      console.log(JSON.stringify(path));
      console.log(JSON.stringify(desImg));

      for (var i = 0; i < path.length; i++) {
        console.log(path[i].newImg)
        newImg.push(path[i].newImg);
      }

      for (var i = 0; i < desImg.length; i++) {
        console.log(desImg[i].newImg)
        newMemo.push(desImg[i].newImg);
      }

      var imgsPath = newImg.join(":");
      var desPath = newMemo.join(":");
      console.log(imgsPath);
      console.log(desPath);
      allData.images = imgsPath;
      allData.description = desPath;
      allData.sellerId = app.sellerId;
      console.log('上传的数据' + JSON.stringify(that.data.data));
      wx.showLoading({
        title: '添加中',
      })
      var json = that.data.data;
      console.log(JSON.stringify(json));
      var url = urlBase + '/mall/goods/group';
      ajax.put(url, json).then(function (data) {
        wx.hideLoading();
        console.log(data);
        console.log(JSON.stringify(data));
        if (data.data.code == 0) {
          wx.showToast({
            title: '修改成功',
            duration: 2000
          })
          wx.navigateBack({
            url: '../groupPurchase/index'
          })
        } else {
          oss.statusHandler(data.statusCode);
          // wx.showToast({
          //   title: '添加失败',
          //   image: '../../images/alert.png',
          //   duration: 2000
          // })
        }

      }).catch(function (status) {
        wx.hideLoading();
        console.log(status);
        wx.showToast({
          title: '请求超时',
          image: '../../images/alert.png',
          duration: 2000
        })
      });

    }
  },
  //  获取商品信息
  getGoodsDetail: function (goodsId) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var url = app.urlBase + '/mall/goods/group/' + goodsId;
    console.log(url);
    ajax.get(url).then(function (data) {
      wx.hideLoading();
      console.log(JSON.stringify(data));
      var statusCode = data.statusCode;
      if (data.data.errCode == 0) {
        var data = data.data.data;

        //  处理商品描述图片
        if (data.description != "") {
          var memoImgs = data.description.split(':');
          for (var i = 0; i < memoImgs.length; i++) {
            var img1 = app.ossHost + '/' + app.sellerId + '/' + memoImgs[i];
            console.log(img1);
            var json1 = {
              oldImg: img1,
              newImg: memoImgs[i]
            }
            that.setData({
              memofiles: that.data.memofiles.concat(json1)
            })
            console.log(that.data.memofiles)
          }
        }


        //  处理商品图片
        var goodsImgs = data.images.split(':');
        for (var i = 0; i < goodsImgs.length; i++) {
          var img2 = app.ossHost + '/' + app.sellerId + '/' + goodsImgs[i];
          console.log(img2);
          var json2 = {
            oldImg: img2,
            newImg: goodsImgs[i]
          }
          that.setData({
            files: that.data.files.concat(json2)
          })
          app.globalData.addPhoto = app.globalData.addPhoto.concat(json2)
          console.log(that.data.files)
        }
        console.log(that.data.images)

        //  处理成团人数
        that.setData({
          peopleIndex: data.buyerLimit - 2
        })

        //  处理拼团时间限制
        that.setData({
          dayIndex: data.timeoutLimit / 24 - 1
        })

        //  处理团购开始时间
        that.setData({
          startTime: oss.formatDate(data.startTime)
        })

        // 处理团购结束时间
        that.setData({
          endTime: oss.formatDate(data.endTime)
        })

        //  处理销售地区
        console.log(data.sellLocations);
        if (data.sellLocations.length == 1 && data.sellLocations[0].province == '山东省' && data.sellLocations[0].city == '青岛市' && data.sellLocations[0].longitude == 120.38299 && data.sellLocations[0].latitude == 36.06623) {
          that.setData({
            areaShow: true
          })
        } else {
          that.setData({
            areaShow: false
          })
          for (var i = 0; i < data.sellLocations.length;i++){
            that.setData({
              zones: that.data.zones.concat(data.sellLocations[i])
            })
            
          }

        }


        that.setData({
          data: data
        })

        console.log(JSON.stringify(that.data));
      } else {
        oss.statusHandler(statusCode);

      }
    }).catch(function (status) {
      oss.statusHandler(status);
      console.log(status)
    })
  }



})

