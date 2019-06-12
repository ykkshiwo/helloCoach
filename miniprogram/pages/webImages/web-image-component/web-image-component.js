Component({

  behaviors: [],

  properties: {
    imageUrl: String,
  },
  data: {
    inputValue: '',
    show: false,
  }, // 私有数据，可用于模版渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () { },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { },
  },

  methods: {

    backToIndexByImageUrl: function(){
      console.log("点击图片，带参数返回");
      wx.navigateTo({
        url: '../index/index?imageUrl=' + this.properties.imageUrl,
      })
    },

  }

})