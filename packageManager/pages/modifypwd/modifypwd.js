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
    console.log(e.detail.value);
    var userId = app.globalData.userData[0].id ;
    var password=app.globalData.userData[0].password;
    var originPwd = e.detail.value.originPwd;
    var newPwd = e.detail.value.newPwd;
    var checknewPwd = e.detail.value.checknewPwd;
    var that = this;
    if (originPwd === "") {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 2000,
        success: () => console.log('原始密码不能为空！')
      })
      return;
    } if (originPwd !== password) {
      wx.showToast({
        title: '密码输入错误',
        icon: 'none',
        duration: 2000,
        success: () => console.log('原始密码输入错误！')
      })
      return;
    } if (newPwd === "") {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none',
        duration: 2000,
        success: () => console.log('新密码不能为空!')
      })
      return;
    } if (newPwd !== checknewPwd) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none',
        duration: 2000,
        success: () => console.log('两次密码输入不一致')
      })
      return;
    }
    wx.request({
      url: app.globalData.MODIFY_UserInfo_URL,
      data: JSON.stringify({
        userId: userId,
        originPwd: originPwd,
        newPwd: newPwd,
        checknewPwd: checknewPwd,
      }),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        wx.showToast({
          title: "修改成功！",
          icon: 'none',
          duration: 2000,
        })
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