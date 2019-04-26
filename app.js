//var URL = "https://www.teamluo.cn";
var URL = "http://localhost:8080/DisposalSludgeSystem";
//var URL ="http://iot.hnu.edu.cn";
App({
  manageTabBar: {
    "color": "#9E9E9E",
    "selectedColor": "#70DB93",
    "backgroundColor": "#fff",
    "borderStyle": "#ccc",
    "position": "bottom",
    "list": [
      {
        pagePath: "/packageManager/pages/map/map",
        text: "首页",
        iconPath: "../../../resources/img/map.png",
        selectedIconPath: "../../../resources/img/map2.png",
        clas: "menu-item2",
        active: true,
      },
      {
        pagePath: "/packageManager/pages/allcardetail/allcardetail",
        text: "监控",
        iconPath: "../../../resources/img/monitor.png",
        selectedIconPath: "../../../resources/img/monitor2.png",
        clas: "menu-item2",
        active: false,
      },
      {
        pagePath: "/packageManager/pages/warehouse/warehouse",
        text: "智慧泥仓",
        iconPath: "../../../resources/img/warehouse.png",
        selectedIconPath: "../../../resources/img/warehouse2.png",
        clas: "menu-item2",
        active: false,
      },
      {
        pagePath: "/packageManager/pages/sysmanage/sysmanage",
        text: "系统管理",
        iconPath: "../../../resources/img/sysmanage.png",
        selectedIconPath: "../../../resources/img/sysmanage2.png",
        clas: "menu-item2",
        active: false,
      },

    ]
  },
  guestTabBar: {
    "color": "#9E9E9E",
    "selectedColor": "#70DB93",
    "backgroundColor": "#fff",
    "borderStyle": "#ccc",
    "position": "bottom",
    "list": [
      {
        pagePath: "/packageGuest/pages/map/map",
        text: "首页",
        iconPath: "../../../resources/img/map.png",
        selectedIconPath: "../../../resources/img/map2.png",
        clas: "menu-item",
        active: true,
      },
      {
        pagePath: "/packageGuest/pages/allcardetail/allcardetail",
        text: "监控",
        iconPath: "../../../resources/img/monitor.png",
        selectedIconPath: "../../../resources/img/monitor2.png",
        clas: "menu-item",
        active: false,
      },
      {
        pagePath: "/packageGuest/pages/warehouse/warehouse",
        text: "智慧泥仓",
        iconPath: "../../../resources/img/warehouse.png",
        selectedIconPath: "../../../resources/img/warehouse2.png",
        clas: "menu-item",
        active: false,
      },
    ]
  },
  factoryTabBar: {
    "color": "#9E9E9E",
    "selectedColor": "#70DB93",
    "backgroundColor": "#fff",
    "borderStyle": "#ccc",
    "position": "bottom",
    "list": [
      {
        "pagePath": "/packageFactory/pages/map/map",
        "text": "首页",
        "iconPath": "../../../resources/img/map.png",
        "selectedIconPath": "../../../resources/img/map2.png",
        "clas": "menu-item2",
        "active": true,
      },
      {
        "pagePath": "/packageFactory/pages/sludgeapply/sludgeapply",
        "text": "任务申请",
        "iconPath": "../../../resources/img/task.png",
        "selectedIconPath": "../../../resources/img/task2.png",
        "clas": "menu-item2",
        "active": false,
      },
      {
        "pagePath": "/packageFactory/pages/factorydetail/factorydetail",
        "text": "监控",
        "iconPath": "../../../resources/img/monitor.png",
        "selectedIconPath": "../../../resources/img/monitor2.png",
        "clas": "menu-item2",
        "active": false,
      },
      {
        "pagePath": "/packageFactory/pages/sludgerecord/sludgerecord",
        "text": "处理记录",
        "iconPath": "../../../resources/img/record.png",
        "selectedIconPath": "../../../resources/img/record2.png",
        "clas": "menu-item2",
        "active": false,
      },
    ]
  },
  treatDriverTabBar: {
    "color": "#9E9E9E",
    "selectedColor": "#70DB93",
    "backgroundColor": "#fff",
    "borderStyle": "#ccc",
    "position": "bottom",
    "list": [
      {
        "pagePath": "/packageTreatmentDriver/pages/map/map",
        "text": "首页",
        "iconPath": "../../../resources/img/map.png",
        "selectedIconPath": "../../../resources/img/map2.png",
        "clas": "menu-item",
        "active": true,
      },
      {
        "pagePath": "/packageTreatmentDriver/pages/treatcardetail/treatcardetail",
        "text": "监控",
        "iconPath": "../../../resources/img/monitor.png",
        "selectedIconPath": "../../../resources/img/monitor2.png",
        "clas": "menu-item",
        "active": false,
      },
      {
        "pagePath": "/packageTreatmentDriver/pages/treatmentRecord/treatmentRecord",
        "text": "处理记录",
        "iconPath": "../../../resources/img/record.png",
        "selectedIconPath": "../../../resources/img/record2.png",
        "clas": "menu-item",
        "active": false,
      },
    ]
  },
  transDriverTabBar: {
    "color": "#9E9E9E",
    "selectedColor": "#70DB93",
    "backgroundColor": "#fff",
    "borderStyle": "#ccc",
    "position": "bottom",
    "list": [
      {
        "pagePath": "/packageTransportDriver/pages/map/map",
        "text": "首页",
        "iconPath": "../../../resources/img/map.png",
        "selectedIconPath": "../../../resources/img/map2.png",
        "clas": "menu-item3",
        "active": true,
      },
      {
        "pagePath": "/packageTransportDriver/pages/transportRecord/transportRecord",
        "text": "处理记录",
        "iconPath": "../../../resources/img/record.png",
        "selectedIconPath": "../../../resources/img/record2.png",
        "clas": "menu-item3",
        "active": false,
      },
    ]
  },
  //第一种底部  
  showManageTabBar: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.manageTabBar;
    for (var i = 0; i < tabBar.list.length; i++) {

      tabBar.list[i].active = false;
      //console.log(tabBar.list[i].pagePath)
      // console.log(_pagePath)
      if (tabBar.list[i].pagePath == _pagePath) {

        tabBar.list[i].active = true;//根据页面地址设置当前页面状态    
      }
    }
    _curPage.setData({
      manageTabBar: tabBar
    });
  },
  showGuestTabBar: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.guestTabBar;
    for (var i = 0; i < tabBar.list.length; i++) {

      tabBar.list[i].active = false;
      //console.log(tabBar.list[i].pagePath)
      // console.log(_pagePath)
      if (tabBar.list[i].pagePath == _pagePath) {

        tabBar.list[i].active = true;//根据页面地址设置当前页面状态    
      }
    }
    _curPage.setData({
      guestTabBar: tabBar
    });
  },
  showFactoryTabBar: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.factoryTabBar;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        tabBar.list[i].active = true;//根据页面地址设置当前页面状态    
      }
    }
    _curPage.setData({
      factoryTabBar: tabBar
    });
  },
  showTreatDriverTabBar: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.treatDriverTabBar;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        tabBar.list[i].active = true;//根据页面地址设置当前页面状态    
      }
    }
    _curPage.setData({
      treatDriverTabBar: tabBar
    });
  },
  showTransDriverTabBar: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.transDriverTabBar;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        tabBar.list[i].active = true;//根据页面地址设置当前页面状态    
      }
    }
    _curPage.setData({
      transDriverTabBar: tabBar
    });
  },

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

  },





  //全局变量
  globalData: {
    userInfo: null,

    userData: [{
      id: "",
      idCard: "",
      realname: "",
      email: "",
      role: "",
      sex: "",
      username: "",
      telephone: "",
      password: "",
      roleId: "",
      siteId: "",
    }],

    // accessToken会自动失效，需要通过后端请求刷新。详见       https://open.ys7.com/doc/zh/book/index/user.html
    ACCESS_TOKEN: "at.91ee13eg46rs5lepb3xbm1ih8sgn4byr-9rh4ualj21-1kgvk4a-19vobpkjf",
    /* const DEVICE_SERIAL = "C29134495"; */
    CHANNEL_NO: 1,
    START_PTZ_URL: "https://open.ys7.com/api/lapp/device/ptz/start",
    STOP_PTZ_URL: "https://open.ys7.com/api/lapp/device/ptz/stop",
    LIVE_LIST_URL: "https://open.ys7.com/api/lapp/live/video/list",
    //URL
    QUERY_MapCar_BySiteIdAndCarTypeAndStatus_URL: URL + '/car/queryMapCarBySiteIdAndCarTypeAndStatus',
    QUERY_VideoAndSensorByCarIdfoForWX_URL: URL + "/monitor/queryVideoAndSensorByCarIdfoForWX",
    QUERY_AllSite_URL: URL + "/system/queryAllSite",
	  DELETE_Site_URL: URL + "/system/deleteSite",
    ADD_Site_URL: URL + "/system/addSite",
    EDIT_Site_URL: URL + "/system/editSite",
    FUZZYQUERY_Site_URL: URL +"/system/fuzzyQuerySite",
    QUERY_AllManagerBySite_URL: URL +"/system/queryAllManagerBySite",
    QUERY_SiteSerialNumberAndName_URL: URL + "/system/querySiteSerialNumberAndName",
    QUERY_AllCar_URL: URL + "/car/queryAllCar",
    DELETE_Car_URL: URL + "/car/deleteCar",
    ADD_Car_URL: URL + "/car/addCar",
    EDIT_Car_URL: URL + "/car/editCar",
    FUZZYQUERY_car_URL: URL + "/car/fuzzyQueryCar",
    QUERY_CarByCarType_URL: URL + "/car/queryCarByCarType",
    ADD_User_URL: URL + "/system/addUser",
    QUERY_NoCarAssignedDriverList_URL: URL + "/user/queryNoCarAssignedDriverList",
    QUERY_AllUser_URL: URL +"/system/queryAllUser",
    QUERY_UserByCheckStatus_URL: URL +"/system/queryUserByCheckStatus",
    QUERY_UserByRoleId_URL: URL + "/system/queryUserByRoleId",
    FUZZYQUERY_User_URL: URL + "/system/fuzzyQueryUser",
    QUERY_AllSensoType_URL: URL + "/sensor/queryAllSensorType",
    QUERY_AllSensor_URL: URL + "/sensor/queryAllSensor",
    ADD_Sensor_URL: URL + "/sensor/addSensor",
    DELETE_Sensor_URL: URL + "/sensor/deleteSensor",
    QUERY_RealTimeValue_URL: URL + "/sensor/queryRealTimeValue",
    QUERY_AllFactoryVideo_URL: URL + '/monitor/queryAllFactoryVideo',
    QUERY_FactoryVideoBySiteIdforWX_URL: URL + "/monitor/queryFactoryVideoBySiteIdforWX",
    LOGIN_Validator_URL: URL + "/user/loginValidatorForWx",
    QUERY_MainWareHouse_URL: URL + "/mudWareHouse/queryMainWareHouse",
    QUERY_MinorWareHouse_URL: URL + "/mudWareHouse/queryMinorWareHouse",
    QUERY_SiteMapBySiteIdAndStatus_URL: URL + "/system/querySiteMapBySiteIdAndStatus",
    QUERY_SiteStatus_URL: URL + "/system/querySiteStatus",
    QUERY_CarInRoad_URL: URL + "/car/queryCarInRoad",
    REGISTER_URL: URL + "/user/register",
    QUERY_HistoryData_URL: URL + "/sensor/queryHistoryData",
    QUERY_SensorByCondition_URL: URL + "/sensor/conditionalQuery",
    QUERY_AllRecord_URL: URL + "/record/queryAllRecord",
    QUERY_AllSludgeByInOutFlagAndWareHouseSerial_URL: URL + "/sludge/queryAllSludgeByInOutFlagAndWareHouseSerial",
    MODIFY_UserInfo_URL: URL + "/user/modifyUserInfo",
    INSERT_RecordByAlert_URL: URL + "/record/insertRecordByAlert",
    QUERY_AllRecordOfOneFactory_URL: URL + "/record/queryAllRecordOfOneFactory",
    QUERY_AllSludgeOfOneFactory_URL: URL + "/sludge/queryAllSludgeOfOneFactory",
    ADD_SludgeByTransCar_URL: URL + "/sludge/addOutSludge",
    QUERY_AllFunction_URL: URL + "/sludge/queryAllFunc",
    QUERY_CarrierUnassign_URL: URL + "/car/queryCarrierUnassign",
    QUERY_SludgeByDateAndInOutFlag_URL: URL + "/sludge/querySludgeByDateAndInOutFlag",
    QUERY_queryassignCarTransportDriver_URL: URL + "/sludge/assignCarTransportDriver",
    QUERY_SludgeByDriverIdAndInOutFlag_URL: URL + "/sludge/querySludgeByDriverIdAndInOutFlag",
    QUERY_SludgeBySiteIdAndInOutFlag_URL: URL + "/sludge/querySludgeBySiteIdAndInOutFlag",
    QUERY_AllSludgeByInOutFlagAndWareHouseSerial_URL: URL + "/sludge/queryAllSludgeByInOutFlagAndWareHouseSerial",
    EDIT_Record_URL: URL + "/record/editRecord",
    DELETE_Record_URL: URL + "/record/deleteRecord",
    QUERY_queryassignCarTreatDriver_URL: URL + "/record/queryassignCarTreatDriver",
    QUERY_RecordByDriverId_URL: URL + "/record/queryRecordByDriverId",
    QUERY_RecordByDate_URL: URL + "/record/queryRecordByDate",
    QUERY_SludgeByDate_URL: URL + "/sludge/querySludgeByDate",
    QUERY_SludgeByDriverId_URL: URL + "/sludge/querySludgeByDriverId",
    QUERY_RecordByRecordId_URL: URL + "/record/queryRecordByRecordId", QUERY_SludgeByRecordId_URL: URL + "/sludge/querySludgeByRecordId",
    UPDATE_RecordStatusById: URL +"/record/updateRecordStatusById",
    //工厂链接
    //司机公用链接
    QUERY_queryWorkerMapCar_URL: URL + "/car/queryWorkerMapCar",
    QUERY_flushCarStatus_URL: URL +"/car/flushCarStatus",
    UPDATE_updateCarStatus_URL:URL+"/car/updateCarStatusByButton",
    //处理车司机链接
    QUERY_queryRecordByStatus_URL: URL +"/record/queryRecordByDriverIdAndStatus",
    //运输车司机链接
    QUERY_querySludgeFunction_URL: URL + "/sludge/queryAllFunc",
    QUERY_querySludgeByUserIdAndStatus_URL: URL +"/sludge/querysludgebydriverIdAndStatus",
    UPDATE_updateSludgeVirtualToRealByDriver_URL: URL +"/sludge/updateSludgeVirtualToRealByDriver",
    EDIT_Sludge_URL: URL + "/sludge/editSludge",
    DELETE_Sludge_URL: URL +"/sludge/deleteSludge",
    QUERY_AllFunc:URL+"/sludge/queryAllFunc",
    DELETE_User:URL+"/system/deleteUserByUserId",
    RESET_PassWord:URL+"/system/resetPassWord",
    QUERY_CarWhichNotAssignDriver:URL+"/car/queryCarWhichNotAssignDriver",
    EDIT_UserByUserId_URL:URL+"/system/editUserByUserId",
  }
})
