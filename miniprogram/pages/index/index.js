//index.js
const app = getApp()
const rpxTopx = app.globalData.rpxTopx
console.log("index页面：", rpxTopx)

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    inputShow: false, //初始状态input不显示
    picArray: [],
    textArray: [],
    hide: true,
    canvasHeight: '',
    canvasShow: true,
    canvasLeft: "750rpx"
  },

  hideComponent: function() {
    this.setData({
      hide: !this.data.hide,
    })
  },

  drawPictures: function(picArray, ctx) {
    console.log("开始绘制图片");
    for (var i = 0; i < picArray.length; i++) {
      var pic = picArray[i].data
      console.log(pic.locatInfo);
      ctx.drawImage(pic.picPath[0], 0, 0, pic.sInfo.sWidth, pic.sInfo.sHeight, pic.locatInfo.thisLeft.slice(0, -3) * rpxTopx, pic.locatInfo.thisTop.slice(0, -3) * rpxTopx, pic.locatInfo.thisWidth.slice(0, -3) * rpxTopx, pic.locatInfo.thisHeight.slice(0, -3) * rpxTopx);
    }
  },

  drawText: function(textArray, ctx) {
    console.log("开始绘制文字");
    for (var i = 0; i < textArray.length; i++) {
      var text = textArray[i].data;
      console.log(text);
      ctx.setFontSize(text.height.slice(0, -3) * rpxTopx);
      ctx.setTextAlign('left');
      ctx.setTextBaseline('top');
      ctx.fillText(text.inputValue, text.left.slice(0, -3) * rpxTopx, text.top.slice(0, -3) * rpxTopx);
    }
  },



  startDraw: function() {
    wx.showLoading({
      title: '绘制中',
    })

    var ctx = wx.createCanvasContext('canvas');
    // var ctx = wx.createOffscreenCanvas('canvas');
    ctx.rect(0, 0, app.globalData.screenWidthPx, app.globalData.screenHeightPx);
    // ctx.setFillStyle('white');
    // ctx.fill();
    this.drawPictures(this.data.picArray, ctx);
    this.drawText(this.data.textArray, ctx);

    const that = this;
    ctx.draw(false, function() {
      console.log("绘制成功");
      wx.hideLoading();
      that.savePicture();
    });

  },

  savePicture: function() {
    const that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: app.globalData.screenWidthPx,
      height: app.globalData.screenHeightPx,
      canvasId: 'canvas',
      fileType: 'jpg',
      quality: 1,
      success(res) {
        console.log(res.tempFilePath);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            console.log(res);
            // that.setData({
            //   canvasLeft: "1600rpx"
            // })
          }
        })
      }
    })
  },

  checkRepeat: function(arrayOld, newData, id) {
    if (arrayOld.length == 0) {
      return true;
    } else {
      for (var i = 0; i < arrayOld.length; i++) {
        console.log(arrayOld[i].id_ == id)
        if (arrayOld[i].id_ == id) {
          arrayOld[i] = {
            id_: id,
            data: newData
          };
          return false;
        }
      }
      return true;
    }
  },

  ccc: function(e) {
    console.log("从input组件回调回来");
    console.log(typeof e.target.id);
    console.log(e.detail, "写入文字数组");
    var cr = this.checkRepeat(this.data.textArray, e.detail, e.target.id);
    if (cr) {
      console.log("文字数组中没有重复。");
      this.data.textArray.push({
        id_: e.target.id,
        data: e.detail
      });
    } else {
      console.log("文字数组中有重复，已经替换");
    }
    console.log("最新的文字数组：", this.data.textArray);
    this.hideAllcomponent();
  },

  hideAllcomponent: function() {
    console.log("首先最外层的捕获事件被触发");
    this.setData({
      inputShow: false, //点击定位组件时父组件先将所有的定位组件的input关闭
    });
  },

  userClickcomponentF: function(e) {
    console.log("父组件被触发");
    console.log(e.target.id);
    console.log(e.detail, "写入图片数组");
    var cr = this.checkRepeat(this.data.picArray, e.detail, e.target.id);
    if (cr) {
      console.log("图片数组中没有重复。");
      this.data.picArray.push({
        id_: e.target.id,
        data: e.detail
      });
    } else {
      console.log("图片数组中有重复，已经替换");
    }
    console.log("最新的图片数组：", this.data.picArray);
  },

  onReady: function() {
    this.setData({
      canvasHeight: app.globalData.screenHeightPx / rpxTopx
    })
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

    console.log(app.globalData.rpxTopx);
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})