Page({
    data: {},
    hasUid: function(i) {
        var t = wx.getStorageSync("uid");
        t ? wx.navigateTo({
            url: "../" + i + "/" + i + "?uid=" + t
        }) : wx.navigateTo({
            url: "../login/login"
        });
    },
    enterPage: function() {
        this.hasUid("step_1");
    },
    detail: function() {
        this.hasUid("list");
    }
});