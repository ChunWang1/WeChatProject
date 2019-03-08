// pages/map/map.js
const app = getApp()
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
var markers = [];
var minorWareHouse = [];
var mainWareHouse = [];
var carInSiteInfo = {};
var siteInfoOld = {}
var roadCarOld=[]
var longitude = 113.83040
var latitude = 20.77615
Page({

  /**
   * 页面的初始数据
   */
  data: {
    marksers: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.showWareHouse();
    that.showSite();
    that.queryCarInRoad();
    setInterval(function () {
      that.queryCarInRoad();
    }, 2000)
    //that.showMap()
  },
  showMap: function() {
    var that = this;
    that.showWareHouse();
    that.showSite();
  },
  showWareHouse: function() {
    var that = this
    wx.request({
      url: app.globalData.QUERY_MainWareHouse_URL,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        mainWareHouse = res.data;
        for (var i = 0; i < mainWareHouse.length; i++) {
          var iconPath = '/resources/warehouse.png';
          var wareHouse = {
            id: mainWareHouse[i].id,
            latitude: mainWareHouse[i].latitude,
            longitude: mainWareHouse[i].longitude,
            width: 50,
            height: 50,
            title: "warehouse",
            iconPath: iconPath,
            callout: {
              content: "",
              padding: 10,
              textAlign: 'center',
              color: '#B22222'
            }
          }
          markers.push(wareHouse)
          that.setData({
            markers: markers
          });
          that.flushWareHouseColloutContent()
          setInterval(function() {
            that.flushWareHouseColloutContent()
          }, 10000)
        }
      }
    });
  },

  flushWareHouseColloutContent: function() {
    var that = this
    for (let i = 0; i < mainWareHouse.length; i++) {
      wx.request({
        url: app.globalData.QUERY_MinorWareHouse_URL,
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          var content = "";
          console.log(res.data)
          var minorWareHouse = res.data
          for (let index = 0; index < minorWareHouse.length; index++) {
            let house = minorWareHouse[index];
            content += house.serialNumber + "号仓库:" + house.remainCapacity + "/" + house.capacity + "\n";
          }
          that.flushWareHouseContentById(-1, content);
        }
      })
    }
  },
  flushWareHouseContentById: function (siteId, content) { //siteId=-1 denote in mudwareHouse
    var that = this
    console.log("call showCarInSiteContents")
    carInSiteInfo[siteId] = {}
    carInSiteInfo[siteId].carrier = {}
    carInSiteInfo[siteId].treatmentCar = {}
    that.queryCar(siteId, carType.TREATMENT, carStatus.LEISURE)
    that.queryCar(siteId, carType.CARRIER, carStatus.LEISURE)
    setTimeout(function () {
      var carrierNum = carInSiteInfo[siteId].carrier.length;
      var treatmentCarNum = carInSiteInfo[siteId].treatmentCar.length;
      if (treatmentCarNum != 0 && treatmentCarNum!='undefined') {
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
      var localMarkers = that.data.markers;
      for (let i = 0; i < localMarkers.length; i++) {
        if (localMarkers[i].title == "warehouse") {
          //markers[i].callout.content = content;
          var edit = "markers[" + i + "].callout.content";
          that.setData({
            [edit]: content
          });
          break;
        }
      }

    }, 2000)
  },

  showSite: function() {
    var that = this
    wx.request({
      url: app.globalData.QUERY_SiteMapBySiteIdAndStatus_URL,
      data: {
        "siteId": -1,
        "status": -1
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data)
        var siteList = res.data;
        for (let i = 0; i < siteList.length; i++) {
          var site = siteList[i];
          var contents = site.siteName + "\n" + site.telephone + "\n";
          siteInfoOld[site.id] = {}
          siteInfoOld[site.id].status = site.status;
          siteInfoOld[site.id].content = contents;
          var iconPath = '/resources/factory' + site.status + '.png';
          var siteMark={
            id: site.id,
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
          markers.push(siteMark)
        }
        that.setData({
          markers: markers
        })
        setInterval(function() {
          that.flushSiteIconAndCallOutContent();
        }, 10000)
      }
    });
  },
  flushSiteIconAndCallOutContent: function() {
    var that = this;
    wx.request({
      url: app.globalData.QUERY_SiteStatus_URL,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success(res) {
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
        setTimeout(function() { //延迟执行，确保数据获取
          for (let i = 0; i < siteStatusNow.length; i++) {
            var site = siteStatusNow[i];
            var siteId = site.id;
            var iconPath = '';
            if (siteInfoOld[siteId].status != site.status) {
              iconPath = '/resources/factory' + site.status + '.png';
            }
            var content = siteInfoOld[siteId].content;
            if(site.status==0){
              content+="状态:正常\n"
            }
            else if(siteStatus==1){
              content += "状态:处理中\n"
            }
            else{
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
              if (localMarkers[i].title == "site" && localMarkers[i].id == siteId) {
                markers[i].callout.content = content;
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
  queryCarInRoad:function(){
    var that=this
    if(roadCarOld.length!=0){
      var localMarkers=that.data.markers;
      for(let i=0;i<roadCarOld.length;i++){
        for(let j=0;j<localMarkers.length;j++){
          if(roadCarOld[i].id==localMarkers[j].id&&localMarkers[j].title=="car"){
            localMarkers.splice(j,1)
            break;
          }
        }
      }
      that.setData({
        markers:localMarkers
      })
    }
    wx.request({
      url: app.globalData.QUERY_CarInRoad_URL,
      method:'GET',
      header: {
        'content-type': 'application/json'
      },
      success(res){
        var roadCar=res.data;
        roadCarOld=roadCar;
        for (var i = 0; i < roadCar.length; i++) {
          var car = roadCar[i];
          var iconPath = '';
          if (car.carType == 0) {
            contents += '污泥处理车';
            iconPath = '/resources/car.png';
          } else {
            contents += '污泥运输车';
            iconPath = '/resources/transportCar.png';
          }
          if (car.status == 1 || car.status == 4) {
            var contents = car.license + "\n";
            if (car.status == 1) {
              if (car.siteId != null && car.siteId != '') {
                contents += "在途中\n" + "目的地:" + car.site.siteName + "\n"
              } else {
                contents += "运输中\n"
              }
            } else {
              contents += "返程中\n"
            }
            markers = markers.concat({
              id: car.id,
              title:"car",
              latitude: car.latitude,
              longitude: car.longitude,
              width: 25,
              height: 25,
              callout: {
                content: contents,
                padding: 10,
                textAlign: 'center',
                color: '#B22222'
              },
              iconPath: iconPath
            });
          }
          that.setData({
            markers: markers
          })
        }
      }
    })

  },
  queryCar: function(siteId, carType, carStatus) {
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
        //console.log(siteId+" "+JSON.stringify(res.data))
        if (carType == 0) {
          carInSiteInfo[siteId].treatmentCar = res.data;
        } else if (carType == 1) {
          carInSiteInfo[siteId].carrier = res.data;
        }
      }
    })
  },

  showCar: function() {
    var that = this;
    wx.request({
      url: app.globalData.QUERY_MapCar_BySiteIdAndCarTypeAndStatus_URL,
      data: {
        siteId: -1,
        carType: carType.ALL,
        status: carStatus.ALL
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var listData = res.data;
        for (var i = 0; i < listData.length; i++) {
          var car = listData[i];
          var iconPath = '';
          if (car.carType == 0) {
            contents += '污泥处理车';
            iconPath = '/resources/car.png';
          } else {
            contents += '污泥运输车';
            iconPath = '/resources/transportCar.png';
          }
          if (car.status == 1 || car.status == 4) {
            var contents = car.license + "\n";
            if (car.status == 1) {
              if (car.siteId != null && car.siteId != '') {
                contents += "在途中\n" + "目的地:" + car.site.siteName + "\n"
              } else {
                contents += "运输中\n"
              }
            } else {
              contents += "返程中\n"
            }
            markers = markers.concat({
              id: car.id,
              latitude: car.latitude,
              longitude: car.longitude,
              width: 25,
              height: 25,
              callout: {
                content: contents,
                padding: 10,
                textAlign: 'center',
                color: '#B22222'
              },
              iconPath: iconPath
            });
          }
          that.setData({
            markers: markers
          })
        }
      }
    })
  },
  showdetailofsite: function(event) {
    var id = event.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '../factorydetail/factorydetail?siteId=' + event.currentTarget.dataset.id,
    });
  },
  showdetailoftreatmentcar: function(event) {
    var carid = event.currentTarget.dataset.carid
    console.log(carid)
    console.log(event.currentTarget.dataset.siteid)
    wx.navigateTo({
      url: '../cardetail/cardetail?carId=' + event.currentTarget.dataset.carid + '&siteId=' + event.currentTarget.dataset.siteid,
    });
  },

  startSetInter: function() {
    var that = this;
    setInterval(function() {
      that.getCarData();
    }, 5000)
  },
  //查询子智慧泥仓信息
  queryMinorWareHouse: function(id) {
    var that = this;
    var mudHouse;
    wx.request({
      url: app.globalData.QUERY_MinorWareHouse_URL,
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        that.setData({
          minorWareHouse: res.data
        })
      }
    })
  },
  //查询车辆信息
  queryMapCar: function(callback) {
    var that = this;
    var carList;
    wx.request({
      url: app.globalData.QUERY_MapCar_BySiteIdAndCarTypeAndStatus_URL,
      data: {
        siteId: -1,
        carType: -1,
        status: -1
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data)
        that.setData({
          carList: res.data
        })
      }
    })
  },

  //查询子智慧泥仓信息
  queryWareHouse: function(callback) {
    var that = this;
    var minorWareHouseList;
    wx.request({
      url: app.globalData.QUERY_MinorWareHouse_URL,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data)
        that.setData({
          minorWareHouseList: res.data
        })
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },

  //查询站点信息
  queryMapSite: function(callback) {
    var thit = this
    wx.request({
      url: app.globalData.QUERY_SiteMapBySiteIdAndStatus_URL,
      data: {
        siteId: -1,
        status: -1
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data);
        thit.setData({
          siteList: res.data
        })
        return
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },
  //右下角站点显示模态框
  showmapsite: function() {
    var siteList = this.queryMapSite();
    this.setData({
      showMapSite: true
    })
  },
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideMapSite: function() {
    this.setData({
      showMapSite: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onSiteCancel: function() {
    this.hideMapSite();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onSiteConfirm: function() {
    this.hideMapSite();
  },

  //右下角处理车显示模态框
  showtreatmentcar: function() {
    var carList = this.queryMapCar();
    this.setData({
      showtreatmentcar: true
    })
  },
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hidetreatmentcarModal: function() {
    this.setData({
      showtreatmentcar: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  ontreatmentcarCancel: function() {
    this.hidetreatmentcarModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  ontreatmentcarConfirm: function() {
    this.hidetreatmentcarModal();
  },

  //右下角运输车显示模态框
  showtransportcar: function() {
    var carList = this.queryMapCar();
    this.setData({
      showtransportcar: true
    })
  },
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hidetransportcarModal: function() {
    this.setData({
      showtransportcar: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  ontransportcarCancel: function() {
    this.hidetransportcarModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  ontransportcarConfirm: function() {
    this.hidetransportcarModal();
  },

  //右下角智慧泥仓显示模态框
  showwarehouse: function() {
    var minorWareHouseList = this.queryWareHouse();
    this.setData({
      showwarehouse: true
    })
  },
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hidewarehouseModal: function() {
    this.setData({
      showwarehouse: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onwarehouseCancel: function() {
    this.hidewarehouseModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onwarehouseConfirm: function() {
    this.hidewarehouseModal();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  regionchange(e) {
    console.log(e.type)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})