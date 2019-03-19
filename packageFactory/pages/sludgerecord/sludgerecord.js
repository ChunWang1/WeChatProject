const { $Message } = require('../../../dist/base/index');
const app = getApp();
var recordList=[];
var sludgeList=[];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab切换
    currentTab: 0,
    //分页
    record_current: 1,
    sludeg_current: 1,
    recordDrivers:[],
    sludgeDrivers:[],
    recordDriver:"",
    sludgeDriver:"",
    index: -1,
    sludgeindex:-1,
    startDate: '2019-03-10',//处理车默认起始时间  
    endDate: '2019-03-13',//处理车默认结束时间 
    showquerybyDriver:false,
    showquerybydate:false,
    startSludgeDate: '2019-03-10',//运输车默认起始时间 
    endSludgeDate: '2019-03-13',//运输车默认结束时间 
    showquerySludgebyDriver: false,
    showquerySludgebydate: false,
    sludgeId:"",
    showEditSludgeModal: false,
    delSludgeVisible: false,
    delSludgeactions: [
      {
        name: '取消'
      },
      {
        name: '删除',
        color: '#ed3f14',
        loading: false
      }
    ]
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
  // 运输车时间段选择  
  sludgeStartDateChange(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      startSludgeDate: e.detail.value,
    })
    
  },
  sludgeEndDateChange(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      endSludgeDate: e.detail.value,
    })
  
  },
  //编辑运输车记录按钮
  editSludgeBtn:function(e){
    console.log(e.currentTarget.dataset.sludgeid);
    this.setData({
      showEditSludgeModal: true,
      sludgeId: e.currentTarget.dataset.sludgeid
    })
  },
  /**
     * 运输车编辑弹出框蒙层截断touchmove事件
     */
  preventTouchMove: function () {
  },
  /**
   * 隐藏运输车编辑模态对话框
   */
  hideModal: function () {
    this.setData({
      showEditSludgeModal: false
    });
  },
  /**
   * 运输车编辑对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 保存运输车污泥块信息(保存报错！)
   */
  saveSludgeEdit:function(e){
    var that=this;
    console.log(e.detail.value.RFID);
    wx.request({
      url: app.globalData.EDIT_Sludge_URL,
      data: JSON.stringify({
        id: that.data.sludgeId,
        rfidString: e.detail.value.RFID,
        destinationAddress: e.detail.value.desAddr,
        sludgeFunction: e.detail.value.sludgeFunction,
        weight: e.detail.value.weight
      }),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data === "SUCCESS"){
          wx.showToast({
            title: "修改成功！",
            icon: 'none',
            duration: 2000,
          })
          this.queryAllSludgeOfOneFactory();//刷新运输车记录页面  
        } 
      },
      fail: function (err) {
        console.log(err)
        wx.showToast({
          title: "修改失败！",
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },

  //删除运输车记录按钮
  delSludgeBtn:function(e){
    var that = this;
    console.log(e.currentTarget.dataset.sludgeid);
    that.setData({
      delSludgeVisible: true,
      sludgeId: e.currentTarget.dataset.sludgeid
    });
  },
  //删除运输车记录模态框事件（未测试）
  delSludgeModal({ detail }) {
    if (detail.index === 0) {
      this.setData({
        delSludgeVisible: false
      });
    } else {
      const action = [...this.data.delSludgeactions];
      action[1].loading = true;

      this.setData({
        delSludgeactions: action
      });
      
      wx.request({
        url: app.globalData.DELETE_Sludge_URL,
        data: { sludgeId: parseInt(this.data.sludgeId)},
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
          if (res.data ==="SUCCESS"){
            setTimeout(() => {
              action[1].loading = false;
              this.setData({
                delSludgeVisible: false,
                delSludgeactions: action
              });
              $Message({
                content: '删除成功！',
                type: 'success'
              });
            }, 2000);

            this.queryAllSludgeOfOneFactory();//刷新运输车记录页面
          }
        },
        fail: function (err) {
          console.log(err)
          $Message({
            content: '删除失败！',
            type: 'error'
          });
        }
      })
    }
  },
  //根据司机（责任人）搜索处理车记录
  queryRecordByDriver: function (e) {
    var that = this;
    that.setData({
      index: e.detail.value,
      recordDriver: that.data.recordDrivers[e.detail.value],
      showquerybyDriver:true,
      showquerybydate: false,
    })
    var driverId;
    for (var i = 0; i < recordList.length; i++) {
      if (recordList[i].car.driver.realname === that.data.recordDrivers[e.detail.value]) {
        driverId = recordList[i].car.driver.id;
        break;
      }
    }
    console.log(that.data.recordDrivers[e.detail.value] + " " + driverId)
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
  //展示所有处理车记录
  showAllrecord:function(){
    var that=this;
    that.setData({
      showquerybyDriver: false,
      showquerybydate: false,
    })
  },
  //展示所有运输车记录
  showAllsludge: function () {
    var that = this;
    that.setData({
      showquerySludgebyDriver: false,
      showquerySludgebydate: false,
    })
  },
  //根据时间查询处理车记录
  queryRecordByDate:function(){
     var that=this;
     that.setData({
       index:-1,
       showquerybyDriver: false,
       showquerybydate: true,
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
  //根据时间查询运输车记录
  querySludgeByDate: function () {
    var that = this;
    that.setData({
      sludgeindex: -1,
      showquerySludgebyDriver: false,
      showquerySludgebydate: true,
    })
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

  },

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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.queryAllRecordOfOneFactory();
    that.queryAllSludgeOfOneFactory();
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
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].car.driver.realname!=null){
            driver.push(res.data[i].car.driver.realname);
          }   
        }
        that.setData({
          recordDrivers:that.removeDup(driver),
        })
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

  queryAllSludgeOfOneFactory: function () {
    var that = this;
    //根据siteId查询所有运输车污泥记录
    wx.request({
      url: app.globalData.QUERY_AllSludgeOfOneFactory_URL,
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
          sludgeList: res.data
        })
        sludgeList=res.data;
        var driver = [];
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].car.driver.realname != null) {
            driver.push(res.data[i].car.driver.realname);
          }
        }
        that.setData({
          sludgeDrivers: that.removeDup(driver),
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  
  swiperChange: function (e) {
    console.log(e);
    this.setData({
      current: e.detail.current,
    })
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