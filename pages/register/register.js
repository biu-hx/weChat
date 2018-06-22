var e = require("../../utils/hotapp.js");

Page({
  yanzZhanghao: function(e) {
    var t = e.detail.value,
      n = /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$|17[0-9]{9}$/;
    if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(t) && !n.test(t)) return wx.showModal({
      title: "提示",
      content: "请输入正确的手机或者邮箱格式!",
      showCancel: !1,
      success: function(e) {}
    }), !1;
    this.setData({
      username: t
    });
  },
  yanzNull: function(e) {
    var t = e.detail.value;
    if (!t) return wx.showModal({
      title: "提示",
      content: "验证码不能为空!",
      showCancel: !1,
      success: function(e) {}
    }), !1;
    this.setData({
      yzm: t
    });
  },
  yanzCode: function(e) {
    var t = /^(\w){6,20}$/,
      n = e.detail.value;
    if (!t.test(n)) return wx.showModal({
      title: "提示",
      content: "密码长度为6到20位，由数字或字母组成!",
      showCancel: !1,
      success: function(e) {}
    }), !1;
    this.setData({
      code: n
    });
  },
  yanzCode02: function(e) {
    var t = /^(\w){6,20}$/,
      n = e.detail.value;
    return t.test(n) ? this.data.code != n ? (wx.showModal({
      title: "提示",
      content: "两次输入的密码不一致!",
      showCancel: !1,
      success: function(e) {}
    }), !1) : void this.setData({
      code02: n
    }) : (wx.showModal({
      title: "提示",
      content: "密码长度为6到20位，由数字或字母组成!",
      showCancel: !1,
      success: function(e) {}
    }), !1);
  },
  clickReg: function(t) {
    var n = this,
      a = this.data.username,
      o = this.data.yzm,
      s = this.data.code,
      c = this.data.code02,
      i = null,
      u = "",
      d = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      l = /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$|17[0-9]{9}$/;
    if (!(a && o && s && c)) return wx.showModal({
      title: "提示",
      content: "请将信息填写完整!",
      showCancel: !1,
      success: function(e) {}
    }), !1;
    d.test(a) && (i = 2, u = n.data.emailCode), l.test(a) && (i = 1, u = n.data.phoneCode),
      e.request({
        useProxy: !0,
        url: "http://login.gmatonline.cn/cn/wap-api/register",
        data: {
          registerStr: n.data.username,
          type: i,
          phoneCode: u,
          code: n.data.yzm,
          pass: n.data.code,
          userName: "",
          source: 3
        },
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function(e) {
          var t = e.data;
          if (0 == t.code) return wx.showModal({
            title: "提示",
            content: t.message,
            showCancel: !1,
            success: function(e) {}
          }), !1;
          wx.navigateTo({
            url: "../login/login"
          });
        }
      });
  },
  sendYzm: function(t) {
    var n = this,
      a = n.data.username,
      o = n.data.yzmname,
      s = 0,
      c = "",
      i = 0,
      u = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      d = /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$|17[0-9]{9}$/;
    if (!a) return wx.showModal({
      title: "提示",
      content: "请输入正确格式的手机号或邮箱!",
      showCancel: !1,
      success: function(e) {}
    }), !1;
    u.test(a) && (s = 2, c = "http://login.gmatonline.cn/cn/wap-api/send-mail", i = 120),
      d.test(a) && (s = 1, c = "http://login.gmatonline.cn/cn/wap-api/phone-code", i = 60),
      e.request({
        useProxy: !0,
        url: c,
        data: {
          phoneNum: a,
          email: a,
          type: s
        },
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function(e) {
          var t = e.data;
          if (0 == t.code) return wx.showModal({
            title: "提示",
            content: t.message,
            showCancel: !1,
            success: function(e) {}
          }), !1;
          n.setData({
            yzmname: i + "秒后",
            yzmbtn: !0,
            phoneCode: t.phonecode,
            emailCode: t.emailCode
          });
          var a = setInterval(function() {
            n.setData({
              yzmname: i + "秒后"
            }), --i < -1 && (clearInterval(a), n.setData({
              yzmname: o,
              yzmbtn: !1
            }));
          }, 1e3);
        }
      });
  },
  data: {
    username: "",
    yzm: "",
    code: "",
    code02: "",
    yzmbtn: !1,
    yzmname: "验证码",
    phoneCode: "",
    emailCode: ""
  },
  onLoad: function(e) {},
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {}
});