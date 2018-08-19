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
            items: {},
            changeItems: {},
            excelJson: [],
            Manager: {
                ManagerName: "",
                ManagerContact: ""
            }
        },
        methods: {
            initData: function () {
                console.log("initData");
                var that = this;
                $.ajax({
                    type: "POST",
                    url: "http://47.94.206.242/meet/admin/findRoomByCondition.action",
                    dataType: "json",
                    success: function (result) {
                        if (result.status == '1') {
                            laypage.render({
                                elem: 'table-pages'
                                , count: result.pageBean.recordNum
                                , limit: 8
                                , layout: ['prev', 'page', 'next', 'count', 'skip']
                                , jump: function (obj, first) {
                                    if (!first) {
                                        $.ajax({
                                            url: "http://47.94.206.242/meet/admin/findRoomByCondition.action",
                                            dataType: 'json',
                                            data: {
                                                "roomName": $("#roomName").val(),
                                                "roomAddress": $("#roomAddress").val(),
                                                "roomPeople": $("#roomPeople").val(),
                                                "roomManager": $("#roomManager").val(),
                                                "pageNum": obj.curr
                                            },
                                            type: 'POST',
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
                                                            console.log(that.items[i].Manager);
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
                                        console.log(that.items.length);

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
                                                console.log(that.items[i].Manager);
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
            // 弹出修改表单
            popUp: function (roomId, popUpWindows) {
                console.log("popUP");
                if (document.body.clientWidth < 993) {
                    window.location.href = "meetingRoomChange.html";
                } else {
                    popUpWindows(roomId);
                    $('.meetingRoomMasked').fadeIn("slow");
                    $('.meetingRoom-form').fadeIn("slow ");
                    // $('.meetingRoomMasked').css("display", "block");
                    // $('.meetingRoom-form').css("display", "block");
                }
            },
            // 弹窗后表单显示数据
            popUpWindows: function (roomId) {
                console.log("popUpWindows");
                var that = this;
                console.log(roomId);
                $.ajax({
                    data: {
                        "roomId": roomId
                    },
                    type: "GET",
                    dataType: "JSON",
                    url: "http://47.94.206.242/meet/admin/updateRoomUI.action",
                    success: function (result) {
                        console.log("success");
                        if (result.status == "1") {
                            that.changeItems = result.room;
                            var manager = result.room.roomManager.split("#");
                            that.Manager.ManagerName = manager[0];
                            that.Manager.ManagerContact = manager[1];
                            console.log(that.changeItems);
                        } else {
           
                        }
                    }
                });
            },
            //关闭弹窗
            closeWindow: function () {
                console.log("closeWindow");
                $('.meetingRoom-form').fadeOut();
                $('.meetingRoomMasked').fadeOut();
            },
            //提交修改表单
            popUpSubmit: function () {
                console.log("popUpSubmit");
                var that = this;
                form.on('submit(btnAlter)', function (data) {
           
                    // var formData = data.field;
                    // console.log(formData);
                    // console.log(that.changeItems.roomId);
                    $.ajax({
                        data: {
                            "roomId": that.changeItems.roomId,
                            "roomPassword" : that.changeItems.roomPassword,
                            "roomName": $('#meetingRoom-form-roomName').val(),
                            "roomAddress": $('#meetingRoom-form-roomAddress').val(),
                            "roomArea": $('#meetingRoom-form-roomArea').val(),
                            "roomPeople": $('#meetingRoom-form-roomPeople').val(),
                            "roomManager": $('#meetingRoom-form-roomManager').val() + '#' + $('#meetingRoom-form-roomManagerContact').val()
                        },
                        type: "POST",
                        dataType: "JSON",
                        url: "http://47.94.206.242/meet/admin/updateRoom.action",
                        success: function (result) {
                            if (result.status) {
                                layer.msg('修改成功！');
                            } else {

                            }
                        }
                    });
                    // return false;
                });
            },
            // 删除会议室信息
            delMeetingRoom: function (roomId) {
                console.log("delMeetingRoom");
                console.log(roomId);
                layer.confirm('您确认要删除该会议室信息吗？', {title: '删除操作'}, function (index) {
                    $.ajax({
                        data: {
                            roomId: roomId
                        },
                        type: "POST",
                        dataType: "JSON",
                        url: "http://47.94.206.242/meet/admin/deleteRoomByRoomId.action",
                        success: function (result) {
                            console.log(roomId);
                            if (result.status == "1") {
                                layer.close(index);
                                layer.msg('删除成功！');
                                window.location.reload();
                            } else {
           
                            }
                        }
                    });
                });
            },
            // 导出excel
            exportExcel() {
                $.ajax({
                    data: {
                        pageNum: -1,
                        "roomName": $("#roomName").val(),
                        "roomAddress": $("#roomAddress").val(),
                        "roomPeople": $("#roomPeople").val(),
                        "roomManager": $("#roomManager").val()
                    },
                    url: "http://47.94.206.242/meet/admin/findRoomByCondition.action",
                    dataType: 'JSON',
                    type: 'POST',
                    success(data) {
                        this.excelJson = data.pageBean.dataList;
                        let fileName = 'meetingRoomInfo';
                        let headers = '会议室名称,容纳人数,占地面积,会议室管理员,管理员联系方式,';
                        let json = [];
                        for (let i in this.excelJson) {
                            let temp = {};
                            let roomManager = this.excelJson[i].roomManager.split("#");
                            temp['会议室名称'] = this.excelJson[i].roomName;
                            temp['容纳人数'] = this.excelJson[i].roomPeople;
                            temp['占地面积'] = this.excelJson[i].roomArea;
                            temp['会议室管理员'] = roomManager[0];
                            temp['管理员联系方式'] = roomManager[1];
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

    //查询操作
    form.on('submit(btnSearch)', function (data) {
        // var formData = data.field;
        // console.log(formData);

        $.ajax({
            data: {
                "roomName": $("#roomName").val(),
                // "roomAddress": $("#roomAddress").val(),
                "roomPeople": $("#roomPeople").val(),
                "roomManager": $("#roomManager").val()
            },
            type: "POST",
            dataType: "JSON",
            url: "http://47.94.206.242/meet/admin/findRoomByCondition.action",
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
                                    url: 'http://47.94.206.242/meet/admin/findRoomByCondition.action',
                                    dataType: 'json',
                                    data: {
                                        "roomName": $("#roomName").val(),
                                        "roomAddress": $("#roomAddress").val(),
                                        "roomPeople": $("#roomPeople").val(),
                                        "roomManager": $("#roomManager").val(),
                                        "pageNum": obj.curr
                                    },
                                    type: 'POST',
                                    success: function (data) {
                                        console.log(data);
                                        if (data.status == '1') {
                                            vm.items = data.pageBean.dataList;
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
                                                    console.log(vm.items[i].Manager);
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
                                        console.log(vm.items[i].Manager);
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