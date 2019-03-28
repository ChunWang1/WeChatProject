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
var minorWareHouse = [];
var mainWareHouse = [];
var carInSiteInfo = {};
var siteInfoOld = {}
var roadCarOld = []
var longitude = 113.83040
var latitude = 20.77615
var nowStatus=0;
var wareHouseFirst=true;
var desType=0;
var selectWarehouseId;
var selectSludgeFunction;
var sludgeAddress;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    no: "",
    windowWidth: wx.getSystemInfoSync().windowWidth,
    markers: [],
    sludgeModalVisible:true,
    wareHouseSelectVisible:false,
    functionSelectVisible:false,
    showModalStatus: false,
    mapVisible:false,
    selectArray: [{
      "id": "1",
      "text": "泥仓"
    }, {
      "id": "2",
      "text": "直接前往目的地"
    }],
    wareHouseArray:[],
    sludgeFuncArray:[]
  },
  // 滑动开始
  touchstart: function(e) {
    start_clientX = e.changedTouches[0].clientX
  },
  // 滑动结束
  touchend: function(e) {
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
  showview: function() {
    this.setData({
      display: "block",
      translate: 'transform: translateX(' + this.data.windowWidth * 0.7 + 'px);'
    })
  },
  // 遮拦
  hideview: function() {
    this.setData({
      display: "none",
      translate: '',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      no: app.globalData.userData[0].username,
      userId: app.globalData.userData[0].id,
    });
    that.showWareHouse();
    that.querySludgeFunction();
    that.queryCarInRoad();
    setInterval(function() {
      that.queryCarInRoad();
    }, 5000)
    console.log(that.data.userId)
  },

  querySludgeFunction:function(){
    var that=this;
    wx.request({
      url: app.globalData.QUERY_querySludgeFunction_URL,
      method:"GET",
      success:function(res){
        var func=res.data;
        var localSludgeFun=that.data.sludgeFuncArray;
        for (let i = 0; i < func.length;i++){
         var sludgeFunc={id:func[i].id,text:func[i].function}
         localSludgeFun.push(sludgeFunc);
       }
       that.setData({
         sludgeFuncArray: localSludgeFun
       })
      }
    })
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
        var localMarkers = that.data.markers;
        for (var i = 0; i < mainWareHouse.length; i++) {
          var iconPath = '/resources/warehouse.png';
          var wareHouse = {
            id: "warehouse" + mainWareHouse[i].id,
            title: "warehouse",
            latitude: mainWareHouse[i].latitude,
            longitude: mainWareHouse[i].longitude,
            width: 50,
            height: 50,
            iconPath: iconPath,
            callout: {
              content: "",
              padding: 10,
              textAlign: 'center',
              color: '#B22222'
            }
          }
          localMarkers.push(wareHouse)
        }
        that.setData({
          markers: localMarkers
        });
        //console.log(85+":"+JSON.stringify(that.data.markers))
        that.flushWareHouseColloutContent()
        setInterval(function() {
          that.flushWareHouseColloutContent()
        }, 10000)
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
          var minorWareHouse = res.data;
          
          for (let index = 0; index < minorWareHouse.length; index++) {
            let house = minorWareHouse[index];
            content += house.serialNumber + "号仓库:" + house.remainCapacity + "/" + house.capacity + "\n";
          }
          console.log(JSON.stringify(that.data.wareHouseArray))
          var localMarkers = that.data.markers;
          for (let i = 0; i < localMarkers.length; i++) {
            if (localMarkers[i].title == "warehouse") {
              var edit = "markers[" + i + "].callout.content";
              that.setData({
                [edit]: content
              });
              break;
            }
          }
        }
      })
    }
  },

  queryCarInRoad: function() {
    var that = this
    //先清除记录
    if (roadCarOld.length != 0) {
      var localMarkers = that.data.markers;
      for (let i = 0; i < roadCarOld.length; i++) {
        for (let j = 0; j < localMarkers.length; j++) {
          if ("car" + roadCarOld[i].id == localMarkers[j].id) {
            localMarkers.splice(j, 1)
            break;
          }
        }
      }
      that.setData({
        markers: localMarkers
      })
    }
    wx.request({
      url: app.globalData.QUERY_queryWorkerMapCar_URL,
      data: {
        "userId": that.data.userId
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        var roadCar = res.data;
        if (app.globalData.userData[0].carId == null) {
          app.globalData.userData[0].carId = roadCar[0].id;
        }
        roadCarOld = roadCar;
        var localMarkers = that.data.markers;
        for (var i = 0; i < roadCar.length; i++) {
          var contents = '';
          var car = roadCar[i];
          that.flushCarStatus(car);
          that.setData({
            siteId: car.siteId,
          })
          var iconPath = '';
          if (car.carType == 0) {
            contents += '类型:污泥处理车\n';
            iconPath = '/resources/car.png';
          } else {
            contents += '类型:污泥运输车\n';
            iconPath = '/resources/transportCar.png';
          }
          contents += "车牌:" + car.license + "\n";
          if (car.status == 0) {
            contents += "空闲\n"
          } else if (car.status == 1) {
            if (car.siteId != null && car.siteId != '') {
              contents += "在途中\n" + "目的地:" + car.site.siteName + "\n"
            } else {
              contents += "运输中\n"
            }
          } else if (car.status == 2) {
            contents += "已到达\n"
          } else if (car.status == 3) {
            contents += "请前往目的地\n"
          } else if (car.status == 4) {
            contents += "返程中\n"
          }
          var carMarker = ({
            id: "car" + car.id,
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
          localMarkers.push(carMarker);
          if (car.siteId != 0) {
            var site = car.site;
            if (localMarkers.length < 3) {
              var contents = site.siteName + "\n" + site.telephone + "\n";
              siteInfoOld[site.id] = {}
              siteInfoOld[site.id].status = site.status;
              siteInfoOld[site.id].contents = contents;
              var iconPath = '/resources/factory' + site.status + '.png';
              if (site.status == 0) {
                contents += "状态:正常\n"
              } else if (site.status == 1) {
                contents += "状态:处理中\n"
              } else {
                contents += "状态:待处理\n"
              }
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
              localMarkers.push(siteMark);
            } else {
              if (site.status != siteInfoOld[site.id].status) {
                var iconPath = '/resources/factory' + site.status + '.png';
                var contents = siteInfoOld[site.id].contents;
                if (site.status == 0) {
                  contents += "状态:正常\n"
                } else if (site.status == 1) {
                  contents += "状态:处理中\n"
                } else {
                  contents += "状态:待处理\n"
                }
                siteInfoOld[site.id].status = site.status;
                for (let i = 0; i < localMarkers.length; i++) {
                  if (localMarkers[i].id == "site" + site.id) {
                    localMarkers[i].iconPath = iconPath;
                    localMarkers[i].callout.content = contents;
                    // var newIconPath = "markers[" + i + "].iconPath";
                    // var newContents = "markers[" + i + "].callout.content";
                    // that.setData({
                    //   [newIconPath]: iconPath,
                    //   [newContents]: contents
                    // });
                    break;
                  }
                }
              }
            }
            that.setData({
              destination: site.siteName,
            })
          } else {
            if(car.status==0){
              that.setData({
                destination: "无"
              })
            }
            if (car.status == 4){
              that.setData({
                destination: "泥仓"
              })
            }
            if(localMarkers.length>=3){
              for (let j = 0; j < localMarkers.length; j++) {
                if ("site" == localMarkers[j].title) {
                  localMarkers.splice(j, 1)
                  break;
                }
              }
            }
          }
        }
        that.setData({
          markers: localMarkers
        })
      }
    })
  },

  getDesType:function(e){
    var that=this;
    desType=e.detail.id;
    console.log(e.detail)
    if (e.detail.id == 1 && e.detail.text=="泥仓"){
      that.setData({
        wareHouseSelectVisible:true,
        functionSelectVisible:false
      })
    }
    else if (e.detail.id == 2 && e.detail.text == "直接前往目的地"){
      that.setData({
        wareHouseSelectVisible: false,
        functionSelectVisible: true
      })
      this.setData({
        address: ""
      })
    }
  },

  setId:function(e){
    console.log(e.detail)
    if(desType==1){ //目的地
      selectWarehouseId=e.detail.id;
      this.setData({
        address:e.detail.text
      })
    }
    else{
      selectSludgeFunction = e.detail.text;
    }
  },

  inputRFID:function(e){
    console.log(e.detail.value)
    this.setData({
      rfid: e.detail.value
    })
  },

  inputWeight:function(e){
    this.setData({
      weight: e.detail.value
    })
  },
  inputAddress:function(e){
    this.setData({
      address: e.detail.value
    })
  },
  confirm:function(e){
    var that=this;
    var postData = {
      id: this.data.sludgeId,
      rfidString: this.data.rfid,
      weight: this.data.weight,
      minorMudWareHouseId: selectWarehouseId,
      destinationAddress: this.data.address
    }
    if(desType==1){ 
      postData.minorMudWareHouseId = selectWarehouseId;
    }
    else{
      var sludgeFunction = {
        function: selectSludgeFunction
      }
      postData.sludgeFunction = sludgeFunction;
    }
    wx.request({
      url: app.globalData.UPDATE_updateSludgeVirtualToRealByDriver_URL,
      method:"POST",
      data:JSON.stringify(postData),
      header:{
        contentType: "application/json",
      },
      success:function(res){
        if(res.data=="SUCCESS"){
          console.log(res.data)
          wx.showToast({
            title: '添加成功',
            icon:'success',
            success:function(){
              that.setData({
                sludgeModalVisible:true,
                mapVisible: false,
                destination:that.data.address
              })
            }
          })
          that.updateCarStatus()
        }
      }
    })
  },
  cancel:function(){
    this.setData({
      sludgeModalVisible: true,
      mapVisible:false
    })
  },

  updateStatusButton(){
    var that=this;
    if(nowStatus==2 && that.data.siteId!=0){
      that.queryVirtualSludge();
      that.queryMinorWareHouse();
      that.setData({
        sludgeModalVisible: false, 
        mapVisible:true
      })
    }
    else{
      that.updateCarStatus();
    }
  },

  queryVirtualSludge:function(){
    var that=this;
    wx.request({
      url: app.globalData.QUERY_querySludgeByUserIdAndStatus_URL,
      method:"GET",
      data:{
        driverId:app.globalData.userData[0].id,
        status:"(6)",
      },
      success:function(res){
        that.setData({
          sludgeId:res.data[0].id
        })
      }
    })
  },

  updateCarStatus:function(){
    var that=this;
    wx.request({
      url: app.globalData.UPDATE_updateCarStatus_URL,
      method:'POST',
      data: JSON.stringify({
        driverId: app.globalData.userData[0].id,
        nowStatus: nowStatus
      }),
      dataType:'json',
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        var car=res.data;
        if (car.status == 0) { //空闲状态
          that.setData({
            statusDes: "暂无任务",
          })
          nowStatus = 0;
          //$("#updateCarStatusButton").attr("disabled", true);
        } else if (car.status == 1) { //在途中
          if (car.siteId != 0) {
            that.setData({
              statusDes: "已到达工厂",
            })
          } else {
            that.setData({
              statusDes: "已到达目的地",
            })
          }
          nowStatus = 1;
        } else if (car.status == 2) { //已经到达状态
          if (car.carType == 0) { //如果是处理车
            that.setData({
              statusDes: "处理完成,返程",
            })
          } else if (car.carType == 1) { //如果是运输车
            if (car.siteId != 0) { //!=0
              that.setData({
                statusDes: "添加装箱记录",
              })
            } else {
              that.setData({
                statusDes: "卸货完成,返程",
              })
            }
          }
          nowStatus = 2;
          //$("#updateCarStatusButton").attr("disabled", false);
        } else if (car.status == 3) { //如果是分配但是为出发状态
          that.setData({
            statusDes: "前往工厂",
          })
          nowStatus = 3;
        } else if (car.status == 4) { //返程状态
          that.setData({
            statusDes: "到达仓库",
          })
          nowStatus = 4;
        }
      }
    })
  },

  showdetailoftreatmentcar: function(event) {
    console.log(event)
    var carId = app.globalData.userData[0].carId;
    wx.navigateTo({
      url: '../treatcardetail/treatcardetail?carId=' + carId
    });
  },

  flushCarStatus:function(car){
    var that=this;
    if (car.status == 0) { //空闲状态
      that.setData({
        statusDes:"暂无任务",
      })
      nowStatus=0;
      //$("#updateCarStatusButton").attr("disabled", true);
    } else if (car.status == 1) { //在途中
      if (car.siteId != 0) {
        that.setData({
          statusDes: "已到达工厂",
        })
      } else {
        that.setData({
          statusDes: "已到达目的地",
        })
      }
      nowStatus=1;
    } else if (car.status == 2) { //已经到达状态
      if (car.carType == 0) { //如果是处理车
        that.setData({
          statusDes: "处理完成,返程",
        })
      } else if (car.carType == 1) { //如果是运输车
        if (car.siteId != 0) { //!=0
          that.setData({
            statusDes: "添加装箱记录",
          })
        } else {
          that.setData({
            statusDes: "卸货完成,返程",
          })
        }
      }
      nowStatus=2;
      //$("#updateCarStatusButton").attr("disabled", false);
    } else if (car.status == 3) { //如果是分配但是为出发状态
      that.setData({
        statusDes: "前往工厂",
      })
      nowStatus=3;
    } else if (car.status == 4) { //返程状态
      that.setData({
        statusDes: "到达仓库",
      })
      nowStatus=4;
    }
    
  },

  //查询子智慧泥仓信息
  queryMinorWareHouse: function() {
    var that = this;
    var mudHouse;
    wx.request({
      url: app.globalData.QUERY_MinorWareHouse_URL,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var minorList=res.data;
        var lists=[];
        for(let i=0;i<minorList.length;i++){
          var minor = { id: minorList[i].id, text: minorList[i].serialNumber+"号仓库"};
          lists.push(minor);
        }
        that.setData({
          wareHouseArray:lists
        })
        console.log(that.data.wareHouseArray)
      }
    })
  },
  //查询车辆信息
  

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
    app.showTransDriverTabBar();     //显示自定义的底部导航

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