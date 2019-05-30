// packageManager/pages/sitedetail.js
// 引入SDK核心类
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js')
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'WOTBZ-CBL3U-QYBVN-4577A-ZOAZK-ZDBWW' // 必填
});
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
     var that = this;
     console.log(JSON.stringify(options));
     that.setData({
       siteId:options.siteId,     //获取上一个页面传过来的siteId
     })
    //  获取站点的所有信息
    wx.request({
      url: app.globalData.QUERY_SiteBySiteId_URL,
      data:{siteId: that.data.siteId},
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },
      success:function(res){
        console.log(res.data);
        that.setData({
          site:res.data
        })
      },
      fail:function(err){
         console.log(err);
      }
    })
  },
  
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },

   /**
   * 隐藏模态对话框
   */
  hideModal:function(){
    this.setData({
      showEditSiteModal: false
    });
  },

  // 编辑站点记录按钮
  editSiteBtn:function(e){
    var thit = this;
    console.log(e.currentTarget.dataset.siteid);
    this.setData({
      showEditSiteModal: true,
      siteId:e.currentTarget.dataset.siteid
    })
    thit.queryAllManagerBySite();
  },
  // 通过站点查询负责人，给下拉框赋值
  queryAllManagerBySite: function () {
    var thit = this;
    var id = thit.data.siteId;
    wx.request({
      url: app.globalData.QUERY_AllManagerBySite_URL + "?siteId=" + id,
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success:function(res){
        console.log(res.data);
        if(res.data.length != 0){
           thit.setData({
             editManagerList: res.data
           })
        }else{
          var editManager = [{ id: 0, realname: "--暂无成员可设置--" }];
          console.log(editManager);
          thit.setData({
            editManagerList: editManager
          })
        }
      },
      fail:function(){
        console.log(err);
      }
    })
  },
  // 下拉框工厂的工作人员数据获取
  bindAllManagerBySitePickerChange: function (e) {
    var that = this;
    //  var realname = that.data.editManagerList[e.detail.value].realname;
    var managerid = that.data.editManagerList[e.detail.value].id;
    console.log(that.data.editManagerList[e.detail.value].realname)
    if (e.detail.value == 4) {
      that.setData({ reply: true })
    } else {
      that.setData({ reply: false })
    }
    that.setData({
      managerIndex: e.detail.value,
      //  selectedRealname: realname,
      managerId: managerid
    })
  },
  // 编辑站点信息
  editSite: function (e) {
    var that = this;
    var id = parseInt(that.data.siteId);
    var serialNumber = e.detail.value.serialNumber;
    var siteName = e.detail.value.siteName;
    var telephone = e.detail.value.telephone;
    var managerId = parseInt(that.data.managerId);
    var address = e.detail.value.address;
    qqmapsdk.geocoder({
      address: address,
      success: function (res) {
        console.log(res);
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        wx.request({
          url: app.globalData.EDIT_Site_URL,
          data: JSON.stringify({
            id: id,
            serialNumber: serialNumber,
            siteName: siteName,
            address: address,
            managerId: managerId,
            telephone: telephone,
            latitude: latitude,
            longitude: longitude
          }),
          method: "POST",
          headers: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.result == "success") {
              wx.showToast({
                title: "修改成功！",
                icon: 'none',
                duration: 2000,
              })
              that.hideModal();
              wx.request({
                url: app.globalData.QUERY_SiteBySiteId_URL,
                data: { siteId: id },
                method: 'GET',
                headers: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  console.log(res.data);
                  that.setData({
                    site: res.data
                  })
                },
                fail: function (err) {
                  console.log(err);
                }
              })
              // that.queryAllSite();//刷新记录页面  
            } else if (res.data.result == "failure") {
              wx.showToast({
                title: "负责人未选，修改失败！",
                icon: 'none',
                duration: 2000,
              })
            } else if (res.data.result == "conflict") {
              wx.showToast({
                title: "修改失败！",
                icon: 'none',
                duration: 2000,
              })
              that.hideModal();
            }
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
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
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