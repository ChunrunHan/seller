var sliderWidth = 50; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
var ajax = require('../../utils/ajax');
var oss = require('../../utils/oss');
var urlBase = app.urlBase;
Page({
  data: {
    tabs: ["待发货", "已发货","已收货","入账货款"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    sliderW: 0,
    // status 1:待审核 2:代发货 3:已发货 4:已转账
    list1:[],
    list2: [],
    list3: [],
    list4: [],
    status: 2,
    userjson: {
      sellerId: '',
      status: 1
    },
    page: 0,
    size: 10,
    listnum: true,
    lock: false

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
    // this.setData({
    //   'userjson.sellerId': app.sellerId
    // });
    this.getList(0);
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      page: 0,
      list1:[],
      list2:[],
      list3:[],
      list4:[]
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
      list4: []
    })
    var index = that.data.activeIndex;
    console.log(index);
    // this.getList(index);
  },
  onReachBottom: function(e){
    console.log("上拉");
    var that = this;
    var lock = that.data.lock;
    if (lock){
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
    
  },
  getList: function(index){
    var that = this;
    // var status = 1;
  // 2:代发货 3:已发货 3:已收货 4:已取消
    if(index == 0){
      // status = 1
      console.log('待审核');
      that.setData({
        status: 2
      })
    }else if(index == 1){
      // status = 3
      console.log('待转账')
      that.setData({
        status: 3
      })
    }else if(index == 2){
      // status = 2
      console.log('已拒绝')
      that.setData({
        status: 3
      })
    }else if(index == 3){
      // status = 4
      console.log('已转账')
      that.setData({
        status: 3
      }) 
    }

    console.log(JSON.stringify(that.data.userjson))
    that.getListValue(that.data.status);



  },
  getListValue: function (status){
    var that = this;
    that.setData({
      lock: false
    })
    wx.showLoading({
      title: '',
    })
    // urlBase + '/order/list/' + sellerId + '//2/' + page + '/' + size;
    var url = urlBase + '/mall/order/list/' + app.sellerId + '//' + status+ '/'+ that.data.page + '/' + that.data.size;
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
          datalist[i].createDateTime = oss.formatAllDate(datalist[i].createDateTime);
        }
        if(that.data.userjson.status == 1){
          that.setData({
            list1: that.data.list1.concat(datalist),
            listnum: true
          })
        } else if (that.data.userjson.status == 2){
          that.setData({
            list3: that.data.list3.concat(datalist),
            listnum: true
          })
        } else if (that.data.userjson.status == 3) {
          that.setData({
            list2: that.data.list2.concat(datalist),
            listnum: true
          })
        } else if (that.data.userjson.status == 4) {
          that.setData({
            list4: that.data.list4.concat(datalist),
            listnum: true
          })
        }

        

        console.log(that.data.list1)
      } else if (data.errCode == 1){
        if(that.data.page == 0){
          that.setData({
            listnum: false
          })
        }else{
          that.setData({
            listnum: true
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
    })

  }
});