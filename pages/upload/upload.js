import weCropper from '../../utils/weCropper.js'
var oss = require('../../utils/oss');
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50
var app = getApp(); 

Page({
  data:  {
  	cropperOpt: {
			id: 'cropper',
			width,
			height,
			scale: 2.5,
			zoom: 8,
			cut: {
				x: (width - 300) / 2,
				y: (height - 300) / 2,
				width: 300,
				height: 300
			}
		}
	},
  touchStart (e) {
    this.wecropper.touchStart(e)
  },
  touchMove (e) {
    this.wecropper.touchMove(e)
  },
  touchEnd (e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage () {
    this.wecropper.getCropperImage((avatar) => {
      if (avatar) {
        //  获取到裁剪后的图片
        console.log(avatar);
        //  图片上传

        // app.globalData.addPhoto = app.globalData.addPhoto.concat(avatar);
        // wx.redirectTo({
        //   url: '',
        // })
        wx.showLoading({
          title: '上传中',
        })
        oss.ossUpload(avatar).then(function (res) {
          wx.hideLoading();
          console.log(res)
          if (res.statusCode == 200){
            wx.showToast({
              title: '上传成功',
            });
            console.log(res.filename);
            var img = {
              oldImg: avatar,
              newImg: res.filename,
              showArrow: 0
            }
            app.globalData.addPhoto = app.globalData.addPhoto.concat(img);
            wx.navigateBack({
              
            })
          }
          // console.log('upload done:' + file);
          // app.globalData.addPhoto = app.globalData.addPhoto.concat(file);
          //  wx.navigateBack({
          // url: '../goodsAdd/index?avatar=${avatar}'
        // });

        }).catch(function (status) {
          console.log('failed to upload');
          console.log(status);
          oss.statusHandler(status.statusCode);

        });
       
      } else {
        console.log('获取图片失败，请稍后重试')
      }
    })
  },
  uploadTap () {
  	const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        let src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

				self.wecropper.pushOrign(src)
      }
    })
  },
  onLoad (option) {
    // do something
		const { cropperOpt } = this.data
    const { src } = option
    if (src) {
      Object.assign(cropperOpt, { src })

			new weCropper(cropperOpt)
				.on('ready', function (ctx) {
					console.log(`wecropper is ready for work!`)
				})
				.on('beforeImageLoad', (ctx) => {
					console.log(`before picture loaded, i can do something`)
					console.log(`current canvas context:`, ctx)
					wx.showToast({
						title: '上传中',
						icon: 'loading',
						duration: 20000
					})
				})
				.on('imageLoad', (ctx) => {
					console.log(`picture loaded`)
					console.log(`current canvas context:`, ctx)
					wx.hideToast()
				})
    }
  },
  back: function(){
    wx.navigateBack({
      url: '../goodsAdd/index'
    })
  }
})
