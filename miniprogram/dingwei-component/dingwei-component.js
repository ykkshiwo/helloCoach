const app = getApp();
const screenWidthPx = app.globalData.screenWidthPx
const rpxTopx = app.globalData.rpxTopx

Component({

  behaviors: [],

  properties: {
    thisTop: String,
    thisLeft: String,
    thisWidth: String,
    thisHeight: String,
    valueText: String,
    isText: Boolean,
    imageSrc: String,
    inputShow: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal) {
        if (!newVal) {
          console.log("input失去焦点，隐藏");
        }
      }
    },
    inputFocus: {
      type: Boolean,
      value: true,
    }
  },

  data: {
    firstAttach: true,
    ifCutPicture: false,
    xpos: '',
    ypos: '',
    bgWidth: '',
    bgHeight: '',
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function() {
      this.setData({
        thisTop1: this.properties.thisTop,
        thisLeft1: this.properties.thisLeft,
        thisWidth1: this.properties.thisWidth,
        thisHeight1: this.properties.thisHeight,
      });
      this.userClickcomponent();
    },
    moved: function() {},
    detached: function() {},
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function() {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() {},

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function() {},
  },

  methods: {

    drawOne: function(e) {
      console.log('失去焦点父组件被触发');
      this.setData({
        valueText: e.detail.inputValue,
        // inputShow: false,
      })
    },

    willDraw: function() {
      console.log("绘制文字--定位组件");
    },

    userClickcomponent: function(e) {
      const that = this;
      if (this.data.firstAttach) {
        console.log("第一次加载");
        if (this.properties.isText) {
          this.setData({
            inputShow: false,
          });
          this.triggerEvent('needdraw', {
            height: this.properties.thisHeight,
            width: this.properties.thisWidth,
            top: this.properties.thisTop,
            left: this.properties.thisLeft,
            inputValue: this.properties.valueText
          });
        } else {
          console.log("这是图片定位组件");
          console.log("初始值存在，写入初始值");
          wx.getImageInfo({
            src: that.properties.imageSrc,
            success(res) {
              const sInfo_ = {
                sWidth: res.width,
                sHeight: res.height
              };
              that.triggerEvent('userclickcomponent', {
                picPath: [that.properties.imageSrc],
                sInfo: sInfo_,
                locatInfo: that.data
              });
            }
          })
        }
        this.setData({
          firstAttach: false,
        })
      } else {
        console.log("不是第一次加载");
        if (this.properties.isText) {
          this.setData({
            inputShow: true,
          });
        } else {
          console.log("用户自己来选择");
          wx.showActionSheet({
            itemList: ['网络素材', '我的相册'],
            success(res) {
              // console.log(res.tapIndex);
              // var locatInfo = {
              //   thisHeight: that.properties.thisHeight,
              //   thisWidth: that.properties.thisWidth,
              //   thisTop: that.properties.thisTop,
              //   thisLeft: that.properties.thisLeft
              // }
              // console.log(locatInfo);
              // var locatInfo_str = JSON.stringify(locatInfo);
              // console.log(locatInfo_str);
              if (res.tapIndex == 0) {
                that.setData({
                  showWebPage: true,
                });
                console.log("用户选择从云端选择图片");
              } else if (res.tapIndex == 1) {
                wx.chooseImage({
                  count: 1,
                  sizeType: ['original', 'compressed'],
                  sourceType: ['album', 'camera'],
                  success(res) {
                    const tempFilePaths = res.tempFilePaths;
                    that.setData({
                      imageSrc: tempFilePaths,
                    })
                    wx.getImageInfo({
                      src: res.tempFilePaths[0],
                      success(res) {
                        const sInfo_ = {
                          sWidth: res.width,
                          sHeight: res.height
                        };
                        // that.triggerEvent('userclickcomponent', {
                        //   picPath: tempFilePaths,
                        //   sInfo: sInfo_,
                        //   locatInfo: that.data
                        // });
                        that.setData({
                          picPath: tempFilePaths,
                          sInfo: sInfo_,
                        })
                        console.log("接下进入裁剪界面。");
                        that.setData({
                          ifCutPicture: true,
                          sInfo_: sInfo_
                        })
                      }
                    })
                  }
                })
              }
            },
            fail(res) {
              console.log(res.errMsg)
            }
          });
        }
      }
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

    clickChangeImagesPage: function(e) {
      console.log(e);
      var targetId = e.target.id;
      this.changePage(targetId);
    },

    bindselectWebImage: function(e) {
      console.log("web-image-component组件点击", e.detail);
      this.setData({
        showWebPage: false
      })
      console.log("云端图片页面被关闭");
      this.triggerEvent('userclickcomponent', {
        picPath: e.detail.picPath,
        sInfo: e.detail.sInfo,
        locatInfo: this.data,
        cutInfo: e.detail.cutInfo,
      });
      var top = e.detail.cutInfo.top
      var left = e.detail.cutInfo.left
      var timesOfCut = (this.properties.thisWidth.slice(0, -3) * rpxTopx) / (0.95 * screenWidthPx)
      console.log("倍数为：", timesOfCut);
      this.setData({
        imageSrc: e.detail.picPath[0],
        xpos: '-' + left * timesOfCut,
        ypos: '-' + top * timesOfCut,
        bgWidth: e.detail.cutInfo.baseWidth * e.detail.cutInfo.scale * timesOfCut,
        bgHeight: e.detail.cutInfo.baseHeight * e.detail.cutInfo.scale * timesOfCut,
      })
      console.log("图片框内的背景信息：", {
        imageSrc: e.detail.picPath[0],
        xpos: '-' + left * timesOfCut,
        ypos: '-' + top * timesOfCut,
        bgWidth: e.detail.cutInfo.baseWidth * e.detail.cutInfo.scale,
        bgHeight: e.detail.cutInfo.baseHeight * e.detail.cutInfo.scale,
      });
    },

    cutImage: function(e) {
      console.log("点击了裁剪按钮，向上传递数据");
      console.log(e.detail);

      this.setData({
        ifCutPicture: false,
      })

      this.triggerEvent('userclickcomponent', {
        picPath: this.data.picPath,
        sInfo: this.data.sInfo,
        locatInfo: this.data,
        cutInfo: e.detail,
      });

      var top = e.detail.top
      var left = e.detail.left
      var timesOfCut = (this.properties.thisWidth.slice(0, -3) * rpxTopx) / (0.95 * screenWidthPx)
      console.log("倍数为：", timesOfCut);
      this.setData({
        imageSrc: this.data.picPath,
        xpos: '-' + left * timesOfCut,
        ypos: '-' + top * timesOfCut,
        bgWidth: e.detail.baseWidth * e.detail.scale * timesOfCut,
        bgHeight: e.detail.baseHeight * e.detail.scale * timesOfCut,
      })

      // that.setData({
      //   picPath: tempFilePaths,
      //   sInfo: sInfo_,
      // })
      // console.log("接下进入裁剪界面。");
      // that.setData({
      //   ifCutPicture: true,
      //   sInfo_: sInfo_
      // })

    }

  }
})