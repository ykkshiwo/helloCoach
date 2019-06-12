// miniprogram/pages/webImages/webImages.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webImagesUrl: [],
    borderBottomWidthbg: '',
    borderBottomWidthkc: '',
    borderBottomWidthqt: '',
    fontWeightbg: '',
    fontWeightkc: '',
    fontWeightqt: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    console.log(option.Info);
    // console.log(JSON.parse(option.sz));
    console.log("数据库启动 2")
    const helloCoachDB = wx.cloud.database({
      env: 'hello-coach-1-3d05cc'
    });
    console.log("数据库启动 3")
    const backgroundCollection = helloCoachDB.collection('background-images');
    const courseCollection = helloCoachDB.collection('course-images');
    const otherCollection = helloCoachDB.collection('other-images');
    console.log("数据库启动 4")
    this.setData({
      backgroundCollection: backgroundCollection,
      courseCollection: courseCollection,
      otherCollection: otherCollection
    });

    this.changePage(option.from);

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
  },

  changeImagesPage: function(Collection, that) {
    Collection.where({}).get({
      success: function(res) {
        console.log("获取的所有数据为：", res.data);
        var webUrlsArray = that.databaseResult_WebUrlsArray(res.data);
        console.log("云文件IDs：", webUrlsArray);
        wx.cloud.getTempFileURL({
          fileList: webUrlsArray,
          success: res => {
            // get temp file URL
            console.log("返回的文件临时链接：", res.fileList);
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

  changePage: function(targetId) {
    const that = this;
    switch (targetId) {
      case "背景图片":
        console.log("点击背景图片");
        this.setData({
          borderBottomWidthbg: '2px',
          borderBottomWidthkc: '',
          borderBottomWidthqt: '',
          fontWeightbg: 'bold',
          fontWeightkc: '',
          fontWeightqt: '',
        })
        this.changeImagesPage(this.data.backgroundCollection, that);
        break;
      case "课程图片":
        console.log("点击课程图片");
        this.setData({
          borderBottomWidthbg: '',
          borderBottomWidthkc: '2px',
          borderBottomWidthqt: '',
          fontWeightbg: '',
          fontWeightkc: 'bold',
          fontWeightqt: '',
        })
        this.changeImagesPage(this.data.courseCollection, that);
        break;
      case "其他图片":
        console.log("点击其他图片");
        this.setData({
          borderBottomWidthbg: '',
          borderBottomWidthkc: '',
          borderBottomWidthqt: '2px',
          fontWeightbg: '',
          fontWeightkc: '',
          fontWeightqt: 'bold',
        })
        this.changeImagesPage(this.data.otherCollection, that);
        break;
      default:
        break;
    }
  },

  clickChangeImagesPage: function (e) {
    console.log(e);
    var targetId = e.target.id;
    this.changePage(targetId);
  }

})