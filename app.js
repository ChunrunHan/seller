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
    addPhoto: []
  },
  // bucket: 'yzb-mall',
  bucket: 'yezhubao-mall',
  // urlBase: 'https://dev.yezhubao.net',
  urlBase: 'https://api.yezhubao.net',
  // token: '78423abfc55e48bd9b8019c008f4155e',
  // sellerId: 'f63ef7105cf94d71015cfce10e760176',
  token: '',
  sellerId: '',
  mobile: '',
  id: '',
  realName: '',
  // ossHost: 'https://dev.yezhubao.net/oss_mall',
  ossHost: 'https://api.yezhubao.net/oss_mall'
})