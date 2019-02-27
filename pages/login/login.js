// pages/login/login.js
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
      url: "http://iot.hnu.edu.cn/user/loginValidator",
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
        if (res.statusCode == 200) {
          //访问正常
          if (res.data.error == true) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000,
            })
          } else {
            //缓存
            wx.setStorage({
              key: "student",
              data: res.data.student
            });
            wx.showToast({
              title: "登陆成功",
              icon: 'success',
              duration: 20000,
              success: function () {
                setTimeout(function () {
                  wx.switchTab({
                    url: '../map/map',
                  })
                }, 2000)
              }
            })
          }
        }

      }
    })
  }
})