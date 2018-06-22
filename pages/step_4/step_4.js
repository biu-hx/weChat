var t = require("../../utils/hotapp.js");

Page({
  data: {
    item: {
      step: 4
    },
    destination: "",
    index: 0,
    multiArray: [],
    multiIndex: [0, 0],
    curData: "",
    major_A: "",
    leftId: "",
    leftIdArry: "",
    rightId: "",
    rightIdArry: ""
  },
  reBack: function(t) {
    wx.navigateBack({
      delta: 1
    });
  },
  onLoad: function() {
    var a = this;
    t.request({
      url: "http://schools.smartapply.cn/cn/wx-api/major-country",
      header: {
        "content-type": "application/json"
      },
      success: function(t) {
        var e = t.data.major,
          n = e.map(function(t) {
            return t.name;
          }),
          r = e.map(function(t) {
            return t.id;
          }),
          i = e[0].child.map(function(t) {
            return t.id;
          }),
          o = {
            id: "0",
            name: "请选择"
          };
        t.data.country.unshift(o);
        a.setData({
          destination: t.data.country,
          multiArray: [n, ["请选择"]],
          major_A: n,
          curData: e,
          leftIdArry: r,
          leftId: r[0],
          rightId: i[0]
        });
      }
    });
  },
  test: function(t) {
    var a = this.data.curData[t].child,
      e = this.data.major_A,
      n = a.map(function(t) {
        return t.name;
      }),
      r = a.map(function(t) {
        return t.id;
      });
    this.setData({
      multiArray: [e, n],
      rightIdArry: r
    });
  },
  bindPickerChange: function(t) {
    this.setData({
      index: t.detail.value
    });
  },
  bindMultiPickerChange: function(t) {
    var a = t.detail.value;
    this.setData({
      multiIndex: t.detail.value,
      leftId: this.data.leftIdArry[a[0]],
      rightId: this.data.rightIdArry[a[1]]
    });
  },
  bindMultiPickerColumnChange: function(t) {
    var a = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    switch (a.multiIndex[t.detail.column] = t.detail.value, t.detail.column) {
      case 0:
        this.test(t.detail.value), a.multiIndex[1] = 0;
    }
    this.setData({
      multiIndex: a.multiIndex
    });
  },
  toResult: function(a) {
    var e = a.detail.value,
      n = this.data.destination[e.destination].id,
      r = this.data.rightId,
      i = e.majorName[0],
      o = e.majorName[1],
      c = this.data.curData[i].child[o].name,
      d = wx.getStorageSync("uid"),
      l = wx.getStorageSync("gpaVal"),
      u = wx.getStorageSync("gmatVal"),
      s = wx.getStorageSync("toeflVal"),
      m = wx.getStorageSync("education"),
      g = wx.getStorageSync("school"),
      h = wx.getStorageSync("schoolName"),
      w = wx.getStorageSync("major_name1"),
      y = wx.getStorageSync("major_top"),
      x = wx.getStorageSync("school_major"),
      S = wx.getStorageSync("wrok"),
      p = wx.getStorageSync("live"),
      f = wx.getStorageSync("project"),
      I = wx.getStorageSync("studyTour"),
      j = wx.getStorageSync("active"),
      v = wx.getStorageSync("price");
    return 0 == n ? (wx.showModal({
      title: "提示",
      content: "请选择留学目的地",
      showCancel: !1
    }), !1) : 0 == r ? (wx.showModal({
      title: "提示",
      content: "请选择留学专业",
      showCancel: !1
    }), !1) : void t.request({
      url: "http://www.smartapply.cn/cn/wx-api/school-storage",
      header: {
        "content-type": "application/json"
      },
      method: "GET",
      data: {
        uid: d,
        result_gpa: l,
        result_gmat: u,
        result_toefl: s,
        education: m,
        school: g,
        schoolName: h,
        major_name1: w,
        major_top: y,
        school_major: x,
        wrok: S,
        live: p,
        project: f,
        studyTour: I,
        active: j,
        price: v,
        destination: n,
        major: r,
        major_name2: c
      },
      success: function(t) {
        1 == t.data.code ? (wx.showNavigationBarLoading(), wx.reLaunch({
          url: "../result/result?id="
        })) : wx.showModal({
          title: "提示",
          content: t.data.message,
          showCancel: !1
        });
      }
    });
  }
});