// cutpicture-component/cutpicture-component.js
Component({

  properties: {
    frameWidth: String,
    frameHeight: String,
  },

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: "./test.jpg",
    width: 375,
    height: 700,
    olddistance: 0, //上一次两个手指的距离
    newdistance: "", //本次两手指之间的距离，两个一减咱们就知道了滑动了多少，以及放大还是缩小（正负嘛）  
    diffdistance: '', //这个是新的比例，新的比例一定是建立在旧的比例上面的，给人一种连续的假象
    Scale: 1, //图片放大的比例，
    oldscaleA: 1,
    baseHeight: 375, //原始高  
    baseWidth: 700, //原始宽
    scrollX: 0,
    scrollY: 0,
    frameWidth: 0, //裁剪框架的宽度
    frameHeight: 0, //裁剪框架的高度
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function() {
      console.log("裁剪组件执行。");
      console.log("frameWidth:", this.properties.frameWidth);
      console.log("frameHeight:", this.properties.frameHeight);
      var fh = this.properties.frameHeight.slice(0, -3);
      var fw = this.properties.frameWidth.slice(0, -3);
      console.log(fh);
      console.log(fw);
      this.setData({
        frameWidth: "95%",
        frameHeight: 0.95 * 750 * fh / fw + "rpx"
      })
      console.log(this.data.frameWidth, this.data.frameHeight);
    },
    moved: function() {},
    detached: function() {},
  },

  methods: {
    //手指在屏幕上移动
    scroll: function(e) {
      var _this = this;
      //当e.touches.length等于1的时候，表示是单指触摸，我们要的是双指
      if (e.touches.length == 2) { //两个手指滑动的时候
        var xMove = e.touches[1].clientX - e.touches[0].clientX; //手指在x轴移动距离
        var yMove = e.touches[1].clientY - e.touches[0].clientY; //手指在y轴移动距离
        var distance = Math.sqrt(xMove * xMove + yMove * yMove); //根据勾股定理算出两手指之间的距离  
        if (_this.data.olddistance == 0) {
          _this.data.olddistance = distance; //要是第一次就给他弄上值，什么都不操作
          console.log("第一次");
          console.log(distance);
        } else {
          _this.data.newdistance = distance; //第二次就可以计算它们的差值了  
          _this.data.diffdistance = _this.data.newdistance - _this.data.olddistance; //两次差值
          _this.data.olddistance = _this.data.newdistance; //计算之后更新比例  
          _this.data.Scale = _this.data.oldscaleA + 0.005 * _this.data.diffdistance; //这条公式是我查阅资料后找到的，按照这条公式计算出来的比例来处理图片，能给用户比较好的体验
          if (_this.data.Scale > 2.5) { //放大的最大倍数
            return;
          } else if (_this.data.Scale < 1) { //缩小不能小于当前
            return;
          }
          console.log("现在的倍数： ", _this.data.Scale);
          console.log("现在的高度： ", _this.data.baseHeight);
          //刷新.wxml ，每次相乘，都是乘以图片的显示宽高
          _this.setData({
            height: _this.data.baseHeight * _this.data.Scale,
            width: _this.data.baseWidth * _this.data.Scale
          })
          _this.data.oldscaleA = _this.data.Scale; //更新比例
        }
      }
    },

    //手指离开屏幕
    endTou: function(e) {
      this.data.olddistance = 0; //重置
      // this.getRect();
    },

    getDisdanceOfScroll: function(e) {
      console.log("距离左侧距离： ", e.detail.scrollLeft)
      console.log("距离顶部距离： ", e.detail.scrollTop)
    },

    getRect: function() {
      var _this = this;
      wx.createSelectorQuery().select('#image').boundingClientRect(function(rect) {
        console.log("scroll-view左侧的距离： ", Math.abs(rect.left));
        console.log("scroll-view上面的距离： ", Math.abs(rect.top));
        _this.data.scrollX = Math.abs(rect.left); //x坐标
        _this.data.scrollY = Math.abs(rect.top); //y坐标
      }).exec()
    },
  }

})