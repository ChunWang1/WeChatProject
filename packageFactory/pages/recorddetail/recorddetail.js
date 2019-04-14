
const app = getApp();
var sludgeList = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordId:"",
    sludgeId: "",
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
    selectArray: {},
    selectFunc:[]
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
    that.queryAllSludgeOfOneFactory();
    that.queryAllFunc();
  },
  getDate: function (e) {
    this.setData({
      selectFunc: e.detail
    });
    console.log(e.detail)
  },
  //查询所有污泥功能
  queryAllFunc:function(){
    var that=this;
    wx.request({
      url: app.globalData.QUERY_AllFunc,
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        var num=0;
        for(var i=0;i<res.data.length;i++){
          if (res.data[i].function != null && res.data[i].function!=""){
            var id = "selectArray[" + num + "].id";
            var text = "selectArray[" + num + "].text";
            that.setData({
              [id]: res.data[i].id,
              [text]: res.data[i].function,
            })
            num++;
          }
          
        }
    //    console.log(that.data.selectArray);
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  //删除运输车记录按钮
  delSludgeBtn: function (e) {
    var that = this;
  //  console.log("sludgeid:"+e.currentTarget.dataset.sludgeid);
    that.setData({
      delSludgeVisible: true,
      sludgeId: e.currentTarget.dataset.sludgeid
    });
  }, 

  //编辑运输车记录按钮
  editSludgeBtn: function (e) {
   // console.log("sludgeid"+e.currentTarget.dataset.sludgeid);
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
    var RFID = e.detail.value.RFID;
    var desAddr = e.detail.value.desAddr;
    var sludgeFunction = {
      function: that.data.selectFunc.text
    }
    console.log("RFID:" + e.detail.value.RFID + e.detail.value.desAddr + that.data.selectFunc.text + e.detail.value.weight);
    if (RFID == '' || RFID == null) {
      RFID = 'none'
    }
    if (desAddr == '' || desAddr == null) {
      desAddr = 'none'
    }
    wx.request({
      url: app.globalData.EDIT_Sludge_URL,
      data: JSON.stringify({
        id: parseInt(that.data.sludgeId),
        rfidString: RFID,
        destinationAddress: desAddr,
        sludgeFunction: sludgeFunction,
        weight: parseFloat(e.detail.value.weight)
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
            icon: 'success',
            duration: 2000,
          })
         
          that.querySludgeByRecordId();//刷新运输车记录页面  
        }else{
          wx.showToast({
            title: "修改失败！",
            icon: 'none',
            duration: 2000,
          })
        }
        that.setData({
          selectFunc: [],
          showEditSludgeModal: false,
        })
      },
      fail: function (err) {
        console.log(err)
       
      }
    })
  },


  //删除运输车记录模态框事件
  delSludgeModal({ detail }) {
    var that=this;
    if (detail.index === 0) {
      that.setData({
        delSludgeVisible: false
      });
    } else {
      const action = [...that.data.delSludgeactions];
      action[1].loading = true;

      that.setData({
        delSludgeactions: action
      });

      wx.request({
        url: app.globalData.DELETE_Sludge_URL,
        data: { sludgeId: parseInt(that.data.sludgeId) },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
          if (res.data === "SUCCESS") {
            setTimeout(() => {
              action[1].loading = false;
              that.setData({
                delSludgeVisible: false,
                delSludgeactions: action
              });
              wx.showToast({
                title: "删除成功!",
                icon: 'success',
                duration: 2000,
              })
            }, 2000);

            that.querySludgeByRecordId();//刷新运输车记录页面
          }
        },
        fail: function (err) {
          console.log(err)
          wx.showToast({
            title: "删除失败!",
            icon: 'none',
            duration: 2000,
          })
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
  queryAllSludgeOfOneFactory: function () {
    var that = this;
    //根据siteId查询所有运输车污泥记录
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
        /*
        sludgeList = res.data;
        var driver = [];
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].car.driver.realname != null) {
            driver.push(res.data[i].car.driver.realname);
          }
        }
        that.setData({
         // sludgeDrivers: that.removeDup(driver),
        })*/
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