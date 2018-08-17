/**
 * Created by nole on 2018/4/21.
 */
layui.use(['jquery', 'form', 'laydate', 'layer', 'laypage', 'element'], function () {
    var $ = layui.jquery,
        laydate = layui.laydate,
        layer = layui.layer,
        laypage = layui.laypage,
        element = layui.element,
        form = layui.form;

    //绑定表
    var tableResult = window.document.getElementById("tableResult");

    $(function () {
        FastClick.attach(document.body);
    });

    //渲染select
    $.get("http://47.94.206.242/meet/admin/findAllTag.action", function (data) {
        if (data.status == '1') {
            for (var i = 0; i < data.roomTagList.length; i++) {
                $("#select-type").append("<option value=" + data.roomTagList[i].tagId + ">" + data.roomTagList[i].tagName + "</option>");
            }
            form.render('select');
        }
    });

    var vm = new Vue({
        el: '#app',
        data: {
            items: {}
        },
        methods: {
            initData(){
                //声明name和id(guest)
                var guestName = getQueryString('guestName');
                var guestId = getQueryString('guestId');
                var that = this;

                if (guestName && guestId) {
                    // url搜索
                    $("#guestName").val(guestName);
                    //拿Id进行搜索
                    this.searchFromUrl();

                } else {
                    // 页面初始化
                    $.ajax({
                        url: "http://47.94.206.242/meet/admin/findAppointByCondition.action",
                        dataType: 'JSON',
                        type: 'GET',
                        success: function (data) {
                            console.log('init');
                            if (data.status == '1') {
                                //分页渲染
                                laypage.render({
                                    elem: 'table-pages'
                                    , count: data.pageBean.recordNum,
                                    limit: 8
                                    , layout: ['prev', 'page', 'next', 'count', 'skip']
                                    , jump: function (obj, first) {
                                        if (!first) {
                                            $.ajax({
                                                url: 'http://47.94.206.242/meet/admin/findAppointByCondition.action',//切分页的接口
                                                dataType: 'json',
                                                data: {
                                                    "guestName": $("#guestName").val(),
                                                    "tagName": $("select-type").val(),
                                                    "beginTime": $("#reserveltime").val().split(" - ")[0],
                                                    "endTime": $("#reserveltime").val().split(" - ")[1],
                                                    "useRoomBeginTime": $("#usetime").val().split(" - ")[0],
                                                    "useRoomEndTime": $("#usetime").val().split(" - ")[1],
                                                    "pageNum": obj.curr
                                                },
                                                type: 'POST',
                                                success: function (data) {
                                                    if (data.status == '1') {
                                                        that.items = data.pageBean.dataList;
                                                        for (let item of that.items) {
                                                            // 修改时间
                                                            item.appointStart = dateFormate(item.appointCreateDate, "yyyy-MM-dd hh:mm:ss");
                                                            item.appointEnd = dateFormate(item.appointEnd, "yyyy-MM-dd hh:mm:ss");
                                                            item.appointCreateDate = dateFormate(item.appointCreateDate, "yyyy-MM-dd hh:mm:ss");
                                                        }
                                                        $(".loading").css("display", "none");
                                                        $(".tac").css("display", "block");
                                                    }
                                                },
                                            })
                                        }
                                    }
                                });
                                that.items = data.pageBean.dataList;
                                console.log(that.items);
                                for (let item of that.items) {
                                    //修改时间
                                    item.appointStart = dateFormate(item.appointStart, "yyyy-MM-dd hh:mm:ss");
                                    item.appointEnd = dateFormate(item.appointEnd, "yyyy-MM-dd hh:mm:ss");
                                    item.appointCreateDate = dateFormate(item.appointCreateDate, "yyyy-MM-dd hh:mm:ss");
                                }
                                $(".loading").css("display", "none");
                                $(".tac").css("display", "block");
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            console.log('error');
                            console.log(textStatus);
                        }
                    })
                }
            },
            searchFromUrl() {
                $('#guestInfo').css("backgroundColor", "#282b33");
                $('#guestInfo').css("color", "#bfc0c2");
                $('#guestReservelInfo').css("backgroundColor", "#009688");
                $('#guestReservelInfo').css("color", "#fff");
                var guestId = getQueryString('guestId');
                // console.log(urlObj.guestId);
                if (guestId) {
                    $.ajax({
                        url: 'http://47.94.206.242/meet/admin/findAppointByCondition.action',//
                        type: 'POST',
                        data: {
                            guestId: guestId
                        },
                        success: function (data) {
                            if (data.status == '1') {
                                laypage.render({
                                    elem: 'table-pages'
                                    , count: data.pageBean.recordNum,
                                    limit: 8
                                    , layout: ['prev', 'page', 'next', 'count', 'skip']
                                    , jump: function (obj, first) {
                                        $.ajax({
                                            url: 'http://47.94.206.242/meet/admin/findAppointByCondition.action',//切分页的接口
                                            dataType: 'json',
                                            data: {
                                                pageNum: obj.curr,
                                                guestId: guestId
                                            },
                                            type: 'POST',
                                            success: function (data) {
                                                if (data.status == '1') {
                                                    vm.items = data.pageBean.dataList;
                                                    for (let item of vm.items) {
                                                        //修改时间
                                                        item.appointStart = dateFormate(item.appointStart, "yyyy-MM-dd hh:mm:ss");
                                                        item.appointEnd = dateFormate(item.appointEnd, "yyyy-MM-dd hh:mm:ss");
                                                        item.appointCreateDate = dateFormate(item.appointCreateDate, "yyyy-MM-dd hh:mm:ss");
                                                    }
                                                    $(".loading").css("display", "none");
                                                    $(".tac").css("display", "block");
                                                }
                                            }
                                        })
                                    }
                                });

                            }
                        }
                    })
                }
            }
        }
    });

    //页面初始化
    setTimeout(() => {
        vm.initData();
    }, 1500);

    //两个日历组件渲染
    laydate.render({
        elem: '#usetime'
        , range: true
        , type: 'date'  // 'month'  'date' 'datetime'
        , done: function (value, date, endDate) {
        }
        , trigger: 'click'
    });

    laydate.render({
        elem: '#reserveltime'
        , range: true
        , type: 'date'  // 'month'  'date' 'datetime'
        , done: function (value, date, endDate) {
        }
        , trigger: 'click'
    });

    //查询操作
    form.on('submit(btnSearch)', function (data) {
        var formData = data.field;
        //取预约时间的val
        var reservelTime = $("#reserveltime").val().split(" - ");
        if (reservelTime == "") {
            formData.beginTime = reservelTime[0];
            formData.endTime = reservelTime[0];
        } else {
            formData.beginTime = reservelTime[0];
            formData.endTime = reservelTime[1];
        }

        //取到使用时间的val
        var useRoomTime = $("#usetime").val().split(" - ");
        if (useRoomTime == "") {
            formData.useRoomBeginTime = useRoomTime[0];
            formData.useRoomEndTime = useRoomTime[0];
        } else {
            formData.useRoomBeginTime = useRoomTime[0];
            formData.useRoomEndTime = useRoomTime[1];
        }

        console.log(formData);
        $.ajax({
            data: formData,
            type: "POST",
            dataType: "JSON",
            url: "http://47.94.206.242/meet/admin/findAppointByCondition.action",//查询接口
            success: function (data) {
                if (data.status == '1') {
                    laypage.render({
                        elem: 'table-pages'
                        , count: data.pageBean.recordNum,
                        limit: 8
                        , layout: ['prev', 'page', 'next', 'count', 'skip']
                        , jump: function (obj, first) {
                            formData.pageNum = obj.curr;
                            $.ajax({
                                url: 'http://47.94.206.242/meet/admin/findAppointByCondition.action',//切分页的接口
                                dataType: 'json',
                                data: formData,
                                type: 'POST',
                                success: function (data) {
                                    if (data.status == '1') {
                                        vm.items = data.pageBean.dataList;
                                        for (let item of vm.items) {
                                            item.appointStart = dateFormate(item.appointStart, "yyyy-MM-dd hh:mm:ss");
                                            item.appointEnd = dateFormate(item.appointEnd, "yyyy-MM-dd hh:mm:ss");
                                            item.appointCreateDate = dateFormate(item.appointCreateDate, "yyyy-MM-dd hh:mm:ss");
                                        }
                                        $(".loading").css("display", "none");
                                        $(".tac").css("display", "block");
                                    }
                                }
                            })

                        }
                    });
                } else {
                    layer.msg("数据加载时出错");
                }
            }
        });
    });
});