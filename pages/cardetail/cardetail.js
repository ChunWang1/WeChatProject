// pages/cardetail/cardetail.js
import * as echarts from '../../ec-canvas/echarts';

const app = getApp()
var map={};
var jsSensorList=[];
var anqiHistoryData = [2, 1, 1, 1, 2, 1, 1, 1, 1, 3];
var lhqHistoryData = [4, 3, 2, 1, 1, 2, 1, 2, 1, 2];
//var Chart=null;

function setOption(chart, anqiHistoryData, lhqHistoryData){
  const  option = {
    title: {
      text: '传感器历史数据',
      left: 'center'
    },
    color: ["#37A2DA", "#9FE6B8"],
    legend: {
      data: ['氨气浓度(PPM)', '硫化氢浓度(PPM)'],
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
      name:"time",
      nameTextStyle:{fontSize:10},
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
/** 
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }*/
       show: true
    },
    series: [{
      name: '氨气浓度(PPM)',
      type: 'line',
      smooth: true,
      data: anqiHistoryData
    }, {
      name: '硫化氢浓度(PPM)',
      type: 'line',
      smooth: true,
      data: lhqHistoryData
    }]
  };
  chart.setOption(option);
}



Page({
  /**
   * 页面的初始数据
   */
  data: {
    carId: 33,
    site_id:53,
    "sensorList": [],
    "sensorRealValueMap":{},

    ec: {
      lazyLoad:true//延迟加载
    },
    timer:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    /* that.setData({
       carId: options.id//获取从上一个页面的carid
       site_id:options.site_id//获取从上一个页面的车的site_id
     })*/
    
    console.log('onLoad')
    this.echartsComponnet = that.selectComponent('#mychart-dom-line');
    this.getOption(); //获取数据
    this.setData({
      timer:setInterval(function(){
        that.getOption();
      },5000)
    })
    
    this.queryAllSite();
    /**
     * 获取传感器和监控
     */
    wx.request({
      url: "https://www.teamluo.cn/monitor/queryVideoAndSensorByCarIdfoForWX",
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
        that.getRealValue();
        setInterval(function () {
          that.getRealValue();
        }, 10000);
        //that.getRealValue();
        
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

// 初始化图表
  initChart: function (anqiHistoryData, lhqHistoryData) {
     console.log("initChart")
    this.echartsComponnet.init((canvas, width, height) => {
      
    const  chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      // Chart.setOption(this.getOption());
      setOption(chart, anqiHistoryData, lhqHistoryData);
      this.chart=chart;
      return chart;
    }); 
  },
getOption:function(){
  var that=this;
  that.initChart(anqiHistoryData, lhqHistoryData)
},

/**
 * 查询站点信息
 */
  queryAllSite:function(){
      var that=this;
    console.log("queryAllSite")
    wx.request({
      url: "https://www.teamluo.cn/system/queryAllSite",
      data: {  },
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },

      success: function (res) {
        console.log(res.data)
        that.setData({
          siteData:res.data 
        })
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
      url: "https://www.teamluo.cn/sensor/queryRealTimeValue",
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
      url: "https://www.teamluo.cn/sensor/queryHistoryData",
      data:JSON.stringify({
        sensorId: sensorId,
        sensorType: sensorType
      }),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      success: function (res) {
      //  console.log(res.data)
        if(sensorType==='氨气传感器'){
          anqiHistoryData=res.data
          console.log("anqiHistoryData")
          console.log(anqiHistoryData)
        } else if (sensorType === '硫化氢传感器'){
          lhqHistoryData=res.data
          console.log("lhqHistoryData")
          console.log(lhqHistoryData)
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

