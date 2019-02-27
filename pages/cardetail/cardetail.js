// pages/cardetail/cardetail.js
import * as echarts from '../../ec-canvas/echarts';

const app = getApp()
var map={};
var jsSensorList=[];

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    title: {
      text: '历史数据',
      left: 'center'
    },
    color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
    legend: {
      data: ['A', 'B', 'C'],
      top: 50,
      left: 'center',
      backgroundColor: 'red',
      z: 100
    },
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [{
      name: 'A',
      type: 'line',
      smooth: true,
      data: [18, 36, 65, 30, 78, 40, 33]
    }, {
      name: 'B',
      type: 'line',
      smooth: true,
      data: [12, 50, 51, 35, 70, 30, 20]
    }, {
      name: 'C',
      type: 'line',
      smooth: true,
      data: [10, 30, 31, 50, 40, 20, 10]
    }]
  };

  chart.setOption(option);
  return chart;
}


Page({
  /**
   * 页面的初始数据
   */
  data: {
    carId: 68,
    "sensorList": [],
    "sensorRealValueMap":{},

    ec: {
      onInit: initChart
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    /* that.setData({
       carId: options.carId//获取从上一个页面的carid
     })*/

    console.log('onLoad')
    
    /**
     * 获取传感器和监控
     */
    wx.request({
      url: "http://iot.hnu.edu.cn/monitor/queryVideoAndSensorByCarIdfoForWX",
      data: { carId: that.data.carId },
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        jsSensorList = res.data.sensorList
        that.setData({
          sensorList: res.data.sensorList,
          videoData: res.data.video,
        });
        setInterval(function () {
          that.getRealValue();
        }, 5000);
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  /*根据sensorID获取传感器实时数据*/
  getRealValue: function () {
    var that=this;
    console.log("getRealValueBySensorId")
    /*根据sensorID获取传感器实时数据*/
    for (var index = 0; index < jsSensorList.length; index++) {
      var sensorId = jsSensorList[index].id
      var sensorSerialNum = jsSensorList[index].serialNumber
      var sensorType = jsSensorList[index].sensorType.type
      that.getRealValueBySensorId(sensorId, sensorSerialNum);
      if (sensorType === "氨气传感器" || sensorType === "硫化氢传感器"){
      that.queryHistoryData(sensorId, sensorType);
      }
    }

  },

  getRealValueBySensorId: function (sensorId, sensorSerialNum){
    var that=this;
    console.log("getRealValueBySensorId");
    wx.request({
      url: "http://iot.hnu.edu.cn/sensor/queryRealTimeValue",
      data: { sensorId: sensorId },
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },

      success: function (res) {
        console.log(res.data)
        map[sensorId] = {};
        map[sensorId].value1 = res.data.value1;
        if(res.data.value2!=0){ //说明是双值传感器     
          map[sensorId].value1=res.data.value1;
          map[sensorId].value2=res.data.value2;
        }
        console.log(map)
        that.setData({
          sensorRealValueMap:map
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

/**
 * 获取传感器历史数据
 */
  queryHistoryData: function (sensorId, sensorType){
    var that=this
    console.log("queryHistoryData")
    console.log("sensorId:" + sensorId + "  " + "sensorType:" + sensorType)
    wx.request({
      url: "http://iot.hnu.edu.cn/sensor/queryHistoryData",
      data:JSON.stringify({
        sensorId: sensorId,
        sensorType: sensorType
      }),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
      },
      fail: function (err) {
        console.log(err)
      }
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

  },

  //松开按钮停止控制监控
  stopPtz: function (e) {
    var direction = e.currentTarget.dataset.direction
    var deviceSerial = e.currentTarget.dataset.deviceserial

    var paramsString = 'direction=' + direction + '&deviceSerial=' + deviceSerial + '&accessToken=' + app.globalData.ACCESS_TOKEN + '&channelNo=' + app.globalData.CHANNEL_NO
    wx.request({
      url: app.globalData.STOP_PTZ_URL + '?' + paramsString,
      data: {},
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data)
      },

      fail: function (err) {
        console.log(err)
      }
    })
  },
  //点击按钮开始控制监控
  startPtz: function (e) {
    var direction = e.currentTarget.dataset.direction
    var deviceSerial = e.currentTarget.dataset.deviceserial
    var speed = e.currentTarget.dataset.speed

    this.stopPtz(e)

    var paramsString = 'direction=' + direction + '&speed=' + speed + '&deviceSerial=' + deviceSerial + '&accessToken=' + app.globalData.ACCESS_TOKEN + '&channelNo=' + app.globalData.CHANNEL_NO
    console.log(paramsString)
    wx.request({
      url: app.globalData.START_PTZ_URL + '?' + paramsString,
      data: {},
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data)
      },

      fail: function (err) {
        console.log(err)
      }
    })

  },


  
})

