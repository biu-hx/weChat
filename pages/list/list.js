var a = require("../../utils/util.js"), t = require("../../utils/hotapp.js");

Page({
    data: {
        loading: !1,
        dataList: "",
        date: ""
    },
    onLoad: function(e) {
        var i = this;
        t.request({
            url: "http://www.smartapply.cn/cn/wx-api/school-record",
            header: {
                "content-type": "application/json"
            },
            data: {
                uid: e.uid
            },
            success: function(t) {
                var e = t.data.data;
                if (e.length > 0) {
                    var n = e.map(function(t) {
                        return a.formatTime(new Date(1e3 * t.createTime));
                    });
                    i.setData({
                        dataList: e,
                        loading: !0,
                        date: n
                    });
                } else i.setData({
                    loading: !0
                }), wx.showModal({
                    title: "提示",
                    content: "当前暂无选校报告",
                    showCancel: !1,
                    success: function(a) {
                        a.confirm && wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            }
        });
    }
});