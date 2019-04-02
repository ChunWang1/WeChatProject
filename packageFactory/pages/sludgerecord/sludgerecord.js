const app = getApp();
var recordList=[];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordDrivers:[],
    updateRecordList:[],
    recordDriver:"",
    index: -1,
    startDate: '2019-03-10',//处理车默认起始时间  
    endDate: '2019-03-13',//处理车默认结束时间 
    
    sortSelected: "责任人",
    mask1Hidden: true,
    mask2Hidden: true,
    showquerybydate:false,
    showquerybyDriver: false,
    showquerybyWaitingUpdate: false,
    selected: 1,
    updateRecordNum:0,
  },

//响应模板中的审核方法
  updateRecordStatus: function (event){
    var that=this;
    console.log(event)
    var recordId = event.currentTarget.dataset.recordid
    wx.request({
      url: app.globalData.UPDATE_RecordStatusById,
      data: {
        recordId: recordId,
        status: 0
       },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data=="SUCCESS"){
          wx.showToast({
            title: "审核通过",
            icon: 'success',
            duration: 2000,
          })
          that.queryAllRecordOfOneFactory();
          if (that.data.showquerybyWaitingUpdate == true) {
            that.showWaitingToUpdate();
          } else if (that.data.showquerybyWaitingUpdate == false) {
            that.showAllrecord();
          }
        }
        else{
          wx.showToast({
            title: "失败",
            icon: 'none',
            duration: 2000,
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
   
  },
  //查询弹出下拉选项
  onOverallTag: function (e) {
    this.setData({
      mask1Hidden: false,
      mask2Hidden: true,
      selected: e.currentTarget.dataset.index,
      showquerybydate: false,
      showquerybyDriver: true,
      showquerybyWaitingUpdate: false,
    })
  },
  onTimeFilter: function (e) {
    this.setData({
      mask2Hidden: false,
      mask1Hidden: true,
      sortSelected: "责任人",
      selected: e.currentTarget.dataset.index,
      showquerybydate: true,
      showquerybyDriver: false,
      showquerybyWaitingUpdate: false,
    })
  },
  mask1Cancel: function () {
    this.setData({
      mask1Hidden: true
    })
  },
 
  //全部
  showAllrecord: function (e) {
    var that=this;
    that.setData({
      selected: e.currentTarget.dataset.index,
      sortSelected:"责任人",
      mask2Hidden: true,
      mask1Hidden: true,
      showquerybydate: false,
      showquerybyDriver: false,
      showquerybyWaitingUpdate: false,
    });
    this.queryAllRecordOfOneFactory()
  },
  //待审核
  showWaitingToUpdate:function(e){
    this.setData({
      selected: e.currentTarget.dataset.index,
      mask2Hidden: true,
      mask1Hidden: true,
      showquerybydate: false,
      showquerybyDriver: false,
      showquerybyWaitingUpdate: true,
    });
  },

  // 处理车时间段选择  
  recordStartDateChange(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      startDate: e.detail.value,
    })
    
  },
  recordEndDateChange(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      endDate: e.detail.value,
    })
    
  },
  
  
  
  //根据司机（责任人）搜索处理车记录(问题：根据driverid查询不到结果！！！（待解决）)
  queryRecordByDriver: function (e) {
    var that = this;
    that.setData({
      sortSelected: that.data.recordDrivers[e.currentTarget.dataset.index],
      mask1Hidden: true,
      mask2Hidden: true,
      recordDriver: that.data.recordDrivers[e.currentTarget.dataset.index],
    })
    console.log(e.currentTarget.dataset.index);
    var driverId;
    for (var i = 0; i < recordList.length; i++) {
      for (var j = 0; j < recordList[i].recordTreatCars.length; j++) {
        if (recordList[i].recordTreatCars[j].treatcar.driver.realname === that.data.recordDrivers[e.currentTarget.dataset.index]) {
          driverId = recordList[i].recordTreatCars[j].treatcarId;
          break;
        }
      }
    }
    console.log(that.data.recordDrivers[e.currentTarget.dataset.index] + " " + driverId)
    wx.request({
      url: app.globalData.QUERY_RecordByDriverId_URL,
      data: { driverId: driverId },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          recordByDriverIdList: res.data
        })
        return
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  //根据司机（责任人）搜索运输车记录
  querySludgeByDriver: function (e) {
    var that = this;
    that.setData({
      sludgeindex: e.detail.value,
      sludgeDriver: that.data.sludgeDrivers[e.detail.value],
      showquerySludgebyDriver: true,
      showquerySludgebydate: false,
    })
    var driverId;
    for (var i = 0; i < sludgeList.length; i++) {
      if (sludgeList[i].car.driver.realname === that.data.sludgeDrivers[e.detail.value]) {
        driverId = sludgeList[i].car.driver.id;
        break;
      }
    }
    console.log(that.data.sludgeDrivers[e.detail.value] + " " + driverId)
    wx.request({
      url: app.globalData.QUERY_SludgeByDriverId_URL,
      data: { driverId: driverId },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          sludgeByDriverIdList: res.data
        })
        return
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
 
  //根据时间查询处理车记录
  queryRecordByDate:function(){
     var that=this;
     that.setData({
       mask1Hidden: true,
       mask2Hidden: true,
     })
    wx.request({
      url: app.globalData.QUERY_RecordByDate_URL,
      data: { startDate: that.data.startDate, endDate:that.data.endDate},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          recordByDateList: res.data
        })
        return
      },
      fail: function (err) {
        console.log(err)
      }
    })
     
  },
  /*
  //根据时间查询运输车记录
  querySludgeByDate: function () {
    var that = this;
    wx.request({
      url: app.globalData.QUERY_SludgeByDate_URL,
      data: { startDate: that.data.startSludgeDate, endDate: that.data.endSludgeDate },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          sludgeByDateList: res.data
        })
        return
      },
      fail: function (err) {
        console.log(err)
      }
    })

  },*/
/*
  //分页事件
  recordhandleChange({ detail }) {
    const type = detail.type;
    if (type === 'next') {
      this.setData({
        record_current: this.data.record_current + 1
      });
    } else if (type === 'prev') {
      this.setData({
        record_current: this.data.record_current - 1
      });
    }
  },
  sludgehandleChange({ detail }) {
    const type = detail.type;
    if (type === 'next') {
      this.setData({
        sludeg_current: this.data.sludeg_current + 1
      });
    } else if (type === 'prev') {
      this.setData({
        sludeg_current: this.data.sludeg_current - 1
      });
    }
  },
*/
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.queryAllRecordOfOneFactory();
    
    //获取设备可视窗口高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight -72
        });
      }
    })
  },
  /*
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
  */

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
        console.log(res.data)
        that.setData({
          recordList: res.data
        })
        recordList=res.data;
        var driver = [];
        var temp=[];
        var num=0;
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].status == 3) {
            num++;
            temp.push(res.data[i]);
          }
          for(var j=0;j<res.data[i].recordTreatCars.length;j++){
            if (res.data[i].recordTreatCars[j].treatcar.driver.realname!=null){
              driver.push(res.data[i].recordTreatCars[j].treatcar.driver.realname);
             }
          }    
        }
        
        if(num>0){
          that.setData({
            updateRecordNum:num
          })
        }
       
        that.setData({
          recordDrivers:that.removeDup(driver),
          updateRecordList:temp
        })
        console.log(that.data.recordDrivers);
      },
      fail: function (err) {
        console.log(err)
      }
    })
    
  },

  //去除数组重复字段
 removeDup:function(arr){
   var removeDupDriver = [];
   for (var i = 0; i < arr.length; i++) {
     if (removeDupDriver.indexOf(arr[i]) < 0) {
       removeDupDriver.push(arr[i]);
     }
   }
   return removeDupDriver;
 },

  
  /*
  swiperChange: function (e) {
    console.log(e);
    this.setData({
      current: e.detail.current,
    })
  },
  */

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.showFactoryTabBar();
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