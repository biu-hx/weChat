Page({
    naviget: function() {
        wx.getStorageSync("uid") ? wx.redirectTo({
            url: "../index/index"
        }) : wx.navigateTo({
            url: "../login/login"
        });
    },
    onShareAppMessage: function(e) {
        return {
            title: "雷哥选校测评",
            path: "pages/star/star",
            success: function(e) {},
            fail: function(e) {}
        };
    }
});