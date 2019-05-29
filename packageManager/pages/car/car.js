// packageManager/pages/car.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noCarAssignedDriverList: [
      {
        id: 0,
        text: "暂不分配"
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this;
     console.log(JSON.stringify(options));
     that.setData({
       carId:options.carId,
     })
    //  获取车辆的所有信息
     wx.request({
       url: app.globalData.QUERY_CarByCarId_URL,
       data:{carId:that.data.carId},
       method: 'GET',
       headers: {
         'content-type': 'application/json'
       },
       success:function(res){
         console.log(res.data);
         that.setData({
           car:res.data
         })
       },
       fail:function(err){
         console.log(err);
       }
     })
  },

  // 跳转到处理车监控
  showdetailoftreatmentcar: function (event) {
    var id = event.currentTarget.dataset.carid
    console.log(id)
    wx.navigateTo({
      url: '/packageManager/pages/cardetail/cardetail?carId=' + event.currentTarget.dataset.carid,
    });
  },
    /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showEditCarModal: false,
    });
  },
  // 编辑车辆信息按钮
  editCarBtn: function (e) {
    console.log(e.currentTarget.dataset.carid);
    this.setData({
      showEditCarModal: true,
      carId: e.currentTarget.dataset.carid,
    })
    this.querynoCarAssignedDriver();
  },

  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },

  // 下拉框没有分配车辆的司机数据获取
  bindnocarassigndriverPickerChange: function (e) {
    var realname = this.data.noCarAssignedDriverList[e.detail.value].text;
    var driverid = this.data.noCarAssignedDriverList[e.detail.value].id;
    console.log(this.data.noCarAssignedDriverList[e.detail.value].text)
    if (e.detail.value == 4) {
      this.setData({ reply: true })
    } else {
      this.setData({ reply: false })
    }
    this.setData({
      driverIndex: e.detail.value,
      selectedCarRealname: realname,
      driverId: driverid
    })
  },
  //查询所有未分配司机，给下拉框附值
  querynoCarAssignedDriver: function (callback) {
    var thit = this
    wx.request({
      url: app.globalData.QUERY_NoCarAssignedDriverList_URL,
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data)
        var num = 1;
        for (var i = 0; i < res.data.length; i++) {
          var id = "noCarAssignedDriverList[" + num + "].id";
          var text = "noCarAssignedDriverList[" + num + "].text";
          thit.setData({
            [id]: res.data[i].id,
            [text]: res.data[i].realname,
          })
          num++;
        }
        console.log(thit.data.noCarAssignedDriverList);
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  // 编辑车辆信息
  editCar: function (e) {
    var that = this;
    var id = parseInt(that.data.carId);
    var license = e.detail.value.license;
    var brand = e.detail.value.brand;
    var driverId = parseInt(that.data.driverId);
    var driverName = e.detail.value.selectedCarRealname;
    if (license == " " || license == null) {
      wx.showToast({
        title: '请输入车牌号',
        icon: 'none',
        duration: 2000
      })
    } else if (driverName == " " || driverName == null) {
      wx.showToast({
        title: '司机选择不正确',
        icon: 'none',
        duration: 2000
      })
    } else {
      if (brand == " " || brand == null) {
        brand = "none";
      }
      var driver = {
        id: driverId,
        realname: driverName
      }
      wx.request({
        url: app.globalData.EDIT_Car_URL,
        data: JSON.stringify({
          id: id,
          license: license,
          brand: brand,
          driverId: driverId,
          driver: driver
        }),
        method: "POST",
        headers: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
          if (res.data == "SUCCESS") {
            wx.showToast({
              title: "修改成功！",
              icon: 'none',
              duration: 2000,
            })
            that.hideModal();
            wx.request({
              url: app.globalData.QUERY_CarByCarId_URL,
              data: { carId: id },
              method: 'GET',
              headers: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res.data);
                that.setData({
                  car: res.data
                })
              },
              fail: function (err) {
                console.log(err);
              }
            })
            // that.queryAllCar();//刷新记录页面  
          } else if (res.data == "INPUT") {
            wx.showToast({
              title: "请输入正确的车牌号！",
              icon: 'none',
              duration: 2000,
            })
            that.hideModal();
          } else if (res.data == "DUPLICATE") {
            wx.showToast({
              title: "车牌号冲突！",
              icon: 'none',
              duration: 2000,
            })
            that.hideModal();
          } else {
            wx.showToast({
              title: "修改失败！",
              icon: 'none',
              duration: 2000,
            })
            that.hideModal();
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
    }
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

  }
})