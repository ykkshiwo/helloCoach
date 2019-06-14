Component({

  behaviors: [],

  properties: {
    myProperty: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal) {} // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
    myProperty2: String, // 简化的定义方式
    thisTop1: String,
    thisLeft1: String,
    thisWidth1: String,
    thisHeight1: String,
    thisInput: String,
    show: Boolean,
  },
  data: {
    inputValue: '',
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

    bindInitial: function(e) {
      this.setData({
        inputValue: e.detail.value
      })
    },

    bindKeyInput: function(e) {
      this.setData({
        inputValue: e.detail.value
      })
      console.log(this.data.inputValue);
    },

    loseFocus: function() {
      console.log("用户输入完成，现在开始绘制");
      this.triggerEvent('needdraw', {
        height: this.properties.thisHeight1,
        width: this.properties.thisWidth1,
        top: this.properties.thisTop1,
        left: this.properties.thisLeft1,
        inputValue: this.data.inputValue
      }, {
        bubbles: true,
        composed: true
      });
    },
  }

})