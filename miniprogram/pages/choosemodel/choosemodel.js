// miniprogram/pages/choosemodel/choosemodel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowModel: 1,
    proList: [{
        index: 1,
        selected: true,
        content: "hello coach-1"
      },
      {
        index: 2,
        selected: false,
        content: "hello coach-2"
      },
      {
        index: 3,
        selected: false,
        content: "hello coach-3"
      },
      {
        index: 4,
        selected: false,
        content: "hello coach-4"
      },
      {
        index: 5,
        selected: false,
        content: "hello coach-5"
      }
    ]
  },

  getSelectItem: function(e) {
    console.log("选择模板在滚动···");
    var that = this;
    //每个商品的宽度
    var itemWidth = e.detail.scrollWidth / that.data.proList.length;
    //滚动宽度
    var scrollLeft = e.detail.scrollLeft;
    //通过Math.round方法对滚动大于一半的位置进行进位
    var curIndex = Math.round(scrollLeft / itemWidth);
    for (var i = 0, len = that.data.proList.length; i < len; ++i) {
      that.data.proList[i].selected = false;
    }
    that.data.proList[curIndex].selected = true;
    this.setData({
      nowModel: curIndex + 1,
    })
    console.log("现在选择的模板是：", this.data.nowModel);
    that.setData({
      proList: that.data.proList,
      // giftNo: this.data.proList[curIndex].id
    });
  },

  toIndex: function(e) {
    console.log(e.target.id);
    wx.navigateTo({
      url: '../index/index?model=' + e.target.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})