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
        content: "hello coach-1",
        imageUrl: "https://6865-hello-coach-1-3d05cc-1259373909.tcb.qcloud.la/c74ab63c28dcc387e842a08ad4ff9ac.jpg?sign=9acd45f1068430d8b183a91ec3407c29&t=1565621924",
      },
      {
        index: 2,
        selected: false,
        content: "hello coach-2",
        imageUrl: "https://6865-hello-coach-1-3d05cc-1259373909.tcb.qcloud.la/d30e08edf6507505f88c81ca69f85ee.jpg?sign=3c016666ceb41d82b558f684b5418f01&t=1565622111",
      },
      {
        index: 3,
        selected: false,
        content: "hello coach-3",
        imageUrl: "https://6865-hello-coach-1-3d05cc-1259373909.tcb.qcloud.la/fb3ec34135aad0ae270e798cfe13b5d.jpg?sign=3d7326853b4e442e716e2e7365a06276&t=1565622133",
      },
      {
        index: 4,
        selected: false,
        content: "hello coach-4",
        imageUrl: "https://6865-hello-coach-1-3d05cc-1259373909.tcb.qcloud.la/jianbian.jpg?sign=9c88805948cac909e9fb4208a047651f&t=1565622160"
      },
      {
        index: 5,
        selected: false,
        content: "hello coach-5",
        imageUrl: "https://6865-hello-coach-1-3d05cc-1259373909.tcb.qcloud.la/my-image.jpg?sign=a491661eab71530eb4e87329fbd7f830&t=1565622178",
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