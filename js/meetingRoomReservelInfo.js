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

    var vm = new Vue({
        el: '#app',
        data: {
            items: [],
            changeItems: {},
            parameter: {
                name: [],
                value: []
            }
        },
        methods: {
            initData: function () {
                // this.getparameter();
                console.log(this.parameter);
                var that = this;
                $.ajax({
                    type: "POST",
                    url: "http://47.94.206.242/meet/admin/findRoomAppointByCondition.action",
                    dataType: "json",
                    success: function (result) {
                        if (result.status === 1) {
                            //分页
                            laypage.render({
                                elem: 'table-pages'
                                , count: result.pageBean.recordNum
                                , limit: 8
                                , layout: ['prev', 'page', 'next', 'count', 'skip']
                                , jump: function (obj, first) {
                                    if (!first) {
                                        $.ajax({
                                            url: 'http://47.94.206.242/meet/admin/findRoomAppointByCondition.action',
                                            dataType: 'json',
                                            data: {
                                                "pageNum": obj.curr
                                            },
                                            type: 'GET',
                                            success: function (data) {
                                                console.log(obj.curr);
                                                console.log(data);
                                                if (data.status === 1) {
                                                    that.items = data.pageBean.dataList;
                                                    var tempManager = {
                                                        ManagerName: "",
                                                        ManagerContact: ""
                                                    };
                                                    //将管理员字段截取出管理员与管理员联系方式
                                                    for(var i = 0; i < that.items.length; i++) {
                                                        // console.log(that.items[i].roomManager);
                                                        if(that.items[i].roomManager !== null) {
                                                            var manager = that.items[i].room.roomManager.split("#");
                                                            tempManager.ManagerName = manager[0];
                                                            tempManager.ManagerContact = manager[1];
                                                            that.items[i].Manager = tempManager;
                                                            that.items[i].appointStart = dateFormate(that.items[i].appointStart, "yyyy-MM-dd hh:mm:ss");
                                                            that.items[i].appointEnd = dateFormate(that.items[i].appointEnd, "yyyy-MM-dd hh:mm:ss");
                                                            // console.log(that.items[i].Manager);
                                                        } else {

                                                        }
                                                    }
                                                    $(".loading").css("display", "none");
                                                    $(".tac").css("display", "block");
                                                } else {
                                                    layer.msg("数据加载出错");
                                                }
                                            },
                                            error: function (XMLHttpRequest, textStatus) {
                                                console.log(textStatus);
                                            }
                                        });
                                    } else {
                                        that.items = result.pageBean.dataList;
                                        var tempManager = {
                                            ManagerName: "",
                                            ManagerContact: ""
                                        };
                                        //将管理员字段截取出管理员与管理员联系方式
                                        for(var i = 0; i < that.items.length; i++) {
                                            // console.log(that.items[i].roomManager);
                                            if(that.items[i].roomManager !== null) {
                                                var manager = that.items[i].room.roomManager.split("#");
                                                tempManager.ManagerName = manager[0];
                                                tempManager.ManagerContact = manager[1];
                                                that.items[i].Manager = tempManager;
                                                that.items[i].appointStart = dateFormate(that.items[i].appointStart, "yyyy-MM-dd hh:mm:ss");
                                                that.items[i].appointEnd = dateFormate(that.items[i].appointEnd, "yyyy-MM-dd hh:mm:ss");
                                                // console.log(that.items[i].Manager);
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
                });
            },
            getparameter: function () {
                // 监听获取URL的属性
                var name, value;
                var str = location.href; //取得整个地址栏
                var num = str.indexOf("?");
                str = str.substr(num+1);

                var arr = str.split("&"); //各个参数放到数组里
                for(var i = 0; i < arr.length; i++){
                    num = arr[i].indexOf("=");
                    if(num>0){
                        this.parameter.name.push(decodeURIComponent(arr[i].substring(0,num)));
                        this.parameter.value.push(decodeURIComponent(arr[i].substr(num+1)));
                    }
                }

            },
            searchFromUrl: function () {
                $('#meetingRoomInfo').css("backgroundColor","#282b33");
                $('#meetingRoomInfo').css("color","#bfc0c2");
                $('#meetingRoomReservelInfo').css("backgroundColor","#009688");
                $('#meetingRoomReservelInfo').css("color","#fff");
                var that = this;
                $.ajax({
                    type: "GET",
                    url: "http://47.94.206.242/meet/admin/findRoomAppointByCondition.action",
                    dataType: "json",
                    data: {
                        "room.roomId": that.parameter.value[1]
                    },
                    success: function (result) {
                        // console.log("searchFromUrl");
                        // console.log(result);
                        if (result.status === 1) {
                            //分页
                            laypage.render({
                                elem: 'table-pages'
                                , count: result.pageBean.recordNum
                                , limit: 8
                                , layout: ['prev', 'page', 'next', 'count', 'skip']
                                , jump: function (obj, first) {
                                    if (!first) {
                                        $.ajax({
                                            url: 'http://47.94.206.242/meet/admin/findRoomAppointByCondition.action',
                                            dataType: 'json',
                                            data: {
                                                "room.roomId": that.parameter.value[1],
                                                "pageNum": obj.curr
                                            },
                                            type: 'GET',
                                            success: function (data) {
                                                // console.log(data);
                                                if (data.status === 1) {
                                                    that.items = data.pageBean.dataList;
                                                    var tempManager = {
                                                        ManagerName: "",
                                                        ManagerContact: ""
                                                    };
                                                    //将管理员字段截取出管理员与管理员联系方式
                                                    for(var i = 0; i < that.items.length; i++) {
                                                        // console.log(that.items[i].roomManager);
                                                        if(that.items[i].roomManager !== null) {
                                                            var manager = that.items[i].room.roomManager.split("#");
                                                            tempManager.ManagerName = manager[0];
                                                            tempManager.ManagerContact = manager[1];
                                                            that.items[i].Manager = tempManager;
                                                            that.items[i].appointStart = dateFormate(that.items[i].appointStart, "yyyy-MM-dd hh:mm:ss");
                                                            that.items[i].appointEnd = dateFormate(that.items[i].appointEnd, "yyyy-MM-dd hh:mm:ss");
                                                            // console.log(that.items[i].Manager);
                                                        } else {

                                                        }

                                                    }
                                                    $(".loading").css("display", "none");
                                                    $(".tac").css("display", "block");
                                                } else {
                                                    layer.msg("数据加载出错");
                                                }
                                            },
                                            error: function (XMLHttpRequest, textStatus) {
                                                console.log(textStatus);
                                            }
                                        });
                                    } else {
                                        that.items = result.pageBean.dataList;
                                        var tempManager = {
                                            ManagerName: "",
                                            ManagerContact: ""
                                        };
                                        //将管理员字段截取出管理员与管理员联系方式
                                        for(var i = 0; i < that.items.length; i++) {
                                            // console.log(that.items[i].roomManager);
                                            if(that.items[i].roomManager !== null) {
                                                var manager = that.items[i].room.roomManager.split("#");
                                                tempManager.ManagerName = manager[0];
                                                tempManager.ManagerContact = manager[1];
                                                that.items[i].Manager = tempManager;
                                                that.items[i].appointStart = dateFormate(that.items[i].appointStart, "yyyy-MM-dd hh:mm:ss");
                                                that.items[i].appointEnd = dateFormate(that.items[i].appointEnd, "yyyy-MM-dd hh:mm:ss");
                                                // console.log(that.items[i].Manager);
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
                });
            }
        }
    });

    //页面初始化请求数据
    setTimeout(function () {
        vm.getparameter();
        console.log(vm.parameter);
        //如果从信息页跳转过来，则进行roomId查询，如果不是则进行页面初始化
        if(vm.parameter !== undefined) {
            vm.searchFromUrl();
        } else {
            vm.initData();
        }
        // vm.initData();
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
        event.stopPropagation();
        $.ajax({
            data: {
                "room.roomName": $("#roomName").val(),
                "guestName": $("#guestName").val(),
                "useRoomBeginTime": $("#reservelTime").val().split(' - ')[0],
                "useRoomEndTime": $("#reservelTime").val().split(' - ')[1]
            },
            type: "POST",
            dataType: "JSON",
            url: "http://47.94.206.242/meet/admin/findRoomAppointByCondition.action",
            success: function (result) {
                console.log($("#roomName").val());
                console.log($("#reservelTime").val().split(' - ')[0]);
                console.log($("#reservelTime").val().split(' - ')[1]);
                console.log("查询成功之后返回的总数据：\n" + result);
                if(result.status == '1') {
                    laypage.render({
                        elem: 'table-pages'
                        , count: result.pageBean.recordNum
                        , limit: 8
                        , layout: ['prev', 'page', 'next', 'count', 'skip']
                        , jump: function (obj, first) {
                            if (!first) {
                                $.ajax({
                                    url: 'http://47.94.206.242/meet/admin/findRoomAppointByCondition.action',
                                    dataType: 'json',
                                    data: {
                                        "roomName": $("#roomName").val(),
                                        "guestName": $("#guestName").val(),
                                        "useRoomBeginTime": $("#reservelTime").val().split(' - ')[0],
                                        "useRoomEndTime": $("#reservelTime").val().split(' - ')[1],
                                        "pageNum": obj.curr
                                    },
                                    type: 'POST',
                                    success: function (data) {
                                        console.log(data);
                                        if (data.status === 1) {
                                            vm.items = data.pageBean.dataList;
                                            var tempManager = {
                                                ManagerName: "",
                                                ManagerContact: ""
                                            };
                                            //将管理员字段截取出管理员与管理员联系方式
                                            for(var i = 0; i < vm.items.length; i++) {
                                                // console.log(that.items[i].roomManager);
                                                if(vm.items[i].roomManager !== null) {
                                                    var manager = vm.items[i].room.roomManager.split("#");
                                                    tempManager.ManagerName = manager[0];
                                                    tempManager.ManagerContact = manager[1];
                                                    vm.items[i].Manager = tempManager;
                                                    vm.items[i].appointStart = dateFormate(vm.items[i].appointStart, "yyyy-MM-dd hh:mm:ss");
                                                    vm.items[i].appointEnd = dateFormate(vm.items[i].appointEnd, "yyyy-MM-dd hh:mm:ss");
                                                    // console.log(that.items[i].Manager);
                                                } else {

                                                }

                                            }
                                            $(".loading").css("display", "none");
                                            $(".tac").css("display", "block");
                                        } else {
                                            layer.msg("数据加载出错");
                                        }
                                    },
                                    error: function (XMLHttpRequest, textStatus) {
                                        console.log(textStatus);
                                    }
                                });
                            } else {
                                vm.items = result.pageBean.dataList;
                                var tempManager = {
                                    ManagerName: "",
                                    ManagerContact: ""
                                };
                                //将管理员字段截取出管理员与管理员联系方式
                                for(var i = 0; i < vm.items.length; i++) {
                                    // console.log(that.items[i].roomManager);
                                    if(vm.items[i].roomManager !== null) {
                                        var manager = vm.items[i].room.roomManager.split("#");
                                        tempManager.ManagerName = manager[0];
                                        tempManager.ManagerContact = manager[1];
                                        vm.items[i].Manager = tempManager;
                                        vm.items[i].appointStart = dateFormate(vm.items[i].appointStart, "yyyy-MM-dd hh:mm:ss");
                                        vm.items[i].appointEnd = dateFormate(vm.items[i].appointEnd, "yyyy-MM-dd hh:mm:ss");
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