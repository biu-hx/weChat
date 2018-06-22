var t = require("../../utils/hotapp.js");

Page({
    yanzZhanghao: function(t) {
        var e = t.detail.value, a = /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$|17[0-9]{9}$/;
        if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(e) && !a.test(e)) return wx.showModal({
            title: "提示",
            content: "请输入正确的手机或者邮箱格式!",
            showCancel: !1,
            success: function(t) {}
        }), !1;
        this.setData({
            username: e
        });
    },
    yanzMima: function(t) {
        var e = t.detail.value;
        if (e.length < 6 && e > 20) return wx.showModal({
            title: "提示",
            content: "请输入6到20位任意字符！",
            showCancel: !1,
            success: function(t) {}
        }), !1;
        this.setData({
            password: e
        });
    },
    loginFun: function() {
        this.setData({
            loading: !1
        });
        var e = this.data.username, a = this.data.password;
        if (!e || !a) return this.setData({
            loading: !0
        }), wx.showModal({
            title: "提示",
            content: "请将账号或密码填写完整！",
            showCancel: !1,
            success: function(t) {}
        }), !1;
        var n = this;
        t.request({
            useProxy: !0,
            url: "http://login.gmatonline.cn/cn/wap-api/check-login",
            data: {
                userName: e,
                userPass: a
            },
            header: {
                "content-type": "application/json"
            },
            success: function(t) {
                var e = t.data.replace("({", "").replace("})", "").split(":");
                if (1 != e[1].split(",")[0]) {
                    e[2];
                    return n.setData({
                        loading: !0
                    }), wx.showModal({
                        title: "提示",
                        content: "账号密码有误",
                        showCancel: !1
                    }), !1;
                }
                var a = e[3].split(",")[0], s = e[4].split(",")[0], i = e[8];
                e[5].split(",")[0];
                wx.setStorageSync("uid", a.substring(1, a.length - 1)), wx.setStorageSync("nickname", i), 
                wx.setStorageSync("username", s), wx.reLaunch({
                    url: "../index/index"
                });
            }
        });
    },
    data: {
        username: "",
        password: "",
        loading: !0
    },
    onLoad: function(t) {
        wx.getStorageSync("uid") && wx.reLaunch({
            url: "../index/index"
        });
    }
});