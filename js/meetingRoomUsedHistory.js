/**
 * Created by xiong on 2018/4/17.
 */

layui.use(['jquery', 'laydate', 'layer', 'laypage', 'element', 'form'], function () {
    var $ = layui.jquery,
        laydate = layui.laydate,
        layer = layui.layer,
        laypage = layui.laypage,
        element = layui.element,
        form = layui.form;
    $(function () {
        FastClick.attach(document.body);
    });

    //将后台传的时间转化为YYYY-MM-DD HH-MM-SS
    Date.prototype.format = function (format) {
        var args = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(format))
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var i in args) {
            var n = args[i];
            if (new RegExp("(" + i + ")").test(format))
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
        }
        return format;
    };

    // // 用例
    // var test1 = new Date(1523493958000).format("yyyy-MM-dd hh:mm:ss");
    // console.log(test1);



    var vm = new Vue({
        el: '#app',
        data: {
            items: [],
            changeItems: {}
        },
        methods: {
            initData: function () {
                var that = this;
                $.ajax({
                    type: "POST",
                    url: "http://47.94.206.242/meet/admin/findRoomUsingByCondition.action",
                    dataType: "json",
                    success: function (result) {
                        if (result.status == '1') {
                            //分页
                            laypage.render({
                                elem: 'table-pages'
                                , count: result.pageBean.recordNum
                                , limit: 8
                                , layout: ['prev', 'page', 'next', 'count', 'skip']
                                , jump: function (obj, first) {
                                    if (!first) {
                                        $.ajax({
                                            url: 'http://47.94.206.242/meet/admin/findRoomUsingByCondition.action',
                                            dataType: 'json',
                                            data: {
                                                "roomName": $("#roomName").val(),
                                                "roomManager": $("#roomManager").val(),
                                                "visitArriveTime": $("#reservelTime").val().split(' - ')[0],
                                                "visitLeaveTime": $("#reservelTime").val().split(' - ')[1],
                                                "pageNum": obj.curr
                                            },
                                            type: 'GET',
                                            success: function (data) {
                                                console.log(data);
                                                if (data.status == '1') {
                                                    that.items = data.pageBean.dataList;

                                                    //将管理员字段截取出管理员与管理员联系方式
                                                    for(var i = 0; i < that.items.length; i++) {
                                                        var tempManager = {
                                                            ManagerName: "",
                                                            ManagerContact: ""
                                                        };
                                                        // console.log(that.items[i].roomManager);
                                                        if(that.items[i].roomManager !== null) {
                                                            var manager = that.items[i].roomManager.split("#");
                                                            tempManager.ManagerName = manager[0];
                                                            tempManager.ManagerContact = manager[1];
                                                            that.items[i].Manager = tempManager;
                                                            that.items[i].visitArriveTime = new Date(that.items[i].visitArriveTime).format("yyyy-MM-dd hh:mm:ss");
                                                            that.items[i].visitLeaveTime = new Date(that.items[i].visitLeaveTime).format("yyyy-MM-dd hh:mm:ss");
                                                            // console.log(that.items[i].Manager);
                                                        } else {

                                                        }

                                                    }
                                                    $(".loading").css("display", "none");
                                                    $(".tac").css("display", "block");
                                                } else {
                                                    layer.msg("数据加载出错");
                                                }
                                            }
                                        });
                                    } else {
                                        that.items = result.pageBean.dataList;

                                        //将管理员字段截取出管理员与管理员联系方式
                                        for(var i = 0; i < that.items.length; i++) {
                                            console.log(that.items[i].roomManager);
                                            var tempManager = {
                                                ManagerName: "",
                                                ManagerContact: ""
                                            };
                                            if(that.items[i].roomManager !== null) {
                                                var manager = that.items[i].roomManager.split("#");
                                                tempManager.ManagerName = manager[0];
                                                tempManager.ManagerContact = manager[1];
                                                that.items[i].Manager = tempManager;
                                                that.items[i].visitArriveTime = new Date(that.items[i].visitArriveTime).format("yyyy-MM-dd hh:mm:ss");
                                                that.items[i].visitLeaveTime = new Date(that.items[i].visitLeaveTime).format("yyyy-MM-dd hh:mm:ss");
                                                // console.log(that.items[i].Manager);
                                                // console.log(vm.items.Manager);
                                            } else {

                                            }
                                        }
                                    }
                                }
                            });
                        } else {
                            layer.msg("数据加载出错");
                        }
                    }
                })
            }
        }
    });

    //页面初始化请求数据
    setTimeout(function () {
        vm.initData();

        $(".loading").css("display","none");
        $(".tac").css("display","block");
    }, 500);

    //日历组件渲染
    laydate.render({
        elem: '#reservelTime'
        , range : true
        , type: 'date'  // 'month'  'date' 'datetime'
        , done: function (value, date, endDate) {
        }
        ,trigger: 'click'
    });

    //查询操作
    form.on('submit(btnSearch)', function (data) {
        // var formData = data.field;
        // console.log(formData);

        $.ajax({
            data: {
                "roomName": $("#roomName").val(),
                "roomManager": $("#roomManager").val(),
                "visitArriveTime": $("#reservelTime").val().split(' - ')[0],
                "visitLeaveTime": $("#reservelTime").val().split(' - ')[1]
            },
            type: "POST",
            dataType: "JSON",
            url: "http://47.94.206.242/meet/admin/findRoomUsingByCondition.action",
            success: function (result) {
                console.log(result);
                if(result.status == '1') {
                    laypage.render({
                        elem: 'table-pages'
                        , count: result.pageBean.recordNum
                        , limit: 8
                        , layout: ['prev', 'page', 'next', 'count', 'skip']
                        , jump: function (obj, first) {
                            if (!first) {
                                $.ajax({
                                    url: 'http://47.94.206.242/meet/admin/findRoomUsingByCondition.action',
                                    dataType: 'json',
                                    data: {
                                        "roomName": $("#roomName").val(),
                                        "roomManager": $("#roomManager").val(),
                                        "visitArriveTime": $("#reservelTime").val().split(' - ')[0],
                                        "visitLeaveTime": $("#reservelTime").val().split(' - ')[1],
                                        "pageNum": obj.curr
                                    },
                                    type: 'POST',
                                    success: function (data) {
                                        console.log(data);
                                        if (data.status == '1') {
                                            vm.items = data.pageBean.dataList;

                                            //将管理员字段截取出管理员与管理员联系方式
                                            for(var i = 0; i < vm.items.length; i++) {
                                                // console.log(that.items[i].roomManager);
                                                if(vm.items[i].roomManager !== null) {
                                                    var tempManager = {
                                                        ManagerName: "",
                                                        ManagerContact: ""
                                                    };
                                                    var manager = vm.items[i].roomManager.split("#");
                                                    tempManager.ManagerName = manager[0];
                                                    tempManager.ManagerContact = manager[1];
                                                    vm.items[i].Manager = tempManager;
                                                    vm.items[i].visitArriveTime = new Date(vm.items[i].visitArriveTime).format("yyyy-MM-dd hh:mm:ss");
                                                    vm.items[i].visitLeaveTime = new Date(vm.items[i].visitLeaveTime).format("yyyy-MM-dd hh:mm:ss");
                                                    // console.log(that.items[i].Manager);
                                                } else {

                                                }
                                            }
                                            $(".loading").css("display", "none");
                                            $(".tac").css("display", "block");
                                        } else {
                                            layer.msg("数据加载出错");
                                        }
                                    }
                                });
                            } else {
                                vm.items = result.pageBean.dataList;

                                //将管理员字段截取出管理员与管理员联系方式
                                for(var i = 0; i < vm.items.length; i++) {
                                    var tempManager = {
                                        ManagerName: "",
                                        ManagerContact: ""
                                    };
                                    // console.log(that.items[i].roomManager);
                                    if(vm.items[i].roomManager !== null) {
                                        var manager = vm.items[i].roomManager.split("#");
                                        tempManager.ManagerName = manager[0];
                                        tempManager.ManagerContact = manager[1];
                                        vm.items[i].Manager = tempManager;
                                        vm.items[i].visitArriveTime = new Date(vm.items[i].visitArriveTime).format("yyyy-MM-dd hh:mm:ss");
                                        vm.items[i].visitLeaveTime = new Date(vm.items[i].visitLeaveTime).format("yyyy-MM-dd hh:mm:ss");
                                        // console.log(that.items[i].Manager);
                                    } else {

                                    }
                                }
                            }
                        }
                    });
                }else {
                    layer.msg("数据加载出错");
                }
            }
        });
    });
});
