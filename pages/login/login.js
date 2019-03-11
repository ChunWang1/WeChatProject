// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad(options) {
    // 初始化提示框
  },
  formSubmit: function (e) {
    console.log(e.detail.value);
    var userName = e.detail.value.no;
    var passwords = e.detail.value.pwd;
    var that = this;
    if (userName === "") {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none',
        duration: 2000 ,
        success: () => console.log('用户名不能为空！')
      })
      return;
    } if (passwords === "") {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 2000 ,
        success: () => console.log('密码不能为空！')
      })
      return;
    }

    wx.request({
      url: app.globalData.LOGIN_Validator_URL,
      data: JSON.stringify({
        username: e.detail.value.no,
        password: e.detail.value.pwd
      }),
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.result == "SUCCESS") {
          //访问正常
          app.globalData.userData[0].id = res.data.user.id;
          app.globalData.userData[0].idCard = res.data.user.idCard;
          app.globalData.userData[0].realname = res.data.user.realname;
          app.globalData.userData[0].role = res.data.user.role.role_name;
          app.globalData.userData[0].sex = res.data.user.sex;
          app.globalData.userData[0].email = res.data.user.email;
          app.globalData.userData[0].username = res.data.user.username;
          app.globalData.userData[0].telephone = res.data.user.telephone;
          app.globalData.userData[0].password = res.data.user.password;
          if (res.data.result == "ERROR") {
            wx.showToast({
              title: "账号密码不正确，请重新输入",
              icon: 'none',
              duration: 2000,
            })
          } else if (res.data.result == "SUCCESS") {
            wx.showToast({
              title: "登录成功",
              icon: 'success',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  wx.redirectTo({
                    url: '../map/map?no=' + e.detail.value.no,
                  })
                })
              }
            })
          } else if (res.data.result == "AUDING") {
            wx.showToast({
              title: "正在审核中，请耐心等待",
              icon: 'none',
              duration: 2000,
            })
          } else if (res.data.result== "FORBID") {
            wx.showToast({
              title: "审核未通过,无法使用系统",
              icon: 'none',
              duration: 2000,
            })
          }
        }

      }
    })
  }
})