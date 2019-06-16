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
    temPathArray: [],
    hide: true,
    canvasHeight: '',
    canvasShow: true,
    canvasLeft: "750rpx",
    backgroundPic: "/images/b19a.jpg",
    backgroundPicInfo: '',
    showWebPage: false,
    nowArrayTask: 0,
    needTask: 0,
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
      console.log("绘制图片的路径：", pic.picPath);
      if (pic.picPath[0].slice(0, 5) == "https") {
        var k = this.webUrlTotemPath(pic.picPath[0]);
        console.log("网络图片变成临时路径：", k);
      }
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

  changeBackground: function() {
    const that = this;
    wx.showActionSheet({
      itemList: ['网络素材', '我的相册'],
      success(res) {
        console.log(res.tapIndex);
        if (res.tapIndex == 0) {
          that.setData({
            showWebPage: true,
          });
          console.log("用户选择从云端选择图片");
        } else if (res.tapIndex == 1) {
          wx.chooseImage({
            success: function(res) {
              that.setData({
                backgroundPic: res.tempFilePaths[0],
              });
              wx.getImageInfo({
                src: res.tempFilePaths[0],
                success: function(res) {
                  that.setData({
                    backgroundPicInfo: {
                      sWidth: res.width,
                      sHeight: res.height,
                    },
                  })
                }
              })
            },
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    });
  },

  bindselectWebImage: function(e) {
    console.log("用户已经从云端选择了图片。")
    this.setData({
      showWebPage: false,
      backgroundPic: e.detail.picPath[0],
      backgroundPicInfo: e.detail.sInfo
    });
  },

  startDraw: function() {
    wx.showLoading({
      title: '绘制中',
    })

    var ctx = wx.createCanvasContext('canvas');
    ctx.drawImage(this.data.backgroundPic, 0, 0, this.data.backgroundPicInfo.sWidth, this.data.backgroundPicInfo.sHeight, 0, 0, app.globalData.screenWidthPx, app.globalData.screenHeightPx);

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
    console.log(e);
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

  onLoad: function(option) {

    for (var i = 0; i < 12; i++) {
      if (i < 5) {
        console.log("i<5");
        continue;
      } else {
        console.log("i>5");
      }
    }

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

  webUrlTotemPath: function(webUrl) {
    wx.showLoading({
      title: '正在加载网络图片···',
    })
    wx.downloadFile({
      url: webUrl,
      success: function(res) {
        wx.hideLoading();
        console.log("下载图片的临时路径为：", res.tempFilePath);
        return res.tempFilePath;
      }
    })
  },

  getIdArrayFromWeb: function(picArray) {
    var idArrayFromWeb = [];
    for (var i = 0; i < picArray.length; i++) {
      if (picArray[i].data.picPath[0].slice(0, 5) == "https") {
        idArrayFromWeb.push(picArray[i].id_)
      }
    }
    this.setData({
      needTask: idArrayFromWeb.length,
    })
    console.log("从云端选择图片的组件ID是：", idArrayFromWeb);
    console.log("从云端选择图片的个数：", this.data.needTask);
    return idArrayFromWeb;
  },

  startDownloadImages: function(idArrayFromWeb, picArray) {
    const that = this;
    for (var i = 0; i < idArrayFromWeb.length; i++) {
      (function(i) {
        wx.downloadFile({
          url: picArray[i].data.picPath[0],
          success: function(res) {
            console.log("下载成功");
            var nowArrayTask = that.data.nowArrayTask;
            that.setData({
              nowArrayTask: nowArrayTask + 1,
            });
            var temPathArray = that.data.temPathArray;
            temPathArray.push({ id_: idArrayFromWeb[i], picPath: res.tempFilePath});
            that.setData({
              temPathArray: temPathArray,
            })
          }
        })
      })(i)
    }

  },

  startWhenDownloadSuccess: function(fun) {
    const that = this;
    setTimeout(function() {
      console.log("监测是否下载完成。");
      if (that.data.needTask == that.data.nowArrayTask) {
        var tem = that.data.temPathArray;
        var pic = that.data.picArray;
        console.log(tem);
        for (var i = 0; i < tem.length; i++){
          for (var j = 0; j < pic.length; j++){
            if(pic[j].id_ == tem[i].id_){
              console.log("id一致，需要更换为本地路径");
              console.log(tem[i].picPath);
              console.log(pic[j].data.picPath[0]);
              pic[j].data.picPath[0] = tem[i].picPath
            }
          }
        }
        that.setData({
          picArray: pic
        })
        console.log(that.data.picArray);
        console.log("下载全部完成，可以执行函数");
        fun();
      } else {
        that.startWhenDownloadSuccess()
      }
    }, 500);
  },

  testFunction: function() {
    var idArrayFromWeb = this.getIdArrayFromWeb(this.data.picArray);
    this.startDownloadImages(idArrayFromWeb, this.data.picArray);
    this.startWhenDownloadSuccess(this.startDraw);
  }

})