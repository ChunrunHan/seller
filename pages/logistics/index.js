var app = getApp()
var ajax = require('../../utils/ajax');
var oss = require('../../utils/oss');
var urlBase = app.urlBase;
var loading = false
Page({
    data: {
      imgUrl: app.ossHost,
      sellerid:'',
      goodsImages: '',
      expressStatus: '无订单状态', //orderStatus[nu_state]
      company:'快递公司',
      num:'快递号',
      orderid:'商品单号',
      yes: true,
      expressList:[],
      lenght: '',
      more: '没有更多数据',
      nogoods: '../../images/goodsinfo.svg'


      

    },
    onLoad: function (options) {
        var _this = this;
        console.log('参数'+options.info) 
        var goodsInfo = options.info.split(":");
        var orderId = goodsInfo[0];
        var company = goodsInfo[1];
        var num = goodsInfo[2];
        var sellerid = goodsInfo[3];
        var img = goodsInfo[4] +':'+ goodsInfo[5];
        this.setData({
          sellerid: sellerid,
          goodsImages: img,
          company: _this.companyCode[company],
          num: num,
          orderid: orderId
        })
        this.getExpressList(orderId,company,num);
        // this.getGoodsInfo();

    },
    onShow: function (options) {
      console.log('执行啊');
        
    },
    getExpressList: function (orderId, company, num){
      console.log('获取快递信息');
      var _this = this
      wx.showLoading({
        title: '加载中',
      })
      // var url = 'https://dev.yezhubao.net/express/query/43251155/yunda/3831750321651'
      var url = urlBase + '/express/query/' + orderId + '/' + company + '/' + num;
      console.log(url);
      ajax.get(url).then(function (res) {
        wx.hideLoading()
        console.log('获得数据：' + JSON.stringify(res));
        if (res.data.errCode == 0) {
          var dataList = res.data.dataList;
          for (var i = 0; i < dataList.length; i++) {
            var cTime = dataList[i].time.split(" ");
            dataList[i].date = cTime[0].split("-")[1] + '-' + cTime[0].split("-")[2];
            dataList[i].time = cTime[1];
            dataList[i].nuState = _this.orderStatus[dataList[i].nu_state]
          }
          console.log(dataList)
          _this.setData({
            expressList: dataList,
            expressStatus: _this.orderStatus[res.data.nu_state],
            lenght: dataList.length - 1
          })
          console.log(_this.data)
        } else {
          wx.hideLoading();
          // $.alert(res.data.errMsg);
          _this.setData({
            yes: false
          })
        }

      }).catch(function (status) {
        wx.hideLoading();
        oss.statusHandler(status)
        wx.showToast({
          title: '请求超时',
          image: '../../images/alert.png',
          duration: 2000
        })
      })
    },
    companyCode: {
        'yunda': '韵达',
        'shunfeng': '顺丰',
        'shentong': '申通',
        'yuantong': '圆通',
        'zhongtong': '中通',
        'huitongkuaidi': '汇通',
        'tiantian': '天天',
        'debangwuliu': '德邦',
        'guotongkuaidi': '国通',
        'ems': 'EMS'
    },
    orderStatus: {
      '0': '在途中',
      '1': '已揽收',
      '2': '疑难',
      '3': '已签收',
      '4': '退签',
      '5': '同城派送中',
      '6': '退回等状态'
    }
})