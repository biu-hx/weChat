var e = require("../../utils/hotapp.js");

Page({
    yanzZhanghao: function(e) {
        var t = e.detail.value, a = /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$|17[0-9]{9}$/;
        if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(t) && !a.test(t)) return wx.showModal({
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
        var t = /^(\w){6,20}$/, a = e.detail.value;
        if (!t.test(a)) return wx.showModal({
            title: "提示",
            content: "密码长度为6到20位，由数字或字母组成!",
            showCancel: !1,
            success: function(e) {}
        }), !1;
        this.setData({
            code: a
        });
    },
    yanzCode02: function(e) {
        var t = /^(\w){6,20}$/, a = e.detail.value;
        return t.test(a) ? this.data.code != a ? (wx.showModal({
            title: "提示",
            content: "两次输入的密码不一致!",
            showCancel: !1,
            success: function(e) {}
        }), !1) : void this.setData({
            code02: a
        }) : (wx.showModal({
            title: "提示",
            content: "密码长度为6到20位，由数字或字母组成!",
            showCancel: !1,
            success: function(e) {}
        }), !1);
    },
    sendYzm: function(t) {
        var a = this, n = a.data.username, o = a.data.yzmname, s = 0, c = "", i = 0, d = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, l = /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$|17[0-9]{9}$/;
        if (!n) return wx.showModal({
            title: "提示",
            content: "请输入正确格式的手机号或邮箱!",
            showCancel: !1,
            success: function(e) {}
        }), !1;
        d.test(n) && (s = 2, c = "http://login.gmatonline.cn/cn/wap-api/send-mail", i = 120), 
        l.test(n) && (s = 2, c = "http://login.gmatonline.cn/cn/wap-api/phone-code", i = 60), 
        e.request({
            useProxy: !0,
            url: c,
            data: {
                phoneNum: n,
                email: n,
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
                a.setData({
                    yzmname: i + "秒后",
                    yzmbtn: !0,
                    phoneCode: t.phonecode,
                    emailCode: t.emailCode
                });
                var n = setInterval(function() {
                    a.setData({
                        yzmname: i + "秒后"
                    }), --i < -1 && (clearInterval(n), a.setData({
                        yzmname: o,
                        yzmbtn: !1
                    }));
                }, 1e3);
            }
        });
    },
    clickFound: function() {
        var t = this, a = this.data.username, n = this.data.yzm, o = this.data.code, s = this.data.code02, c = null, i = "", d = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, l = /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$|17[0-9]{9}$/;
        if (!(a && n && o && s)) return wx.showModal({
            title: "提示",
            content: "请将信息填写完整!",
            showCancel: !1,
            success: function(e) {}
        }), !1;
        d.test(a) && (c = 2, i = t.data.emailCode), l.test(a) && (c = 1, i = t.data.phoneCode), 
        e.request({
            useProxy: !0,
            url: "http://login.gmatonline.cn/cn/wap-api/find-pass",
            data: {
                registerStr: t.data.username,
                type: c,
                phoneCode: i,
                code: t.data.yzm,
                pass: t.data.code
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
    data: {
        username: "",
        yzm: "",
        code: "",
        code02: "",
        yzmbtn: !1,
        yzmname: "验证码",
        phoneCode: "",
        emailCode: ""
    }
});