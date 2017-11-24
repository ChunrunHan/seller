var promise = require('promise');

var md5 = require('md5');

var ajax = promise.wxPromisify(wx.request);

var app = getApp();


var source = 'wx_lpqd_seller';
var ver = '0.3';

function getToken() {
  return app.token;
}


// 获取header
function getHeader() {
    var token = getToken();
    console.log('token' + token);
    var argNum = arguments.length;
    if (argNum > 2) {
        alert("请求参数不正确");
        return;
    }

    var url = arguments[0];
    var json = "";
    if (argNum == 2) {
        if (typeof arguments[1] == "string") {
            json = arguments[1];
        } else {
            json = JSON.stringify(arguments[1]);
        }
    }

    
    // if(url.split('/')[3] == 'sso'){
    //     var key = 'd923ce2c-7edb-46fa-92f4-4a320965d2b2';
    // }else {
    //     var key = token || '98922c26-505a-4305-9890-74bc1a2fb541';
    // }

    // var key = token || '838157ed-7bd3-4a1e-be57-cdf22d5e540d'
    
    var key = token || '4da778e6-cea5-11e7-ad62-00163e068d8f'
    

    var timestamp = Date.parse(new Date());

    var sign = md5(key + timestamp + url + json);
    sign = sign.replace(' ', '');

    var header = new Object({
        ver: ver,
        source: source,
        timestamp: timestamp,
        sign: sign,
        token: key
    });

    return header;
}

// get方法
function get(url) {
    var header = getHeader(url);
    return ajax({
        method: 'GET',
        url: url,
        dataType: 'json',
        header: header
    })
}

// post方法
function post(url, data) {
    var header = getHeader(url, data);
    return ajax({
        method: 'POST',
        url: url,
        data: data,
        dataType: 'json',
        header: header
    })
}

//  put方法
function put(url){
  var header = getHeader(url);
  return ajax({
    method: 'PUT',
    url: url,
    dataType: 'json',
    header: header
  })
}

module.exports = {
    get: get,
    post: post,
    put: put
}