// pages/factorydetail/factorydetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    siteId: '',
    status: '',
    treatIndex:0,
    transIndex:0,
  },

  bindchange1: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    // 设置这个携带值赋值给索引值index
    // 所以option1 ,option2 ,option3的索引值都是一样的
    this.setData({
      treatIndex: e.detail.value
    })
  },

  bindchange2: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    // 设置这个携带值赋值给索引值index
    // 所以option1 ,option2 ,option3的索引值都是一样的
    this.setData({
      transIndex: e.detail.value
    })
  },

  allocateTreatCar:function(){
    console.log("haha")
    var that=this;
    wx.request({
      url: app.globalData.QUERY_TreatmentCarUnassign_URL,
      method:"GET",
      header:{
        'content-type': 'application/json'
      },
      success:function(res){
        var carList=res.data;
        var treatcarLicenseList=['分配处理车']
        var treatCarIdLicenseMap={}
        console.log(carList)
        for (let i = 0; i < carList.length;i++){
          treatcarLicenseList.push(carList[i].license)
          treatCarIdLicenseMap[carList[i].license] = carList[i].id;
        }
       that.setData({
         treatcarLicenseList: treatcarLicenseList,
         treatCarIdLicenseMap: treatCarIdLicenseMap
       })
      }
    })
    
  },

  allocateTransCar: function () {
    var that = this;
    wx.request({
      url: app.globalData.QUERY_CarrierUnassign_URL,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var carList = res.data;
        var transcarLicenseList = ['分配运输车']
        var transcarIdLicenseMap = {}
        console.log(carList)
        for (let i = 0; i < carList.length; i++) {
          transcarLicenseList.push(carList[i].license)
          transcarIdLicenseMap[carList[i].license] = carList[i].id;
        }
        that.setData({
          transcarLicenseList: transcarLicenseList,
          transcarIdLicenseMap: transcarIdLicenseMap
        })
      }
    })

  },

  confirmAllocate:function(e){
    var that=this;
    console.log(e.target.dataset.type)
    var type = e.target.dataset.type;
    var treatCarId=-1;
    var transCarId=-1;
    if(type=="treatcar"){
      treatCarId = that.data.treatCarIdLicenseMap[that.data.treatcarLicenseList[that.data.treatIndex]];
    }
    else{
      transCarId = that.data.transcarIdLicenseMap[that.data.transcarLicenseList[that.data.transIndex]];
    }
    wx.request({
      url: app.globalData.UPDATE_AssignDriverForRecord_URL,
      method:"GET",
      header:{
        'content-type': 'application/json'
      },
      data: {
        "siteId": that.data.siteId,
        "treatcarId": treatCarId,
        "transcarId": transCarId
      },
      success:function(res){
        if(res.data=="SUCCESS"){
          that.queryAssignedCar();
          if (type == "treatcar") {
            that.allocateTreatCar();
            that.setData({
              treatIndex:0
            })
          }else{
            that.allocateTransCar();
            that.setData({
              transIndex: 0
            })
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var siteId = options.siteId;
    var status = options.status;
    var current = options.status;
    if (status == 1) {
      current = 2
    }
    if (status == 2) {
      current = 1
    }
    that.setData({
      siteId: siteId, //获取从上一个页面的siteId
      status: status,
      current: current
    })
    that.queryVideo();
    that.allocateTreatCar();
    that.allocateTransCar();
    if (status!=0){
      that.queryAssignedCar()
    }
  },

  queryVideo:function(){
    var that=this;
    wx.request({
      url: app.globalData.QUERY_FactoryVideoBySiteIdforWX_URL,
      data: {
        siteId: that.data.siteId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          video: res.data
        });
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  queryAssignedCar:function(){
    var that=this;
    wx.request({
      url: app.globalData.QUERY_MapCar_BySiteIdAndCarTypeAndStatus_URL,
      method: 'GET',
      data: {
        siteId: that.data.siteId,
        carType: -1,
        status: -1,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var assginCarList = res.data;
        var assignTreatCarList = []
        var assignTransCarList = []
        for (let i = 0; i < assginCarList.length; i++) {
          if (assginCarList[i].carType == 0) {
            assignTreatCarList.push(assginCarList[i]);
          } else {
            assignTransCarList.push(assginCarList[i]);
          }
        }
        that.setData({
          assignTreatCarList: assignTreatCarList,
          assignTransCarList: assignTransCarList
        })
      }
    })
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
    if (ops.from === 'button') {
      console.log(ops.target);
    }
    return {
      title: '污泥处理系统',
      path: 'packageManager/pages/factorydetail/factorytail',
      success: function(res) {
        console.log("转发成功" + JSON.stringify(res));
      },
      fail: function(res) {
        console.log("转发失败" + JSON.stringify(res));
      }
    }
  },
  /**
   * 停止触摸按钮云台停止
   */
  stopPtz: function(e) {
    var direction = e.currentTarget.dataset.direction
    var deviceSerial = e.currentTarget.dataset.deviceserial

    var paramsString = 'direction=' + direction + '&deviceSerial=' + deviceSerial + '&accessToken=' + app.globalData.ACCESS_TOKEN + '&channelNo=' + app.globalData.CHANNEL_NO
    wx.request({
      url: app.globalData.STOP_PTZ_URL + '?' + paramsString,
      data: {},
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data)
      },

      fail: function(err) {
        console.log(err)
      }
    })
  },

  /**
   * 开始点击按钮启动云台
   */
  startPtz: function(e) {
    var direction = e.currentTarget.dataset.direction
    var deviceSerial = e.currentTarget.dataset.deviceserial
    var speed = e.currentTarget.dataset.speed
    this.stopPtz(e)

    var paramsString = 'direction=' + direction + '&speed=' + speed + '&deviceSerial=' + deviceSerial + '&accessToken=' + app.globalData.ACCESS_TOKEN + '&channelNo=' + app.globalData.CHANNEL_NO
    //  console.log(paramsString)
    wx.request({
      url: app.globalData.START_PTZ_URL + '?' + paramsString,
      data: {},
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data)
      },

      fail: function(err) {
        console.log(err)
      }
    })

  }
})