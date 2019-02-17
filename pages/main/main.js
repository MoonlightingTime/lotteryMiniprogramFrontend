// pages/main/main.js

var viewState = Object.freeze({
  "waitRequest": 0, "successRequest": 1, "failRequest": 2
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialogVisible: true,
    swpstkRules: [],
    dialogState: viewState.waitRequest,

    sweepstakes: [],
    backend: "",
    viewState: viewState.waitRequest
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp();
    this.data.backend = app.globalData.backend;
    setTimeout(this.getSwpstkRules, 0);
    setTimeout(this.getSwpstkInfo, 0);
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

  handleCloseDialog: function () {
    wx.showToast({
      title: "已经了解",
      icon: "none"
    });
  },

  handleOpenDialog: function () {
    this.getSwpstkRules();
    this.setData({
      dialogVisible: true
    });
  },

  // TODO: 从后端获得所有的抽奖规则信息
  getSwpstkRules: function () {
    var self = this;
    wx.request({
      url: `${self.data.backend}/swpstk_rule/query_rules`,
      success: self.ruleSuccessCallBack,
      fail: self.ruleFailCallBack
    })
  },

  ruleSuccessCallBack: function (res) {
    console.log(res);
    var self = this;

    if (res.data.code === 0){
      self.setData({
        swpstkRules: [],
        dialogState: viewState.successRequest
      });
      res.data.data.forEach(function (item, index) {
        var wxcnm = `swpstkRules[${index}]`;
        self.setData({
          [wxcnm]: item
        })
      })
    } else {
      self.setData({
        dialogState: viewState.failRequest,
        dialogErrMsg: res.errMsg
      })
    }
  },

  ruleFailCallBack: function (res) {
    console.log(res);
    this.setData({
      dialogState: viewState.failRequest,
      dialogErrMsg: res.errMsg
    })
  },

  // TODO: 从后端获得所有的抽奖信息
  getSwpstkInfo: function () {
    var self = this;
    wx.request({
      url: this.data.backend + '/sweepstake/query_swpstk/',
      success: self.infoSuccessCallback,
      fail: self.infoFailCallBack
    });
  },

  infoSuccessCallback: function (res) {
    console.log(res);
    var self = this;
    self.setData({
      viewState: viewState.successRequest,
      sweepstakes: []
    });
    res.data.data.forEach(function (item, index) {
      item.firstPrize.loadImage = true;
      item.secondPrize.loadImage = true;
      item.thirdPrize.loadImage = true;
      item.luckyPrize.loadImage = true;

      var lotteryDataTime = new Date(item.lotteryTime);
      item.lotteryTime = `${lotteryDataTime.getFullYear()}-${lotteryDataTime.getMonth()}-${lotteryDataTime.getDate()}` +
        ` ${lotteryDataTime.getHours()}:${lotteryDataTime.getMinutes()}:${lotteryDataTime.getSeconds()}`;
      item.maxPrizeValue = Math.max(item.firstPrize.prizeValue, item.secondPrize.prizeValue,
          item.thirdPrize.prizeValue, item.luckyPrize.prizeValue);

      console.log(item);
      self.data.sweepstakes.push(item);
      var cnmwx = `sweepstakes[${index}]`;
      self.setData({[cnmwx]: item});

      self.loadSwpStkImage(index);
    });
    // this.setData({sweepstakes: this.data.sweepstakes});
  },

  infoFailCallBack: function (res) {
    console.log(res);
    this.setData({
      viewState: viewState.failRequest,
      infoErrMsg: res.errMsg
    })
  },
  
  loadSwpStkImage: function (num) {
    var self = this;
    setTimeout(function () { wx.downloadFile({
      url: `${self.data.backend}/images/${self.data.sweepstakes[num].firstPrize.demoImage}`,
      success: res => {
        console.log(res);
        self.data.sweepstakes[num].firstPrize.loadImage = false;
        self.data.sweepstakes[num].firstPrize.demoImage = res.tempFilePath;
        var cnmwx = `sweepstakes[${num}]`;
        self.setData({[cnmwx]: self.data.sweepstakes[num]});
      }
    }) }, 0);
    setTimeout(function () { wx.downloadFile({
      url: `${self.data.backend}/images/${self.data.sweepstakes[num].secondPrize.demoImage}`,
      success: res => {
        console.log(res);
        self.data.sweepstakes[num].secondPrize.loadImage = false;
        self.data.sweepstakes[num].secondPrize.demoImage = res.tempFilePath;
        var cnmwx = `sweepstakes[${num}]`;
        self.setData({[cnmwx]: self.data.sweepstakes[num]});
      }
    }) }, 0);
    setTimeout(function () { wx.downloadFile({
      url: `${self.data.backend}/images/${self.data.sweepstakes[num].thirdPrize.demoImage}`,
      success: res => {
        console.log(res);
        self.data.sweepstakes[num].thirdPrize.loadImage = false;
        self.data.sweepstakes[num].thirdPrize.demoImage = res.tempFilePath;
        var cnmwx = `sweepstakes[${num}]`;
        self.setData({[cnmwx]: self.data.sweepstakes[num]});
      }
    }) }, 0);
    setTimeout(function () { wx.downloadFile({
      url: `${self.data.backend}/images/${self.data.sweepstakes[num].luckyPrize.demoImage}`,
      success: res => {
        console.log(res);
        self.data.sweepstakes[num].luckyPrize.loadImage = false;
        self.data.sweepstakes[num].luckyPrize.demoImage = res.tempFilePath;
        var cnmwx = `sweepstakes[${num}]`;
        self.setData({[cnmwx]: self.data.sweepstakes[num]});
      }
    }) }, 0);
  },

  participateInSwpstk: function (swpstkId) {
    var app = getApp();
    var self = this;
    wx.request({
      url: this.data.backend + '/participate/participate_in',
      data: {
        openid: app.globalData.userInfo.openid,
        swpstkId: swpstkId
      },
      success: self.participateInCallBack
    })
  },

  participateInCallBack: function (res) {
    console.log(res);
  }
})