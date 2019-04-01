const app=getApp();
Page({
  data: {
    current: 'tab1',
    tab1:true,
    current_scroll: 'tab1'
  },

  onLoad:function(){
    var that=this;
      that.queryNoCompleteRecord();

  },

  queryNoCompleteRecord:function(){
    var that=this;
    wx.request({
      url: app.globalData.QUERY_querySludgeByUserIdAndStatus_URL,
      data:{
        driverId: app.globalData.userData[0].id,
        status: "(0,2,4)",
        flag:0
      },
      method:"GET",
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        that.setData({
          recordList:res.data,
          count:res.data.length
        });
      }
    })
  },

  queryCompleteRecordInWareHouse: function () {
    var that = this;
    wx.request({
      url: app.globalData.QUERY_querySludgeByUserIdAndStatus_URL,
      data: {
        driverId: app.globalData.userData[0].id,
        status: "(1)",
      },
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          recordList: res.data
        });
      }
    })
  },

  queryCompleteRecordInDes: function () {
    var that = this;
    wx.request({
      url: app.globalData.QUERY_querySludgeByUserIdAndStatus_URL,
      data: {
        driverId: app.globalData.userData[0].id,
        status: "(5)",
      },
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          recordList: res.data
        });
      }
    })
  },

  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
    if (detail.key == 'tab1'){
      this.queryNoCompleteRecord()
    }
    else if (detail.key == 'tab2') {
      this.queryCompleteRecordInWareHouse();
    }
    else if (detail.key == 'tab3') {
      this.queryCompleteRecordInDes();
    }
  },

  handleChangeScroll({ detail }) {
    this.setData({
      current_scroll: detail.key
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.showTransDriverTabBar();
  },
});
