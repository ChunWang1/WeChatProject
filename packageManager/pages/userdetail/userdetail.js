// packageManager/pages/userdetail/userdetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editCarSelectArray: [
      {
        id: -1,
        text: "--暂不修改--"
      },
      {
        id: 0,
        text: "--暂不分配车辆--"
      },
    ],
    editUserVisible: false,
    resetPassVisible: false,
    editSiteSelectArray: [
      {
        id: 0,
        text: "--暂不分配--"
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(JSON.stringify(options));
    that.setData({
      userId:options.userId
    })
    // 获取用户的所有信息
    wx.request({
      url: app.globalData.QUERY_UserByUserId_URL,
      data:{userId:that.data.userId},
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },
      success:function(res){
       console.log(res.data);
       that.setData({
         user:res.data,
       })
        console.log(that.data.user.username);
      },
      fail:function(err){
        console.log(err);
      }
    })
  },
  
  //查询所有未分配司机的车辆，给司机编辑下拉框赋值
  queryCarWhichNotAssignDriver: function () {
    var thit = this
    wx.request({
      url: app.globalData.QUERY_CarWhichNotAssignDriver,
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data)
        var num = 2;
        for (var i = 0; i < res.data.length; i++) {
          var id = "editCarSelectArray[" + num + "].id";
          var text = "editCarSelectArray[" + num + "].text";
          thit.setData({
            [id]: res.data[i].id,
            [text]: res.data[i].license,
          })
          num++;
        }
        console.log(thit.data.editCarSelectArray);
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  // 查询所有站点
  queryAllSite: function (callback) {
    var thit = this
    wx.request({
      url: app.globalData.QUERY_AllSite_URL,
      method: 'GET',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data);
        thit.setData({
          siteList: res.data
        })
        var num = 1;
        for (var i = 0; i < res.data.length; i++) {
          var id = "editSiteSelectArray[" + num + "].id";
          var text = "editSiteSelectArray[" + num + "].text";
          thit.setData({
            [id]: res.data[i].id,
            [text]: res.data[i].siteName,
          })
          num++;
        }
        console.log(thit.data.editSiteSelectArray);
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  //展示编辑用户模态框
  showEditModal: function (e) {
    var that = this;
    console.log("您要编辑的角色id为：" + e.currentTarget.dataset.roleid)
    that.setData({
      editUserVisible: true,
      roleId: e.currentTarget.dataset.roleid,
      userId: e.currentTarget.dataset.userid,
    })
    that.queryCarWhichNotAssignDriver();
    that.queryAllSite();
  },

  //展示重置密码框
  showResetModal: function (e) {
    var that = this;
    that.setData({
      resetPassVisible: true,
      username: e.currentTarget.dataset.username,
      userId: e.currentTarget.dataset.userid,
    })
  },

  //编辑司机用户下拉选中事件
  getCarDate: function (e) {
    this.setData({
      editCarSelect: e.detail
    });
    console.log(e.detail)
  },

  //编辑工厂人员用户下拉选中事件
  getSiteDate: function (e) {
    this.setData({
      editSiteSelect: e.detail
    });
    console.log(e.detail)
  },

  //取消编辑用户
  cancelEditUser: function () {
    var that = this;
    that.setData({
      editUserVisible: false,
    })
  },

  editUser: function () {
    var that = this;
    var userId = that.data.userId;
    var roleId = that.data.roleId;
    var siteId = 0;
    var carId = 0;
    if (roleId == 2) {
      siteId = parseInt(that.data.editSiteSelect.id)
    } else if (roleId == 3) {
      carId = parseInt(that.data.editCarSelect.id)
    }
    console.log("userId:" + userId + "roleId:" + roleId + "siteId:" + siteId + "carId:" + carId)
    if (roleId == 3 && carId == -1) {
      that.setData({
        editUserVisible: false,
      })
    } else {
      wx.request({
        url: app.globalData.EDIT_UserByUserId_URL,
        data: JSON.stringify({
          userId: userId,
          roleId: roleId,
          siteId: siteId,
          carId: carId
        }),
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
          if (res.data.result === "success") {
            wx.showToast({
              title: "修改成功！",
              icon: 'success',
              duration: 2000,
            })
            // that.queryAllUser();
            wx.request({
              url: app.globalData.QUERY_UserById_URL,
              data: { userId: that.data.userId },
              method: 'GET',
              headers: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res.data);
                that.setData({
                  user: res.data,
                })
              },
              fail: function (err) {
                console.log(err);
              }
            })
          } else {
            wx.showToast({
              title: "修改用户信息失败！",
              icon: 'none',
              duration: 2000,
            })
          }
          that.setData({
            editCarSelect: [],
            editSiteSelect: [],
            editUserVisible: false,
          })
        },
        fail: function (err) {
          console.log(err)

        }
      })
    }
  },
  //重置密码
  resetPass: function (e) {
    var that = this;
    var userid = parseInt(that.data.userId)
    console.log("您需要重置密码的用户id:" + userid);
    wx.request({
      url: app.globalData.RESET_PassWord + "?userId=" + userid,
      data: {
        //userId:userid
      },
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data == "SUCCESS") {
          wx.showToast({
            title: "密码重置成功!",
            icon: 'success',
            duration: 2000,
          })
          that.setData({
            resetPassVisible: false,
          })
        } else {
          wx.showToast({
            title: "密码重置失败!",
            icon: 'none',
            duration: 2000,
          })
        }

      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  //取消重置密码
  cancelResetPass: function () {
    var that = this;
    that.setData({
      resetPassVisible: false,
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