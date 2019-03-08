var URL = "https://www.teamluo.cn";
App({
  
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
  globalData: {
    userInfo: null,
    // accessToken会自动失效，需要通过后端请求刷新。详见       https://open.ys7.com/doc/zh/book/index/user.html
    ACCESS_TOKEN: "at.91ee13eg46rs5lepb3xbm1ih8sgn4byr-9rh4ualj21-1kgvk4a-19vobpkjf",
    /* const DEVICE_SERIAL = "C29134495"; */
    CHANNEL_NO: 1,
    START_PTZ_URL: "https://open.ys7.com/api/lapp/device/ptz/start",
    STOP_PTZ_URL: "https://open.ys7.com/api/lapp/device/ptz/stop",
    LIVE_LIST_URL: "https://open.ys7.com/api/lapp/live/video/list",
    
    //URL
    QUERY_MapCar_BySiteIdAndCarTypeAndStatus_URL: URL+'/car/queryMapCarBySiteIdAndCarTypeAndStatus',
    QUERY_VideoAndSensorByCarIdfoForWX_URL: URL+"/monitor/queryVideoAndSensorByCarIdfoForWX",
    QUERY_AllSite_URL: URL+"/system/queryAllSite",
    QUERY_RealTimeValue_URL: URL +"/sensor/queryRealTimeValue",
    QUERY_AllFactoryVideo_URL:URL+'/monitor/queryAllFactoryVideo',
    QUERY_FactoryVideoBySiteIdforWX_URL: URL +"/monitor/queryFactoryVideoBySiteIdforWX",
    LOGIN_Validator_URL: URL +"/user/loginValidator",
    QUERY_MainWareHouse_URL: URL +"/mudWareHouse/queryMainWareHouse",
    QUERY_MinorWareHouse_URL: URL +"/mudWareHouse/queryMinorWareHouse",
    QUERY_SiteMapBySiteIdAndStatus_URL: URL +"/system/querySiteMapBySiteIdAndStatus",
    QUERY_SiteStatus_URL:URL+"/system/querySiteStatus",
    QUERY_CarInRoad_URL: URL +"/car/queryCarInRoad",
    REGISTER_URL: URL +"/user/register",
    QUERY_HistoryData_URL: URL +"/sensor/queryHistoryData",
    QUERY_AllRecord_URL: URL +"/record/queryAllRecord",
    QUERY_AllSludgeByInOutFlagAndWareHouseSerial_URL: URL +"/sludge/queryAllSludgeByInOutFlagAndWareHouseSerial",
    

  }
})