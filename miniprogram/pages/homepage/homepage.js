// miniprogram/pages/homepage/homepage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: "Page animation",
    animation: '',
    whichGym: "Where are you?",
  },

  getInfoOfUser: function(){
    console.log("用户登入···");
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res.authSetting);
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              console.log(res);
            }
          })
        }else{
          console.log("没有被授权，发起请求。");
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              console.log("sadasdas")
              wx.getUserInfo({
                success: res => {
                  console.log(res);
                }
              })
            }
          })
        }
      }
    })
    // wx.cloud.callFunction({
    //   name: 'getUserOpenId',
    //   complete: res => {
    //     console.log('callFunction test result: ', res)
    //   }
    // })
  },

  getGymName: function(){
    const that = this;
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          whichGym: res.name,
        })
      },
    })
  },

  toChooseModel: function(){
    wx.redirectTo({
      url: '../choosemodel/choosemodel?id=1'
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
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
      delay: 500
    });
    animation.scale(1.3).rotate(20).step().scale(1).rotate(0).step({
      duration: 100,
      timingFunction: 'ease-out',
      delay: 0,
    });
    this.setData({
      ani: animation.export()
    })
  },

  rotate: function() {
    //顺时针旋转10度
    //
    this.animation.rotate(150).step()
    this.setData({
      //输出动画
      animation: this.animation.export()
    })
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