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
      url: app.globalData.QUERY_queryRecordByStatus_URL,
      data:{
        driverId: app.globalData.userData[0].id,
        status:0,
        flag:1
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

  queryCompleteRecord: function () {
    var that = this;
    wx.request({
      url: app.globalData.QUERY_queryRecordByStatus_URL,
      data: {
        driverId: app.globalData.userData[0].id,
        status: 0,
        flag: 0
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
      this.queryCompleteRecord();
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
    app.showTreatDriverTabBar();
  },
});
