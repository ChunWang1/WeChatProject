// pages/warehouse/warehouse.js
const app=getApp();

import * as echarts from '../../ec-canvas/echarts';
function initChart(canvas, width, height, data) {//这里多加一个参数
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  })
  canvas.setChart(chart);
  var option = {
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: ['10%', '100%'],
        animationType: 'scale',
        silent: true,
        labelLine: {
          normal: {
            show: false
          }
        },
        data: data,
        color: ["#666", "#179B16"]
      }
    ]
  }
  chart.setOption(option);
  return chart;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    },
    //recordShow: "none",
    itemList: [
      { name: '1号仓', moistrueDegree: "0.8", capacity: 100, data: [{ value: 100 }, { value: 10 }] },
      { name: '2号仓', moistrueDegree: "0.8", capacity: 200,data: [{ value: 100 }, { value: 0 }] },
      { name: '3号仓', moistrueDegree: "0.8", capacity: 300,data: [{ value: 100 }, { value: 30 }] }
    ],

    imageSrc1: '../../pages/img/menuicon/img1.png',
    imageSrc2: '../../pages/img/menuicon/img2.png',
    // tab切换
    currentTab: 0,
    record_current: 1,
    sludeg_current: 1,
    carrierUnassignList:[],
    functionList:[]

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
      that.queryrecord();
      that.querysludge();
      
    }

  },

  swiperChange: function (e) {

    console.log(e);

    this.setData({

      currentTab: e.detail.current,

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
    var thit = this
      wx.request({
        url: app.globalData.QUERY_MinorWareHouse_URL,  //服务器地址
        method: 'GET',
        header: {
          'content-type': 'application/json' //默认值
        },
        success: function (res) {
          console.log(res.data);
          var data_0 = [{ value: res.data[0].capacity }, { value: res.data[0].capacity - res.data[0].remainCapacity }]
          var data_1 = [{ value: res.data[1].capacity }, { value: res.data[1].capacity - res.data[1].remainCapacity }]
          var data_2 = [{ value: res.data[2].capacity }, { value: res.data[2].capacity - res.data[2].remainCapacity }]
          thit.setData({
            itemList: [
              { name: res.data[0].id, moistrueDegree: res.data[0].moistrueDegree, capacity: res.data[0].capacity, data: data_0 },
              { name: res.data[1].id, moistrueDegree: res.data[1].moistrueDegree, capacity: res.data[1].capacity, data: data_1 },
              { name: res.data[2].id, moistrueDegree: res.data[2].moistrueDegree, capacity: res.data[2].capacity, data: data_2 }
            ]
          })
        },
        fail: function (res) {
          console.log("失败");
        }
      })
  },

  queryrecord: function(callback) {
    var thit = this
    wx.request({
      url: app.globalData.QUERY_AllRecord_URL,
      method: 'GET',
      header: {
        // "Content-Type":"application/json"
      },
      success: function (res) {
        console.log(res.data);
        thit.setData({
          recordList:res.data
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  querysludge:function(callback){
    var thit = this
    wx.request({
      url: app.globalData.QUERY_AllSludgeByInOutFlagAndWareHouseSerial_URL,
      data: JSON.stringify({
        inOutFlag:3,
        minorWareHouseId:0
      }),
      method: 'POST',
      header: {
        // "Content-Type":"application/json"
      },
      success: function (res) {
        console.log(res.data)
        thit.setData({
          sludgeList: res.data
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  queryallfunction: function (callback) {
    var thit = this
    wx.request({
      url: app.globalData.QUERY_AllFunction_URL,
      method: 'POST',
      header: {
        // "Content-Type":"application/json"
      },
      success: function (res) {
        console.log(res.data)
        thit.setData({
          functionList: res.data
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  queryCarrierUnassign: function (callback) {
    var thit = this
    var carList = [];
    wx.request({
      url: app.globalData.QUERY_CarrierUnassign_URL,
      method: 'POST',
      header: {
        // "Content-Type":"application/json"
      },
      success: function (res) {
        console.log(res.data[0].driver.realname)
        for(var i=0;i<res.data.length;i++){
          carList[i] = {id: res.data[i].driverId, name: res.data[i].driver.realname};
        }
        console.log(carList)
        thit.setData({
          carrierUnassignList: carList
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    app.showManageTabBar();    //显示自定义的底部导航
  },

  addsludge: function () {
    this.queryallfunction();
    this.queryCarrierUnassign();
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  wareHouseinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      wareHouseinput: e.detail.value
    });
  },
  transCarinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      transCarinput: e.detail.value
    });
  },
  rfidinputChange:function(e) {
    console.log(e.detail.value);
    this.setData({
      rfidinput: e.detail.value
    });
  },
  desAddrinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      desAddrinput: e.detail.value
    });
  },
  functioninputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      functioninput: e.detail.value
    });
  },
  weightinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      weightinput: e.detail.value
    });
  },
  onConfirm: function () {
    var that = this;
    var transCarId = parseInt(that.data.transCarinput);
    var mudWareHouseId = parseInt(that.data.wareHouseinput);
    var rfid = that.data.rfidinput;
    var desAddr = that.data.desAddrinput;
    var sludgeFunction = {function:that.data.functioninput};
    var weight = parseFloat(that.data.weightinput);
    console.log(weight)
    console.log(sludgeFunction)
    
    wx.request({
      url: app.globalData.ADD_SludgeByTransCar_URL,
      data: JSON.stringify({
        transCarId: transCarId,
        minorMudWareHouseId: mudWareHouseId,
        rfidString: rfid,
        destinationAddress: desAddr,
        sludgeFunction: sludgeFunction,
        weight: weight
      }),
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        if (res.data == "SUCCESS") {
          wx.showToast({
            title: "注册成功",
            icon: 'success',
            duration: 20000,
            success: function () {
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000
              })
            }
          })
        } 
      }
    })
    this.hideModal();
  },
  bindwarehousePickerChange: function (e) {
   console.log( this.data.itemList[e.detail.value].name)
    this.setData({
      warehouseid: this.data.itemList[e.detail.value].name
    })
    if (e.detail.value == 4) {
      this.setData({ reply: true })
    } else {
      this.setData({ reply: false })
    }
    this.setData({
      warehouseIndex: e.detail.value
    })
  },
  bindtranscarPickerChange: function (e) {
    console.log(this.data.carrierUnassignList[e.detail.value].id)
    console.log(this.data.carrierUnassignList[e.detail.value].name)
    this.setData({
      transCarId: this.data.carrierUnassignList[e.detail.value].id,
      transCardrivername: this.data.carrierUnassignList[e.detail.value].name
    })
    if (e.detail.value == 4) {
      this.setData({ reply: true })
    } else {
      this.setData({ reply: false })
    }
    this.setData({
      carIndex: e.detail.value
    })
  },
  bindfunctionPickerChange: function (e) {
    console.log(this.data.functionList[e.detail.value].function)
    this.setData({
      sludgefunction: this.data.functionList[e.detail.value].function,
    })
    if (e.detail.value == 4) {
      this.setData({ reply: true })
    } else {
      this.setData({ reply: false })
    }
    this.setData({
      functionIndex: e.detail.value
    })
  },
})