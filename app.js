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
  bucket: 'yzb-mall',
  // bucket: 'yezhubao-mall',
  urlBase: 'https://dev.yezhubao.net'
})