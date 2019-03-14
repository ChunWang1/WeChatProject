const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab切换
    currentTab: 0,
    //分页
    record_current:1,
    sludeg_current:1,
  },
  //分页事件
  recordhandleChange({ detail }) {
    const type = detail.type;
    if (type === 'next') {
      this.setData({
        record_current: this.data.record_current + 1
      });
    } else if (type === 'prev') {
      this.setData({
        record_current: this.data.record_current - 1
      });
    }
  },
 sludgehandleChange({ detail }) {
    const type = detail.type;
    if (type === 'next') {
      this.setData({
        sludeg_current: this.data.sludeg_current + 1
      });
    } else if (type === 'prev') {
      this.setData({
        sludeg_current: this.data.sludeg_current - 1
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.queryAllRecordOfOneFactory();
    that.queryAllSludgeOfOneFactory();
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

  queryAllRecordOfOneFactory:function(){
    var that = this;
    //根据siteId查询所有处理记录
    wx.request({
      url: app.globalData.QUERY_AllRecordOfOneFactory_URL,
      data: JSON.stringify({
        id: app.globalData.userData[0].siteId
      }),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          recordList: res.data
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  queryAllSludgeOfOneFactory:function(){
    var that = this;
    //根据siteId查询所有污泥记录
    wx.request({
      url: app.globalData.QUERY_AllSludgeOfOneFactory_URL,
      data: JSON.stringify({
        id: app.globalData.userData[0].siteId
      }),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          sludgeList: res.data
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

      current: e.detail.current,

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