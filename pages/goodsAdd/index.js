//index.js
var app = getApp()
var ajax = require('../../utils/ajax');
var oss = require('../../utils/oss');
var QQMapWX = require('../../utils/qqmap-wx-jssdk');
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
      available: true,
      description: '',
      images: '',
      name: '',
      oldPrice: '',
      singlePrice: '',
      leaderPrice: '',
      memberPrice: '',
      buyerLimit: 2,
      sevenDaysRefund: false,
      oneDayArrive: false,
      startTime: '',
      endTime: '',
      timeoutLimit: 24,
      sellerId: '',
      unit: '',
      remaining: '',
      textDescription: '',
      sellLocations: []
    },

    people: ['2人','3人', '4人', '5人', '6人', '7人', '8人', '9人', '10人'],
    peopleIndex: 0,
    day: ["24小时", "48小时", "72小时"],
    dayIndex: 0,
    textDescription: '',
    textDescriptionLength: 0,
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
    wx.getStorage({
      key: 'token',
      success: function (res) {
        console.log(res.data);
      },
    })
    wx.getStorage({
      key: 'sellerId',
      success: function (res) {
        console.log(res.data);
      },
    })
    // try {
    //   var value = wx.getStorageSync('bigData');
    //   if (value) {
    //     console.log('不是空的')
    //     that.setData({
    //       data: {}
    //     })
    //     console.log('获得数据'+ JSON.stringify(value));
    //     that.setData({
    //       data: value
    //     })
    //     that.data = value;
    //     console.log(typeof value);

    //   }
    //   console.log('存储的数据：'+value)
    //   console.log(JSON.stringify(that.data));

    // } catch (e) {
    //   // Do something when catch error
    // }
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
    wx.showLoading({
      title: '',
    })
    console.log(typeof this.data)
    console.log(JSON.stringify(this.data))
    console.log()
    // console.log(app.globalData.addPhoto);
    console.log(JSON.stringify(this.data));
    var that = this;
    var nowtime = oss.NowTimer();
    console.log(nowtime);
    this.data.nowTime = nowtime;
    //  图片添加
    console.log('全局图片' + app.globalData.addPhoto);
    this.setData({
      files: app.globalData.addPhoto
    })
    console.log('初始化：', that.data);
    wx.hideLoading()
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
                newImg: res.filename,
                showArrow: 0
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
  // 图片上显示删除、箭头
  showControlBtn: function (e) {
    console.log(e)
    console.log(e.currentTarget.dataset.index)
    console.log(e.currentTarget.dataset.source)
    console.log(e.currentTarget.dataset.showarrow);
    var showArrow = e.currentTarget.dataset.showArrow;
    var source = e.currentTarget.dataset.source;
    var index = e.currentTarget.dataset.index;
    if (source == 'goods') {
      var imgs = this.data.files;
      imgs.forEach(function (v, i) {
        console.log(i);
        if (i == index) {
          v.showArrow = !v.showArrow;
        } else {
          v.showArrow = 0;
        }

      })

      this.setData({
        files: imgs
      })

    } else if (source == 'memo') {
      var imgs = this.data.memofiles;
      imgs.forEach(function (v, i) {
        console.log(i);
        if (i == index) {
          v.showArrow = !v.showArrow;
        } else {
          v.showArrow = 0;
        }

      })
      this.setData({
        memofiles: imgs
      })

    }

  },

  //隐藏删除、箭头
  clearControlBtn: function () {
    var goodsImg = this.data.files;
    var memoImg = this.data.memofiles;
    for (var i = 0; i < goodsImg.length; i++) {
      goodsImg[i].showArrow = 0;
    }
    for (var i = 0; i < memoImg.length; i++) {
      memoImg[i].showArrow = 0;
    }
    this.setData({
      memofiles: memoImg,
      files: goodsImg
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
        console.log(res);
        console.log(res.name);
        console.log(res.address);
        console.log(res.latitude);
        console.log(res.longitude);
        var zone = res.name;
        var latitude;
        var longitude;

        // 调用接口（根据地址获取经纬度）
        demo.geocoder({
          address: res.address,
          success: function (res) {
            console.log(res.result.location);
            latitude = res.result.location.lat;
            longitude = res.result.location.lng;
            var province = '';
            var city = '';
            var district = '';
            // wx.setStorageSync("latitude", latitude );
            // console.log(wx.getStorageSync('latitude'))
            //  逆地址解析
            demo.reverseGeocoder({
              location: {
                latitude: latitude,
                longitude: longitude
              },
              success: function (res) {
                console.log(res);
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

          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });
      },
    })
  },
  // showMap: function () {
  //   var that = this;
  //   wx.chooseLocation({
  //     success: function (res) {
  //       console.log(res.name);
  //       console.log(res.address);
  //       console.log(res.latitude);
  //       console.log(res.longitude);
  //       var latitude = res.latitude;
  //       var longitude = res.longitude;
  //       var zone = res.name;
  //       var province = '';
  //       var city = '';
  //       var district = '';
       

  //       //  逆地址解析
  //       demo.reverseGeocoder({
  //         location: {
  //           latitude: latitude,
  //           longitude: longitude
  //         },
  //         success: function (res) {
  //           console.log(res);
  //           console.log(JSON.stringify(res));
  //           console.log(JSON.stringify(res.result.address_component));
  //           var result = res.result.address_component;
  //           province = result.province;
  //           city = result.city;
  //           district = result.district;
  //           var json = {
  //             province: province,
  //             city: city,
  //             district: district,
  //             zone: zone,
  //             longitude: longitude,
  //             latitude: latitude
  //           }
  //           that.setData({
  //             zones: that.data.zones.concat(json)
  //           })
  //           console.log(that.data.zones);


  //         },
  //         fail: function (res) {
  //           console.log(res);
  //         },
  //         complete: function (res) {
  //           console.log(res);
  //         }
  //       });


  //     },
  //   })
  // },
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
              wx.showToast({
                title: '删除失败',
                image: '../../images/alert.png',
                duration: 2000
              })
            }


          }).catch(function (err) {
            console.log('oss单个文件删除', err)
            if (err.errMsg == "request: fail timeout"){
              wx.showToast({
                title: '删除请求超时',
                image: '../../images/alert.png',
                duration: 2000
              })
            }else{
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
      textDescriptionLength: e.detail.value.length,
      textDescription: e.detail.value
    });
    this.data.data.textDescription = e.detail.value;
    console.log(JSON.stringify(this.data.data));
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
    if (e.detail.value) {
      // wx.showModal({
      //   title: '注意',
      //   content: '上午11点之前当日达，11点之后次日送达。',
      // });
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
    }
   
    // var oneDayArrive = e.detail.value;
    // this.setData({
    //   'data.oneDayArrive': oneDayArrive
    // })
    console.log(JSON.stringify(this.data.data));
  },
  getsevenDaysRefund: function (e) {
    var that = this;
    console.log(e.detail.value);
    if (e.detail.value) {
      // wx.showModal({
      //   title: '注意',
      //   content: '消费者收货七天后，资金到账。',
      // });
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

    // var sevenDaysRefund = e.detail.value;
    // this.setData({
    //   'data.sevenDaysRefund': sevenDaysRefund
    // })
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
  // 商品添加
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
    console.log(oldimg);
    console.log(oldmemo);


    console.log(JSON.stringify(this.data.data));
    allData.remaining = parseInt(allData.remaining);
    if (allData.name == '' || allData.oldPrice == '' || allData.singlePrice == '' || allData.leaderPrice == '' || allData.memberPrice == '' || allData.startTime == '' || allData.endTime == '' || allData.timeoutLimit == '' || allData.unit == '' || allData.remaining == '' || oldimg == "" || oldmemo == "") {
      wx.showModal({
        title: '注意',
        content: '商品所有属性为必填项，且商品图片和商品描述图至少上传一张。'
      })
    } else if (allData.startTime > allData.endTime) {
      wx.showModal({
        title: '注意',
        content: '开始时间不能大于结束时间'
      })
    } else if (allData.name.length < 3) {
      wx.showModal({
        title: '注意',
        content: '商品名称至少三个字'
      })
    } else if (allData.sellLocations.length == 0) {
      wx.showModal({
        title: '注意',
        content: '请选择销售地区'
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
      var newgoods = that.data.data;
      console.log('上传的数据' + JSON.stringify(newgoods));
      var url = urlBase + '/mall/goods/group';
      ajax.post(url, newgoods).then(function (data) {
        wx.hideLoading();
        console.log(data);
        console.log(JSON.stringify(data));
        if (data.data.code == 0) {
          wx.showToast({
            title: '添加成功',
            duration: 2000
          })
          wx.navigateBack({
            url: '../goodsAdd/index'
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
        console.log(status.errMsg);
        wx.showToast({
          title: '请求超时',
          image: '../../images/alert.png',
          duration: 2000
        })
      });

    }
  },

  // 左右移动图片
  chageImgPositon: function (e) {
    var _this = this;
    console.log('来源' + e.currentTarget.dataset.source)
    console.log('方向' + e.currentTarget.dataset.direction)
    console.log('index' + e.currentTarget.dataset.index)
    let source = e.currentTarget.dataset.source;
    let direction = e.currentTarget.dataset.direction;
    let index = e.currentTarget.dataset.index;
    if (source == 'goods') {
      if (direction == 'left') {
        console.log('左移动');
        console.log('files图：' + JSON.stringify(_this.data.files));
        console.log('当前图：' + JSON.stringify(_this.data.files[index]))
        if (_this.data.files.length == 1 || index == 0) {
          wx.showModal({
            title: '注意',
            content: '当前图片已经是第一张了',
          })
        } else {
          // console.log('左移动之前' + JSON.stringify(_this.data.files))
          let can = _this.data.files[index];
          _this.data.files[index] = _this.data.files[index - 1];
          _this.data.files[index - 1] = can;
          console.log("左移动之后" + JSON.stringify(_this.data.files))
          _this.setData({
            files: _this.data.files
          })
          app.globalData.addPhoto = _this.data.files

        }
      } else {
        console.log('右移动');
        console.log('files图：' + JSON.stringify(_this.data.files));
        console.log('当前图：' + JSON.stringify(_this.data.files[index]))
        if (_this.data.files.length == 1 || index == _this.data.files.length - 1) {
          wx.showModal({
            title: '注意',
            content: '当前图片已经是最后一张了',
          })
        } else {
          let can = _this.data.files[index];
          _this.data.files[index] = _this.data.files[index + 1];
          _this.data.files[index + 1] = can;
          console.log("右移动之后" + JSON.stringify(_this.data.files))
          _this.setData({
            files: _this.data.files
          })
          app.globalData.addPhoto = _this.data.files
        }
      }

    } else if (source == 'memo') {
      if (direction == 'top') {
        console.log('上移动');
        console.log('memofiles图：' + JSON.stringify(_this.data.memofiles));
        console.log('当前图：' + JSON.stringify(_this.data.memofiles[index]))
        if (_this.data.memofiles.length == 1 || index == 0) {
          wx.showModal({
            title: '注意',
            content: '当前图片已经是第一张了',
          })
        } else {
          // console.log('左移动之前' + JSON.stringify(_this.data.files))
          let can = _this.data.memofiles[index];
          _this.data.memofiles[index] = _this.data.memofiles[index - 1];
          _this.data.memofiles[index - 1] = can;
          console.log("上移动之后" + JSON.stringify(_this.data.memofiles))
          _this.setData({
            memofiles: _this.data.memofiles
          })

        }
      } else {
        console.log('下移动');
        console.log('memofiles图：' + JSON.stringify(_this.data.memofiles));
        console.log('当前图：' + JSON.stringify(_this.data.memofiles[index]))
        if (_this.data.memofiles.length == 1 || index == _this.data.memofiles.length - 1) {
          wx.showModal({
            title: '注意',
            content: '当前图片已经是最后一张了',
          })
        } else {
          let can = _this.data.memofiles[index];
          _this.data.memofiles[index] = _this.data.memofiles[index + 1];
          _this.data.memofiles[index + 1] = can;
          console.log("下移动之后" + JSON.stringify(_this.data.memofiles))
          _this.setData({
            memofiles: _this.data.memofiles
          })
        }
      }
 
    }

  }





})

