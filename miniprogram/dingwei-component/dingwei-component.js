var app = getApp();

Component({

  behaviors: [],

  properties: {
    myProperty: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal) {} // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
    myProperty2: String, // 简化的定义方式
    thisTop: String,
    thisLeft: String,
    thisWidth: String,
    thisHeight: String,
    show: {
      type: Boolean,
      observer: function(newVal, oldVal) {
        if (!newVal) {
          console.log("input失去焦点，隐藏");
          this.willDraw();
        }
      }
    },
    inputFocus: {
      type: Boolean,
      value: true,
    }
  },
  data: {
    A: [{
      B: 'init data.A[0].B'
    }],
    show: false,
  }, // 私有数据，可用于模版渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function() {},
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
    willDraw: function() {
      app.globalData.a = 5698;
      console.log("绘制文字--定位组件");
      console.log(app.globalData.a);
    },

    ccc: function() {
      console.log("ccc");
    },

    userClickcomponent: function(e) {
      console.log("用户点击定位组件");
      this.setData({
        show: true,
      });
      var userInput = '用户输入的内容';
      this.triggerEvent('userclickcomponent', userInput);
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