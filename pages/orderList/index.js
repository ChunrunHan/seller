var sliderWidth = 50; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
var ajax = require('../../utils/ajax');
var oss = require('../../utils/oss');
var urlBase = app.urlBase;
var statusText = ["待支付", "待发货", "待收货", "已收货", "待评价", "已完成", "取消订单审核中", "已取消订单", "删除订单", "已经申请退货，待审核", "退货申请驳回", "退货申请通过", "退货已经发出", "已经收到退货", "将退货商品重新寄给客户", "正在退款", "退款成功","待拼团"];

Page({
  data: {
    // tabs: ["待发货", "已发货", "已收货","待退货","退货中","订单完成"],
    tabs: ["待发货", "已发货", "已收货", "订单完成", "退货申请"],
    radioItems: [
      { name: '商家配送', value: '0', checked: true },
      { name: '快递配送', value: '1' }
    ], 
    mobile: '../../images/mobile.png',
    sendMode: 0, // 配送方式
    tickets:'', // 快递单号
    showMask: true, // 模板显示
    showExpressInfo: true,
    expressList: false, //物流数据,
    isScroll:true,
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    sliderW: 0,
    // status 1:待发货 3:已发货 4:已收货 6:退货申请 7:退货中 5:订单完成
    list1: [],
    list2: [],
    list3: [],
    list4: [],
    list5: [],
    list6: [],
    expressArry:[],
    status: 2,
    statusText: '待发货',
    page: 0,
    size: 10,
    listnum: true,
    lock: false,
    sendGoodsId: '',
    json: {
      id: '',
      expressNo: '',
      carrierCode: 'shunfeng'
    },
    // express: [{ id: 'SF', name: '顺丰' }, { id: 'ZTO', name: '中通' }, { id: 'STO', name: '申通' }, { id: 'YTO', name: '圆通' }, { id: 'YD', name: '韵达' }, { id: 'GTO', name: '国通' }, { id: 'EMS', name: 'EMS' }, { id: 'HTKY', name: '百世' }, { id:'HHTT',name:'天天'}],
    express: [{ id: 'shunfeng', name: '顺丰' }, { id: 'zhongtong', name: '中通' }, { id: 'shentong', name: '申通' }, { id: 'yuantong', name: '圆通' }, { id: 'yunda', name: '韵达' }, { id: 'guotongkuaidi', name: '国通' }, { id: 'ems', name: 'EMS' }, { id: 'huitongkuaidi', name: '百世汇通' }, { id:'tiantian',name:'天天'}],
    expressIndex: 0

  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowWidth);
        that.setData({
          sliderLeft: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          sliderW: (res.windowWidth / that.data.tabs.length)
        });
      }
    });
  },
  onShow: function(){
    var that = this;
    this.setData({
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],
      list6: [],
      page: 0,
      size: 10
    })
    var expressIndex = wx.getStorageSync('expressIndex');
    console.log(expressIndex);
    if (expressIndex != '') {
      expressIndex = parseInt(expressIndex);
      that.setData({
        expressIndex: expressIndex,
        'json.carrierCode': that.data.express[expressIndex].id

      })
    }
    // var index = that.data.activeIndex.toString();
    // 获取待发货订单
    // wx.showModal({
    //   title: '请求数据index',
    //   content: index,
    // })
    this.getList(that.data.activeIndex);
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      page: 0,
      list1:[],
      list2:[],
      list3:[],
      list4:[],
      list5: [],
      list6: [],
      showMask: true,
      showExpressInfo:true,
      isScroll: true
    });
    var id = e.currentTarget.id
    console.log(id)
    this.getList(id);
  },
  onPullDownRefresh: function(e){
    console.log("下拉");
    var that = this;
    this.setData({
      page: 0,
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],
      list6: []

    })
    var index = that.data.activeIndex;
    console.log(index);
    this.getList(index,true);
  },
  onReachBottom: function(e){
    console.log(this.data.isScroll)
    if (this.data.isScroll){
      console.log("上拉");
      var that = this;
      var lock = that.data.lock;
      if (lock) {
        console.log(that.data.page++);
        var page = that.data.page++;
        console.log(page);
        this.setData({
          page: page
        });
        console.log(that.data.page);
        var index = that.data.activeIndex;
        console.log(index);
        this.getList(index);
      }
    }
   
    
  },
  getList: function(index,isDown){
    wx.showLoading({
      title: '',
    })
    var that = this;
    // var status = 1;
    // status  1:待发货 3:已发货 4:已收货 6:退货申请 7:退货中 5:订单完成
    if(index == 0){
      console.log('待发货');
      that.setData({
        status: 1,
        statusText: '待发货'
      })
    } else if(index == 1){
      console.log('已发货')
      that.setData({
        status: 3,
        statusText: '已发货'
      })
    } else if(index == 2){
      console.log('已收货')
      that.setData({
        status: 4,
        statusText: '已收货'
      })
    // } else if(index == 3){
    //   console.log('待退货')
    //   that.setData({
    //     status: 10,
    //     statusText: '待退货'
    //   }) 
    } else if (index == 4) {
      console.log('退货中')
      that.setData({
        status: 6,
        statusText: '退货中'
      })
    } else if (index == 3) {
      console.log('已完成')
      that.setData({
        status: 5,
        statusText: '订单完成'
      })
    } 

    console.log(JSON.stringify(that.data.userjson))
    that.getListValue(that.data.status, isDown);



  },
  getListValue: function (status, isDown){
    var that = this;
    that.setData({
      lock: false
    })
    wx.showLoading({
      title: '',
    })
    // urlBase + '/order/list/' + sellerId + '//2/' + page + '/' + size;
    // var url = urlBase + '/mall/order/list/group/' + app.sellerId + '/' + status+ '/'+ that.data.page + '/' + that.data.size;
    var url = urlBase + '/mall/order/group_seller/' + app.sellerId + '/' + status + '/' + that.data.page + '/' + that.data.size;
    console.log(url);
    ajax.get(url).then(function (data) {
      wx.hideLoading()
      console.log('获得数据：' + JSON.stringify(data));
      var statusCode = data.statusCode;
      var data = data.data;
      if (data.errCode == 0){
        console.log(data)
        var datalist = data.dataList;
        for(var i=0;i<datalist.length;i++){
          datalist[i].showTime = oss.formatAllDate(datalist[i].orderTime);
          datalist[i].status = statusText[datalist[i].status-1];
          if (datalist[i].goods == undefined || datalist[i].seller == undefined){
            datalist.splice(i,1);
          }else{
            var goodsImg = datalist[i].goods;
            goodsImg.images = goodsImg.images.split(':');
            console.log(goodsImg.images);
            goodsImg.images = app.ossHost + '/' + app.sellerId + '/' + goodsImg.images[0];
            console.log(goodsImg.images);
            if (datalist[i].carrierCode == "" || datalist[i].expressNo == "" || datalist[i].carrierCode == undefined || datalist[i].expressNo == undefined) {
              datalist[i].isExpress = true;
            } else {
              datalist[i].isExpress = false
            }
          }
         
         
         
        }
       // status 1:待发货 3:已发货 4:已收货 6:退货申请 7:退货中 5:订单完成
        if(that.data.status == 1){
          that.setData({
            list1: that.data.list1.concat(datalist),
            listnum: true
          })
        } else if (that.data.status == 3){
          that.setData({
            list2: that.data.list2.concat(datalist),
            listnum: true
          })
        } else if (that.data.status == 4) {
          that.setData({
            list3: that.data.list3.concat(datalist),
            listnum: true
          })
        } else if (that.data.status == 6) {
          that.setData({
            list5: that.data.list5.concat(datalist),
            listnum: true
          })
        // } else if (that.data.status == 6) {
        //   that.setData({
        //     list5: that.data.list5.concat(datalist),
        //     listnum: true
        //   })
        } else if (that.data.status == 5) {
          that.setData({
            list4: that.data.list4.concat(datalist),
            listnum: true
          })
        }

        console.log(that.data.list1)
      } else if (data.errCode == 1){
        if(that.data.page == 0){
          that.setData({
            listnum: false,
            lock: false
          })
        }else{
          that.setData({
            listnum: true,
            lock: false
          })
          wx.showToast({
            title: '没有数据了',
            icon: 'success',
            duration: 2000
          })
        }
        
      
      } else if (data.errCode != 0 && data.errCode != 1 && statusCode == 200){
          wx.showToast({
            title: data.errMsg,
            image: '../../images/alert.png',
            duration: 2000
          })
      }else{
        oss.statusHandler(statusCode)
      }

      that.setData({
        lock:true
      })

      console.log(typeof isDown)
      if (isDown) {
        wx.stopPullDownRefresh();
      }

    }).catch(function(status){
      wx.hideLoading();
      oss.statusHandler(status)
      wx.showToast({
        title: '请求超时',
        image: '../../images/alert.png',
        duration: 2000
      })
      that.setData({
        lock: true
      })
      console.log(typeof isDown)
      if (isDown) {
        wx.stopPullDownRefresh();
      }
    })

  },
  sendGood: function(e){
    console.log(e.target.id);
    var id = e.target.id;
    console.log(id);
    var that = this;
    // this.submitGoods(id);
    that.setData({
      showMask: false,
      'json.id': id,
      isScroll: false,
      'json.expressNo': ''
    })

  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var value = parseInt(e.detail.value);
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems,
      sendMode: value
    });
    console.log(this.data.radioItems);
    console.log(this.data);
  },
  openCamera: function(e){
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res);
        that.setData({
          'json.expressNo': res.result
        })
      }
    })

  },
  hiddenMask: function(e){
    this.setData({
      showMask: true,
      isScroll: true,
      sendMode: 0,
      tickets: '',
      radioItems: [
        { name: '商家配送', value: '0', checked: true },
        { name: '快递配送', value: '1' }
      ] 

    })
  },
  submitSend: function(e){
    var that = this;
    console.log(that.data.sendMode);
    var sendMode = that.data.sendMode;
    if (sendMode){
     
      if (that.data.json.expressNo == ''){
        wx.showToast({
          title: "请扫描快递单号",
          image: '../../images/alert.png',
          duration: 2000
        })
      } else if (that.data.json.carrierCode == ''){
        wx.showToast({
          title: "请输入快递公司",
          image: '../../images/alert.png',
          duration: 2000
        })
      }else{
        wx.showToast({
          title: '快递配送',
        });
        console.log(that.data.json)
        wx.setStorageSync('expressIndex', parseInt(that.data.expressIndex));
        that.startDelivering();

      }
    }else{
      wx.showToast({
        title: '商家配送',
      })
      that.setData({
        'json.expressNo': '',
        'json.carrierCode': ''
          
      });
      console.log(that.data.json)
      that.startDelivering();

    }
  },
  submitGoods:function(id){
    wx.showLoading({
      title: '',
    })
    var url = urlBase + '/mall/order/delivering/' + id;
    ajax.put(url).then(function (data) {
      console.log(JSON.stringify(data));
      wx.hideLoading();
      var statusCode = data.statusCode;
      var datalist = data.data;
      if (datalist.code === 0) {
       wx.showLoading({
         title: '提交成功'
       })
        wx.startPullDownRefresh()
      } else if (statusCode == 200 && data.code != 0){
        wx.showToast({
          title: data.errMsg,
          image: '../../images/alert.png',
          duration: 2000
        })
      } else{
        oss.statusHandler(statusCode)
      }

    }).catch(function (status) {
      wx.hideLoading();
      console.log('商户点击开始配送请求' + status)
      oss.statusHandler(status);
    });
  },
  getCarrierCode: function(e){
    console.log(e.detail.value);
    this.setData({
      'json.carrierCode': e.detail.value
    })
  },
  startDelivering: function(e){
    wx.showLoading({
      title: '',
    })
    var that = this;
    var json = that.data.json;
    console.log(json);
    var url = urlBase + '/mall/order/start_delivering';
    console.log(url);
    ajax.put(url,json).then(function (data) {
      console.log(JSON.stringify(data));
      wx.hideLoading();
      var statusCode = data.statusCode;
      var datalist = data.data;
      if (datalist.code === 0) {
        wx.showLoading({
          title: '提交成功'
        })
        that.hiddenMask();
        wx.startPullDownRefresh()
      } else if (statusCode == 200 && data.code != 0) {
        wx.showToast({
          title: data.errMsg,
          image: '../../images/alert.png',
          duration: 2000
        })
      } else {
        oss.statusHandler(statusCode)
      }

    }).catch(function (status) {
      wx.hideLoading();
      console.log('商户点击开始配送请求' + status)
      oss.statusHandler(status);
    });
  },
  callMobile: function(e){
    console.log(e.target.id);
    var mobile = e.target.id;
    wx.makePhoneCall({
      phoneNumber: mobile,
    })
  },
  bindExpressChange: function(e){
    console.log(e.detail.value);
    var index = e.detail.value; 
    var that = this;
    that.setData({
      expressIndex: index
    })
    var id = that.data.express[e.detail.value].id;
    console.log(id);
    that.setData({
      'json.carrierCode': id
    })
  },
  deliveryComplete: function(e){
    wx.showLoading({
      title: '提交中',
    })
    var id = e.target.id;
    var url = urlBase + '/mall/order/delivered/' + id;
    console.log(url);
    ajax.put(url,{}).then(function (data) {
      var statusCode = data.statusCode;
      console.log(JSON.stringify(data));
      wx.hideLoading();
      var data = data.data;
      if (data.code === 0) {
        wx.startPullDownRefresh()
      } else if (statusCode == 200 && data.code != 0) {
        wx.showToast({
          title: data.errMsg,
          image: '../../images/alert.png',
          duration: 2000
        })
      } else {
        oss.statusHandler(statusCode)
      }

    }).catch(function (status) {
      console.log('商户点击配送完成请求' + status)
      oss.statusHandler(status);
    });
  },
  showExpressInfo: function(e){
    console.log(JSON.stringify(e));
    console.log(e.target.dataset.carriercode);
    console.log(e.target.dataset.expressno);
    var shipperCode = e.target.dataset.carriercode;
    var logisticCode = e.target.dataset.expressno;
    // wx.showToast({
    //   title: '敬请期待',
    // })
    this.setData({
      showExpressInfo: false,
      isScroll: false,
      expressArry: []
    });
    this.getExpressInfo(shipperCode, logisticCode);

  },
  hiddenExpressMask: function(e){
    var that = this;
    that.setData({
      showExpressInfo: true,
      isScroll: true
    })
  },
  // 确认退货
  returnGoods:function(e){
    var that = this;
    var orderId = e.target.id;
    wx.showModal({
      title: '确认退货',
      content: '你确认同意买家退货申请',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.returnGoodsDeal(orderId,1);
        } else if (res.cancel) {
          console.log('用户点击取消')

        }
      }

    })
  },
  // 拒绝退货
  refuseReturn: function(e){
    var that = this;
    var orderId = e.target.id;
    wx.showModal({
      title: '拒绝退货',
      content: '你确认拒绝买家退货申请',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.returnGoodsDeal(orderId,0)
        } else if (res.cancel) {
          console.log('用户点击取消')

        }
      }
    })
  },
  returnGoodsDeal: function(orderId,allowed){
    // GET /order/response_refund/ { orderId } / { allowed }
    var url = urlBase + '/mall/order/response_refund/' + orderId + '/' + allowed;
    console.log(url);
    ajax.get(url).then(function (data) {
      wx.hideLoading()
      console.log('获得数据：' + JSON.stringify(data));
      var statusCode = data.statusCode;
      var data = data.data;
      if (data.code == 0) {
        wx.showLoading({
          title: '提交成功'
        })
        wx.startPullDownRefresh()
      } else if (data.code != 0 && statusCode == 200) {
        wx.showToast({
          title: data.errMsg,
          image: '../../images/alert.png',
          duration: 2000
        })
      } else {
        oss.statusHandler(statusCode)
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
// shipperCode [String] 物流公司代码
// logisticCode [String] 运单号
  getExpressInfo: function (shipperCode, logisticCode){
    wx.showLoading({
      title: '',
    })
    var url = 'https://www.kuaidi100.com/query?type=' + shipperCode + '&postid=' + logisticCode +'&id=19&valicode=&temp=0.8181859840210222'
    // var url = 'https://www.kuaidi100.com/query?type=zhongtong&postid=538062303130&id=19&valicode=&temp=0.8181859840210222'
    var that = this;
    // var url = urlBase + '/mall/express/track_query/' + shipperCode + '/' + logisticCode;
    console.log(url);
    ajax.get(url).then(function (data) {
      wx.hideLoading()
      console.log('获得数据：' + JSON.stringify(data));
      var statusCode = data.statusCode;
      var dataList = data.data;
      if (dataList.message == "ok") {
        that.setData({
          expressArry: dataList.data,
          expressList: true
        })
        
      } else if (dataList.statusCode != 200) {
        wx.showToast({
          title: dataList.errMsg,
          image: '../../images/alert.png',
          duration: 2000
        })
      } else {
        oss.statusHandler(statusCode)
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
  // 查看退货详情
  goDetail:function(e){
    console.log(e.target.id);
    var id = e.target.id;
    wx.navigateTo({
      url: `../returnDetail/index?orderId=${id}`,
    })

  }
  // scrolltoupper:function(e){
  // console.log("下拉");
  //   var that = this;
  //   this.setData({
  //     page: 0,
  //     list1: [],
  //     list2: [],
  //     list3: [],
  //     list4: [],
  //     list5: [],
  //     list6: []

  //   })
  //   var index = that.data.activeIndex;
  //   console.log(index);
  //   this.getList(index,true);
  // },
  // scrolltolower:function(e){
  // console.log("上拉");
  //   var that = this;
  //   var lock = that.data.lock;
  //   if (lock){
  //     console.log(that.data.page++);
  //     var page = that.data.page++;
  //     console.log(page);
  //     this.setData({
  //       page: page
  //     });
  //     console.log(that.data.page);
  //     var index = that.data.activeIndex;
  //     console.log(index);
  //     this.getList(index);
  //   }
  // }
});