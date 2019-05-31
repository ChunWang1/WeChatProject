// pages/advice/advice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    adviceInfo:"",
    phoneNum:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getAdvice:function(e){
    var that=this
    var adviceInfo = e.detail.value.adviceInfo;
    var phoneNum = e.detail.value.phoneNum;
    if (adviceInfo==""){
      wx.showToast({
        title: "您还未输入反馈^〇^",
        icon: 'none',
        duration: 2000,
      })
      that.setData({
        adviceInfo:"",
        phoneNum:""
      })
    }else{
      wx.showToast({
        title: "反馈提交成功!",
        icon: 'success',
        duration: 2000,
      })
      that.setData({
        adviceInfo: "",
        phoneNum: ""
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