//app.js
App({
  onLaunch: function (options) {
    // Do something initial when launch.
    console.log(options.path);
    console.log(options.query);
    console.log(options.scene);
  },
  onShow: function (options) {
    // Do something when show.
    
  },
  onHide: function () {
    // Do something when hide.
  },
  onError: function (msg) {
    console.log(msg)
  },
  globalData: {
    addPhoto: [],
    selectGoods:''
  },
  bucket: 'yzb-mall',
  urlBase: 'https://dev.yezhubao.net',
  ossHost: 'https://dev.yezhubao.net/oss_mall',
  token: '',
  sellerId: '',
  mobile: '',
  id: '',
  realName: '',
  // bucket: 'yezhubao-mall',
  // urlBase: 'https://api.yezhubao.net',
  // ossHost: 'https://api.yezhubao.net/oss_mall'
})