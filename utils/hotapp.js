var e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e;
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};

!function() {
    function t(e, t, n) {
        if (y) return [ d + "/api/error", {
            appkey: y,
            system_info: f.getSystemInfo(),
            user_info: f.getUserInfo(),
            version: t,
            msg: e
        }, n ];
        h("app key is empty");
    }
    function n() {
        return 1 === parseInt(f.get("wxAuth"));
    }
    function o(e) {
        r();
        var t = function() {
            var t = f.getFakeOpenID();
            return "function" == typeof e && e(t);
        };
        wx.login({
            success: function(n) {
                return n.code ? void wx.request({
                    url: d + "/data/wechat/login",
                    data: {
                        hotAppKey: y,
                        code: n.code,
                        sdkVersion: f.getVersion()
                    },
                    method: "POST",
                    success: function(t) {
                        var n = t.data.openid;
                        return c.isEmpty(n) && (n = f.getFakeOpenID()), f.setOpenID(n), "function" == typeof e && e(n);
                    },
                    fail: t
                }) : t();
            },
            fail: t
        });
    }
    function r(e) {
        void 0 === e && (e = y);
        var t = "hotAppKey不能为空";
        if (c.isEmpty(e)) throw wx.showToast({
            title: t
        }), Error(t);
    }
    function a(e, t) {
        r(e = e || f.getHotAppKey()), f.set("hotAppKey", e), h("hotAppKey: " + y + " 已初始化");
        var a = function() {
            n() ? (h("conf.wxAuth disable our auth dialog"), f.set("userInfo", {}), p()) : wx.getUserInfo({
                success: function(e) {
                    f.set("userInfo", e.userInfo), p();
                }
            });
        };
        return f.getOpenID() ? a() : void o(a);
    }
    function p() {
        wx.request({
            url: d + "/data/wechat/launch",
            data: {
                hotAppKey: y,
                openId: f.getOpenID(),
                hotAppUUID: f.getHotAppUUID(),
                userInfo: f.getUserInfo(),
                systemInfo: f.getSystemInfo(),
                phoneTime: Date.parse(new Date()) / 1e3,
                hotAppVersion: f.getVersion(),
                sdkVersion: f.getVersion()
            },
            method: "POST",
            success: function(e) {
                if (0 == f.get("uploadType")) f.set("uploadType", e.data.upload_type); else {
                    var t = wx.getStorageSync("hotAppEvent") || [];
                    if (0 == t.length) return;
                    wx.request({
                        url: d + "/data/wechat/event",
                        data: {
                            hotAppKey: y,
                            openId: f.getOpenID(),
                            hotAppUUID: f.getHotAppUUID(),
                            eventArray: t
                        },
                        method: "POST",
                        success: function(e) {
                            h(wx.getStorageSync("hotAppEvent") || [], e.data);
                            try {
                                wx.removeStorageSync("hotAppEvent");
                            } catch (e) {
                                h(e);
                            }
                        },
                        fail: function() {
                            h("send event fail"), wx.setStorageSync("hotAppEvent", t);
                        }
                    });
                }
            },
            fail: function(e) {
                h("send launch fail: ", e);
            }
        });
    }
    function i(t, n) {
        if ("object" == (void 0 === t ? "undefined" : e(t)) && t.__route__) if (y) var o = t.__route__, r = setInterval(function() {
            var e = f.getOpenID(), t = f.getUserInfo();
            c.isEmpty(e) || c.isEmpty(t) || (clearInterval(r), h("clear timer check_env, trigger page onload event"), 
            a(e, t));
        }, 200), a = function(e, t) {
            var r = d + "/data/wechat/param";
            for (var a in n) n[a] = unescape(n[a].replace(/\\u/g, "%u"));
            var p = {
                hotAppKey: y,
                page: o,
                openId: e,
                hotAppUUID: f.getHotAppUUID(),
                paraInfo: n
            };
            p.paraInfo.userInfo = t, l.http(r, p);
        }; else h("hotapp key is empty"); else h("context error");
    }
    function u(t, n) {
        if (y) {
            if ("object" == (void 0 === t ? "undefined" : e(t)) && t.__route__) {
                var o = n.path, r = f.getOpenID();
                r || (r = f.getFakeOpenID(), h("shareMessage use fake openId: " + r));
                var a = d + "/data/wechat/share", p = function(e) {
                    var t = {}, n = e.indexOf("?");
                    if (!g.isString(e) || -1 === n) return t;
                    var o = e.substring(n + 1).split("&");
                    return c.map(o, function(e) {
                        var n = e.split("=");
                        t[n[0]] = n[1] || "";
                    }), t;
                }(o);
                h("shareMessage params: ", p);
                var i = {
                    hotAppKey: y,
                    page: t.__route__,
                    openId: r,
                    hotAppUUID: f.getHotAppUUID(),
                    params: p
                };
                l.http(a, i);
                var u = "?hotapp_share_id=" + r, s = -1 === o.indexOf("?") ? o + u : o.substring(0, o.indexOf("?")) + u;
                if (g.isObject(p) && !c.isEmpty(p)) {
                    var v = [];
                    Object.keys(p).forEach(function(e) {
                        v.push(e + "=" + encodeURIComponent(p[e]));
                    }), s += "&" + v.join("&");
                }
                return h("shareUrl: ", s), n.path = s, n;
            }
            h("context error, must be in Page instance scope");
        } else h("hotapp key is empty");
    }
    function s(e, t, n) {
        if (e[t]) {
            var o = e[t], r = 0;
            e[t] = function(e) {
                if ("onShareAppMessage" == t) {
                    if (!o || !g.isFunction(o)) return;
                    var a = o.apply(this, arguments);
                    return n.call(this, a);
                }
                if ("onError" == t) {
                    var p = n.apply(this, arguments);
                    if (g.isArray(p) && g.isObject(p[1])) {
                        if (r > 3) return h("maxRequest ", 3, "times achieved"), void o.call(this, e);
                        var i = p[0], u = p[1], s = [ "getStorageSync:fail" ];
                        if (c.inArray(u.msg, s)) return o.call(this, e);
                        try {
                            l.http(i, u, function(e, t) {
                                g.isObject(e) ? h("send err log ok, err data: ", e, t) : !1 === e && (h("err occurred", t), 
                                ++r);
                            });
                        } catch (e) {
                            h("onError", e);
                        }
                    }
                    return o.call(this, e);
                }
                return n.call(this, e, t), o.call(this, e);
            };
        }
    }
    var c = function() {
        function t(e, t) {
            return !!a.isArray(t) && -1 !== t.indexOf(e);
        }
        var n = Object.prototype.toString, o = Object.prototype.hasOwnProperty, r = Array.prototype.slice, a = function() {
            var o = {
                isFunction: function(e) {
                    return "[object Function]" === n.call(e);
                },
                isObject: function(e) {
                    return "[object Object]" === n.call(e);
                },
                isArray: function(e) {
                    return "[object Array]" === n.call(e);
                },
                isString: function(e) {
                    return "[object String]" === n.call(e);
                },
                isNumber: function(e) {
                    return "[object Number]" === n.call(e);
                },
                isBoolean: function(e) {
                    return "[object Boolean]" === n.call(e);
                }
            };
            return o.shouldBe = function(n, a) {
                if (!t(n, [ "function", "object", "array", "string", "number", "boolean" ])) throw Error("unknown type: " + n);
                var p = r.call(arguments), i = "is" + n[0].toUpperCase() + n.substring(1);
                if (o[i]) {
                    if (!o[i].call(null, a)) throw Error("argument#" + p.indexOf(a) + " should be " + n + ", " + (void 0 === a ? "undefined" : e(a)) + " given");
                    return !0;
                }
                throw Error("Unregistered function: " + i);
            }, o;
        }(), p = function(e, t) {
            if (a.isObject(e)) for (var n in e) o.call(e, n) && t.call(null, n, e[n]); else if (a.isArray(e)) for (var r = 0, p = e.length; r < p; r++) t.call(null, e[r], r);
        };
        return {
            assert: a,
            inArray: t,
            map: p,
            extendObj: function(e, t) {
                return t = t || {}, a.shouldBe("object", e), a.shouldBe("object", t), p(t, function(t, n) {
                    e[t] = n;
                }), e;
            },
            isEmpty: function(e) {
                return a.isObject(e) ? 0 === Object.getOwnPropertyNames(e).length : a.isArray(e) ? 0 === e.length : !e;
            }
        };
    }(), f = function() {
        function e() {
            var e = t("hotAppDebug"), n = Array.prototype.slice.call(arguments);
            n.unshift("[ZM-DEBUG]: "), e && console && console.log.apply(this, n);
        }
        function t(e) {
            return !!c.inArray(e, l) && f[e];
        }
        function n(e, t) {
            return !!c.inArray(e, l) && (f[e] = t, !0);
        }
        function o() {
            return t("hotAppKey") || "";
        }
        function r() {
            var e = t("hotAppOpenIdCache");
            return wx.getStorageSync(e);
        }
        function a(e) {
            return e = e || {}, "uuid_" + +new Date() + function() {
                for (var e = "", t = 0; t < 8; t++) e += Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
                return e;
            }();
        }
        function p() {
            var e = "fakeOpenId", t = wx.getStorageSync(e);
            if (t) return t;
            var n = a();
            return wx.setStorageSync(e, n), n;
        }
        function i() {
            var e = r();
            return e || p();
        }
        var u = {
            hotAppHost: "https://wxapi.hotapp.cn",
            hotAppUUID: "",
            userInfo: {},
            hotAppVersion: "2.1.0",
            hotAppUUIDCache: "hotAppUUID",
            hotAppEventCache: "hotAppEvent",
            hotAppOpenIdCache: "hotAppOpenId",
            uploadType: 0,
            debugarr: [],
            hotAppDebug: !1
        }, s = require("./hotapp-conf"), f = c.extendObj(u, s);
        c.assert.shouldBe("object", f);
        var l = Object.getOwnPropertyNames(f);
        return {
            getAll: function() {
                return f;
            },
            get: t,
            set: n,
            validKey: function(e) {
                if (c.assert.isString(e)) {
                    if (!t(e)) throw Error("invalid key: " + e);
                } else c.assert.isArray(e) && c.map(e, function(e) {
                    if (!t(e)) throw Error("invalid key: " + e);
                });
                return !0;
            },
            getHotAppKey: o,
            clearData: function() {
                n("hotAppUUID", ""), wx.clearStorageSync();
            },
            getUserInfo: function() {
                return t("userInfo");
            },
            getSystemInfo: function() {
                return wx.getSystemInfoSync() || {};
            },
            setEventUploadType: function(e) {
                return n("hotAppKey", e);
            },
            getHotAppUUID: function() {
                if (!o()) return e("hotappkey is empty"), "";
                var r = t("hotAppUUID");
                if (r) return r;
                var p = t("hotAppUUIDCache");
                return p ? ((r = wx.getStorageSync(p)) || (r = a(), n("hotAppUUID", r), wx.setStorageSync(p, r)), 
                r) : (e("hotAppUUIDCache is empty"), "");
            },
            getHotAppHost: function() {
                return t("hotAppHost") || "";
            },
            getVersion: function() {
                return t("hotAppVersion") || "";
            },
            setDebug: function(e) {
                return e = e || !1, n("hotAppDebug", e);
            },
            isDebug: function() {
                return !!t("hotAppDebug");
            },
            getOpenID: r,
            setOpenID: function(n) {
                var o = t("hotAppOpenIdCache");
                return o ? wx.setStorageSync(o, n) : (e("hotAppOpenIdCache is empty"), !1);
            },
            genKeyFromUser: a,
            getLocalKey: p,
            getFakeOpenID: i,
            getPrefix: function(e) {
                return (e = e || "") + "_" + i();
            },
            genPrimaryKey: function(e) {
                e = e || "";
                var t = Date.parse(new Date());
                return e + "_" + i() + "_" + 1e3 * t;
            },
            replaceOpenIdKey: function(e, t) {
                if (!r()) return "function" == typeof t && t(!1);
                var n = e.replace("_" + p() + "_", "_" + r() + "_");
                return "function" == typeof t && t(n);
            },
            log: e
        };
    }(), l = function() {
        function e(e, t, n) {
            wx.getNetworkType({
                success: function(o) {
                    return "none" != o.networkType && (t.sdkVersion || (t.sdkVersion = f.getVersion()), 
                    void wx.request({
                        url: e,
                        data: t,
                        method: "POST",
                        header: {
                            "content-type": "application/json"
                        },
                        success: function(e) {
                            return "function" == typeof n && n(e.data);
                        },
                        fail: function(e) {
                            return "function" == typeof n && n(!1, e);
                        }
                    }));
                }
            });
        }
        var t = f.log, n = f.getHotAppKey(), o = f.getHotAppHost();
        return {
            http: e,
            get: function(t, r) {
                e(o + "/api/get", {
                    appkey: n,
                    key: t
                }, r);
            },
            post: function(t, r, a) {
                e(o + "/api/post", {
                    appkey: n,
                    key: t,
                    value: r
                }, a);
            },
            del: function(t, r) {
                e(o + "/api/delete", {
                    appkey: n,
                    key: t
                }, r);
            },
            request: function(e) {
                return 0 == e.useProxy ? void wx.request({
                    url: e.url,
                    data: e.data,
                    header: e.header,
                    method: e.method,
                    success: function(t) {
                        e.success(t);
                    },
                    fail: function(t) {
                        e.fail(t);
                    },
                    complete: function(t) {
                        e.complete(t);
                    }
                }) : void (n ? wx.request({
                    url: o + "/proxy/?appkey=" + n + "&url=" + e.url,
                    data: e.data,
                    header: e.header,
                    method: e.method,
                    success: function(t) {
                        e.success(t);
                    },
                    fail: function(t) {
                        e.fail(t);
                    },
                    complete: function(t) {
                        e.complete(t);
                    }
                }) : t("hotappkey is empty"));
            }
        };
    }(), h = f.log, g = c.assert, y = f.getHotAppKey(), d = f.getHotAppHost(), v = App;
    App = function(e) {
        var n = {
            lastShow: 0,
            lastHide: 0,
            lastTTL: 0
        }, o = f.getHotAppHost();
        s(e, "onLaunch", function() {
            h("app launching"), a();
        }), s(e, "onShow", function() {
            h("app showing"), n.lastShow = +new Date();
        }), s(e, "onHide", function() {
            h("app showing"), n.lastHide = +new Date();
            var e = parseInt((n.lastHide - n.lastShow) / 1e3);
            if (e > 0) {
                h("app ttl, ", e);
                var t = o + "/data/wechat/time", r = {
                    time: e,
                    hotAppKey: f.getHotAppKey(),
                    hotAppUUID: f.getHotAppUUID(),
                    openId: f.getOpenID()
                };
                h("send app ttl request ", r), l.http(t, r);
            }
        }), s(e, "onError", function(e) {
            return t(e, f.get("appVer") || "0.1.0");
        }), v(e);
    };
    var A = Page;
    Page = function(e) {
        s(e, "onReady", function() {}), s(e, "onLoad", function() {
            i(this, arguments[0]);
        }), s(e, "onUnload", function() {}), s(e, "onShow", function() {
            h("page show");
        }), s(e, "onHide", function() {
            h("page hide");
        }), "onShareAppMessage" in e && s(e, "onShareAppMessage", function(e) {
            var t = this.__route__;
            return h("page onShareAppMessage: " + t), e = e || {
                title: "ZM-title",
                desc: "ZM-desc",
                path: "/" === t[0] ? t : "/" + t
            }, u(this, e);
        }), A(e);
    }, module.exports = {
        init: a,
        onEvent: function(e, t) {
            t = void 0 === t ? "" : t;
            var n = f.getHotAppKey(), o = f.get("uploadType"), r = f.getHotAppHost();
            if (n) {
                var a = wx.getStorageSync("hotAppEvent") || [], p = {
                    eventId: e,
                    eventValue: t,
                    phoneTime: Date.parse(new Date()) / 1e3
                };
                a.push(p), 0 != o ? wx.setStorageSync("hotAppEvent", a) : wx.request({
                    url: r + "/data/wechat/event",
                    data: {
                        hotAppKey: f.getHotAppKey(),
                        openId: f.getOpenID(),
                        hotAppUUID: f.getHotAppUUID(),
                        eventArray: a,
                        hotAppVersion: f.getVersion()
                    },
                    method: "POST",
                    success: function(e) {
                        h("hotAppEvent", wx.getStorageSync("hotAppEvent") || []);
                        try {
                            wx.removeStorageSync("hotAppEvent");
                        } catch (e) {
                            h("remove hotAppEvent failed", e);
                        }
                    },
                    fail: function() {
                        h("send event fail"), wx.setStorageSync("hotAppEvent", a);
                    }
                });
            } else h("hotappkey is empty");
        },
        onError: t,
        onLoad: i,
        onShare: u,
        setEventUploadType: f.setEventUploadType,
        clearData: f.clearData,
        wxlogin: o,
        getFakeOpenID: f.getFakeOpenID,
        getOpenID: f.getOpenID,
        getPrefix: f.getPrefix,
        genPrimaryKey: f.genPrimaryKey,
        replaceOpenIdKey: f.replaceOpenIdKey,
        searchkey: function(e, t) {
            f.validKey([ "hotAppHost", "hotAppKey" ]);
            var n = f.getHotAppHost() + "/api/searchkey", o = {
                appkey: f.get("hotAppKey")
            };
            c.map(e, function(e, t) {
                o[e] = t;
            }), l.http(n, o, t);
        },
        get: l.get,
        post: l.post,
        del: l.del,
        request: l.request,
        getVersion: f.getVersion,
        setDebug: f.setDebug,
        feedback: function(e, t, n, o) {
            var r = f.getSystemInfo(), a = f.getUserInfo(), p = f.getHotAppHost();
            if (c.isEmpty(a)) return h("userinfo is empty"), "function" == typeof o && o(!1);
            var i = p + "/api/feedback", u = {
                appkey: f.getHotAppKey(),
                content: e,
                openid: f.getOpenID() ? f.getOpenID() : f.getFakeOpenID(),
                content_type: t,
                contract_info: n,
                system_info: r,
                user_info: a
            };
            l.http(i, u, o);
        },
        uploadFeedbackImage: function(e) {
            wx.chooseImage({
                success: function(t) {
                    h(t);
                    var n = t.tempFilePaths;
                    wx.uploadFile({
                        url: d + "/api/feedback/image/upload",
                        filePath: n[0],
                        name: "file",
                        formData: {
                            appkey: y
                        },
                        success: function(t) {
                            var n = t.data;
                            return c.assert.isString(t.data) && (n = JSON.parse(t.data)), 0 == n.ret ? "function" == typeof e && e(n.image_url) : "function" == typeof e && e(!1);
                        },
                        fail: function(t) {
                            return "function" == typeof e && e(!1);
                        }
                    });
                },
                fail: function(t) {
                    return h("choose img failed"), "function" == typeof e && e(!1);
                }
            });
        },
        log: h
    };
}();