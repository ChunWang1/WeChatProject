// packageManager/pages/sysmanage.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clientHeight: "",
    currentTab: 0,
    partCurrentTab:3,
    placeholderText:"请输入用户姓名/登录名/手机号码/身份证/邮箱",
    userName:[
     {name:'管理员'},
     {name:'工作人员'},
     {name:'司机'},
     {name:'运输车司机'} 
    ],
    carType:[
     {id:0,name:'污泥处理'},
     {id:1,name:'污泥运输'}
    ],
    select: false,
    selectOne:false,
    selectTwo:false,
    selectstatus:"选择状态",
    selectuser:"选择角色",
    selectcar:"车类型查询",
    user_current: 1,
    site_current:1,
    car_current:1,
    region: ["", "", ""], // 省市区三级联动初始化

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
  // 车队管理导航
  partswichNav: function (e) {
    console.log(e);
    var that = this;
    if (this.data.partCurrentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        partCurrentTab: e.target.dataset.current,
      })
    }
  },
  // 查询所有用户
  queryAllUser: function (callback) {
    var thit = this
    wx.request({
      url: app.globalData.QUERY_AllUser_URL,
      method: 'GET',
      header: {
        // "Content-Type":"application/json"
      },
      success: function (res) {
        console.log(res.data);
        thit.setData({
          userList: res.data
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
  //查询所有未分配司机，给下拉框附值
  querynoCarAssignedDriver: function (callback) {
    var thit = this
    wx.request({
      url: app.globalData.QUERY_NoCarAssignedDriverList_URL,
      method: 'POST',
      header: {
        // "Content-Type":"application/json"
      },
      success: function (res) {
        console.log(res.data)
        thit.setData({
          noCarAssignedDriverList: res.data
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  // 查询所有车辆
  queryAllCar: function (callback) {
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

  swiperChange: function (e) {

    console.log(e);

    this.setData({

      currentTab: e.detail.current,

    })
  },
  // 车队管理导航
  partswiperChange: function (e) {

    console.log(e);

    this.setData({

      partCurrentTab: e.detail.current,

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var thit = this;
     thit.queryAllUser();
     thit.queryAllSite();
     thit.queryAllCar();
     thit.querynoCarAssignedDriver();
    //获取设备可视窗口高度
    wx.getSystemInfo({
      success: function (res) {
        thit.setData({
          clientHeight: res.windowHeight - 40
        });
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
    app.showManageTabBar(); 
  },
  // 新增用户
  addUser: function () {
    this.setData({
      showModal: true
    })
  },
  // 新增站点
  addSite:function(){
     this.setData({
       showModal:true
     })
  },
  // 新增车辆
  addCar:function(){
    this.setData({
      showModal:true
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
      showModal: false,
      
      showEditCarModal:false
    });
  },
  /**
   * 隐藏站点记录编辑模态对话框
   */
  hideSiteModal: function () {
    this.setData({
      showEditSiteModal: false,
    });
  },
    /**
   * 站点记录编辑对话框取消按钮点击事件
   */
  onsiteCancel: function () {
    this.hideSiteModal();
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  // 获取输入框数据
  serialNumberinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      serialNumberinput: e.detail.value
    });
  },
  siteNameinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      siteNameinput: e.detail.value
    });
  },
  telephoneinputChange:function(e){
    console.log(e.detail.value);
    this.setData({
      telephoneinput: e.detail.value
    });
  },
  addressinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      addressinput: e.detail.value
    });
  },
  searchValueInput:function(e){
    console.log(e.detail.value);
    this.setData({
      searchValue: e.detail.value
    });
  },
  licenseinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      licenseinput: e.detail.value
    });
  },
  brandinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      brandinput: e.detail.value
    });
  },
  cartypeinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      cartypeinput: e.detail.value
    });
  },
  nocarassigndriverinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      nocarassigndriverinput: e.detail.value
    });
  },
  managerChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      managerinput: e.detail.value
    });
  },
  // 下拉框用户角色数据获取
  binduserPickerChange: function (e) {
    console.log(this.data.userName[e.detail.value].name)
    if (e.detail.value == 4) {
      this.setData({ reply: true })
    } else {
      this.setData({ reply: false })
    }
    this.setData({
      userIndex: e.detail.value
    })
  },
  // 下拉框车辆类型数据获取
  bindcartypePickerChange:function(e){
    console.log(this.data.carType[e.detail.value].name)
    if(e.detail.value == 4){
       this.setData({reply:true})
    }else{
      this.setData({reply:false})
    }
    this.setData({
      carTypeIndex:e.detail.value
    })
  },
  // 下拉框没有分配车辆的司机数据获取
  bindnocarassigndriverPickerChange: function (e) {
    console.log(this.data.noCarAssignedDriverList[e.detail.value].realname)
    if (e.detail.value == 4) {
      this.setData({ reply: true })
    } else {
      this.setData({ reply: false })
    }
    this.setData({
      driverIndex: e.detail.value
    })
  },
  
  //状态下拉框
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
  mySelect(e) {
    var status = e.currentTarget.dataset.name
    this.setData({
      selectstatus: status,
      select: false
    })
  },
  //角色下拉框
  bindShowMsgUser() {
    this.setData({
      selectOne: !this.data.selectOne
    })
  },
  mySelectUser(e) {
    var user = e.currentTarget.dataset.name
    this.setData({
      selectuser: user,
      selectOne: false
    })
  },
  // 车辆查询下拉框
  bindShowMsgCar() {
    this.setData({
      selectTwo: !this.data.selectTwo
    })
  },
  mySelectCar(e) {
    var car = e.currentTarget.dataset.name
    this.setData({
      selectcar: car,
      selectTwo: false
    })
  },
  // 分页事件
  // 用户信息分页
  userhandleChange({ detail }) {
    const type = detail.type;
    if (type === 'next') {
      this.setData({
        user_current: this.data.user_current + 1
      });
    } else if (type === 'prev') {
      this.setData({
        user_current: this.data.user_current - 1
      });
    }
  },
  // 站点信息分页
  sitehandleChange({ detail }) {
    const type = detail.type;
    if (type === 'next') {
      this.setData({
        site_current: this.data.site_current + 1
      });
    } else if (type === 'prev') {
      this.setData({
        site_current: this.data.site_current - 1
      });
    }
  },
  // 车辆信息分页
  carhandleChange({ detail }) {
    const type = detail.type;
    if (type === 'next') {
      this.setData({
        car_current: this.data.car_current + 1
      });
    } else if (type === 'prev') {
      this.setData({
        car_current: this.data.car_current - 1
      });
    }
  },
  // 选择省市区函数
  changeRegin(e) {
    this.setData({ region: e.detail.value });
  },

  //编辑站点记录按钮
  editSiteBtn: function (e) {
    console.log(e.currentTarget.dataset.siteid);
    this.setData({
      showEditSiteModal: true,
      siteId: e.currentTarget.dataset.siteid
    })
  },
  // 编辑车辆信息按钮
  editCarBtn:function(e){
     console.log(e.currentTarget.dataset.carid);
     this.setData({
       showEditCarModal:true,
       carId:e.currentTarget.dataset.carid
     })
  },
  //确定站点增加
  onSiteConfirm: function () {
    var that = this;
    var serialNumber = that.data.serialNumberinput;
    var siteName = that.data.siteNameinput;
    var telephone = that.data.telephoneinput;
    var address = that.data.addressinput;
    wx.request({
      url: app.globalData.ADD_Site_URL,
      data: JSON.stringify({
        serialNumber: serialNumber,
        siteName: siteName,
        address: address,
        telephone: telephone
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
    that.hideModal();
    that.queryAllSite();
  },
  // 删除站点信息
  delSite: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.siteid);
    that.setData({
      siteId: e.currentTarget.dataset.siteid
    });
    wx.showModal({
      title: '提示',
      content: '删除后无法恢复，是否确认删除这条记录',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.globalData.DELETE_Site_URL,
            data: { siteId: that.data.siteId },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res.data)
              if (res.data === "SUCCESS") {
                setTimeout(() => {
                  $Message({
                    content: '删除成功！',
                    type: 'success'
                  });
                }, 2000);

                that.queryAllSite();//刷新车辆信息
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 编辑站点信息
  editSite:function(e){
    var that = this;
    var id = parseInt(that.data.siteId);
    var serialNumber = that.data.serialNumberinput;
    var siteName = that.data.siteNameinput;
    var telephone = that.data.telephoneinput;
    var managerId = parseInt(that.data.managerinput);
    var address = that.data.addressinput;
    wx.request({
      url: app.globalData.EDIT_Site_URL,
      data: JSON.stringify({
        id:id,
        serialNumber: serialNumber,
        siteName: siteName,
        address: address,
        managerId: managerId,
        telephone: telephone
      }),
      method:"POST",
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
          that.hideSiteModal();
          that.queryAllSite();//刷新记录页面  
        } else if (res.data == "ERROR") {
          wx.showToast({
            title: "修改失败！",
            icon: 'none',
            duration: 2000,
          })
          that.hideSiteModal();
        } else if (res.data == "CONFLICT") {
          wx.showToast({
            title: "修改失败！",
            icon: 'none',
            duration: 2000,
          })
          that.hideSiteModal();
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
  // 确定车辆增加
  onCarConfirm: function () {
    var that = this;
    var license = that.data.licenseinput;
    var brand = that.data.brandinput;
    if (that.data.cartypeinput == "污泥处理"){
      var carType = 0;
    }else{
      var carType = 1;
    } 
    var driverId = that.data.nocarassigndriverinput;
    wx.request({
      url: app.globalData.ADD_Car_URL,
      data: JSON.stringify({
        license: license,
        brand: brand,
        driverId: driverId,
        carType: carType
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
    that.hideModal();
    that.queryAllCar();
  },
  // 编辑车辆信息
  editCar: function (e) {
    var that = this;
    var id = parseInt(that.data.carId);
    var license = that.data.licenseinput;
    var brand = that.data.brandinput;
    var driverId = parseInt(that.data.driverId);
    wx.request({
      url: app.globalData.EDIT_Car_URL,
      data: JSON.stringify({
        id: id,
        license: license,
        brand: brand,
        driverId: driverId,
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
          that.hideModal
          that.queryAllCar();//刷新记录页面  
        } else if (res.data == "ERROR") {
          wx.showToast({
            title: "修改失败！",
            icon: 'none',
            duration: 2000,
          })
          that.hideModal();
        } else if (res.data == "CONFLICT") {
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
  },
  //删除车辆信息
  delCar: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.carid);
    that.setData({
      carId: e.currentTarget.dataset.carid
    });
    wx.showModal({
      title: '提示',
      content: '删除后无法恢复，是否确认删除这条记录',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.globalData.DELETE_Car_URL,
            data: { carId: parseInt(that.data.carId) },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res.data)
              if (res.data === "SUCCESS") {
                setTimeout(() => {
                  $Message({
                    content: '删除成功！',
                    type: 'success'
                  });
                }, 2000);

                that.queryAllCar();//刷新车辆信息
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  
  // 跳转到运输车监控
  showdetailoftreatmentcar: function (event) {
    var id = event.currentTarget.dataset.carid
    console.log(id)
    wx.navigateTo({
      url: '/packageManager/pages/cardetail/cardetail?carId=' + event.currentTarget.dataset.carid,
    });
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