// testC/testC.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    thisId: String,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  lifetimes: {
    attached: function(e) {
      // 在组件实例进入页面节点树时执行
      console.log("组件进入节点实例。");
      console.log(this.id);
      const query = wx.createSelectorQuery()
      query.select("#" + this.id).boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        console.log(res[0].top, res[0].left);
      })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})