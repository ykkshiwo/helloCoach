Component({

  behaviors: [],

  properties: {
    imageUrl: String,
    showWebpage: Boolean,
    frameHeight: String,
    frameWidth: String,
    fromBackground: String,
  },
  data: {
    inputValue: '',
    show: false,
    webImagesUrl: [],
    borderBottomWidthbg: '',
    borderBottomWidthkc: '',
    borderBottomWidthqt: '',
    fontWeightbg: '',
    fontWeightkc: '',
    fontWeightqt: '',
    ifCutPicture: false,
    notCutPic: true,
  }, // 私有数据，可用于模版渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function() {

    console.log("云端图片页面被加载。");
    console.log("开始连接数据库")
    const helloCoachDB = wx.cloud.database({
      env: 'hello-coach-1-3d05cc'
    });
    console.log("数据库连接成功")
    const backgroundCollection = helloCoachDB.collection('background-images');
    const courseCollection = helloCoachDB.collection('course-images');
    const otherCollection = helloCoachDB.collection('other-images');
    console.log("已经获取数据库内集合")
    this.setData({
      backgroundCollection: backgroundCollection,
      courseCollection: courseCollection,
      otherCollection: otherCollection
    });

    this.changePage("课程图片");

  },

  ready: function() {},

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function() {},
  },

  methods: {

    databaseResult_WebUrlsArray: function(databaseResult) {
      var webUrlsArray = [];
      for (var i = 0; i < databaseResult.length; i++) {
        webUrlsArray.push(databaseResult[i].fileId);
      };
      return webUrlsArray;
    },

    changeImagesPage: function(Collection, that, type) {
      Collection.where({}).get({
        success: function(res) {
          console.log("获取的所有数据为：", res.data);
          var webUrlsArray = that.databaseResult_WebUrlsArray(res.data);
          console.log("云文件IDs：", webUrlsArray);
          wx.cloud.getTempFileURL({
            fileList: webUrlsArray,
            success: res => {
              // get temp file URL
              console.log("返回的文件临时链接：", res.fileList);
              that.setData({
                webImagesUrl: res.fileList
              });
              try {
                wx.setStorageSync(type, res.fileList);
                console.log("缓存--" + type + " 成功");
              } catch (e) {
                console.log("同步缓存出现错误：", e);
              }
            },
            fail: err => {
              // handle error
            }
          })
        }
      });
    },

    getDataFromCloudOrStorage: function(collection, that, type) {
      try {
        var value = wx.getStorageSync(type)
        if (value) {
          console.log("有缓存数据，不需要从云端获取。");
          this.setData({
            webImagesUrl: value
          });
        } else {
          console.log("无缓存数据，需要从云端获取。");
          this.changeImagesPage(collection, that, type);
        }
      } catch (e) {
        console.log("提取缓存出现错误：", e);
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
          this.getDataFromCloudOrStorage(this.data.backgroundCollection, that, "background");
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
          this.getDataFromCloudOrStorage(this.data.courseCollection, that, "course");
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
          this.getDataFromCloudOrStorage(this.data.otherCollection, that, "other");
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

    hideTop: function() {
      console.log("隐藏头部，为了解决iPhone上的bug")
      this.setData({
        notCutPic: false
      });
    },

  }
})