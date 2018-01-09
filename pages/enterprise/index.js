  //index.js
var app = getApp()
var ajax = require('../../utils/ajax');
var oss = require('../../utils/oss');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var demo = new QQMapWX({
  key: 'YFBBZ-AJRKO-KAKWM-S55DU-S3K2S-UNBQK' // 必填
});
const qiniuUploader = require("../../utils/qiniuUploader");
var urlBase = app.urlBase;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: {
      type: 2,
      category: '团购-水果',//主营类目分类
      enterpriseName: '',//企业名称
      enterpriseBank: '',//企业开户银行
      enterpriseBankAccount: '',//企业开户银行号
      province: '',
      city: '',
      district: '',
      address: '',
      isUnionLicense: true,//是否三证合一

      // isUnionLicense== true 上传以下数据
      unifiedSocialCreditCode: '',//统一社会信用代码  

      // isUnionLicense== false 上传以下数据
      businessLicenseNum: '', //营业执照注册号
      businessExpireDate: '', //营业执照有效期
      organizationCode: '',  //组织机构代码
      organizationCodeExpireDate: '',//组织机构代码有效期
      taxpayerIdNum: '',//纳税人识别码
      organizationCodeCertImg: '',//组织机构代码证照片
      taxAffairsRegistrationCertificateImg: '', //税务登记证明

      // 公共部分
      businessLicenseImg: '',//营业执照
      legalRepresentative: '',//企业法人代表
      legalRepresentativeMobile: '',//企业法人代表手机号
      legalRepresentativeIdNum: '',//企业法人代表身份证号
      legalRepresentativeExpireDate: '',//法人代表身份证有效期
      legalRepresentativeImg1: '',//身份证正面
      legalRepresentativeImg2: '', //身份证反面

      sellerName: '',//店铺名称
      logo: '',//店铺logo
      managerName: '',//店铺负责人姓名
      managerMobile: ''//店铺负责人手机号

    },
    province: '请选择所在地区',
    city: '',
    district: '',
    showAddress: true,
    latitude: '',
    longitude: '',
    address: '',
    isAgree: false,
    idcarZ: [],
    idcarF: [],
    idcarH: [],
    idcarB: [],
    tax: [],
    organization: [],

    categoryIndex: 0,
    category: ['水果', '生鲜', '零食']

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      isAgree: !that.data.isAgree
    })
  },
  getThree: function (e) {
    var that = this;
    console.log(e.detail.value);
    this.setData({
      'data.isUnionLicense': e.detail.value
    })
    console.log(that.data.data);
  },
  endTimeChange: function (e) {
    var that = this;
    console.log(e.detail.value);
    console.log(e.target.dataset.mode);
    var mode = e.target.dataset.mode;
    var endtime = oss.timeToLong(e.detail.value, "end");
    var current = oss.currentTime();
    console.log(current);
    var starttime = current + 3 * 30 * 24 * 60 * 60 * 1000;
    console.log(starttime);
    console.log(oss.formatDate(starttime));
    console.log(endtime);
    if (mode == 'businessExpireDate') {
      that.setData({
        businessExpireDate: e.detail.value
      });
      that.data.data.businessExpireDate = e.detail.value;
    } else if (mode == 'organizationCodeExpireDate') {
      that.setData({
        organizationCodeExpireDate: e.detail.value
      });
      that.data.data.organizationCodeExpireDate = e.detail.value;
    } else {
      if (endtime < starttime) {
        wx.showModal({
          title: '注意',
          content: '身份证件有效期不足三个月，请换领新证后重新申请!',
        })

      } else {
        that.setData({
          endTime: e.detail.value
        });
        that.data.data.legalRepresentativeExpireDate = e.detail.value;
      }
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
              'data.province': province,
              'data.city': city,
              'data.district': district,
              'data.address': zone
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
  delImage: function (e) {
    var that = this;
    console.log(e);
    console.log(that.data.files)
    console.log(e.currentTarget.id);
    console.log(e.currentTarget.dataset.name);
    console.log(e.currentTarget.dataset.source);
    var index = e.currentTarget.id;
    var delfilename = e.currentTarget.dataset.name;
    var delfileFrom = e.currentTarget.dataset.source;
    let titlememo;
    console.log(delfileFrom);
    switch (delfileFrom) {
      case 'carB':
        titlememo = '确认删除店铺头像';
        break;
      case 'carZ':
        titlememo = '确认删除身份证正面';
        break;
      case 'carF':
        titlememo = '确认删除身份证反面';
        break;
      case 'carH':
        titlememo = '确认删除手持身份证半身照';
        break;

    }
    wx.showModal({
      title: '提示',
      content: titlememo,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var urlBase = app.urlBase;
          var url = urlBase + '/mall/oss/settlement/' + delfilename;
          console.log(delfilename)
          ajax.del(url).then(function (res) {
            console.log(JSON.stringify(res));
            if (res.data.code == 0) {
              console.log('删除成功');
              wx.showToast({
                title: '删除成功',
              })
              console.log(res);

              switch (delfileFrom) {
                case 'carB':
                  var files = that.data.idcarB;
                  console.log(files);
                  files.splice(index, 1);
                  that.setData({
                    idcarB: files
                  });
                  break;
                case 'carZ':
                  var files = that.data.idcarZ;
                  console.log(files);
                  files.splice(index, 1);
                  that.setData({
                    idcarZ: files
                  });
                  break;
                case 'carF':
                  var files = that.data.idcarF;
                  console.log(files);
                  files.splice(index, 1);
                  that.setData({
                    idcarF: files
                  });
                  break;
                case 'carH':
                  var files = that.data.idcarH;
                  console.log(files);
                  files.splice(index, 1);
                  that.setData({
                    idcarH: files
                  });
                  break;

              }

              // app.globalData.addPhoto = that.data.files;
              // console.log('全局商品图片' + app.globalData.addPhoto)



            } else {
              wx.showToast({
                title: '删除失败',
                image: '../../images/alert.png',
                duration: 2000
              })
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
  getEnterpriseName: function (e) {
    console.log(e.detail.value);
    this.setData({
      'data.enterpriseName': e.detail.value
    })
    console.log(JSON.stringify(this.data.data));
  },
  getEnterpriseBank: function (e) {
    console.log(JSON.stringify(this.data.data));
    this.setData({
      'data.enterpriseBank': e.detail.value
    })
    console.log(JSON.stringify(this.data.data));
  },
  getBackcard: function (e) {
    console.log(JSON.stringify(this.data.data));
    this.setData({
      'data.enterpriseBankAccount': e.detail.value
    })
    console.log(JSON.stringify(this.data.data));
  },
  getUnifiedSocialCreditCode: function (e) {
    console.log(JSON.stringify(this.data.data));
    this.setData({
      'data.unifiedSocialCreditCode': e.detail.value
    })
    console.log(JSON.stringify(this.data.data));
  },
  getBusinessLicenseNum: function (e) {
    console.log(JSON.stringify(this.data.data));
    this.setData({
      'data.businessLicenseNum': e.detail.value
    })
    console.log(JSON.stringify(this.data.data));
  },
  getsellerName: function (e) {
    console.log(e.detail.value);
    this.setData({
      'data.sellerName': e.detail.value
    })
    console.log(JSON.stringify(this.data.data));
  },
  getmanagerName: function (e) {
    console.log(e.detail.value);
    this.setData({
      'data.managerName': e.detail.value
    })
    console.log(JSON.stringify(this.data.data));
  },
  getmanagerMobile: function (e) {
    console.log(e.detail.value);
    this.setData({
      'data.managerMobile': e.detail.value
    });
    console.log(JSON.stringify(this.data.data));
  },
  getlegalRepresentative: function (e) {
    console.log(e.detail.value);
    this.setData({
      'data.legalRepresentative': e.detail.value
    });
    console.log(JSON.stringify(this.data.data));
  },
  getlegalRepresentativeMobile: function (e) {
    console.log(e.detail.value);
    this.setData({
      'data.legalRepresentativeMobile': e.detail.value
    })
    console.log(JSON.stringify(this.data.data));
  },
  getlegalRepresentativeIdNum: function (e) {
    console.log(e.detail.value);
    this.setData({
      'data.legalRepresentativeIdNum': e.detail.value
    })
    console.log(JSON.stringify(this.data.data));
  },
  getChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      categoryIndex: e.detail.value
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
          var filename = oss.getImgName(imgSrc, '');
          qiniuUploader.upload(imgSrc, (res) => {
            wx.showToast({
              title: '上传成功',
            });
            console.log(res);

            var img = {
              oldImg: imgSrc,
              newImg: res.key
            }
            if (imgId == 'carZ') {
              that.setData({
                idcarZ: that.data.idcarZ.concat(img)
              })
            } else if (imgId == 'carF') {
              that.setData({
                idcarF: that.data.idcarF.concat(img)
              })
            } else if (imgId == 'carH') {
              that.setData({
                idcarH: that.data.idcarH.concat(img)
              })
            } else {
              that.setData({
                idcarB: that.data.idcarB.concat(img)
              })
            }


            console.log(res)
          }, (error) => {
            console.log('error: ' + error);
          }, {
              region: 'NCN',
              domain: 'settlement.qinniu.yezhubao.net', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
              key: filename,
              uptokenURL: `${urlBase}/mall/oss/settlement`
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
    console.log(JSON.stringify(this.data));
    if (allData.managerName == '' || allData.managerMobile == '' || that.data.idcarZ == '' || allData.province == '' || allData.city == "" || allData.district == '' || allData.address == '' || allData.sellerName == '' || allData.category == '' || allData.legalRepresentative == '' || allData.legalRepresentativeMobile == '' || allData.legalRepresentativeIdNum == '' || allData.legalRepresentativeExpireDate == '' || that.data.idcarH == '' || that.data.idcarB == '' || that.data.idcarF == '' || allData.enterpriseBank == '' ) {
      wx.showModal({
        title: '注意',
        content: '所有项为必填项',
      })
    } else if (allData.enterpriseBank.length >10) {
      wx.showModal({
        title: '注意',
        content: '开户银行长度不能超过10个字符',
      })

    } else{
      if (oss.checkMobile(allData.legalRepresentativeMobile) && oss.checkMobile(allData.managerMobile)) {
        if (oss.IdentityCodeValid(allData.legalRepresentativeIdNum)) {
          if (that.data.isAgree) {
            if (oss.CheckBankNo(allData.enterpriseBankAccount)) {
              console.log('上传的数据' + JSON.stringify(that.data.data));
              wx.showLoading({
                title: '保存中',
              })
              var json = that.data.data;
              json.logo = that.data.idcarH[0].newImg;
              json.legalRepresentativeImg1 = that.data.idcarZ[0].newImg;
              json.legalRepresentativeImg2 = that.data.idcarF[0].newImg;
              json.businessLicenseImg = that.data.idcarB[0].newImg;
              console.log('上传的数据' + JSON.stringify(that.data.data));
              var url = urlBase + '/mall/seller/settlement/group';
              ajax.post(url, json).then(function (data) {
                wx.hideLoading();
                console.log(data);
                console.log(JSON.stringify(data));
                if (data.data.code == 0) {
                  wx.showToast({
                    title: '申请填写成功',
                    duration: 2000,
                    success: function () {
                      setTimeout(function () {
                        wx.navigateTo({
                          url: '../applySuccess/index?id=1'
                        })
                      }, 2000)
                    }
                  })

                } else if (data.statusCode == 200 && data.data.code !== 0) {
                  wx.showToast({
                    title: data.data.message,
                    duration: 2000
                  })
                } else {
                  oss.statusHandler(data.statusCode);
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
          } else {
            wx.showModal({
              title: '注意',
              content: '请仔细阅读并同意相关条款',
            })
          }
        }
      }
    }
  }
})

