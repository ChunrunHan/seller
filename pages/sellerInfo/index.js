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
      name: '',
      logo: '',
      totalOrder: 100,
      totalScore: 100,
      province: '',
      city:'',
      district:'',
      address: '',
      servicePhone: '',
      latitude: '',
      longitude: ''
    },
    files: [],
    zones: [],
    areaShow: true,
    delfilename:''


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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getSellerVlue();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(JSON.stringify(this.data));
    var that = this;
    //  图片添加
    console.log('全局图片' + app.globalData.addPhoto);
    if (app.globalData.addPhoto.length != 0){
      this.setData({
        files: app.globalData.addPhoto
      })
    }
   
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
        that.setData({
          'data.address': res.name,
          'data.latitude': latitude,
          'data.longitude': longitude
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
              'data.district': district
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
    console.log(that.data.files)
    console.log(e.currentTarget.id);
    console.log(e.currentTarget.dataset.name);
    var index = e.currentTarget.id;
    var delfilename = e.currentTarget.dataset.name;

    that.setData({
      delfilename: delfilename
    });
    var files = that.data.files;
    console.log(files);
    files.splice(index, 1);
    that.setData({
      files: files
    });
    console.log(that.data.files);
    console.log(that.data.delfilename)
  
  },
  getStoreName: function (e) {
    console.log(e.detail.value);
   this.setData({
     'data.name': e.detail.value
   })
    console.log(JSON.stringify(this.data.data));
  },
  getMobile: function (e) {
    console.log(e.detail.value);
    this.setData({
      'data.servicePhone': e.detail.value
    });
    console.log(JSON.stringify(this.data.data));
  },
  // 保存信息
  submitInfo: function (e) {
    console.log('保存啊');
    var that = this;
    var allData = that.data.data;
    var oldimg = that.data.files.join(":");
    console.log(oldimg);
    console.log(JSON.stringify(this.data.data));
    if (allData.province == '' || allData.city == '' || allData.address == '' || allData.district == '' || allData.servicePhone == '' || allData.name == '' || oldimg == "") {
      wx.showModal({
        title: '注意',
        content: '店铺名称、所在地区、门店地址、头像不能为空',
      })
    } else {
      if (oss.checkMobile(allData.servicePhone)){
        var newImg = [];
        var path = that.data.files;
        console.log(JSON.stringify(path));

        for (var i = 0; i < path.length; i++) {
          console.log(path[i].newImg)
          newImg.push(path[i].newImg);
        }

        var imgsPath = newImg.join(":");
        console.log(imgsPath);

        allData.logo = imgsPath;
        allData.sellerId = app.sellerId;
        console.log('上传的数据' + JSON.stringify(that.data.data));
        wx.showLoading({
          title: '保存中',
        })
        console.log('hahahha');
        if(that.data.delfilename != ""){
          // that.delImg();
        }
        var json = that.data.data;
        console.log('上传的数据' + JSON.stringify(json));
        var url = urlBase + '/mall/seller';
        ajax.put(url, json).then(function (data) {
          wx.hideLoading();
          console.log(data);
          console.log(JSON.stringify(data));
          if (data.data.code == 0) {
            wx.showToast({
              title: '保存成功',
              duration: 2000
            })
            // wx.navigateBack({
            //   url: '../setting/index'
            // })
          } else if (data.statusCode == 200 && data.data.code !== 0){
            wx.showModal({
              title: '注意',
              content: data.data.message,
            })
          }else{

            // oss.statusHandler(data.statusCode);
            wx.showToast({
              title: '添加失败',
              image: '../../images/alert.png',
              duration: 2000
            })
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

    }
  },
  getSellerVlue:function(e){
    wx.showLoading({
      title: '',
    })
    var that = this;
    var url = urlBase + '/mall/seller/info/' + app.sellerId;
    console.log(url);
    ajax.get(url).then(function (data) {
      wx.hideLoading();
      console.log(JSON.stringify(data));
      var statusCode = data.statusCode;
      var datalist = data.data;
      
      if (datalist.errCode == 0){
        var img2 = app.ossHost + '/' + app.sellerId + '/' + datalist.data.logo;;
        console.log(img2);
        var json2 = {
          oldImg: img2,
          newImg: datalist.data.logo
        }

        var files = [];
        files.push(json2)
        that.setData({
          files: files
        })
        app.globalData.addPhoto = that.data.files;

        that.setData({
          data: datalist.data
        })
      } else if (datalist.errCode !== 0 && statusCode == 200){
        wx.showToast({
          title: datalist.message,
          duration: 2000
        })
      } else{
        oss.statusHandler(statusCode);

      }

    }).catch(function (status){
      console.log(status);
      oss.statusHandler(status);
    })
  },
  delImg: function(){
    var that = this;
    var delfilename = that.data.delfilename;
    var bucket = app.bucket;
    var delfile = [{
      bucket: bucket,
      object: delfilename
    }]
    var url = urlBase + '/mall/oss/delete/seller';
    ajax.post(url, delfile).then(function (res) {
      console.log(JSON.stringify(res));
      if (res.data.code == 0) {
        console.log('删除成功');
        wx.showToast({
          title: '删除成功',
        })
        console.log(res);

        var files = that.data.files;
        console.log(files);
        files.splice(index, 1);
        that.setData({
          files: files
        });
        app.globalData.addPhoto = that.data.files;
        console.log('全局商品图片' + app.globalData.addPhoto)



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

  }




})

