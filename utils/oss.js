var md5 = require('md5');
var app = getApp();
var ajax = require('ajax');
var promise = require('promise');

var wxUploadFile = promise.wxPromisify(wx.uploadFile);

function uuid() {
  var lut = [];
  for (var i = 0; i < 256; i++) { lut[i] = (i < 16 ? '0' : '') + (i).toString(16); }
  var d0 = Math.random() * 0xffffffff | 0;
  var d1 = Math.random() * 0xffffffff | 0;
  var d2 = Math.random() * 0xffffffff | 0;
  var d3 = Math.random() * 0xffffffff | 0;
  return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] +
    lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] +
    lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
    lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
}

function ossUpload(source) {
  console.log('ossUpload(' + source + ')');
  // if (this.isNullOrUndefined(source)) {
  //   defer.reject(ERROR.FILE_INVALID);
  //   return defer.promise;
  // }
  var upload = new Promise(function (resolve, reject) {

    stsUpdate().then(function (sts) {
      var ossKeyId = sts.accessKeyId;
      var signature = sts.signature;
      var policy = sts.policy;
      var dir = sts.dir;
      var host = 'https://dev.yezhubao.net/oss_mall';
      // var host = sts.host;

      if (ossKeyId === undefined || signature === undefined) {
        reject(ERROR.INVALID_PARAMS);
      }

      var pos = source.lastIndexOf('.');
      var suffix = source.substring(pos).toLowerCase();
      var filename = uuid().replace(/-/, '') + suffix;
      var keyname = dir + filename;

      wx.showLoading({
        title: '上传中',
      });


      wxUploadFile({
        url: host,
        filePath: source,
        formData: {
          'key': keyname,
          'policy': policy,
          'OSSAccessKeyId': ossKeyId,
          'signature': signature,
          'success_action_status': '200'
        },
        name: "file"
      }).then(function (res) {
        wx.hideLoading();
        res.filename = filename
        resolve(res)
      }).catch(function (err) {
        wx.hideLoading();
        console.log(err);
        reject(err)
      })
    })
  });

  return upload;
}

// get post signature
function stsUpdate(forceUpdate) {
  // var mobile = plus.storage.getItem('mobile');
  // var cache = plus.storage.getItem(mobile);

  // if (!this.isNullOrUndefined(cache)) {
  //   cache = JSON.parse(cache);
  //   var storedExpire = cache.sts.expiration;

  //   var nowTime = Date.parse(new Date());
  //   if (forceUpdate !== true && storedExpire > nowTime) {
  //     //console.log('not expired sts');
  //     defer.resolve(cache.sts);
  //     return defer.promise;
  //   }
  // }

  var urlBase = app.urlBase;
  // var url = urlBase + '/oss/sign/seller';
  var url = urlBase + "/mall/oss/sign/seller";
  console.log('ossupload图片上传url' + url);


  var getTts = new Promise(function (resolve, reject) {
    ajax.get(url).then(function (res) {
      if (res.statusCode !== 200) {
        throw (res)
      }
      console.log('res');
      console.log(res);

      console.log(res.data);
      console.log(res.data.data);
      var sts = res.data;
      if (sts.errCode !== 0) reject(sts.errorCode);
      console.log('sts=' + JSON.stringify(sts));
      var data = new Object();
      data.sts = sts.data;
      resolve(data.sts)

    }).catch(function (err) {
      console.log('fail to update sts: ', err);
      reject(err)
    })
  })
  return getTts
}


//	oss单个文件删除
function delImgFromServer(file, source) {
  bucket = app.bucket;
  var delfile = [{
    bucket: bucket,
    object: file
  }]
  console.log('删除的文件名字： ' + delfile);
  console.log('删除的文件来源： ' + source);
  urlBase = app.urlBase;
  var url = urlBase + '/oss/delete/seller';
  ajax.post(url, delfile).then(function (res) {
    console.log('删除成功');
    console.log(res.data);

  }).catch(function (status) {
    console.log('oss单个文件删除' + status)
    statusHandler(status);
  })
}

function ceshi() {
  console.log('测试')
}

function timeToLong(time, end) {
  if (end == "end") {
    end = "23:59:59";
  } else {
    end = "00:00:00";
  }
  var timer = time.replace(/-/g, "/");
  console.log(timer);
  timer = timer + ' ' + end;
  console.log(timer);
  // var timer = "2017/06/14 11:15"
  var date = new Date(timer);
  console.log(date.getTime());
  return date.getTime();
}

//	返回当前时间戳
function currentTime() {
  var timestamp = new Date();
  var year = timestamp.getFullYear();
  var month = timestamp.getMonth() + 1;
  var date = timestamp.getDate();
  var hour = timestamp.getHours();
  var minute = timestamp.getMinutes();
  if (month < 10) {
    month = '0' + month;
  }
  if (date < 10) {
    date = '0' + date;
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  if (minute < 10) {
    minute = '0' + minute;
  }
  var currentdate = year + "/" + month + "/" + date + " " + '00' + ":" + '00';
  var date = new Date(currentdate);
  currentdate = date.getTime();
  return currentdate;
}

//  获得当前时间
function NowTimer() {
  var timestamp = new Date();
  var year = timestamp.getFullYear();
  var month = timestamp.getMonth() + 1;
  var date = timestamp.getDate();
  var hour = timestamp.getHours();
  var minute = timestamp.getMinutes();
  if (month < 10) {
    month = '0' + month;
  }
  if (date < 10) {
    date = '0' + date;
  }
  var currentdate = year + '-' + month + '-' + date;
  return currentdate;
}

//判断手机号格式
function checkMobile(mobile) {
  if (!(/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(mobile))) {
    wx.showToast({
      title: '手机号格式不正确',
      image: '../../images/alert.png',
      duration: 2000
    })
    return false;
  } else {
    return true;
  }
}

module.exports = {
  ossUpload: ossUpload,
  delImgFromServer: delImgFromServer,
  ceshi: ceshi,
  timeToLong: timeToLong,
  currentTime: currentTime,
  NowTimer: NowTimer,
  checkMobile: checkMobile
}
