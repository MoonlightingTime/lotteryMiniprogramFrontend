// pages/result/result.js

var viewState = Object.freeze({
  "waitRequest": 0, "successRequest": 1,
  "refreshRequest": 2, "failRequest": 3
});

Page({
  data: {
    // 向后端发起请求所需的数据
    backend: undefined,
    openid: undefined,
    viewState: viewState.waitRequest,
    //前端展示效果所需的数据
    participatedSwpstks: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp();
    this.data.backend = app.globalData.backend;
    this.data.openid = app.globalData.userInfo.openid;
    this.tryQuery();
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

  tryQuery: function (tryTimes = 0) {
    var self = this;
    if (self.data.openid !== undefined) {
      this.queryResult();
      return true;
    }
    ++tryTimes < 6 ? (function () {
      console.log(`Openid is undefine, waiting ${tryTimes} second`);
      setTimeout(function () {
        var app = getApp();
        app.globalData.userInfo.openid === undefined || (function (openid) {
            self.setData({openid: openid});
          })(app.globalData.userInfo.openid);
        self.tryQuery(tryTimes);
      }, 1000)})() : self.setData({
        viewState: viewState.failRequest,
        errMsg: "未得到个人信息"
      });
  },

  queryResult: function () {
    var self = this;
    wx.request({
      url: `${self.data.backend}/participate/query_participated`,
      data: {
        openid: self.data.openid
      },
      success: self.querySuccessCallBack,
      fail: self.queryFailCallBack
    })
  },
  
  querySuccessCallBack: function (res) {
    console.log(res);
    var self = this;
    this.setData({
      viewState: viewState.successRequest,
      participatedSwpstks: []
    });
    if (res.data.code === 0) {
      res.data.data.forEach(function (item, index) {
        switch (item.swpstkState) {
          case null: item.swpstkState = "notTime"; break;
          case true: item.swpstkState = "hasWon"; break;
          case false: item.swpstkState = "notWon"; break;
          default: item.swpstkState = "error"; break;
        }
        console.log(item);
        var wxcnm = `participatedSwpstks[${index}]`;
        self.setData({
          [wxcnm]: item
        })
      })
    }
  },

  queryFailCallBack: function (res) {
    console.log(res);
    this.setData({
      viewState: viewState.failRequest,
      errMsg: res.errMsg
    })
  },

  refreshContent: function () {
    this.viewState = viewState.refreshRequest;
    this.queryResult();
  }
})