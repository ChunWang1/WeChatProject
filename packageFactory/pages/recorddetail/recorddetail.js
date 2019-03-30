import template from '../../../template/template'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordId:"",
    delSludgeVisible: false,
    showEditSludgeModal: false,
    delSludgeactions: [
      {
        name: '取消'
      },
      {
        name: '删除',
        color: '#ed3f14',
        loading: false
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      recordId: options.recordId
    })
    that.queryRecordByRecordId();
    that.querySludgeByRecordId();
  },

  editAndDel:function(e){
  template.delSludgeBtn(e),
  template.editSludgeBtn(e)
  },

  //编辑运输车记录按钮
  editSludgeBtn: function (e) {
    console.log(e.currentTarget.dataset.sludgeid);
    this.setData({
      showEditSludgeModal: true,
      sludgeId: e.currentTarget.dataset.sludgeid
    })
  },
  /**
     * 运输车编辑弹出框蒙层截断touchmove事件
     */
  preventTouchMove: function () {
  },
  /**
   * 隐藏运输车编辑模态对话框
   */
  hideModal: function () {
    this.setData({
      showEditSludgeModal: false
    });
  },
  /**
   * 运输车编辑对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 保存运输车污泥块信息(保存报错！)
   */
  saveSludgeEdit: function (e) {
    var that = this;
    console.log(e.detail.value.RFID);
    wx.request({
      url: app.globalData.EDIT_Sludge_URL,
      data: JSON.stringify({
        id: that.data.sludgeId,
        rfidString: e.detail.value.RFID,
        destinationAddress: e.detail.value.desAddr,
        sludgeFunction: e.detail.value.sludgeFunction,
        weight: e.detail.value.weight
      }),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data === "SUCCESS") {
          wx.showToast({
            title: "修改成功！",
            icon: 'none',
            duration: 2000,
          })
          this.queryAllSludgeOfOneFactory();//刷新运输车记录页面  
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

  //删除运输车记录按钮
  delSludgeBtn: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.sludgeid);
    that.setData({
      delSludgeVisible: true,
      sludgeId: e.currentTarget.dataset.sludgeid
    });
  },
  //删除运输车记录模态框事件（未测试）
  delSludgeModal({ detail }) {
    if (detail.index === 0) {
      this.setData({
        delSludgeVisible: false
      });
    } else {
      const action = [...this.data.delSludgeactions];
      action[1].loading = true;

      this.setData({
        delSludgeactions: action
      });

      wx.request({
        url: app.globalData.DELETE_Sludge_URL,
        data: { sludgeId: parseInt(this.data.sludgeId) },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
          if (res.data === "SUCCESS") {
            setTimeout(() => {
              action[1].loading = false;
              this.setData({
                delSludgeVisible: false,
                delSludgeactions: action
              });
              $Message({
                content: '删除成功！',
                type: 'success'
              });
            }, 2000);

            this.queryAllSludgeOfOneFactory();//刷新运输车记录页面
          }
        },
        fail: function (err) {
          console.log(err)
          $Message({
            content: '删除失败！',
            type: 'error'
          });
        }
      })
    }
  },
  //根据RecordId搜索处理车记录
  queryRecordByRecordId: function (e) {
    console.log("queryRecordByRecordId");
    var that = this;
    wx.request({
      url: app.globalData.QUERY_RecordByRecordId_URL,
      data: { recordId: that.data.recordId },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          recordByRecordId: res.data
        })
        return
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
//根据RecordId搜索运输车记录
  querySludgeByRecordId: function (e) {
    console.log("querySludgeByRecordId");
    var that = this;
    wx.request({
      url: app.globalData.QUERY_SludgeByRecordId_URL,
      data: { recordId: that.data.recordId },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          sludgeByRecordIdList: res.data
        })
        return
      },
      fail: function (err) {
        console.log(err)
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