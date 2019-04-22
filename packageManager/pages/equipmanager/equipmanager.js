// packageManager/pages/equipmanager.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clientHeight: "",
    tabTxt: ['设备位置','具体位置' ,'设备类型', '状态'],//设备信息查询条件分类
    tab: [true, true,true, true],
    locationList: [
      { id:0,name: '工厂' },
      { id:1,name: '车辆' }
    ],
    sensorStatusList: [
      {id:0,name:'正常'},
      {id:1,name:'异常'}
    ],
    sensor_current: 1,
    sensor_id: -1,
    sensorStatus_id: -1,
    searchSerialNumberValueInput: '',
    txt: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var thit = this;
     thit.queryAllSensorType();
     thit.queryAllSite();
     thit.queryAllCar();
     thit.queryAllSensor();
    //获取设备可视窗口高度
    wx.getSystemInfo({
      success: function (res) {
        thit.setData({
          clientHeight: res.windowHeight-100
        });
      }
    })
  },

  // 设备信息选项卡
  filterTab: function (e) {
    var data = [true, true, true, true], index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({
      tab: data
    })
  },
  //设备信息筛选项点击操作
  filter: function (e) {
    var self = this, id = e.currentTarget.dataset.id, txt = e.currentTarget.dataset.txt, tabTxt = this.data.tabTxt;
    switch (e.currentTarget.dataset.index) {
      case '0':
        tabTxt[0] = txt;
        self.setData({
          tab: [true, true, true, true],
          tabTxt: tabTxt,
          location_id: id,
          location_txt: txt
        });
        break;
      case '1':
        tabTxt[1] = txt;
        self.setData({
          tab: [true, true, true, true],
          tabTxt: tabTxt,
          id: id,
          txt: txt
        });
        break;
      case '2':
        tabTxt[2] = txt;
        self.setData({
          tab: [true, true, true, true],
          tabTxt: tabTxt,
          sensor_id: id,
          sensor_txt: txt
        });
        break;
      case '3':
        tabTxt[3] = txt;
        self.setData({
          tab: [true, true, true, true],
          tabTxt: tabTxt,
          sensorStatus_id: id,
          sensorStatus_txt: txt
        });
        break;
    }
    //数据筛选
    self.getDataList();
  },

  //加载数据
  getDataList: function () {
    //调用数据接口，获取数据


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 新增传感器
  adddevice: function () {
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
  // 获取输入框数据
  sensorserialnumberinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      sensorSerialNumberinput: e.detail.value
    });
  },
  sensortypeinputChange:function(e){
     console.log(e.detail.value);
     this.setData({
       sensorTypeinput:e.detail.value
     })
  },
  gPSIDinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      gPSIDinput: e.detail.value
    });
  },
  locationinputChange:function(e){
    console.log(e.detail.value);
    this.setData({
      placeSelectinput: e.detail.value
    });
  },
  placeinputChange:function(e){
    console.log(e.detail.value);
    this.setData({
      placeinput: e.detail.value
    });
  },
  // 设备信息里的查询值获取
  searchSerialNumberValueInputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      searchSerialNumberValueInput: e.detail.value
    })
  },
  // siteinputChange: function (e) {
  //   console.log(e.detail.value);
  //   this.setData({
  //     siteinput: e.detail.value
  //   });
  // },
  // carinputChange: function (e) {
  //   console.log(e.detail.value);
  //   this.setData({
  //     carinput: e.detail.value
  //   });
  // },
  // 下拉选择框数据获取
  bindsensorTypePickerChange: function (e) {
    var sensortypename = this.data.sensorTypeList[e.detail.value].type;
    console.log(this.data.sensorTypeList[e.detail.value].type)
    if (e.detail.value == 4) {
      this.setData({ reply: true })
    } else {
      this.setData({ reply: false })
    }
    this.setData({
      sensorTypeIndex: e.detail.value,
      sensorTypeName: sensortypename
    })
  },
  bindlocationPickerChange:function(e){
    var locationname = this.data.locationList[e.detail.value].name;
    console.log(this.data.locationList[e.detail.value].name)
    if (e.detail.value == 4) {
      this.setData({ reply: true })
    } else {
      this.setData({ reply: false })
    }
    this.setData({
      locationIndex: e.detail.value,
      locationName: locationname
    })
  },
  bindsitePickerChange: function (e) {
    var sitename = this.data.siteList[e.detail.value].siteName;
    console.log(this.data.siteList[e.detail.value].siteName)
    if (e.detail.value == 4) {
      this.setData({ reply: true })
    } else {
      this.setData({ reply: false })
    }
    this.setData({
      siteIndex: e.detail.value,
      siteName: sitename
    })
  },
  bindcarPickerChange: function (e) {
    var license = this.data.carList[e.detail.value].license;
    console.log(this.data.carList[e.detail.value].license)
    if (e.detail.value == 4) {
      this.setData({ reply: true })
    } else {
      this.setData({ reply: false })
    }
    this.setData({
      carIndex: e.detail.value,
      selectedLicense: license
    })
  },
  // 查询所有传感器类型
  queryAllSensorType: function (callback) {
    var thit = this
    wx.request({
      url: app.globalData.QUERY_AllSensoType_URL,
      method: 'GET',
      header: {
        // "Content-Type":"application/json"
      },
      success: function (res) {
        console.log(res.data);
        thit.setData({
          sensorTypeList: res.data
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  // 查询所有站点
  queryAllSite: function (callback) {
    var thit = this
    wx.request({
      url: app.globalData.QUERY_AllSite_URL,
      method: 'GET',
      header: {
        // "Content-Type":"application/json"
      },
      success: function (res) {
        console.log(res.data);
        thit.setData({
          siteList: res.data
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  // 查询所有车辆
  queryAllCar:function(callback){
    var thit = this
    wx.request({
      url: app.globalData.QUERY_AllCar_URL,
      method: 'GET',
      header: {
        // "Content-Type":"application/json"
      },
      success: function (res) {
        console.log(res.data);
        thit.setData({
          carList: res.data
        })
      },
      fail: function (err) {
        console.log(err)
      }
    }) 
  },
  // 查询所有传感器
  queryAllSensor: function (callback) {
    var thit = this
    wx.request({
      url: app.globalData.QUERY_AllSensor_URL,
      method: 'GET',
      header: {
        // "Content-Type":"application/json"
      },
      success: function (res) {
        console.log(res.data);
        thit.setData({
          sensorList: res.data
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  // 设备查询
  querySensorByCondition:function(){
    var that = this;
    if (that.data.searchSerialNumberValueInput == ''){
      var sensorSerialNumber = "none";
    }else{
      var sensorSerialNumber = that.data.searchSerialNumberValueInput;
    }
    var placeSelectId = that.data.location_id;
    if(placeSelectId == 0){
        var placeSelect = "site";
    } else if (placeSelectId == 1){
      var placeSelect = "slugeCar";
    }else{
      var placeSelect = "none";
    }
    if (that.data.txt == ''){
      var place = "none";
    }else{
      var place = that.data.txt;
    }
    if (that.data.sensor_id == -1){
      var sensorTypeId = -1;
    }else{
      var sensorTypeId = parseInt(that.data.sensor_id);
    }
    if(that.data.sensorStatus_id == -1){
      var status = -1;
    }else{
      var status = that.data.sensorStatus_id;
    }
    wx.request({
      url: app.globalData.QUERY_SensorByCondition_URL,
      data: JSON.stringify({
        sensorSerialNumber: sensorSerialNumber,
        sensorTypeId: sensorTypeId,
        placeSelect: placeSelect,
        place: place,
        status: status
      }),
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          sensorList: res.data
        })
      }
    })
  },
  //增加传感器
  onSensorConfirm: function () {
    var that = this;
    var sensorSerialNumber = that.data.sensorSerialNumberinput;
    var sensorType = that.data.sensorTypeName;
    var gPSID= that.data.gPSIDinput;
    var placeSelect = that.data.locationName;
    if(placeSelect == "工厂"){
      var place = that.data.siteName;
    }else{
      placeSelect="slugeCar";
      var place = that.data.selectedLicense;
    }
    var sensorInfo;
    if(sensorType == "GPS传感器"){
      sensorInfo = JSON.stringify({
        sensorSerialNumber: sensorSerialNumber,
        sensorType: sensorType,
        GPSID: gPSID,
        placeSelect: placeSelect,
        place: place
      })
    }else{
      sensorInfo = JSON.stringify({
        sensorSerialNumber: sensorSerialNumber,
        sensorType: sensorType,
        placeSelect: placeSelect,
        place: place
      })
    }
    wx.request({
      url: app.globalData.ADD_Sensor_URL,
      data: sensorInfo,
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.result == "SUCCESS") {
          wx.showToast({
            title: "新增成功",
            icon: 'success',
            duration: 2000,
          })
        }
        that.hideModal();
        that.queryAllSensor();
      }
    })
  },
  //删除传感器记录
  delSensor: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.sensorid);
    that.setData({
      sensorId: e.currentTarget.dataset.sensorid
    });
    wx.showModal({
      title: '提示',
      content: '删除后无法恢复，是否确认删除这条记录',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.globalData.DELETE_Sensor_URL,
            method:'POST',
            data: JSON.stringify({ sensorId: parseInt(that.data.sensorId) }),
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res.data)
              if (res.data === "SUCCESS") {
                wx.showToast({
                  title: "删除成功",
                  icon: 'success',
                  duration: 2000,
                })  
              }
              that.queryAllSensor();//刷新传感器信息
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //分页事件
  sensorhandleChange({ detail }) {
    const type = detail.type;
    if (type === 'next') {
      this.setData({
        sensor_current: this.data.sensor_current + 1
      });
    } else if (type === 'prev') {
      this.setData({
        sensor_current: this.data.sensor_current - 1
      });
    }
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

  }
})