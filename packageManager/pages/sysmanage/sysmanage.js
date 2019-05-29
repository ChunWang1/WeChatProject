// packageManager/pages/sysmanage.js
// 引入SDK核心类
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js')
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'WOTBZ-CBL3U-QYBVN-4577A-ZOAZK-ZDBWW' // 必填
});
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clientHeight: "",
    currentTab: 0,
    // partCurrentTab:3,
    placeholderText:"请输入用户姓名/登录名/手机号码/身份证/邮箱",
    userName:[
     {id:1,name:'管理员'},
     {id:2,name:'工作人员'},
     {id:3,name:'司机'},
     {id:4,name:'运输车司机'} 
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
    // resetPassVisible:false,
    // editUserVisible:false,
    // editCarSelectArray:[
    //   {
    //     id:-1,
    //     text:"--暂不修改--"
    //   },
    //   {
    //     id: 0,
    //     text: "--暂不分配车辆--"
    //   },
    //   ],
    // editSiteSelectArray:[
    //   {
    //     id: 0,
    //     text: "--暂不分配--"
    //   }
    //   ],
    // noCarAssignedDriverList:[
    //   {
    //     id:0,
    //     text:"暂不分配"
    //   }
    // ],
    editCarSelect:[],
    editSiteSelect: [],
    username:"",
    userId:"",
    roleId:"",
    tabTxt: ['设备位置', '具体位置', '设备类型', '状态'],//设备信息查询条件分类
    tab: [true, true, true, true],
    locationList: [
      { id: 0, name: '工厂' },
      { id: 1, name: '车辆' }
    ],
    sensorStatusList: [
      { id: 0, name: '正常' },
      { id: 1, name: '异常' }
    ],
    // sensor_current: 1,
    sensor_id: -1,
    sensorStatus_id: -1,
    searchSerialNumberValueInput: '',
    txt: ''
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
  // partswichNav: function (e) {
  //   console.log(e);
  //   var that = this;
  //   if (this.data.partCurrentTab === e.target.dataset.current) {
  //     return false;
  //   } else {
  //     that.setData({
  //       partCurrentTab: e.target.dataset.current,
  //     })
  //   }
  // },
  // 查询所有用户
  queryAllUser: function (callback) {
    var thit = this
    wx.request({
      url: app.globalData.QUERY_AllUser_URL,
      method: 'GET',
      header: {
         "Content-Type":"application/json"
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
         "Content-Type":"application/json"
      },
      success: function (res) {
        console.log(res.data);
        thit.setData({
          siteList: res.data
        })
        var num = 1;
        for (var i = 0; i < res.data.length; i++) {
          var id = "editSiteSelectArray[" + num + "].id";
          var text = "editSiteSelectArray[" + num + "].text";
          thit.setData({
            [id]: res.data[i].id,
            [text]: res.data[i].siteName,
          })
          num++;
        }
        console.log(thit.data.editSiteSelectArray);
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  //查询所有未分配司机的车辆，给司机编辑下拉框赋值
  queryCarWhichNotAssignDriver:function(){
    var thit = this
    wx.request({
      url: app.globalData.QUERY_CarWhichNotAssignDriver,
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data)
        var num=2;
        for (var i = 0; i < res.data.length; i++){
          var id = "editCarSelectArray[" + num + "].id";
          var text = "editCarSelectArray[" + num + "].text";
          thit.setData({
            [id]: res.data[i].id,
            [text]: res.data[i].license,
          })
          num++;
        }
        console.log(thit.data.editCarSelectArray);
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
         "Content-Type":"application/json"
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
  
  // 查询所有车辆
  queryAllCar: function (callback) {
    var thit = this
    wx.request({
      url: app.globalData.QUERY_AllCar_URL,
      method: 'GET',
      header: {
         "Content-Type":"application/json"
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
  // partswiperChange: function (e) {

  //   console.log(e);

  //   this.setData({

  //     partCurrentTab: e.detail.current,

  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var thit = this;
     thit.queryAllUser();
     thit.queryAllSite();
     thit.queryAllCar();
     thit.querynoCarAssignedDriver();
    thit.queryAllSensor();
    //获取设备可视窗口高度
    wx.getSystemInfo({
      success: function (res) {
        thit.setData({
          clientHeight: res.windowHeight -40
        });
       // console.log("自适应高度为：" + thit.data.clientHeight)
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
  //删除用户按钮
  deleteUser:function(e){
     var that=this;
    
    var userid = parseInt(e.currentTarget.dataset.userid)
    console.log("您需要删除用户的id:" + userid);
    wx.request({
      url: app.globalData.DELETE_User + "?userId=" + userid,
      data:{
       //userId:userid
      },
      
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        wx.showToast({
          title: "删除成功!",
          icon: 'success',
          duration: 2000,
        })
        that.queryAllUser();
      },
      fail: function (err) {
        console.log(err)
        wx.showToast({
          title: "删除失败!",
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },
  // //重置密码
  // resetPass:function(e){
  //   var that = this;
  //   var userid = parseInt(that.data.userId)
  //   console.log("您需要重置密码的用户id:" + userid);
  //   wx.request({
  //     url: app.globalData.RESET_PassWord + "?userId=" + userid,
  //     data: {
  //       //userId:userid
  //     },

  //     method: 'POST',
  //     headers: {
  //       'content-type': 'application/json'
  //     },
  //     success: function (res) {
  //       console.log(res.data)
  //       if (res.data == "SUCCESS"){
  //         wx.showToast({
  //           title: "密码重置成功!",
  //           icon: 'success',
  //           duration: 2000,
  //         })
  //         that.setData({
  //           resetPassVisible: false,
  //         })
  //       }else{
  //         wx.showToast({
  //           title: "密码重置失败!",
  //           icon: 'none',
  //           duration: 2000,
  //         })
  //       }
        
  //     },
  //     fail: function (err) {
  //       console.log(err)       
  //     }
  //   })
  // },
  //展示重置密码框
  // showResetModal:function(e){
  //   var that = this;
  //   that.setData({
  //     resetPassVisible: true,
  //     username: e.currentTarget.dataset.username,
  //     userId: e.currentTarget.dataset.userid,
  //   })
    
  // },
  //取消重置密码
  // cancelResetPass:function(){
  //   var that=this;
  //   that.setData({
  //     resetPassVisible:false,
  //   })
  // },
  //展示编辑用户模态框
  showEditModal:function(e){
    var that = this;
    console.log("您要编辑的角色id为：" + e.currentTarget.dataset.roleid)
    that.setData({
      editUserVisible: true,
      roleId: e.currentTarget.dataset.roleid,
      userId: e.currentTarget.dataset.userid,
    })
    that.queryCarWhichNotAssignDriver();
    that.queryAllSite();
  },
  //取消编辑用户
  // cancelEditUser:function(){
  //   var that = this;
  //   that.setData({
  //     editUserVisible: false,
  //   })
  // },
  //编辑用户
  // editUser:function(){
  //   var that = this;
  //   var userId = that.data.userId;
  //   var roleId = that.data.roleId;
  //   var siteId = 0;
  //   var carId = 0;
  //   if (roleId == 2) {
  //     siteId = parseInt(that.data.editSiteSelect.id)
  //   } else if (roleId == 3) {
  //     carId = parseInt(that.data.editCarSelect.id)
  //   }
  //   console.log("userId:" + userId + "roleId:" + roleId + "siteId:" + siteId + "carId:" + carId)
  //   if (roleId==3&&carId==-1){
  //     that.setData({
  //       editUserVisible: false,
  //     })
  //   }else{
  //     wx.request({
  //       url: app.globalData.EDIT_UserByUserId_URL,
  //       data: JSON.stringify({
  //         userId: userId,
  //         roleId: roleId,
  //         siteId: siteId,
  //         carId: carId
  //       }),
  //       method: 'POST',
  //       headers: {
  //         'content-type': 'application/json'
  //       },
  //       success: function (res) {
  //         console.log(res.data)
  //         if (res.data.result === "success") {
  //           wx.showToast({
  //             title: "修改成功！",
  //             icon: 'success',
  //             duration: 2000,
  //           }) 
  //           that.queryAllUser();
  //         } else {
  //           wx.showToast({
  //             title: "修改用户信息失败！",
  //             icon: 'none',
  //             duration: 2000,
  //           })
  //         }
  //         that.setData({
  //           editCarSelect:[],
  //           editSiteSelect:[],
  //           editUserVisible: false,
  //         })
  //       },
  //       fail: function (err) {
  //         console.log(err)

  //       }
  //     })
  //   }

    
  // },
  //编辑司机用户下拉选中事件
  // getCarDate:function(e){
  //   this.setData({
  //     editCarSelect: e.detail
  //   });
  //   console.log(e.detail)
  // },
  //编辑工厂人员用户下拉选中事件
  // getSiteDate: function (e) {
  //   this.setData({
  //     editSiteSelect: e.detail
  //   });
  //   console.log(e.detail)
  // },
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
      showEditCarModal:false,
      showEditSiteModal:false
    });
  },
  /**
   * 隐藏站点记录编辑模态对话框
   */
  // hideSiteModal: function () {
  //   this.setData({
  //     showEditSiteModal: false,
  //   });
  // },
    /**
   * 站点记录编辑对话框取消按钮点击事件
   */
  // onsiteCancel: function () {
  //   this.hideSiteModal();
  // },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  // 获取输入框数据
  logininputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      logininput: e.detail.value
    });
  },
  pwdinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      pwdinput: e.detail.value
    });
  },
  telinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      telinput: e.detail.value
    });
  },
  nameinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      nameinput: e.detail.value
    });
  },
  emailinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      emailinput: e.detail.value
    });
  },
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
  // licenseinputChange: function (e) {
  //   console.log(e.detail.value);
  //   this.setData({
  //     licenseinput: e.detail.value
  //   });
  // },
  // brandinputChange: function (e) {
  //   console.log(e.detail.value);
  //   this.setData({
  //     brandinput: e.detail.value
  //   });
  // },
  cartypeinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      cartypeinput: e.detail.value
    });
  },
  // nocarassigndriverinputChange: function (e) {
  //   console.log(e.detail.value);
  //   this.setData({
  //     nocarassigndriverinput: e.detail.value
  //   });
  // },
  managerChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      managerinput: e.detail.value
    });
  },
  // 站点管理里的查询值获取
  searchValueInputChange:function(e){
    console.log(e.detail.value);
    this.setData({
       searchValueInput:e.detail.value
    })
  },
  // 车队信息的查询值获取
  searchCarValueInputChange:function(e){
    console.log(e.detail.value);
    this.setData({
      searchCarValueInput: e.detail.value
    })
  },
  // 用户信息的查询值获取
  searchUserValueInputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      searchUserValueInput: e.detail.value
    })
  },
  editManagerinputChange:function(e){
    console.log(e.detail.value);
    this.setData({
      editManagerinput: e.detail.value
    })
  },
  // 下拉框用户角色数据获取
  binduserPickerChange: function (e) {
    var roleid = this.data.userName[e.detail.value].id;
    console.log(this.data.userName[e.detail.value].name)
    if (e.detail.value == 4) {
      this.setData({ reply: true })
    } else {
      this.setData({ reply: false })
    }
    this.setData({
      userIndex: e.detail.value,
      roleId: roleid
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
    var realname=this.data.noCarAssignedDriverList[e.detail.value].text;
    var driverid = this.data.noCarAssignedDriverList[e.detail.value].id;
    console.log(this.data.noCarAssignedDriverList[e.detail.value].text)
    if (e.detail.value == 4) {
      this.setData({ reply: true })
    } else {
      this.setData({ reply: false })
    }
    this.setData({
      driverIndex: e.detail.value,
      selectedCarRealname:realname,
      driverId:driverid
    })
  },
  // 下拉框工厂的工作人员数据获取
  bindAllManagerBySitePickerChange:function(e){
     var that = this;
    //  var realname = that.data.editManagerList[e.detail.value].realname;
     var managerid = that.data.editManagerList[e.detail.value].id;
     console.log(that.data.editManagerList[e.detail.value].realname)
     if(e.detail.value == 4){
        that.setData({reply: true})
     }else{
        that.setData({reply: false})
     }
     that.setData({
       managerIndex: e.detail.value,
      //  selectedRealname: realname,
       managerId: managerid
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
    this.queryUserByCheckStatus();
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
    this.queryUserByRoleId();
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
    this.queryCarByCarType();
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
  // 新增用户
  onUserConfirm: function () {
    var that = this;
    var username = that.data.logininput;
    var password = that.data.pwdinput;
    var telephone = that.data.telinput;
    var realname = that.data.nameinput;
    var roleId = that.data.roleId;
    var email = that.data.emailinput;
    var regs = /^1[3|4|5|8][0-9]\d{4,8}$/;
    var reg = /[\u4e00-\u9fa5]+/g;
    var pattern = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
    if(username == " " || username == null || password == " " || password == null ){
       wx.showToast({
         title: '登录名和密码必填',
         icon:'none',
         duration:2000,
         success: () => console.log("登录名和密码必填！")
       })
    }else if(!(regs.test(telephone))){
       wx.showToast({
         title: '请输入正确的手机号码',
         icon:'none',
         duration:2000,
         success: () => console.log("请输入正确的手机号码！")
       })
    }else if(!(reg.test(realname))){
       wx.showToast({
         title: '请输入汉字',
         icon:'none',
         duration:2000,
         success: () => console.log("请输入汉字！")
       })
    }else if(!(pattern.test(email))){
       wx.showToast({
         title: '请输入正确的邮箱',
         icon: 'none',
         duration:2000,
         success: () => console.log("请输入正确的邮箱！")
       })
    }else{
      wx.request({
        url: app.globalData.ADD_User_URL,
        data: JSON.stringify({
          realname: realname,
          username: username,
          password: password,
          email: email,
          telephone: telephone,
          roleId: roleId,
        }),
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
            that.hideModal();
            that.queryAllUser();
          }else if(res.data.result == "INPUT"){
            wx.showToast({
              title: '登录名和密码必填',
              icon: 'none',
              duration: 2000,
            })
          } else if (res.data.result == "DUPLICATE"){
            wx.showToast({
              title: '该用户已被占用',
              icon: 'none',
              duration: 2000,
            })
          }else{
            wx.showToast({
              title: '添加失败',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function(err){
          console.log(err);
          wx.showToast({
            title: '添加失败',
            icon:'none',
            duration:2000
          })
        }
      })
    }
    
  },
  // 通过审核状态来查询用户
  queryUserByCheckStatus: function () {
    var that = this;
    var checkStatusName = that.data.selectstatus;
    if (checkStatusName == "全部") {
      var checkStatus = -1;
    } else if (checkStatusName == "待审核"){
      var checkStatus = 2;
    } else if (checkStatusName == "审核不通过"){
      var checkStatus = 0;
    }else{
      var checkStatus = 1;
    }
    wx.request({
      url: app.globalData.QUERY_UserByCheckStatus_URL + "?checkStatus=" + parseInt(checkStatus),
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          userList: res.data
        })
      }
    })
  },
  // 根据用户角色查询用户
  queryUserByRoleId: function () {
    var that = this;
    var roleName = that.data.selectuser;
    if (roleName == "管理员") {
      var roleId = 1;
    } else if (roleName == "工厂人员") {
      var roleId = 2;
    } else if (roleName == "处理车司机") {
      var roleId = 3;
    } else {
      var roleId = 4;
    }
    wx.request({
      url: app.globalData.QUERY_UserByRoleId_URL + "?roleId=" + parseInt(roleId),
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          userList: res.data
        })
      }
    })
  },
  // 通过搜索条件查询用户
  queryUserByCondotion: function () {
    var that = this;
    var queryStr = that.data.searchUserValueInput;
    wx.request({
      url: app.globalData.FUZZYQUERY_User_URL + "?queryStr=" + queryStr,
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          userList: res.data
        })
      }
    })
  },
  // 通过站点查询负责人,给下拉框赋值
  queryAllManagerBySite: function (callback) {
    var thit = this;
    var id = thit.data.siteId;
    wx.request({
      url: app.globalData.QUERY_AllManagerBySite_URL + "?siteId=" + id,
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data)
        if(res.data.length!=0){
          thit.setData({
            editManagerList: res.data
          })
        }else{
          var editManager = [{id:0,realname:"--暂无成员可设置--"}];
          console.log(editManager);
          thit.setData({
            editManagerList: editManager
          })
        }        
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  //编辑站点记录按钮
  editSiteBtn: function (e) {
    var thit = this;
    console.log(e.currentTarget.dataset.siteid);
    this.setData({
      showEditSiteModal: true,
      siteId: e.currentTarget.dataset.siteid
    })
    thit.queryAllManagerBySite();
  },
  // 编辑车辆信息按钮
  editCarBtn:function(e){
     console.log(e.currentTarget.dataset.carid);
     this.setData({
       showEditCarModal:true,
       carId:e.currentTarget.dataset.carid,
     })
  },
  // 通过搜索条件查询车辆
  queryCarByCondotion:function(){
    var that = this;
    var queryCondition = that.data.searchCarValueInput;
    wx.request({
      url: app.globalData.FUZZYQUERY_car_URL + "?condition=" + queryCondition,
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          carList: res.data
        })
      }
    })
  },
  // 通过车辆类型来查询车辆
  queryCarByCarType:function(){
    var that = this;
    var carTypeName = that.data.selectcar;
    if (carTypeName == "污泥处理车"){
      var carType = 0;
    }else{
      var carType = 1;
    }
    wx.request({
      url: app.globalData.QUERY_CarByCarType_URL + "?carType=" + parseInt(carType),
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          carList: res.data
        })
      }
    })
  },
  // 通过搜索条件查询站点
  querySite:function(){
    var that = this;
    var queryStr = that.data.searchValueInput;
    wx.request({
      url: app.globalData.FUZZYQUERY_Site_URL +"?queryStr="+queryStr,
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:function(res){
        console.log(res.data);
        that.setData({
          siteList: res.data
      })
      }
    })
  },
  //确定站点增加
  onSiteConfirm: function () {
    var that = this;
    var addSerialNumber = that.data.serialNumberinput;
    var addSiteName = that.data.siteNameinput;
    wx.request({
      url: app.globalData.QUERY_SiteSerialNumberAndName_URL+"?serialNumber=" + addSerialNumber + "&siteName=" + addSiteName,
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data.result;
        console.log(result);
        if(result == "1"){
           wx.showToast({
             title: '编号或站点已存在，请重新输入',
             icon:'none',
             duration:2000
           })
        }else{
          var serialNumber = that.data.serialNumberinput;
          var siteName = that.data.siteNameinput;
          var telephone = that.data.telephoneinput;
          var address = that.data.addressinput;
          qqmapsdk.geocoder({
            address: address,
            success: function (res) {
              console.log(res);
              var res = res.result;
              var latitude = res.location.lat;
              var longitude = res.location.lng;
              wx.request({
                url: app.globalData.ADD_Site_URL,
                data: JSON.stringify({
                  serialNumber: serialNumber,
                  siteName: siteName,
                  address: address,
                  telephone: telephone,
                  longitude: longitude,
                  latitude: latitude,
                }),
                method: 'post',
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  console.log(res.data);
                  if (res.data.result == "success") {
                    wx.showToast({
                      title: "新增成功",
                      icon: 'success',
                      duration: 2000,
                    })
                    that.hideModal();
                    that.queryAllSite();
                  }else{
                    wx.showToast({
                      title: "添加失败",
                      icon: 'success',
                      duration: 2000,
                    })
                  }
                }
              })
            },
            fail: function (error) {
              console.error(error);
            },
            complete: function (res) {
              console.log(res);
            }
          })
        }
      },
      fail:function(err){
         console.log(err);
      }
    })
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
            data: { siteId: parseInt(that.data.siteId) },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res.data)
              if (res.data == "SUCCESS") {
                wx.showToast({
                  title: "删除成功",
                  icon: 'success',
                  duration: 2000,
                })
              }
              that.queryAllSite();//刷新站点信息
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
    var serialNumber = e.detail.value.serialNumber;
    var siteName = e.detail.value.siteName;
    var telephone = e.detail.value.telephone;
    var managerId = parseInt(that.data.managerId);
    var address = e.detail.value.address;
    qqmapsdk.geocoder({
      address: address,
      success: function (res) {
        console.log(res);
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        wx.request({
          url: app.globalData.EDIT_Site_URL,
          data: JSON.stringify({
            id: id,
            serialNumber: serialNumber,
            siteName: siteName,
            address: address,
            managerId: managerId,
            telephone: telephone,
            latitude: latitude,
            longitude: longitude
          }),
          method: "POST",
          headers: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data)
            if(res.data.result == "success") {
              wx.showToast({
                title: "修改成功！",
                icon: 'none',
                duration: 2000,
              })
              that.hideModal();
              that.queryAllSite();//刷新记录页面  
            }else if (res.data.result == "failure") {
              wx.showToast({
                title: "负责人未选，修改失败！",
                icon: 'none',
                duration: 2000,
              })
            }else if (res.data.result == "conflict") {
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
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
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
    var driverId = parseInt(that.data.driverId);
    var driverName = that.data.selectedCarRealname;
    if(driverName == "暂不分配"){
      driverName = " ";
    }
    if(license == " " || license == null){
       wx.showToast({
         title: '设备信息不完善',
         icon: 'none',
         duration:2000
       })
    }else{
      if(brand == " " || brand == null){
          brand = "none";
      }else{
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
            if (res.data.result == "SUCCESS") {
              wx.showToast({
                title: "新增成功",
                icon: 'success',
                duration: 2000,
              })
              that.hideModal();
              that.queryAllCar();
            }else if(res.data.result == "INPUT"){
              wx.showToast({
                title: "请输入正确的车牌号",
                icon: 'success',
                duration: 2000,
              })
            } else if (res.data.result == "DUPLICATE"){
              wx.showToast({
                title: "车牌号冲突",
                icon: 'success',
                duration: 2000,
              })
            }else{
              wx.showToast({
                title: "添加失败",
                icon: 'success',
                duration: 2000,
              })
            }      
          },
          fail:function(err){
            console.log(err);
            wx.showToast({
              title: "添加失败",
              icon: 'success',
              duration: 2000,
            })
          }
        })
      }
    }
    
  },
  // // 编辑车辆信息
  // editCar: function (e) {
  //   var that = this;
  //   var id = parseInt(that.data.carId);
  //   var license = e.detail.value.license;
  //   var brand = e.detail.value.brand;
  //   var driverId = parseInt(that.data.driverId);
  //   var driverName = e.detail.value.selectedCarRealname;
  //   if(license == " " || license == null){
  //      wx.showToast({
  //        title: '请输入车牌号',
  //        icon:'none',
  //        duration:2000
  //      })
  //   }else if(driverName == " " || driverName == null){
  //     wx.showToast({
  //       title: '司机选择不正确',
  //       icon: 'none',
  //       duration: 2000
  //     })
  //   }else{
  //     if(brand == " " || brand == null){
  //       brand = "none";
  //     }
  //     var driver = {
  //       id: driverId,
  //       realname: driverName
  //     }
  //     wx.request({
  //       url: app.globalData.EDIT_Car_URL,
  //       data: JSON.stringify({
  //         id: id,
  //         license: license,
  //         brand: brand,
  //         driverId: driverId,
  //         driver: driver
  //       }),
  //       method: "POST",
  //       headers: {
  //         'content-type': 'application/json'
  //       },
  //       success: function (res) {
  //         console.log(res.data)
  //         if (res.data == "SUCCESS") {
  //           wx.showToast({
  //             title: "修改成功！",
  //             icon: 'none',
  //             duration: 2000,
  //           })
  //           that.hideModal();
  //           that.queryAllCar();//刷新记录页面  
  //         } else if (res.data == "INPUT") {
  //           wx.showToast({
  //             title: "请输入正确的车牌号！",
  //             icon: 'none',
  //             duration: 2000,
  //           })
  //           that.hideModal();
  //         } else if (res.data == "DUPLICATE") {
  //           wx.showToast({
  //             title: "车牌号冲突！",
  //             icon: 'none',
  //             duration: 2000,
  //           })
  //           that.hideModal();
  //         }else{
  //           wx.showToast({
  //             title: "修改失败！",
  //             icon: 'none',
  //             duration: 2000,
  //           })
  //           that.hideModal();
  //         }
  //       },
  //       fail: function (err) {
  //         console.log(err)
  //         wx.showToast({
  //           title: "修改失败！",
  //           icon: 'none',
  //           duration: 2000,
  //         })
  //       }
  //     })
  //   }
  // },
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
                wx.showToast({
                  title: "删除成功!",
                  icon: 'success',
                  duration: 2000,
                })
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
  
  // 跳转到处理车监控
  showdetailoftreatmentcar: function (event) {
    var id = event.currentTarget.dataset.carid
    console.log(id)
    wx.navigateTo({
      url: '/packageManager/pages/cardetail/cardetail?carId=' + event.currentTarget.dataset.carid,
    });
  },

  // 跳转到站点详细信息
  showdetailofsite: function (event) {
    var id = event.currentTarget.dataset.siteid;
    console.log(id);
    wx.navigateTo({
      url: '/packageManager/pages/sitedetail/sitedetail?siteId='+ event.currentTarget.dataset.siteid,
    });
  },

  // 跳转到车辆详细信息
  showdetailofcar:function(event){
     var id = event.currentTarget.dataset.carid;
     console.log(id);
     wx.navigateTo({
       url: '/packageManager/pages/car/car?carId=' + event.currentTarget.dataset.carid,
     })
  },

  // 跳转到用户详细信息
  showdetailofuser:function(event){
     var id = event.currentTarget.dataset.userid;
     console.log(id);
     wx.navigateTo({
       url: '/packageManager/pages/userdetail/userdetail?userId=' + id,
     })
  },

  // 设备管理
  // 设备信息里的查询值获取
  searchSerialNumberValueInputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      searchSerialNumberValueInput: e.detail.value
    })
  },

  // 设备查询
  querySensorByCondition: function () {
    var that = this;
    if (that.data.searchSerialNumberValueInput == '') {
      var sensorSerialNumber = "none";
    } else {
      var sensorSerialNumber = that.data.searchSerialNumberValueInput;
    }
    var placeSelectId = that.data.location_id;
    if (placeSelectId == 0) {
      var placeSelect = "site";
    } else if (placeSelectId == 1) {
      var placeSelect = "slugeCar";
    } else {
      var placeSelect = "none";
    }
    if (that.data.txt == '') {
      var place = "none";
    } else {
      var place = that.data.txt;
    }
    if (that.data.sensor_id == -1) {
      var sensorTypeId = -1;
    } else {
      var sensorTypeId = parseInt(that.data.sensor_id);
    }
    if (that.data.sensorStatus_id == -1) {
      var status = -1;
    } else {
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
  // 设备信息选项卡
  filterTab: function (e) {
    var data = [true, true, true, true], index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({
      tab: data
    })
    this.queryAllSensorType();
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
  adddevice: function () {
    this.setData({
      showModal: true
    })
    this.queryAllSensorType();
  },

  // 获取输入框数据
  sensorserialnumberinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      sensorSerialNumberinput: e.detail.value
    });
  },
  sensortypeinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      sensorTypeinput: e.detail.value
    })
  },
  gPSIDinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      gPSIDinput: e.detail.value
    });
  },
  locationinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      placeSelectinput: e.detail.value
    });
  },
  placeinputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      placeinput: e.detail.value
    });
  },

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
  bindlocationPickerChange: function (e) {
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

  //增加传感器
  onSensorConfirm: function () {
    var that = this;
    var sensorSerialNumber = that.data.sensorSerialNumberinput;
    var sensorType = that.data.sensorTypeName;
    var gPSID = that.data.gPSIDinput;
    var placeSelect = that.data.locationName;
    if (placeSelect == "工厂") {
      var place = that.data.siteName;
    } else {
      placeSelect = "slugeCar";
      var place = that.data.selectedLicense;
    }
    var sensorInfo;
    if (sensorType == "GPS传感器") {
      sensorInfo = JSON.stringify({
        sensorSerialNumber: sensorSerialNumber,
        sensorType: sensorType,
        GPSID: gPSID,
        placeSelect: placeSelect,
        place: place
      })
    } else {
      sensorInfo = JSON.stringify({
        sensorSerialNumber: sensorSerialNumber,
        sensorType: sensorType,
        placeSelect: placeSelect,
        place: place
      })
    }
    var reg = /^[A-Z][0-9]{5}$/; //设备号的正则表达式
    if (sensorSerialNumber == " " || placeSelect == null || place == null) {
      wx.showToast({
        title: '设备信息不完善',
        icon: 'none',
        duration: 2000
      })
    } else if (!(reg.test(sensorSerialNumber))) {
      wx.showToast({
        title: '请输入正确的设备号',
        icon: 'none',
        duration: 2000
      })
    } else {
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
            that.hideModal();
            // that.queryAllSensor();
          } else if (res.data.result == "DUPLICATE") {
            wx.showToast({
              title: "设备号冲突",
              icon: 'success',
              duration: 2000,
            })
          } else if (res.data.result == "INPUT") {
            wx.showToast({
              title: "请检查输入数据",
              icon: 'success',
              duration: 2000,
            })
          } else {
            wx.showToast({
              title: "添加失败",
              icon: 'success',
              duration: 2000,
            })
          }
        },
        fail: function (err) {
          console.log(err);
          wx.showToast({
            title: "添加失败",
            icon: 'success',
            duration: 2000,
          })
        }
      })
    }
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
  // 设备详情
  showdetailofsensor: function (event) {
    var id = event.currentTarget.dataset.sensorid
    console.log(id)
    wx.navigateTo({
      url: '/packageManager/pages/equipmanager/equipmanager?sensorId='+ event.currentTarget.dataset.sensorid 
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