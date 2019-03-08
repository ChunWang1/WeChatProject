// pages/sensorhistorydata/sensorhistorydata.js
import * as echarts from '../../ec-canvas/echarts';

const app = getApp()

var ammniaData = [];//氨气
var shydrothionData = [];//硫化氢
var temperatureData = [];//温度
var humidityData = [];//湿度
var ultrasonicData=[];//超声波
var liquidData=[];//液位
var ammniaUnit="氨气浓度(PPM)";
var shydrothionUnit = "硫化氢浓度(PPM)";
var temperatureUnit ="温度(℃)";
var humidityUnit = "湿度(%)";
var ultrasonicUnit="距离(mm)";
var liquidUnit = "距离(mm)";


//只有一个值的表
function setOptionOne(chart, sensorType,unit,sensorData) {
  console.log("setOptionOne");
 // console.log("sensorType:" + sensorType + "unit:" + unit);
 // console.log(sensorData);
  const option = {
    title: {
      text: sensorType+'历史数据',
      left: 'center'
    },
    color: ["#37A2DA"],
    legend: {
      data: [unit],
      top: 25,
      left: 'center',
      backgroundColor: 'white',
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
      name: "time",
      nameTextStyle: { fontSize: 10 },
      type: 'category',
      // boundaryGap: false,
      show: true,
    },
    yAxis: {
      x: 'center',
      type: 'value',
      axisLabel: { //调整y轴的lable  
        textStyle: {
          fontSize: 15 // 让字体变大
        }
      },
      show: true
    },
    series: [{
      name: unit,
      type: 'line',
      smooth: true,
      data: sensorData
    }]
  };
  chart.setOption(option);
}

//有两个值的表（温湿度传感器）
function setOptionTwo(chart, sensorType, temperatureData, humidityData) {
  
  const option = {
    title: {
      text: sensorType + '历史数据',
      left: 'center'
    },
    color: ["#37A2DA","#FFC125"],
    legend: {
      data: ["温度(℃)","湿度(%)"],
      top: 25,
      left: 'center',
      backgroundColor: 'white',
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
      name: "time",
      nameTextStyle: { fontSize: 10 },
      type: 'category',
      // boundaryGap: false,
      show: true,
    },
    yAxis: {
      x: 'center',
      type: 'value',
      axisLabel: { //调整y轴的lable  
        textStyle: {
          fontSize: 15 // 让字体变大
        }
      },
      show: true
    },
    series: [{
      name: '温度(℃)',
      type: 'line',
      smooth: true,
      data: temperatureData
    }, {
        name: '湿度(%)',
        type: 'line',
        smooth: true,
        data: humidityData
      }]
  };
  chart.setOption(option);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
   // statue:0,
    ec: {
      lazyLoad: true//延迟加载
    },
    timer: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    var that=this;
    var sensorId = parseInt(options.sensorId);
    var sensorType = options.sensorType;

    this.echartsComponnet = that.selectComponent('#mychart-dom-line');
    this.queryHistoryData(sensorId, sensorType);
    this.setData({
       timer: setInterval(function () {
       that.queryHistoryData(sensorId, sensorType);
       }, 5000)
      })
    

   // this.echartsComponnet = that.selectComponent('#mychart-dom-line');
   // this.getOption(); //获取数据
   /* this.setData({
      timer: setInterval(function () {
        that.getOption();
      }, 5000)
    })*/
  },
  // 初始化只有一个值的图表
  initChartOne: function (sensorType,unit,sensorData) {
    console.log("initChartOne")
    this.echartsComponnet.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOptionOne(chart, sensorType, unit, sensorData);
      this.chart = chart;
      return chart;
    });
  },

  // 初始化有两个值的图表
  initChartTwo: function (sensorType, sensorValue1, sensorValue2) {
    console.log("initChartTwo")
    this.echartsComponnet.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOptionTwo(chart, sensorType, sensorValue1, sensorValue2);
      this.chart = chart;
      return chart;
    });
  },
/*
  getOption: function () {
    var that = this;
    that.initChart(anqiHistoryData, lhqHistoryData)
  },*/

  /**
 * 获取传感器历史数据
 */
  queryHistoryData: function (sensorId, sensorType) {
    var that = this
    console.log("queryHistoryData")
    console.log("sensorId:" + sensorId + "  " + "sensorType:" + sensorType)
    wx.request({
      url: app.globalData.QUERY_HistoryData_URL,
      data: JSON.stringify({
        sensorId: sensorId,
        sensorType: sensorType
      }),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if (sensorType === '氨气传感器') {
          ammniaData = res.data
          that.initChartOne(sensorType, ammniaUnit, ammniaData)
        } else if (sensorType === '硫化氢传感器') {
          shydrothionData = res.data
          that.initChartOne(sensorType, shydrothionUnit, shydrothionData)
        } else if (sensorType === '超声波传感器') {
          ultrasonicData = res.data
          that.initChartOne(sensorType, ultrasonicUnit, ultrasonicData)
        } else if (sensorType === '液位传感器') {
          liquidData = res.data
          that.initChartOne(sensorType, liquidUnit, liquidData)
        } else if (sensorType === '温湿度传感器') {
          temperatureData = res.data
          that.initChartOne(sensorType, temperatureUnit, temperatureData)
        }

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
   // var that=this;
    //this.echartsComponnet = that.selectComponent('#mychart-dom-line');
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
    clearInterval(this.data.timer)
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