// pages/map/map.js
var markers = [];
var mainWareHouse=[];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    minorWareHouse:[],
    mainWareHouse:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.showMap();
    // that.startSetInter();
  },
  showMap:function(){
    var that=this;
    that.showWareHouse()
    that.showSite();
  },
  showWareHouse:function(){
    var that=this
    wx.request({
      url: 'https://www.teamluo.cn/mudWareHouse/queryMainWareHouse',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        mainWareHouse=res.data;
        var listData = res.data;
        for (var i = 0; i < listData.length; i++) {
          console.log(listData[i].longitude)
          that.queryMinorWareHouse(listData[i].id);
          setTimeout(function(){
            var minorWareHouse=that.data.minorWareHouse;
            var contents="";
            for(let index=0;index<minorWareHouse.length;index++){
              console.log(JSON.stringify(minorWareHouse[index]));
              let house = minorWareHouse[index];
              contents+=house.serialNumber+"号仓库:"+house.remainCapacity+"/"+house.capacity+"\n";
            }
            markers = markers.concat({
              id: mainWareHouse[0].id,
              latitude: mainWareHouse[0].latitude,
              longitude: mainWareHouse[0].longitude,
              width: 50,
              height: 50,
              iconPath: '/resources/warehouse.png',
              callout: {
                content: contents,
                padding: 10,
                textAlign: 'center'
              }
            });
            that.setData({markers:markers})
          }.bind(that),100);
          
        }
        that.setData({
          markers: markers
        })
        console.log(markers);
      }
    });
  },
  test:function(event){
    console.log(event)
  },
  showSite:function(){
    var that=this
    wx.request({
      url: 'https://www.teamluo.cn/system/querySiteMapBySiteIdAndStatus',
      data: { "siteId": -1, "status": -1 },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        var listData = res.data;
        for (var i = 0; i < listData.length; i++) {
          if (listData[i].status == 0) {
            markers = markers.concat({
              id: listData[i].id,
              latitude: listData[i].latitude,
              longitude: listData[i].longitude,
              width: 60,
              height: 60,
              iconPath: '/resources/factory0.png',
              callout: {
                content: listData[i].siteName + "\n" + listData[i].telephone + "\n" + "状态：正常",
                padding: 10,
                textAlign: 'center',
                color: '#B22222'
              }
            });
          } else if (listData[i].status == 1) {
            markers = markers.concat({
              id: listData[i].id,
              latitude: listData[i].latitude,
              longitude: listData[i].longitude,
              width: 60,
              height: 60,
              iconPath: '/resources/factory7.png',
              callout: {
                content: listData[i].siteName + "\n" + listData[i].telephone + "\n" + "状态：正在处理",
                padding: 10,
                textAlign: 'center',
                color: '#B22222'
              }
            });
          } else {
            markers = markers.concat({
              id: listData[i].id,
              latitude: listData[i].latitude,
              longitude: listData[i].longitude,
              width: 60,
              height: 60,
              iconPath: '/resources/factory3.png',
              callout: {
                content: listData[i].siteName + "\n" + listData[i].telephone + "\n" + "状态：待处理",
                padding: 10,
                textAlign: 'center',
                color: '#B22222'
              }
            });
          }
        }
        console.log(markers);
        that.setData({
          markers: markers
        })
      }
    });
  }
  ,

  getCarData: function () {
    var that = this;
    wx.request({
      url: 'https://www.teamluo.cn/car/queryMapCarBySiteIdAndCarTypeAndStatus?siteId=-1&carType=-1&status=-1',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          listData: res.data
        })
        var listData = res.data;
        for (var i = 0; i < listData.length; i++) {
          if (listData[i].status == 0) {
            markers = markers.concat({
              id: listData[i].id,
              latitude: listData[i].latitude,
              longitude: listData[i].longitude,
              width: 25,
              height: 25,
              iconPath: '/resources/car.png'
            });
          } else {
            markers = markers.concat({
              id: listData[i].id,
              latitude: listData[i].latitude,
              longitude: listData[i].longitude,
              width: 30,
              height: 30,
              iconPath: '/resources/transportCar.png'
            });
          }
        }
        console.log(markers);
        that.setData({
          markers: markers
        })
      }
    })
  },

  startSetInter: function () {
    var that = this;
    setInterval(function () {
      that.getCarData();
    }, 5000)
  },
  //查询子智慧泥仓信息
  queryMinorWareHouse: function (id) {
    var that = this;
    var mudHouse;
    wx.request({
      url: 'https://www.teamluo.cn/mudWareHouse/queryMinorWareHouse',
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({minorWareHouse:res.data})
      }
    })
  },
  //查询车辆信息
  queryMapCar: function (callback) {
    var that = this;
    var carList;
    wx.request({
      url: 'https://www.teamluo.cn/car/queryMapCarBySiteIdAndCarTypeAndStatus?siteId=-1&carType=-1&status=-1',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          carList: res.data
        })
        var listData = res.data;
        for (var i = 0; i < listData.length; i++) {
          if (listData[i].status == 0) {
            markers = markers.concat({
              id: listData[i].id,
              latitude: listData[i].latitude,
              longitude: listData[i].longitude,
              width: 25,
              height: 25,
              iconPath: '/resources/car.png'
            });
          } else {
            markers = markers.concat({
              id: listData[i].id,
              latitude: listData[i].latitude,
              longitude: listData[i].longitude,
              width: 30,
              height: 30,
              iconPath: '/resources/transportCar.png'
            });
          }
        }
        console.log(markers);
        that.setData({
          markers: markers
        })
      }
    })
  },

  //查询子智慧泥仓信息
  queryWareHouse: function (callback) {
    var that = this;
    var minorWareHouseList;
    wx.request({
      url: 'https://www.teamluo.cn/mudWareHouse/queryMinorWareHouse',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          minorWareHouseList: res.data
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  //查询站点信息
  queryMapSite: function (callback) {
    var thit = this
    wx.request({
      url: 'https://www.teamluo.cn/system/querySiteMapBySiteIdAndStatus?siteId=-1&status=-1',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        thit.setData({
          siteList: res.data
        })
        return
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  //右下角站点显示模态框
  showmapsite: function () {
    var siteList = this.queryMapSite();
    this.setData({
      showMapSite: true
    })
  },
  preventTouchMove: function () { },
   /**
     * 隐藏模态对话框
     */ hideMapSite: function () { this.setData({ showMapSite: false }); }, /**
     * 对话框取消按钮点击事件
     */ onSiteCancel: function () { this.hideMapSite(); }, /**
     * 对话框确认按钮点击事件
     */ onSiteConfirm: function () { this.hideMapSite(); },

//右下角处理车显示模态框
  showtreatmentcar: function () {
    var carList = this.queryMapCar();
    this.setData({
      showtreatmentcar: true
    })
  },
   preventTouchMove: function () { }, 
   /**
     * 隐藏模态对话框
     */ hideModal: function () { this.setData({ showtreatmentcar: false }); }, /**
     * 对话框取消按钮点击事件
     */ onCancel: function () { this.hideModal(); }, /**
     * 对话框确认按钮点击事件
     */ onConfirm: function () { this.hideModal(); },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  regionchange(e) {
    console.log(e.type)
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})