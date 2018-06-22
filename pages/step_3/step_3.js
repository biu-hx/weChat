Page({
    data: {
        item: {
            step: 3
        },
        array: [ "请选择", "国内四大", "500强", "外企", "国企", "私企" ],
        index: 0
    },
    reBack: function(e) {
        wx.navigateBack({
            delta: 1
        });
    },
    nextPage: function(e) {
        var t = e.detail.value, a = t.wrok, r = t.live, i = t.project, c = t.studyTour, n = t.active, o = t.price;
        wx.setStorageSync("wrok", a), wx.setStorageSync("live", r), wx.setStorageSync("project", i), 
        wx.setStorageSync("studyTour", c), wx.setStorageSync("active", n), wx.setStorageSync("price", o), 
        wx.navigateTo({
            url: "../step_4/step_4"
        });
    },
    bindPickerChange: function(e) {
        this.setData({
            index: e.detail.value
        });
    }
});