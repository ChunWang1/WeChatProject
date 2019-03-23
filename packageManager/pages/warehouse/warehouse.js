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
    clientHeight:"",
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
    functionList:[],
    tabTxt: ['仓库', '工厂', '负责人', '日期'],//分类
    tab: [true, true, true, true],
    assigntranscarlist:[],
    assigntranscar_id:0,
    assigntranscar_txt:'',
    pinpaiList: [{ 'id': '1', 'title': '品牌1' }, { 'id': '2', 'title': '品牌2' }],
    pinpai_id: 0,//品牌
    pinpai_txt: '',
    sitelist:[],
    site_id: 0,
    site_txt: '',
    date: '2019-01-01',//默认起始时间  
    date2: '2019-12-30',//默认结束时间 
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
              { name: res.data[0].id+'号仓', moistrueDegree: res.data[0].moistrueDegree, capacity: res.data[0].capacity, data: data_0 },
              { name: res.data[1].id + '号仓', moistrueDegree: res.data[1].moistrueDegree, capacity: res.data[1].capacity, data: data_1 },
              { name: res.data[2].id + '号仓', moistrueDegree: res.data[2].moistrueDegree, capacity: res.data[2].capacity, data: data_2 }
            ]
          })
        },
        fail: function (res) {
          console.log("失败");
        }
      })
    thit.queryassignCarTransportDriver();
    thit.querryallsite();

    //获取设备可视窗口高度
    wx.getSystemInfo({
      success: function (res) {
        thit.setData({
          clientHeight: res.windowHeight-40
        });
      }
    })
  },
 //查询所有记录
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
//查询所有污泥记录
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
//查询所有污泥功能，给下拉框附值
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
  //查询所有未分配运输车，给下拉框附值
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
  //增加污泥出入记录模态框
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
  //获取输入框数据
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
  //确定增加
  onConfirm: function () {
    var that = this;
    var transCarId = parseInt(that.data.transCarId);
    var mudWareHouseId = parseInt(that.data.warehouseid);
    var rfid = that.data.rfidinput;
    var desAddr = that.data.desAddrinput;
    var sludgeFunction = {function: that.data.sludgefunction};
    var weight = parseFloat(that.data.weightinput);
    console.log(transCarId)
    console.log(mudWareHouseId)
    console.log(weight)
    console.log(sludgeFunction)
    
    wx.request({
      url: app.globalData.ADD_SludgeByTransCar_URL,
      data: JSON.stringify({
        transcarId: transCarId,
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
    this.querysludge();
  },
  //下拉选择框数据获取
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
  // 搜索
  //按日期查询污泥处理记录
  querySludgeBySiteIdAndInOutFlag: function (callback) {
    var thit = this
    console.log(thit.data.date)
    console.log(thit.data.date2)
    wx.request({
      url: app.globalData.QUERY_SludgeByDateAndInOutFlag_URL,
      data: JSON.stringify({
        startDate: thit.data.date,
        endDate: thit.data.date2,
        inOutFlag: '3',
        minorWareHouseId: '0'
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
  //查询分配任务的司机，附值给负责人的选择框
  queryassignCarTransportDriver : function(callback) {
    var thit = this
    wx.request({
      url: app.globalData.QUERY_queryassignCarTransportDriver_URL,

      method: 'POST',
      header: {
        // "Content-Type":"application/json"
      },
      success: function (res) {
        console.log(res.data)
        thit.setData({
          assigntranscarlist: res.data
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  //按司机查询污泥处理记录
  querySludgeByDriverIdAndInOutFlag: function (callback) {
    var thit = this
    wx.request({
      url: app.globalData.QUERY_SludgeByDriverIdAndInOutFlag_URL,
      data: JSON.stringify({
        driverId: parseInt(thit.data.assigntranscar_id),
        inOutFlag: '3',
        minorWareHouseId: '0'
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
  //查询所有站点，附值给工厂的选择框
  querryallsite: function (callback) {
    var thit = this
    wx.request({
      url: app.globalData.QUERY_AllSite_URL,
      method: 'POST',
      header: {
        // "Content-Type":"application/json"
      },
      success: function (res) {
        console.log(res.data)
        thit.setData({
          sitelist: res.data
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  //按工厂查询污泥处理记录
  querySludgeBySiteIdAndInOutFlag: function (callback) {
    var thit = this
    wx.request({
      url: app.globalData.QUERY_SludgeBySiteIdAndInOutFlag_URL,
      data: JSON.stringify({
        siteId: parseInt(thit.data.site_id),
        inOutFlag: '3',
        minorWareHouseId: '0'
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
  // 选项卡
  filterTab: function (e) {
    var data = [true, true, true,true], index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({
      tab: data
    })
  },
  // 时间段选择  
  bindDateChange(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      date: e.detail.value,
    })
  },
  bindDateChange2(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      date2: e.detail.value,
    })
    that.querySludgeBySiteIdAndInOutFlag()
  },
  //筛选项点击操作
  filter: function (e) {
    var self = this, id = e.currentTarget.dataset.id, txt = e.currentTarget.dataset.txt, tabTxt = this.data.tabTxt;
    switch (e.currentTarget.dataset.index) {
      case '0':
        tabTxt[0] = txt;
        self.setData({
          tab: [true, true, true,true],
          tabTxt: tabTxt,
          pinpai_id: id,
          pinpai_txt: txt
        });
        break;
      case '1':
        tabTxt[1] = txt;
        self.setData({
          tab: [true, true, true,true],
          tabTxt: tabTxt,
          site_id: id,
          site_txt: txt
        });
        self.querySludgeBySiteIdAndInOutFlag()
        break;
      case '2':
        tabTxt[2] = txt;
        self.setData({
          tab: [true, true, true,true],
          tabTxt: tabTxt,
          assigntranscar_id: id,
          assigntranscar_txt: txt
        });
        self.querySludgeByDriverIdAndInOutFlag()
        break;
        case'3':
        tabTxt[3]=txt;
        self.setData({
          tab: [true, true, true, true],
          tabTxt: tabTxt,
          date: this.data.date,
          date2: this.data.date2
        });
        break;
    }
    //数据筛选
    self.getDataList();
  },

  //加载数据
  getDataList: function () {
    //调用数据接口，获取数据


  }
})