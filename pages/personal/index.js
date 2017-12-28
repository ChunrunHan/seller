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
      type: 1,
      category: 5,
      name: '',
      address: '',
      username: '',
      mobile: '',
      Idcar: '',
      endTime: '',
      bankCard: '',
      IdcarZ: '',
      IdcarF: '',
      IdcarH: '',
      isAgree: false

    },
    province: '请选择所在地区',
    city: '',
    district: '',
    showAddress: true,
    latitude: '',
    longitude: '',
    address: '',
    endTime: '',
    isAgree: false,
    idcarZ: [],
    idcarF: [],
    idcarH: [],
    categoryIndex: 0,
    category: ['水果', '生鲜', '零食']

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
    var nowtime = oss.NowTimer();
    console.log(nowtime);
    this.data.nowTime = nowtime;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getVlue();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(JSON.stringify(this.data));
    var that = this;
    //  图片添加
    console.log('全局图片' + app.globalData.addPhoto);
    this.setData({
      files: app.globalData.addPhoto
    })
    console.log('初始化：', that.data);
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindAgreeChange: function (e) {
    var that = this;
    this.setData({
      isAgree: !that.data.isAgree,
      'data.isAgree': !that.data.isAgree
    })
  },
  // chooseImage: function (e) {
  //   var that = this;
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

  //       const src = res.tempFilePaths;
  //       wx.navigateTo({
  //         url: `../upload/upload?src=${src}`
  //       })

  //     }
  //   })
  // },
  // previewImage: function (e) {
  //   var imgs = this.data.files;
  //   console.log(this.data.files)
  //   var showImg = [];
  //   for (var i = 0; i < imgs.length; i++) {
  //     console.log(imgs[i].oldImg)
  //     showImg.push(imgs[i].oldImg);
  //   }
  //   console.log(showImg);
  //   wx.previewImage({
  //     current: e.currentTarget.id, // 当前显示图片的http链接
  //     urls: showImg // 需要预览的图片http链接列表
  //   })
  // },
  endTimeChange: function (e) {
    console.log(e.detail.value);
    var endtime = oss.timeToLong(e.detail.value, "end");
    var current = oss.currentTime();
    console.log(current);
    var starttime = current + 3 * 30 * 24 * 60 * 60 * 1000;
    console.log(starttime);
    console.log(oss.formatDate(starttime));
    console.log(endtime);
    if (endtime < starttime) {
      wx.showModal({
        title: '注意',
        content: '身份证件有效期不足三个月，请换领新证后重新申请!',
      })
    } else {
      this.setData({
        endTime: e.detail.value
      });
      this.data.data.endTime = endtime;
    }


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
        that.setData({
          address: zone,
          latitude: latitude,
          longitude: longitude,
          showAddress: false
        })


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
            // var json = {
            //   province: province,
            //   city: city,
            //   district: district,
            //   zone: zone,
            //   longitude: longitude,
            //   latitude: latitude
            // }
            that.setData({
              // zones: that.data.zones.concat(json)
              'province': province,
              'city': city,
              'district': district,
              'data.address': province + city + district + zone
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
    })
  },
  //  删除图片
  // delImage: function (e) {
  //   var that = this;
  //   console.log(that.data.files)
  //   console.log(e.currentTarget.id);
  //   console.log(e.currentTarget.dataset.name);
  //   var index = e.currentTarget.id;
  //   var delfilename = e.currentTarget.dataset.name;

  //   wx.showModal({
  //     title: '提示',
  //     content: '确定删除该头像',
  //     success: function (res) {
  //       if (res.confirm) {
  //         console.log('用户点击确定')
  //         var bucket = app.bucket;
  //         var delfile = [{
  //           bucket: bucket,
  //           object: delfilename
  //         }]
  //         var urlBase = app.urlBase;
  //         var url = urlBase + '/mall/oss/delete/seller';
  //         ajax.post(url, delfile).then(function (res) {
  //           console.log(JSON.stringify(res));
  //           if (res.data.code == 0) {
  //             console.log('删除成功');
  //             wx.showToast({
  //               title: '删除成功',
  //             })
  //             console.log(res);

  //               var files = that.data.files;
  //               console.log(files);
  //               files.splice(index, 1);
  //               that.setData({
  //                 files: files
  //               });
  //               app.globalData.addPhoto = that.data.files;
  //               console.log('全局商品图片' + app.globalData.addPhoto)



  //           } else {
  //             wx.showToast({
  //               title: '删除失败',
  //               image: '../../images/alert.png',
  //               duration: 2000
  //             })
  //           }


  //         }).catch(function (err) {
  //           console.log('oss单个文件删除', err)
  //           if (err.errMsg == "request: fail timeout"){
  //             wx.showToast({
  //               title: '删除请求超时',
  //               image: '../../images/alert.png',
  //               duration: 2000
  //             })
  //           }else{
  //             wx.showToast({
  //               title: '删除失败',
  //               image: '../../images/alert.png',
  //               duration: 2000
  //             })
  //           }


  //         })

  //       } else if (res.cancel) {
  //         console.log('用户点击取消')

  //       }
  //     }
  //   });
  // },
  getUserName: function (e) {
    console.log(e.detail.value);
    this.setData({
      'data.name': e.detail.value
    })
    console.log(JSON.stringify(this.data.data));
  },
  getMobile: function (e) {
    console.log(e.detail.value);
    this.setData({
      'data.mobile': e.detail.value
    });
    console.log(JSON.stringify(this.data.data));
  },
  getIdcar: function (e) {
    console.log(e.detail.value);
    this.setData({
      'data.Idcar': e.detail.value
    })
    console.log(JSON.stringify(this.data.data));
  },
  getBackcard: function (e) {
    console.log(e.detail.value);
    this.setData({
      'data.bankCard': e.detail.value
    })
    console.log(JSON.stringify(this.data.data));
  },
  getChange: function(e){
    console.log(e.detail.value)
    this.setData({
      categoryIndex:e.detail.value
    })
  },
  chooseIdcarImage: function (e) {
    console.log(e.target.id)
    var imgId = e.target.id;
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
              if (imgId == 'carZ') {
                that.setData({
                  idcarZ: that.data.idcarZ.concat(img)
                })
              } else if (imgId == 'carF') {
                that.setData({
                  idcarF: that.data.idcarF.concat(img)
                })
              } else {
                that.setData({
                  idcarH: that.data.idcarH.concat(img)
                })
              }


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
  // getMemo: function (e) {
  //   console.log(e.detail.value);
  //   this.setData({
  //     'data.memo': e.detail.value
  //   });
  //   console.log(JSON.stringify(this.data.data));
  // },
  // 保存信息
  submitInfo: function (e) {
    var that = this;
    var allData = that.data.data;
    console.log(JSON.stringify(this.data.data));
    if (allData.address == '' || allData.name == '' || allData.mobile == '' || that.data.address == '' || allData.bankCard == '' || allData.Idcar == "" || allData.IdcarZ == '' || allData.IdcarH == '' || allData.IdcarF == '') {
      wx.showModal({
        title: '注意',
        content: '所有项为必填项',
      })
    } else {
      if (oss.checkMobile(allData.mobile)) {
        if (that.IdentityCodeValid(allData.Idcar)) {
          if (that.data.isAgree) {
            if (that.CheckBankNo(allData.bankCard)) {
              console.log('上传的数据' + JSON.stringify(that.data.data));
              wx.showLoading({
                title: '保存中',
              })
              //   var json = that.data.data;
              //   console.log('上传的数据' + JSON.stringify(json));
              //   var url = urlBase + '/mall/seller/settlement';
              //   ajax.post(url, json).then(function (data) {
              //     wx.hideLoading();
              //     console.log(data);
              //     console.log(JSON.stringify(data));
              //     if (data.data.code == 0) {
              //       wx.showToast({
              //         title: '申请填写成功',
              //         duration: 2000,
              //         success: function () {
              //           setTimeout(function () {
              //             wx.navigateTo({
              //               url: '../applySuccess/index?id=1'
              //             })
              //           }, 2000)
              //         }
              //       })

              //     } else if (data.statusCode == 200 && data.data.code !== 0) {
              //       wx.showToast({
              //         title: data.data.message,
              //         duration: 2000
              //       })
              //     } else {
              //       oss.statusHandler(data.statusCode);
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

              // }
            }
          } else {
            wx.showModal({
              title: '注意',
              content: '请仔细阅读并同意相关条款',
            })
          }
        }
      }
    }
  },
  IdentityCodeValid: function (code) {
    var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
    var tip = "";
    var pass = true;

    if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
      tip = "身份证号格式错误";
      pass = false;
    }

    else if (!city[code.substr(0, 2)]) {
      tip = "身份证地址编码错误";
      pass = false;
    }
    else {
      //18位身份证需要验证最后一位校验位
      if (code.length == 18) {
        code = code.split('');
        //∑(ai×Wi)(mod 11)
        //加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        //校验位
        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        var sum = 0;
        var ai = 0;
        var wi = 0;
        for (var i = 0; i < 17; i++) {
          ai = code[i];
          wi = factor[i];
          sum += ai * wi;
        }
        var last = parity[sum % 11];
        if (parity[sum % 11] != code[17]) {
          tip = "身份证校验位错误";
          pass = false;
        }
      }
    }
    if (!pass) {
      wx.showModal({
        title: '注意',
        content: tip,
      })
    };
    return pass;
  },
  CheckBankNo: function (bankno) {
    if (bankno == "") {
      wx.showModal({
        title: '注意',
        content: '请填写银行卡号',
      })
      return false;
    }
    if (bankno.length < 16 || bankno.length > 19) {
      wx.showModal({
        title: '注意',
        content: '银行卡号长度必须在16到19之间',
      })
      return false;
    }
    var num = /^\d*$/; //全数字
    if (!num.exec(bankno)) {
      //      $("#banknoInfo").html("银行卡号必须全为数字");
      wx.showModal({
        title: '注意',
        content: '银行卡号必须全为数字',
      })
      return false;
    }
    //开头6位
    var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
    if (strBin.indexOf(bankno.substring(0, 2)) == -1) {
      wx.showModal({
        title: '注意',
        content: '银行卡号开头6位不符合规范',
      })
      return false;
    }
    return true;
  }
  // 上传商品图片描述
  // chooseMemoImage: function (e) {
  //   var that = this;
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
  //       var imgSrc = res.tempFiles[0].path;
  //       var filesize = res.tempFiles[0].size;
  //       console.log(imgSrc);
  //       console.log(filesize);
  //       var maxsize = 500 * 1024;
  //       console.log(filesize * 1024)
  //       if (filesize > maxsize) {
  //         wx.showModal({
  //           title: '注意',
  //           content: '图片不能大于500KB',
  //         })
  //       } else {
  //         wx.showLoading({
  //           title: '上传中',
  //         })
  //         oss.ossUpload(imgSrc).then(function (res) {
  //           wx.hideLoading();
  //           console.log(res)
  //           if (res.statusCode == 200) {
  //             wx.showToast({
  //               title: '上传成功',
  //             });
  //             console.log(res.filename);
  //             var img = {
  //               oldImg: imgSrc,
  //               newImg: res.filename
  //             }
  //             that.setData({
  //               memofiles: that.data.memofiles.concat(img)
  //             })
  //           }
  //         }).catch(function (status) {
  //           console.log('failed to upload');
  //           console.log(status);
  //           oss.statusHandler(status.statusCode);

  //         });
  //       }
  //     }
  //   })
  // }




})

