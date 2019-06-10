// miniprogram/pages/webImages/webImages.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webImagesUrl: [],
    testUrls: ["https://6865-hello-coach-1-3d05cc-1259373909.tcb.qcloud.la/my-image.jpg", "https://6865-hello-coach-1-3d05cc-1259373909.tcb.qcloud.la/my-image.jpg"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("数据库启动 2")
    const helloCoachDB = wx.cloud.database({
      env: 'hello-coach-1-3d05cc'
    });
    console.log("数据库启动 3")
    const backgroundCollection = helloCoachDB.collection('background-images');
    console.log("数据库启动 4")

    const that = this;
    backgroundCollection.where({}).get({
      success: function(res) {
        console.log("获取的所有数据为：", res.data);
        var webUrlsArray = that.databaseResult_WebUrlsArray(res.data);
        console.log("云文件IDs：", webUrlsArray);
        wx.cloud.getTempFileURL({
          fileList: webUrlsArray,
          success: res => {
            // get temp file URL
            console.log("返回的文件临时链接：",res.fileList);
            that.setData({
              webImagesUrl: res.fileList
            });
          },
          fail: err => {
            // handle error
          }
        })
      }
    });



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

  },

  databaseResult_WebUrlsArray: function(databaseResult) {
    var webUrlsArray = [];
    for (var i = 0; i < databaseResult.length; i++) {
      webUrlsArray.push(databaseResult[i].fileId);
    };
    return webUrlsArray;
  }
})