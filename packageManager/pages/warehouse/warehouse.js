// pages/warehouse/warehouse.js
const app=getApp();

import * as echarts from '../../../ec-canvas/echarts';

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
      { name: '一号仓', moistrueDegree: "0.8", capacity: 100, data: [{ value: 100 }, { value: 10 }] },
      { name: '二号仓', moistrueDegree: "0.8", capacity: 200,data: [{ value: 100 }, { value: 0 }] },
      { name: '三号仓', moistrueDegree: "0.8", capacity: 300,data: [{ value: 100 }, { value: 30 }] }
    ],

    imageSrc1: '../../pages/img/menuicon/img1.png',
    imageSrc2: '../../pages/img/menuicon/img2.png',
    // tab切换
    currentTab: 0,
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
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    app.showManageTabBar();    //显示自定义的底部导航
  },

})