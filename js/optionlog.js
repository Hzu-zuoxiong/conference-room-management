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
    // 绑定表
    var tableResult = window.document.getElementById("tableResult");

    // 移动端click时间延迟300ms
    $(function () {
        FastClick.attach(document.body);
    });

    var vm = new Vue({
        el: '#app',
        data: {
            items: {}
        },
        methods: {
            initData() {
                var that = this;
                $.ajax({
                    url: "http://47.94.206.242/meet/admin/findOperationByCondition.action",
                    dataType: 'JSON',
                    type: 'GET',
                    success: function (data) {
                        if (data.status == '1') {
                            laypage.render({
                                elem: 'table-pages'
                                , count: data.pageBean.recordNum
                                , limit: 8
                                , layout: ['prev', 'page', 'next', 'count', 'skip']
                                , jump: function (obj, first) {
                                    if (!first) {
                                        $.ajax({
                                            url: 'http://47.94.206.242/meet/admin/findOperationByCondition.action',//切分页的接口
                                            dataType: 'json',
                                            data: {
                                                // "guestName": $("#guestName").val(),
                                                // "guestCredit": $("#guestCredit").val(),
                                                // "guestSex": $("#select-year").val(),
                                                "adminId": $("#adminId").val(),
                                                "beginTime": $("#operateTime").val(),
                                                "operateKind": $("#operateKind").val(),
                                                "pageNum": obj.curr
                                            },
                                            type: 'POST',
                                            success: function (data) {
                                                if (data.status == '1') {
                                                    that.items = data.pageBean.dataList;
                                                    for (let item of that.items) {
                                                        item.operateTime = dateFormate(item.operateTime, "yyyy-MM-dd hh:mm:ss");
                                                    }
                                                    $(".loading").css("display", "none");
                                                    $(".tac").css("display", "block");
                                                } else {
                                                    layer.msg("数据加载出错");
                                                }
                                            }
                                        })
                                    } else {

                                    }
                                }
                            });
                            that.items = data.pageBean.dataList;
                            for (let item of that.items) {
                                item.operateTime = dateFormate(item.operateTime, "yyyy-MM-dd hh:mm:ss");
                            }
                            $(".loading").css("display", "none");
                            $(".tac").css("display", "block");
                        }

                    }
                })
            }
        }
    });

    // 页面初始化时加载数据
    setTimeout(() => {
        vm.initData();
    }, 150);

    // 渲染时间
    laydate.render({
        elem: '#beginTime'
        , type: 'date'  // 'month'  'date' 'datetime'
        , done: function (value, date, endDate) {
        }
        , trigger: 'click'
    });

    // 渲染下拉框
    form.render('select');

    //查询操作
    form.on('submit(btnSearch)', function (data) {
        var formData = data.field;
        console.log(formData);
        $.ajax({
            data: formData,
            type: "POST",
            dataType: "JSON",
            url: "http://47.94.206.242/meet/admin/findOperationByCondition.action",//
            success: function (data) {
                if (data.status == '1') {
                    laypage.render({
                            elem: 'table-pages'
                            , count: data.pageBean.recordNum
                            ,limit: 8
                            , layout: ['prev', 'page', 'next', 'count', 'skip']
                            , jump: function (obj, first) {
                                if(!first) {
                                    formData.pageNum = obj.curr;
                                    $.ajax({
                                        url: 'http://47.94.206.242/meet/admin/findOperationByCondition.action',//切分页的接口
                                        dataType: 'json',
                                        data: formData,
                                        type: 'POST',
                                        success: function (data) {
                                            console.log(formData);
                                            console.log(data);
                                            if (data.status == '1') {
                                                vm.items = data.pageBean.dataList;
                                                // console.log(data);
                                                for (let item of vm.items) {
                                                    item.operateTime = dateFormate(item.operateTime, "yyyy-MM-dd hh:mm:ss");
                                                }
                                                $(".loading").css("display", "none");
                                                $(".tac").css("display", "block");
                                            } else {
                                                layer.msg("数据加载出错");
                                            }
                                        }
                                    })
                                } else {
                                    vm.items = data.pageBean.dataList;
                                    for (let item of vm.items) {
                                        item.operateTime = dateFormate(item.operateTime, "yyyy-MM-dd hh:mm:ss");
                                    }
                                    $(".loading").css("display", "none");
                                    $(".tac").css("display", "block");
                                }
                            }
                        }
                    );
                }
            }
        });
    });
});

