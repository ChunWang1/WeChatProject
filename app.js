//app.js
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
  //第一种底部  
  showManageTabBar: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.globalData.manageTabBar;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        tabBar.list[i].active = true;//根据页面地址设置当前页面状态    
      }
    }
    _curPage.setData({
      tabBar: tabBar
    });
  },
  showFactoryTabBar: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.globalData.factoryTabBar;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        tabBar.list[i].active = true;//根据页面地址设置当前页面状态    
      }
    }
    _curPage.setData({
      tabBar: tabBar
    });
  },
  showTreatDriverTabBar: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.globalData.treatDriverTabBar;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        tabBar.list[i].active = true;//根据页面地址设置当前页面状态    
      }
    }
    _curPage.setData({
      tabBar: tabBar
    });
  },
  showTransDriverTabBar: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.globalData.transDriverTabBar;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        tabBar.list[i].active = true;//根据页面地址设置当前页面状态    
      }
    }
    _curPage.setData({
      tabBar: tabBar
    });
  },
  globalData: {
    userInfo: null,
    // accessToken会自动失效，需要通过后端请求刷新。详见 https://open.ys7.com/doc/zh/book/index/user.html
    ACCESS_TOKEN: "at.91ee13eg46rs5lepb3xbm1ih8sgn4byr-9rh4ualj21-1kgvk4a-19vobpkjf",
    

    /* const DEVICE_SERIAL = "C29134495"; */
    CHANNEL_NO: 1,
    START_PTZ_URL: "https://open.ys7.com/api/lapp/device/ptz/start",
    STOP_PTZ_URL: "https://open.ys7.com/api/lapp/device/ptz/stop",
    LIVE_LIST_URL: "https://open.ys7.com/api/lapp/live/video/list",
    manageTabBar: {
      "color": "#9E9E9E",
      "selectedColor": "#f00",
      "backgroundColor": "#fff",
      "borderStyle": "#ccc",
      "position":"bottom",
      "list": [
        {
          "pagePath": "../map/map",
          "text": "首页",
          "iconPath": "../img/menuicon/map.png",
          "selectedIconPath": "../img/menuicon/map2.png",
          "clas": "menu-item",
           active: true,
        },
        {
          "pagePath": "../allcardetail/allcardetail",
          "text": "监控",
          "iconPath": "../img/menuicon/car.png",
          "selectedIconPath": "../img/menuicon/car2.png",
          "clas": "menu-item",
          "active": false,
        },
        {
          "pagePath": "../allcardetail/allcardetail",
          "text": "系统管理",
          "iconPath": "../img/menuicon/car.png",
          "selectedIconPath": "../img/menuicon/car2.png",
          "clas": "menu-item",
          "active": false,
        },
       
      ]
    },
    factoryTabBar: {
      "color": "#9E9E9E",
      "selectedColor": "#f00",
      "backgroundColor": "#fff",
      "borderStyle": "#ccc",
      "position": "bottom",
      "list": [
        {
          "pagePath": "../map/map",
          "text": "首页",
          "iconPath": "../img/menuicon/map.png",
          "selectedIconPath": "../img/menuicon/map2.png",
          "clas": "menu-item2",
          active: true,
        },
        {
          "pagePath": "../allcardetail/allcardetail",
          "text": "任务申请",
          "iconPath": "../img/menuicon/car.png",
          "selectedIconPath": "../img/menuicon/car2.png",
          "clas": "menu-item2",
          "active": false,
        },
        {
          "pagePath": "../allcardetail/allcardetail",
          "text": "监控",
          "iconPath": "../img/menuicon/car.png",
          "selectedIconPath": "../img/menuicon/car2.png",
          "clas": "menu-item2",
          "active": false,
        },
        {
          "pagePath": "../allcardetail/allcardetail",
          "text": "处理记录",
          "iconPath": "../img/menuicon/car.png",
          "selectedIconPath": "../img/menuicon/car2.png",
          "clas": "menu-item2",
          "active": false,
        },

      ],
    },
    treatDriverTabBar: {
      "color": "#9E9E9E",
      "selectedColor": "#f00",
      "backgroundColor": "#fff",
      "borderStyle": "#ccc",
      "position": "bottom",
      "list": [
        {
          "pagePath": "../map/map",
          "text": "首页",
          "iconPath": "../img/menuicon/map.png",
          "selectedIconPath": "../img/menuicon/map2.png",
          "clas": "menu-item",
          active: true,
        },
        {
          "pagePath": "../allcardetail/allcardetail",
          "text": "监控",
          "iconPath": "../img/menuicon/car.png",
          "selectedIconPath": "../img/menuicon/car2.png",
          "clas": "menu-item",
          "active": false,
        },
        {
          "pagePath": "../allcardetail/allcardetail",
          "text": "处理记录",
          "iconPath": "../img/menuicon/car.png",
          "selectedIconPath": "../img/menuicon/car2.png",
          "clas": "menu-item",
          "active": false,
        },
      ]
    },
    transDriverTabBar: {
      "color": "#9E9E9E",
      "selectedColor": "#f00",
      "backgroundColor": "#fff",
      "borderStyle": "#ccc",
      "position": "bottom",
      "list": [
        {
          "pagePath": "../map/map",
          "text": "首页",
          "iconPath": "../img/menuicon/map.png",
          "selectedIconPath": "../img/menuicon/map2.png",
          "clas": "menu-item3",
          active: true,
        },
        {
          "pagePath": "../allcardetail/allcardetail",
          "text": "处理记录",
          "iconPath": "../img/menuicon/car.png",
          "selectedIconPath": "../img/menuicon/car2.png",
          "clas": "menu-item3",
          "active": false,
        },
      ]
    }
  }
})