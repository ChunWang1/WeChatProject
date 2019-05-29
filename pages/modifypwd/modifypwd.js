// pages/modifypwd/modifypwd.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  modifyPwd: function (e) {
    //console.log(e.detail.value);
    var userId = app.globalData.userData[0].id ;
    var password=app.globalData.userData[0].password;
    var originPwd = e.detail.value.originPwd;
    var newPwd = e.detail.value.newPwd;
    var checknewPwd = e.detail.value.checknewPwd;
    var that = this;
    if (originPwd === "") {
      wx.showToast({
        title: '原密码不能为空',
        icon: 'none',
        duration: 2000,
        success: () => console.log('原始密码不能为空！')
      })
      return;
    } if (originPwd !== password) {
      wx.showToast({
        title: '原密码输入错误',
        icon: 'none',
        duration: 2000,
        success: () => console.log('原始密码输入错误！')
      })
      return;
    } if (newPwd === "") {
      wx.showToast({
        title: '新密码不能为空！',
        icon: 'none',
        duration: 2000,
        success: () => console.log('新密码不能为空!')
      })
      return;
    } if (newPwd !== checknewPwd) {
      wx.showToast({
        title: '密码与确认密码不一致！',
        icon: 'none',
        duration: 2000,
        success: () => console.log('两次密码输入不一致')
      })
      return;
    } if (checknewPwd=="") {
      wx.showToast({
        title: '确认密码不能为空！',
        icon: 'none',
        duration: 2000,
        success: () => console.log('确认密码不能为空！')
      })
      return;
    } if (newPwd.length<6) {
      wx.showToast({
        title: '新密码不能低于6位！',
        icon: 'none',
        duration: 2000,
        success: () => console.log('新密码不能低于6位')
      })
      return;
    }
    console.log(typeof (userId) + " " + typeof (originPwd) + " " +
      typeof (newPwd) + " " + typeof (checknewPwd))
    wx.request({
      url: app.globalData.MODIFY_Pwd_URL,
      data: JSON.stringify({
        userId: userId,
        originPwd: originPwd,
        newPwd: newPwd,
        checknewPwd: checknewPwd,
      }),
      method: 'POST',
      dataType: "json",
      headers: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.msg === "success") {
            wx.showToast({
              title: "密码修改成功，请重新登录!",
              icon: 'none',
              duration: 2000,
            })

            //跳转到登录页面
          setTimeout(function () {
            wx.redirectTo({
              url: '../../../pages/login/login'
            })
          }, 1000);
          
          }else{
          wx.showToast({
            title: "修改失败！",
            icon: 'none',
            duration: 2000,
          })
          }
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: "修改失败！",
          icon: 'none',
          duration: 2000,
        })
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