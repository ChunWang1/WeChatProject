// pages/sludgeapply/sludgeapply.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    siteId:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that=this;
     that.setData({
       siteId: app.globalData.userData[0].siteId,
     })
   // console.log(app.globalData.userData[0].siteId);
    wx.request({
      url: app.globalData.QUERY_AllSite_URL,
      data: {},
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },

      success: function (res) {
      //  console.log(res.data)
        that.setData({
          siteData: res.data
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  //污泥处理申请
  sludgeApply:function(e){
    var that = this;
    var pretreatAmount = e.detail.value.pretreatAmount;
    wx.request({
      url: app.globalData.INSERT_RecordByAlert_URL,
      data: JSON.stringify({
        siteId: that.data.siteId,
        pretreatAmount: pretreatAmount
      }),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        wx.showToast({
          title: "污泥处理申请成功，请等待配车！",
          icon: 'none',
          duration: 2000,
        })
      },
      fail: function (err) {
        console.log(err)
        wx.showToast({
          title: "申请失败！",
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
    app.showFactoryTabBar();
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