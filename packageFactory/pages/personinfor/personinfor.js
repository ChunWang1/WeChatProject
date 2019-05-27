// pages/personinfor/personinfor.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    idCard: "",
    realname: "",
    email: "",
    role_name: "",
    sex: "",
    username: "",
    telephone: "",
    selectArray: [{
      "id": "1",
      "text": "男"
    }, {
      "id": "2",
      "text": "女"
    }],
    selectValue:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      id:app.globalData.userData[0].id,
      idCard: app.globalData.userData[0].idCard,
      realname: app.globalData.userData[0].realname,
      email: app.globalData.userData[0].email,
      role_name: app.globalData.userData[0].role_name,
      sex: app.globalData.userData[0].sex,
      username: app.globalData.userData[0].username,
      telephone: app.globalData.userData[0].telephone,
    })
    
  },
  getDate: function (e) {
    this.setData({
      selectValue: e.detail
    });
    //console.log(e.detail)
  },
  //修改个人信息
  modifyUserInfo:function(e){
    var that=this;
    
    var userId=that.data.id;
    var username = e.detail.value.username;
    var realname = e.detail.value.realname
    var role_name = e.detail.value.role_name;
    var sex = that.data.selectValue.text;
    var idCard = e.detail.value.idCard;
    var telephone = e.detail.value.telephone;
    var email = e.detail.value.email;
    var roleId = app.globalData.userData[0].roleId;
    var role={
      id:roleId,
      role_name:role_name
    }
    console.log(role)
    console.log(userId + " " + username+" "+sex + " " + idCard + " " + telephone);
//输入正则判断
    var reg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
    var regs = /^[1][3,4,5,7,8][0-9]{9}$/;
    var regidcard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var pattern = /^['男'|'女']$/;
    if (realname == "") {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 2000,
        success: () => console.log('真实姓名不能为空！')
      })
      return
    } if (pattern.test(sex) == false) {
      wx.showToast({
        title: '请输入您的性别：<男> 或 <女>',
        icon: 'none',
        duration: 2000,
        success: () => console.log('请输入您的性别：<男> 或 <女>！')
      })
      return
    } if (idCard == "") {
      wx.showToast({
        title: '身份证号码不能为空！',
        icon: 'none',
        duration: 2000,
        success: () => console.log('身份证号码不能为空！')
      })
      return
    } if (regidcard.test(idCard) == false) {
      wx.showToast({
        title: '不是正确的身份证号，请重新输入！',
        icon: 'none',
        duration: 2000,
        success: () => console.log('不是正确的身份证号，请重新输入！')
      })
      return
    } if (telephone == "") {
      wx.showToast({
        title: '手机号码不能为空！',
        icon: 'none',
        duration: 2000,
        success: () => console.log('手机号码不能为空！')
      })
      return
    } if (!(telephone && telephone.length == 11 && !isNaN(telephone))) {
      wx.showToast({
        title: '不是完整的11位手机号或者正确的手机号前七位！',
        icon: 'none',
        duration: 2000,
        success: () => console.log('不是完整的11位手机号或者正确的手机号前七位！')
      })
      return 
    } if (email == "") {
      wx.showToast({
        title: '邮箱不能为空！',
        icon: 'none',
        duration: 2000,
        success: () => console.log('邮箱不能为空！')
      })
      return
    } if (!(reg.test(email))) {
      wx.showToast({
        title: '邮箱格式不正确！',
        icon: 'none',
        duration: 2000,
        success: () => console.log('邮箱格式不正确！')
      })
      return
    }
    wx.request({
      url: app.globalData.MODIFY_UserInfo_URL,
      data: JSON.stringify({
        id:userId,
        username: username,
        realname: realname,
        email: email,
        sex: sex,
        role: role,
        telephone: telephone,
        idCard: idCard,   
      }),
      headers: {
        'content-type': 'application/json'
       // 'content-type':'application/x-www-form-urlencoded'
      },
      method:'POST',
      dataType:JSON,
      success: function (res) {
        console.log("修改成功")
        console.log(res.data)
        wx.showToast({
          title: "修改成功！",
          icon: 'success',
          duration: 2000,
        })
      /*  that.setData({
          id: res.data.id,
          idCard: res.data.idCard,
          realname: res.data.realname,
          email: res.data.email,
          role: res.data.role,
          sex: res.data.sex,
          username: res.data.username,
          telephone: res.data.telephone,
        })*/
      },
      fail: function (res) {
        console.log("修改失败")
        console.log(res.data)
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