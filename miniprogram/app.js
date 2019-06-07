//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    const res = wx.getSystemInfoSync();
    console.log(res.windowWidth);
    var rpxTopx = res.windowWidth/750;
    this.globalData.rpxTopx = rpxTopx;
  },

  globalData: {
    rpxTopx: 0.5,
  }
})
