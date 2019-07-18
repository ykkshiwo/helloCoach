Component({

  behaviors: [],

  properties: {
    imageUrl: String,
    frameHeight: String,
    frameWidth: String,
  },
  data: {
    inputValue: '',
    show: false,
    ifCutPicture: false,
    sInfo_: "",
  }, // 私有数据，可用于模版渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function() {
    console.log("图片被加载。");
  }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() {},

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function() {},
  },

  methods: {

    backToIndexByImageUrl: function() {

      this.triggerEvent('cutPicture', {
        success: 1
      });

      const that = this;
      console.log("点击网络图片，选择图片成功");
      var picPath = this.properties.imageUrl;
      console.log("网络图片的临时路径为： ", picPath);
      wx.getImageInfo({
        src: picPath,
        success(res) {
          const sInfo_ = {
            sWidth: res.width,
            sHeight: res.height
          };
          // that.triggerEvent('selectWebImage', {
          //   picPath: [picPath],
          //   sInfo: sInfo_,
          // }, {
          //   bubbles: true,
          //   composed: true
          // });
          that.setData({
            ifCutPicture: true,
            sInfo_: sInfo_,
            picPath: [picPath],
          });
          console.log("传递上来的数据：", that.properties.frameHeight, that.properties.frameWidth);
        }
      });
    },

    cutImage: function(e) {
      console.log("网络素材中的裁剪组件点击裁剪");
      this.triggerEvent('selectWebImage', {
        picPath: this.data.picPath,
        sInfo: this.data.sInfo_,
        cutInfo: e.detail,
      }, {
        bubbles: true,
        composed: true
      });
    }

  }

})