// pages/register/register.js
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
    var repasswords = e.detail.value.rpwd;
    var that = this;
    if (userName === "") {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none',
        duration: 2000,
        success: () => console.log('用户名不能为空！')
      })
      return;
    } if (passwords === "") {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 2000,
        success: () => console.log('密码不能为空！')
      })
      return;
    } if (repasswords === "") {
      wx.showToast({
        title: '请确认密码',
        icon: 'none',
        duration: 2000,
        success: () => console.log('请确认密码')
      })
      return;
    } if (repasswords !== passwords) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none',
        duration: 2000,
        success: () => console.log('两次密码输入不一致')
      })
      return;
    }

    wx.request({
      url: app.globalData.REGISTER_URL,
      data: JSON.stringify({
        username: e.detail.value.no,
        password: e.detail.value.pwd,
        nickname:app.globalData.userInfo.nickName,
        telephone: "",
        idCard: "",
        realname: "",
        sex: "",
        roleId: 1,
        siteId: ""
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
              setTimeout(function () {
                wx.redirectTo({
                  url: '../login/login',
                })
              }, 2000)
            }
          })
        } else if (res.data == "DUPLICATE") {
          wx.showToast({
            title: "该用户名已被注册",
            icon: 'success',
            duration: 20000,
          })
        } else if (res.data == "INPUT") {
          wx.showToast({
            title: "请检查注册信息输入是否正确",
            icon: 'success',
            duration: 20000,
          })
        } 
      }
    })
  }
})