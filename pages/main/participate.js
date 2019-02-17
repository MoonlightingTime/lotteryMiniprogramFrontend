// pages/main/participate.js
var viewState = Object.freeze({
  "waitRequestCheck": 0, "hasParticipated": 1,
  "waitUserInput": 2, "requestFail": 3,
  "waitRequestIn": 4, "successParcitipate": 5
});

Page({
  data: {
    // 向后端请求所需数据
    backend: undefined,
    swpstkId: undefined,
    openid: undefined,
    phoneNumber: undefined,
    // 前端显示所需状态数据
    viewState: viewState.waitRequestCheck
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var app = getApp();

    this.data.backend = app.globalData.backend;
    this.data.swpstkId = options.swpstkId;
    this.data.openid = app.globalData.userInfo.openid;

    this.checkParticipatedState();
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

  },

  checkParticipatedState: function () {
    var self = this;
    this.setData({
      viewState: viewState.waitRequestCheck
    });
    wx.request({
      url: `${self.data.backend}/participate/check_participated`,
      data: {
        openid: self.data.openid,
        swpstkId: self.data.swpstkId
      },
      success: self.checkCallBack
    })
  },

  checkCallBack: function (res) {
    console.log(res);
    var self = this;
    if (res.data.code === 1) {
      self.setData({
        viewState: viewState.hasParticipated
      })
    } else if (res.data.code === 0) {
      self.setData({
        viewState: viewState.waitUserInput,
        phoneNumber: res.data.data.phoneNumber
      })
    } else {
      self.setData({
        viewState: viewState.requestFail,
        errorMsg: res.data.msg
      })
    }
  },

  bindPhoneNumber: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  
  submitPhoneNumber: function () {
    var self = this;
    wx.request({
      url: `${self.data.backend}/participate/participate_in`,
      data:{
        openid: self.data.openid,
        swpstkId: self.data.swpstkId,
        phoneNumber: self.data.phoneNumber
      },
      success: self.submitCallBack
    });
    self.setData({
      viewState: viewState.waitRequestIn
    })
  },
  
  submitCallBack: function (res) {
    console.log(res);
    var self = this;
    if (res.data.code === 0) {
      self.setData({
        viewState: viewState.successParcitipate
      });
      setTimeout(wx.navigateBack, 2000);
    } else if (res.data.code === 1) {
      self.setData({
        viewState: viewState.hasParticipated
      });
    } else {
      self.setData({
        viewState: viewState.requestFail,
        errorMsg: res.data.msg
      });
    }
  }
});