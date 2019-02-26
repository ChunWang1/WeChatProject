// pages/map/map.js
var markers = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'http://iot.hnu.edu.cn/system/queryAllSite',
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
    })
    wx.request({
      url: 'http://iot.hnu.edu.cn/mudWareHouse/queryMainWareHouse',
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
          markers = markers.concat({
            id: listData[i].id,
            latitude: listData[i].latitude,
            longitude: listData[i].longitude,
            width: 50,
            height: 50,
            iconPath: '/resources/warehouse.png'
          });
        }
        console.log(markers);
        that.setData({
          markers: markers
        })
      }
    })
    that.getCarData();
    //that.startSetInter();
  },

  getCarData: function () {
    var that = this;
    wx.request({
      url: 'http://iot.hnu.edu.cn/car/queryMapCarBySiteIdAndCarTypeAndStatus?siteId=-1&carType=-1&status=-1',
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