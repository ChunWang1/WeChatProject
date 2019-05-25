// pages/allcardetail/allcardetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0
  },

  swichNav: function (e) {

    console.log(e);

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {

      return false;

    } else {

      that.setData({

        currentTab: e.target.dataset.current,

      })

    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //查询车辆信息
      var that = this;
    that.querytreatmentcar();
    that.queryallfactoryvideo();
    //获取设备可视窗口高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight - 40
        });
      }
    })
  },
  
  querytreatmentcar: function (callback){
    console.log("hahahaha")
    var that = this;
    wx.request({
      url: app.globalData.QUERY_CarByCarType_URL,
      data: { carType:0},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          carList: res.data
        })
        return
      }
    })
  },

  queryallfactoryvideo: function (callback) {
    var that = this;
    wx.request({
      url: app.globalData.QUERY_AllFactoryVideo_URL,
      data: { },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          videoList: res.data
        })
        return
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  showdetailoftreatmentcar: function (event) {
    var id = event.currentTarget.dataset.carid
    console.log(id)
    wx.navigateTo({
      url: '/packageManager/pages/cardetail/cardetail?carId=' + event.currentTarget.dataset.carid+'&siteId=' + event.currentTarget.dataset.siteid,
    });
  },

  showdetailoffactory: function (event) {
    var siteid = event.currentTarget.dataset.siteid
    console.log(siteid)
    wx.navigateTo({
      url: '/packageManager/pages/factorydetail/factorydetail?siteId=' + event.currentTarget.dataset.siteid,
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.showManageTabBar();
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
    if (ops.from === 'button') {
      console.log(ops.target);
    }
    return {
      title: '污泥处理系统',
      path: 'packageManager/pages/allcardetail/allcardetail',
      success: function (res) {
        console.log("转发成功" + JSON.stringify(res));
      },
      fail: function (res) {
        console.log("转发失败" + JSON.stringify(res));
      }
    }
  }
})