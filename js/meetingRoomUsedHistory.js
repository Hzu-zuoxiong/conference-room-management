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
                                                            that.items[i].visitArriveTime = dateFormate(that.items[i].visitArriveTime, "yyyy-MM-dd hh:mm:ss");
                                                            that.items[i].visitLeaveTime = dateFormate(that.items[i].visitLeaveTime, "yyyy-MM-dd hh:mm:ss");
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
                                                that.items[i].visitArriveTime = dateFormate(that.items[i].visitArriveTime, "yyyy-MM-dd hh:mm:ss");
                                                that.items[i].visitLeaveTime = dateFormate(that.items[i].visitLeaveTime, "yyyy-MM-dd hh:mm:ss");
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
            },
            exportExcel() {
                $.ajax({
                    data: {
                        pageNum: -1,
                        "roomName": $("#roomName").val(),
                        "roomManager": $("#roomManager").val(),
                        "visitArriveTime": $("#reservelTime").val().split(' - ')[0],
                        "visitLeaveTime": $("#reservelTime").val().split(' - ')[1]
                    },
                    url: "http://47.94.206.242/meet/admin/findRoomUsingByCondition.action",
                    dataType: 'JSON',
                    type: 'POST',
                    success(data) {
                        this.excelJson = data.pageBean.dataList;
                        let fileName = 'meetingRoomUsedHistory';
                        let headers = '会议室名称,管理员,管理员联系方式,开始时间,结束时间,';
                        let json = [];
                        for (let i in this.excelJson) {
                            let temp = {};
                            let roomManager = this.excelJson[i].roomManager.split("#");
                            temp['会议室名称'] = this.excelJson[i].guestName;
                            temp['管理员'] = roomManager[0];
                            temp['管理员联系方式'] = roomManager[1];
                            temp['开始时间'] = dateFormate(this.excelJson[i].visitArriveTime, "yyyy-MM-dd hh:mm:ss");
                            temp['结束时间'] = dateFormate(this.excelJson[i].visitLeaveTime, "yyyy-MM-dd hh:mm:ss");
                            json.push(temp);
                        }
                        json = JSON.stringify(json);
                        Excelpost('http://47.94.206.242/meet/admin/getExcel.action', {fileName: fileName, headers: headers, json: json});
                    }
                });
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
                                                    vm.items[i].visitArriveTime = dateFormate(vm.items[i].visitArriveTime, "yyyy-MM-dd hh:mm:ss");
                                                    vm.items[i].visitLeaveTime = dateFormate(vm.items[i].visitLeaveTime, "yyyy-MM-dd hh:mm:ss");
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
                                        vm.items[i].visitArriveTime = dateFormate(vm.items[i].visitArriveTime, "yyyy-MM-dd hh:mm:ss");
                                        vm.items[i].visitLeaveTime = dateFormate(vm.items[i].visitLeaveTime, "yyyy-MM-dd hh:mm:ss");
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
