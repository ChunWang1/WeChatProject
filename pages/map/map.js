// pages/map/map.js
var siteStatus = { NORMAL: 0, PROCESSING: 1, WATINGPROCESS: 2 };
var carType = { TREATMENT: 0, CARRIER: 1, ALL: -1 };
var carStatus = { LEISURE: 0, ONTHEWAY: 1, ARRIVAL: 2, NODEPARTURE: 3, GETBACK: 4, ALL: -1 };
var markers = [];
var carInSiteInfo={};
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
    that.showMap()
    // setInterval(function(){
    //   that.showMap()
    // },5000)
  },
  showMap:function(){
    var that=this;
    that.showWareHouse()
    that.showSite();
    that.showCar();
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
        that.setData({
          mainWareHouse:res.data
        });
        var listData = res.data;
        for (var i = 0; i < listData.length; i++) {
          var siteId=-1;
          that.queryMinorWareHouse(listData[i].id);
          carInSiteInfo[siteId]={}
          carInSiteInfo[siteId].carrier={}
          carInSiteInfo[siteId].treatmentCar={}
          that.queryCar(siteId,carType.TREATMENT,carStatus.LEISURE)
          that.queryCar(siteId, carType.CARRIER, carStatus.LEISURE)
          setTimeout(function(){
            var carrierNum = carInSiteInfo[siteId].carrier.length;
            var treatmentCarNum = carInSiteInfo[siteId].treatmentCar.length;
            console.log("showHouse\n" + carrierNum+" "+treatmentCarNum)
            var minorWareHouse=that.data.minorWareHouse;
            var contents="";
            for(let index=0;index<minorWareHouse.length;index++){
              let house = minorWareHouse[index];
              contents+=house.serialNumber+"号仓库:"+house.remainCapacity+"/"+house.capacity+"\n";
            }
            if (treatmentCarNum != 0) {
              contents+=treatmentCarNum+"辆空闲处理车\n";
              for(let i=0;i<treatmentCarNum;i++){
                contents += carInSiteInfo[siteId].treatmentCar[i].license+"  ";
              }
              contents+="\n";
            }
            if(carrierNum!=0){
              contents += carrierNum + "辆空闲运输车\n";
              for (let i = 0; i < carrierNum; i++) {
                contents += carInSiteInfo[siteId].carrier[i].license+"  ";
              }
              contents += "\n";
            }
            var mainWareHouse=that.data.mainWareHouse
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
                textAlign: 'center',
                color: '#B22222'
              }
            });
            that.setData({markers:markers})
          }.bind(that),1000);
          
        }
      }
    });
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
          var siteId=listData[i].id;
          //初始化集合
          carInSiteInfo[siteId]={}
          carInSiteInfo[siteId].carrier = [];
          carInSiteInfo[siteId].treatmentCar = [];
          //查询工厂的处理车和污泥车
          that.queryCar(siteId,carType.CARRIER,carStatus.ARRIVAL);
          that.queryCar(siteId, carType.TREATMENT, carStatus.ARRIVAL);    
        }
          setTimeout(function(){
            for (let i = 0; i < listData.length; i++) {
              var contents = listData[i].siteName + "\n" + listData[i].telephone + "\n";
              var iconPath='';
              var carrierNum = carInSiteInfo[listData[i].id].carrier.length;
              var treatmentCarNum = carInSiteInfo[listData[i].id].treatmentCar.length;
              if (listData[i].status == 0) { //工厂状态为正常
                contents += "状态：正常\n";
                iconPath ='/resources/factory0.png';
                if (carrierNum!=0){  //正常状态也可能有运输车在装箱
                  contents+="运输车辆：\n"
                  for(let i=0;i<carrierNum;i++){
                    contents += carInSiteInfo[listData[i].id].carrier[i].license;
                  }
                  contents+="\n";
                  iconPath ='/resources/factory0C.png';
                }
                markers = markers.concat({
                  id: listData[i].id,
                  latitude: listData[i].latitude,
                  longitude: listData[i].longitude,
                  width: 60,
                  height: 60,
                  iconPath: iconPath,
                  callout: {
                    content: contents,
                    padding: 10,
                    textAlign: 'center',
                    color: '#B22222'
                  }
                });
              } else if (listData[i].status == 1) {
                contents += "状态：正在处理\n";
                iconPath ='/resources/factory1.png'
                if (treatmentCarNum != 0) {  //有运输车在装箱
                  contents += "处理车辆:\n"
                  for (let i = 0; i < treatmentCarNum; i++) {
                    contents += carInSiteInfo[listData[i].id].treatmentCar[i].license;
                  }
                  contents += "\n";
                }
                if (carrierNum != 0) {  //有运输车在装箱
                  contents += "运输车辆：\n"
                  for (let i = 0; i < carrierNum; i++) {
                    contents += carInSiteInfo[listData[i].id].carrier[i].license;
                  }
                  contents += "\n";
                }
                if(treatmentCarNum!=0&&carrierNum!=0){ //处理车和运输车都在
                  iconPath = '/resources/factory1CT.png';
                }
                else if(treatmentCarNum!=0&&carrierNum==0){ //只有处理车
                  iconPath = '/resources/factory1T.png';
                }
                markers = markers.concat({
                  id: listData[i].id,
                  latitude: listData[i].latitude,
                  longitude: listData[i].longitude,
                  width: 60,
                  height: 60,
                  iconPath: iconPath,
                  callout: {
                    content: contents,
                    padding: 10,
                    textAlign: 'center',
                    color: '#B22222'
                  }
                });
              } else {
                contents += "状态：待处理\n";
                var iconPath = '/resources/factory2.png';
                if(carrierNum!=0){ //运输车提前到了
                  contents += "运输车辆：\n"
                  for (let i = 0; i < carrierNum; i++) {
                    contents += carInSiteInfo[listData[i].id].carrier[i].license;
                  }
                  contents += "\n";
                  iconPath = '/resources/factory2C.png';
                }
                markers = markers.concat({
                  id: listData[i].id,
                  latitude: listData[i].latitude,
                  longitude: listData[i].longitude,
                  width: 60,
                  height: 60,
                  iconPath: iconPath,
                  callout: {
                    content: contents,
                    padding: 10,
                    textAlign: 'center',
                    color: '#B22222'
                  }
                });
              }
            }
            that.setData({
              markers: markers
            })
          },1000);
      }
    });
  },
  queryCar: function (siteId, carType, carStatus){
    var that=this;
    wx.request({
      url: 'https://www.teamluo.cn/car/queryMapCarBySiteIdAndCarTypeAndStatus',
      method:'GET',
      data: {
        siteId: siteId,
        carType: carType,
        status: carStatus
      },
      header: {
        'content-type': 'application/json'
      },
      success(res){
        if(carType==0){
          carInSiteInfo[siteId].treatmentCar=res.data;
        }
        else if(carType==1){
          carInSiteInfo[siteId].carrier = res.data;
        }

      }
    })
  },

  showCar: function () {
    var that = this;
    wx.request({
      url: 'https://www.teamluo.cn/car/queryMapCarBySiteIdAndCarTypeAndStatus',
      data:{
        siteId:-1,
        carType:carType.ALL,
        status:carStatus.ALL
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var listData = res.data;
        for (var i = 0; i < listData.length; i++) {
          var car=listData[i];
          var iconPath='';
          if (car.carType == 0) {
            contents += '污泥处理车';
            iconPath ='/resources/car.png';
          }
          else{
            contents += '污泥运输车';
            iconPath = '/resources/transportCar.png';
          }
          if (car.status == 1 || car.status==4){    
            var contents = car.license+"\n";
            if (car.status==1){
              if(car.siteId!=null&&car.siteId!=''){
                contents += "在途中\n"+"目的地:"+car.site.siteName+"\n"
              }
              else{
                contents+="运输中\n"
              }
            }
            else{
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
  showdetailofsite:function(event){
    var id = event.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '../factorydetail/factorydetail?siteId=' + event.currentTarget.dataset.id,
    });
  },
  showdetailoftreatmentcar: function (event) {
    var carid = event.currentTarget.dataset.carid
    console.log(carid)
    console.log(event.currentTarget.dataset.siteid)
    wx.navigateTo({
      url: '../cardetail/cardetail?carId=' + event.currentTarget.dataset.carid+'&siteId='+event.currentTarget.dataset.siteid,
    });
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
     */ hidetreatmentcarModal: function () { this.setData({ showtreatmentcar: false }); }, /**
     * 对话框取消按钮点击事件
     */ ontreatmentcarCancel: function () { this.hidetreatmentcarModal(); }, /**
     * 对话框确认按钮点击事件
     */ ontreatmentcarConfirm: function () { this.hidetreatmentcarModal(); },

  //右下角运输车显示模态框
  showtransportcar: function () {
    var carList = this.queryMapCar();
    this.setData({
      showtransportcar: true
    })
  },
  preventTouchMove: function () { },
   /**
     * 隐藏模态对话框
     */ hidetransportcarModal: function () { this.setData({ showtransportcar: false }); }, /**
     * 对话框取消按钮点击事件
     */ ontransportcarCancel: function () { this.hidetransportcarModal(); }, /**
     * 对话框确认按钮点击事件
     */ ontransportcarConfirm: function () { this.hidetransportcarModal(); },

  //右下角智慧泥仓显示模态框
  showwarehouse: function () {
    var minorWareHouseList = this.queryWareHouse();
    this.setData({
      showwarehouse: true
    })
  },
  preventTouchMove: function () { },
   /**
     * 隐藏模态对话框
     */ hidewarehouseModal: function () { this.setData({ showwarehouse: false }); }, /**
     * 对话框取消按钮点击事件
     */ onwarehouseCancel: function () { this.hidewarehouseModal(); }, /**
     * 对话框确认按钮点击事件
     */ onwarehouseConfirm: function () { this.hidewarehouseModal(); },

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