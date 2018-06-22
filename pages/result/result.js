var t = require("../../utils/hotapp.js");

Page({
  data: {
    hint: [{
      hintText: "此报告未考虑文书质量与面试质量"
    }, {
      hintText: "用保证结果的准确性"
    }, {
      hintText: "此报告匹配标准以雷哥留学网近5年留学录取成果大数据作为技术支撑，并不能百分百表实际录取结果，仅供参考"
    }],
    school: [],
    nickname: "",
    score: "",
    bgExport: "",
    schoolNum: 0,
    loading: !1,
    majorName: '',
  },
  reBack: function() {
    wx.redirectTo({
      url: "../index/index"
    });
  },
  onLoad: function(a) {
    var e = this,
      n = wx.getStorageSync("uid"),
      o = a.id;
    t.request({
      url: "http://www.smartapply.cn/cn/wx-api/school-result",
      header: {
        "content-type": "application/json"
      },
      method: "GET",
      data: {
        uid: n,
        id: o
      },
      success: function(t) {
        e.setData({
          loading: !0,
          nickname: t.data.user.nickname,
          school: t.data.data.res,
          score: t.data.data.score,
          bgExport: t.data.score,
          schoolNum: t.data.data.res.length,
          majorName: t.data.major
        });
      }
    });
  },
  onShareAppMessage: function(t) {
    return {
      title: JSON.parse(wx.getStorageSync("nickname")) + "的选校测评",
      path: "pages/star/star",
      success: function(t) {},
      fail: function(t) {}
    };
  }
});