// pages/map/map.js
var start_clientX;
var end_clientX;
const app = getApp()
const util = require("../../../utils/util.js")
var siteStatus = {
  NORMAL: 0,
  PROCESSING: 1,
  WATINGPROCESS: 2
};
var carType = {
  TREATMENT: 0,
  CARRIER: 1,
  ALL: -1
};
var carStatus = {
  LEISURE: 0,
  ONTHEWAY: 1,
  ARRIVAL: 2,
  NODEPARTURE: 3,
  GETBACK: 4,
  ALL: -1
};
var carInSiteInfo = {};
var siteInfoOld = {};
var longitude = 113.83040
var latitude = 20.77615
Page({

  /**
   * 页面的初始数据
   */
  data: {
    no: "",
    windowWidth: wx.getSystemInfoSync().windowWidth,
    markers: [],
    timer: '',
  
  },
  // 滑动开始
  touchstart: function (e) {
    start_clientX = e.changedTouches[0].clientX
  },
  // 滑动结束
  touchend: function (e) {
    end_clientX = e.changedTouches[0].clientX;
    if (end_clientX - start_clientX > 120) {
      this.setData({
        display: "block",
        translate: 'transform: translateX(' + this.data.windowWidth * 0.7 + 'px);'
      })
    } else if (start_clientX - end_clientX > 0) {
      this.setData({
        display: "none",
        translate: ''
      })
    }
  },
  // 头像
  showview: function () {
    this.setData({
      display: "block",
      translate: 'transform: translateX(' + this.data.windowWidth * 0.7 + 'px);'
    })
  },
  // 遮拦
  hideview: function () {
    this.setData({
      display: "none",
      translate: '',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.showSite();
    that.setData({
      no: app.globalData.userData[0].username,
    });
    app.showFactoryTabBar();    //显示自定义的底部导航
  },
/* 
//查询待审核的记录
  queryAllRecordOfOneFactory: function () {
    var that = this;
    //根据siteId查询所有处理车记录
    wx.request({
      url: app.globalData.QUERY_AllRecordOfOneFactory_URL,
      data: JSON.stringify({
        id: app.globalData.userData[0].siteId
      }),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var num=0;
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].status==2){//！！！！！！！！！！
            num++;
          }
        }
        that.setData({
          updateRecordNum: num
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })

  },
*/

  showSite: function () {
    var that = this
    wx.request({
      url: app.globalData.QUERY_SiteMapBySiteIdAndStatus_URL,
      data: {
        "siteId": app.globalData.userData[0].siteId,
        "status": -1
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          siteList: res.data,
        })
        var siteList = res.data;
        var localMarkers = that.data.markers;
        for (let i = 0; i < siteList.length; i++) {
          var site = siteList[i];
          var contents = site.siteName + "\n" + site.telephone + "\n";
          siteInfoOld[site.id] = {};
          siteInfoOld[site.id].status = site.status;
          siteInfoOld[site.id].content = contents;
          var iconPath = '/resources/factory' + site.status + '.png';
          var siteMark = {
            id: "site" + site.id,
            title: "site",
            latitude: site.latitude,
            longitude: site.longitude,
            width: 60,
            height: 60,
            iconPath: iconPath,
            callout: {
              content: contents,
              padding: 10,
              textAlign: 'center',
              color: '#B22222'
            }
          }
          localMarkers.push(siteMark)
        }
        that.setData({
          markers: localMarkers
        })
        that.flushSiteIconAndCallOutContent();
        that.setData({
          timer: setInterval(function () {
            that.flushSiteIconAndCallOutContent();
          }, 10000)
        })
        
      }
    });
  },

  flushSiteIconAndCallOutContent: function () {
    var that = this;
    wx.request({
      url: app.globalData.QUERY_SiteStatus_URL,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success:function(res) {
        console.log(res.data)
        var siteStatusNow = res.data;
        for (let i = 0; i < siteStatusNow.length; i++) {
          var site = siteStatusNow[i];
          var siteId = site.id;
          carInSiteInfo[siteId] = {}
          carInSiteInfo[siteId].carrier = {}
          carInSiteInfo[siteId].treatmentCar = {}
          that.queryCar(siteId, carType.TREATMENT, carStatus.ARRIVAL);
          that.queryCar(siteId, carType.CARRIER, carStatus.ARRIVAL);
        }
        setTimeout(function () { //延迟执行，确保数据获取
          for (let i = 0; i < siteStatusNow.length; i++) {
            var site = siteStatusNow[i];
            var siteId = parseInt(site.id);
            var iconPath = '';
            if (siteInfoOld[siteId].status != site.status) {
              iconPath = '/resources/factory' + site.status + '.png';
            }
            var content = siteInfoOld[siteId].content;
            if (site.status == 0) {
              content += "状态:正常\n"
            }
            else if (site.status == 1) {
              content += "状态:处理中\n"
            }
            else {
              content += "状态:待处理\n"
            }
            var carrierNum = carInSiteInfo[siteId].carrier.length;
            var treatmentCarNum = carInSiteInfo[siteId].treatmentCar.length;
            if (treatmentCarNum != 0) {
              content += treatmentCarNum + "辆处理车\n";
              for (let i = 0; i < treatmentCarNum; i++) {
                content += carInSiteInfo[siteId].treatmentCar[i].license + "  ";
              }
              content += "\n";
            }
            if (carrierNum != 0) {
              content += carrierNum + "辆运输车\n";
              for (let i = 0; i < carrierNum; i++) {
                content += carInSiteInfo[siteId].carrier[i].license + "  ";
              }
              content += "\n";
            }
            siteInfoOld[siteId].status = site.status; //更新status
            var localMarkers = that.data.markers;
            for (let i = 0; i < localMarkers.length; i++) {
              if (localMarkers[i].id == "site" + siteId) {
                var nowContent = "markers[" + i + "].callout.content";
                that.setData({
                  [nowContent]: content
                });
                if (iconPath != '') {
                  var newIconPath = "markers[" + i + "].iconPath";
                  that.setData({
                    [newIconPath]: iconPath
                  });
                }
                break;
              }
            }
          }
        }, 2000)
      }
    })
  },
  queryCar: function (siteId, carType, carStatus) {
    var that = this;
    wx.request({
      url: app.globalData.QUERY_MapCar_BySiteIdAndCarTypeAndStatus_URL,
      method: 'GET',
      data: {
        siteId: siteId,
        carType: carType,
        status: carStatus
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (carType == 0) {
          carInSiteInfo[siteId].treatmentCar = res.data;
        } else if (carType == 1) {
          carInSiteInfo[siteId].carrier = res.data;
        }
      }
    })
  },

  
  //查询处理车辆信息
  queryTreatmentMapCar: function (callback) {
    var that = this;
    wx.request({
      url: app.globalData.QUERY_MapCar_BySiteIdAndCarTypeAndStatus_URL,
      data: {
        siteId: app.globalData.userData[0].siteId,
        carType: 0,
        status: -1
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          treatmentCarList: res.data
        })
      }
    })
  },
  //查询运输车辆信息
  queryTransportMapCar: function (callback) {
    var that = this;
    wx.request({
      url: app.globalData.QUERY_MapCar_BySiteIdAndCarTypeAndStatus_URL,
      data: {
        siteId: app.globalData.userData[0].siteId,
        carType: 1,
        status: -1
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          transportCarList: res.data
        })
      }
    })
  },

  

  //右下角处理车显示模态框
  showtreatmentcar: function () {
    var carList = this.queryTreatmentMapCar();
    this.setData({
      showtreatmentcar: true
    })
  },
  preventTouchMove: function () { },
  /**
   * 隐藏模态对话框
   */
  hidetreatmentcarModal: function () {
    this.setData({
      showtreatmentcar: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  ontreatmentcarCancel: function () {
    this.hidetreatmentcarModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  ontreatmentcarConfirm: function () {
    this.hidetreatmentcarModal();
  },

  //右下角运输车显示模态框
  showtransportcar: function () {
    var carList = this.queryTransportMapCar();
    this.setData({
      showtransportcar: true
    })
  },
  preventTouchMove: function () { },
  /**
   * 隐藏模态对话框
   */
  hidetransportcarModal: function () {
    this.setData({
      showtransportcar: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  ontransportcarCancel: function () {
    this.hidetransportcarModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  ontransportcarConfirm: function () {
    this.hidetransportcarModal();
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
    clearInterval(this.data.timer)
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