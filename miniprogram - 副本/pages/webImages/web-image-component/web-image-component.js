Component({

  behaviors: [],

  properties: {
    imageUrl: String,
    thisOption: Object,
  },
  data: {
    inputValue: '',
    show: false,
  }, // 私有数据，可用于模版渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { 
    console.log("图片页面被加载。");
    console.log(this.properties.thisOption);
  }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () { },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { },
  },

  methods: {

    backToIndexByImageUrl: function(){
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
          var deliverToIndex = {
            picPath: [picPath],
            sInfo: sInfo_,
            locatInfo: that.properties.thisOption.locatInfo,
          };
          console.log(JSON.stringify(deliverToIndex));
          wx.navigateTo({
            url: '../index/index?deliverToIndex=' + JSON.stringify(deliverToIndex) + "&id_=" + that.properties.thisOption.id_ + "&from_=" + that.properties.thisOption.from_,
          })
        }
      });

      // wx.navigateTo({
      //   url: '../index/index?imageUrl=' + this.properties.imageUrl,
      // })
    },

  }

})