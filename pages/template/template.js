function n(n, o, e) {
    return o in n ? Object.defineProperty(n, o, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : n[o] = e, n;
}

var o;

Page((o = {
    data: {}
}, n(o, "data", {}), n(o, "onLoad", function(n) {}), n(o, "onReady", function() {}), 
n(o, "onShow", function() {}), n(o, "onHide", function() {}), n(o, "onUnload", function() {}), 
n(o, "onPullDownRefresh", function() {}), n(o, "onReachBottom", function() {}), 
n(o, "onShareAppMessage", function() {}), o));