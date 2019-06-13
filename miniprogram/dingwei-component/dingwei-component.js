Component({

  behaviors: [],

  properties: {
    myProperty: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal) {} // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
    myProperty2: String, // 简化的定义方式
    mId: String,
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
    // inputShow: false,
    firstAttach: true,
    imageInfo: '',
    sInfo_: '',
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
      console.log("m-id:", this.properties.mId);
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
              console.log(res.tapIndex);
              var locatInfo = {
                thisHeight: that.properties.thisHeight,
                thisWidth: that.properties.thisWidth,
                thisTop: that.properties.thisTop,
                thisLeft: that.properties.thisLeft
              }
              console.log(locatInfo);
              var locatInfo_str = JSON.stringify(locatInfo);
              console.log(locatInfo_str);
              if (res.tapIndex == 0) {
                wx.navigateTo({
                  url: '../webImages/webImages?from_=课程图片&locatInfo_str=' + locatInfo_str + "&id_=" + that.properties.mId,
                })
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
                        that.triggerEvent('userclickcomponent', {
                          picPath: tempFilePaths,
                          sInfo: sInfo_,
                          locatInfo: that.data
                        });
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

    onMyButtonTap: function() {
      this.setData({
        // 更新属性和数据的方法与更新页面数据的方法类似
        myProperty: 'Test'
      })
    },
    _myPrivateMethod: function() {
      // 内部方法建议以下划线开头
      this.replaceDataOnPath(['A', 0, 'B'], 'myPrivateData') // 这里将 data.A[0].B 设为 'myPrivateData'
      this.applyDataUpdates()
    }
  }

})