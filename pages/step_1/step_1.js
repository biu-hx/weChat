Page({
    data: {
        item: {
            step: 1
        }
    },
    nextPage: function(t) {
        var e = t.detail.value, a = e.gpaVal, o = e.gmatVal, l = e.toeflVal;
        if (isNaN(a) || isNaN(o) || isNaN(l)) return wx.showModal({
            title: "提示",
            content: "请输入正确的科目分数！",
            showCancel: !1
        }), !1;
        if (o) {
            if (o < 200) return wx.showModal({
                title: "提示",
                content: "GRE数值填写范围为200-340，GMAT数值填写范围为400-800",
                showCancel: !1
            }), !1;
            if (o > 340 && o < 400) return wx.showModal({
                title: "提示",
                content: "GRE数值填写范围为200-340，GMAT数值填写范围为400-800",
                showCancel: !1
            }), !1;
            if (o > 800) return wx.showModal({
                title: "提示",
                content: "GRE数值填写范围为200-340，GMAT数值填写范围为400-800",
                showCancel: !1
            }), !1;
        }
        if (a && l) {
            if (a < 2.5 || a > 100 || a > 4 && a < 50) return wx.showModal({
                title: "提示",
                content: "GPA数值填写范围为2.5-4.0或者50-100！",
                showCancel: !1
            }), !1;
            if (l < 5) return wx.showModal({
                title: "提示",
                content: "TOEFL数值填写范围为60-120！,IELTS数值填写范围为5.0-9.0",
                showCancel: !1
            }), !1;
            if (l > 120) return wx.showModal({
                title: "提示",
                content: "TOEFL数值填写范围为60-120！,IELTS数值填写范围为5.0-9.0",
                showCancel: !1
            }), !1;
            if (l < 60 && l > 9) return wx.showModal({
                title: "提示",
                content: "TOEFL数值填写范围为60-120！,IELTS数值填写范围为5.0-9.0",
                showCancel: !1
            }), !1;
            wx.setStorageSync("gpaVal", e.gpaVal), wx.setStorageSync("gmatVal", e.gmatVal), 
            wx.setStorageSync("toeflVal", e.toeflVal), wx.navigateTo({
                url: "../step_2/step_2"
            });
        } else wx.showModal({
            title: "提示",
            content: "*必填项不能为空",
            showCancel: !1
        });
    }
});