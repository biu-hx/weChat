var t = require("../../utils/hotapp.js");

Page({
    data: {
        item: {
            step: 2
        },
        edLv: [ "请选择", "博士", "硕士", "本科", "专科", "高中", "初中" ],
        enVal: "",
        indexLv: 0,
        indexSc: 0,
        schoolItem: [ "请选择", "清北复交浙大", "985", "211", "非211本科", "专科" ],
        multiArray: [],
        multiIndex: [ 0, 0 ],
        curData: "",
        major_A: "",
        leftId: "",
        leftIdArry: "",
        rightId: "",
        rightIdArry: ""
    },
    reBack: function(t) {
        wx.navigateBack({
            delta: 1
        });
    },
    nextPage: function(t) {
        var a = t.detail.value, e = a.eduLv, i = this.data.edLv[e], n = a.schoolLv, r = a.schoolName, o = this.data.leftId, l = this.data.rightId, d = a.majorName[0], c = a.majorName[1], s = this.data.curData[d].child[c].name;
        return 0 == o ? (wx.showModal({
            title: "提示",
            content: "请选择专业",
            showCancel: !1
        }), !1) : 0 == e ? (wx.showModal({
            title: "提示",
            content: "请选择目前学历",
            showCancel: !1
        }), !1) : 0 == n ? (wx.showModal({
            title: "提示",
            content: "请选择就读/毕业院校",
            showCancel: !1
        }), !1) : r ? (wx.setStorageSync("education", i), wx.setStorageSync("school", n), 
        wx.setStorageSync("schoolName", r), wx.setStorageSync("major_name1", s), wx.setStorageSync("major_top", o), 
        wx.setStorageSync("school_major", l), void wx.navigateTo({
            url: "../step_3/step_3"
        })) : (wx.showModal({
            title: "提示",
            content: "请详细填写学校名称",
            showCancel: !1
        }), !1);
    },
    onLoad: function() {
        var a = this;
        t.request({
            url: "http://schools.smartapply.cn/cn/wx-api/major-country",
            header: {
                "content-type": "application/json"
            },
            success: function(t) {
                var e = t.data.major, i = e.map(function(t) {
                    return t.name;
                }), n = e.map(function(t) {
                    return t.id;
                }), r = e[0].child.map(function(t) {
                    return t.id;
                });
                a.setData({
                    multiArray: [ i, [ "请选择" ] ],
                    major_A: i,
                    curData: e,
                    leftIdArry: n,
                    leftId: n[0],
                    rightId: r[0]
                });
            }
        });
    },
    test: function(t) {
        var a = this.data.curData[t].child, e = this.data.major_A, i = a.map(function(t) {
            return t.name;
        }), n = a.map(function(t) {
            return t.id;
        });
        this.setData({
            multiArray: [ e, i ],
            rightIdArry: n
        });
    },
    bindPickerChange_a: function(t) {
        this.setData({
            indexLv: t.detail.value
        });
    },
    bindPickerChange_b: function(t) {
        this.setData({
            indexSc: t.detail.value
        });
    },
    bindMultiPickerChange: function(t) {
        var a = t.detail.value;
        this.setData({
            multiIndex: t.detail.value,
            leftId: this.data.leftIdArry[a[0]],
            rightId: this.data.rightIdArry[a[1]]
        });
    },
    bindMultiPickerColumnChange: function(t) {
        var a = {
            multiArray: this.data.multiArray,
            multiIndex: this.data.multiIndex
        };
        switch (a.multiIndex[t.detail.column] = t.detail.value, t.detail.column) {
          case 0:
            this.test(t.detail.value), a.multiIndex[1] = 0;
        }
        this.setData({
            multiIndex: a.multiIndex
        });
    }
});