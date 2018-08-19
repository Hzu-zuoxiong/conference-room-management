/**
 * Created by xiong on 2018/4/26.
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

    //页面初始化请求数据
    setTimeout(function () {
        vm.initData();
        $(".loading").css("display", "none");
        $(".tac").css("display", "block");
    }, 500);

    var vm = new Vue({
        el: '#app',
        data: {
            items: {}
        },
        methods: {
            initData: function () {
                console.log("initData");
                var that = this;
                $.ajax({
                    type: "POST",
                    url: "http://47.94.206.242/meet/admin/findUserByCondition.action",
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
                                            url: "http://47.94.206.242/meet/admin/findUserByCondition.action",
                                            dataType: 'json',
                                            data: {
                                                "userId": $("#userId").val(),
                                                "userName": $("#userName").val(),
                                                "userEmail": $("#userEmail").val(),
                                                pageNum: obj.curr
                                            },
                                            type: 'POST',
                                            success: function (data) {
                                                console.log(data);
                                                if (data.status == '1') {
                                                    that.items = data.pageBean.dataList;
                                                    for (var i = 0; i < that.items.length; i++) {
                                                        that.items[i].userLoginPreTime = dateFormate(that.items[i].userLoginPreTime, "yyyy-MM-dd hh:mm:ss");
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
                                        console.log(that.items);
                                        for (var i = 0; i < that.items.length; i++) {
                                            that.items[i].userLoginPreTime = dateFormate(that.items[i].userLoginPreTime, "yyyy-MM-dd hh:mm:ss");
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
            //修改授权
            changeAuthority: function (userId, btnIndex) {
                // console.log(this.items[index].userIsAuthorized);
                // console.log(index, this.items[index].userIsAuthorized);
                // console.log(userId);
                var that = this;

                layer.confirm(`您确认要${that.items[btnIndex].userIsAuthorized ? '关闭' : '开启'}该用户登陆权限？`, {title: '更新操作'}, function (index) {
                    that.items[btnIndex].userIsAuthorized = !that.items[btnIndex].userIsAuthorized;
                    $.ajax({
                        data: {
                            "userId": userId
                        },
                        type: "GET",
                        dataType: "JSON",
                        url: "http://47.94.206.242/meet/admin/updateUserAuthority.action",
                        success: function (data) {

                            console.log(userId);
                            // layer.close(index);
                            layer.msg('修改成功！');
                        }
                    });
                });
            },
            exportExcel() {
                $.ajax({
                    data: {
                        pageNum: -1,
                        "userId": $("#userId").val(),
                        "userName": $("#userName").val(),
                        "userEmail": $("#userEmail").val()
                    },
                    url: "http://47.94.206.242/meet/admin/findUserByCondition.action",
                    dataType: 'JSON',
                    type: 'POST',
                    success(data) {
                        this.excelJson = data.pageBean.dataList;
                        let fileName = 'userInfo';
                        let headers = 'ID,真实姓名,邮箱,联系方式,上次登陆时间,上次登陆IP,授权登陆,';
                        let json = [];
                        for (let i in this.excelJson) {
                            let temp = {};
                            temp['ID'] = this.excelJson[i].userId;
                            temp['真实姓名'] = this.excelJson[i].userName;
                            temp['邮箱'] = this.excelJson[i].userEmail;
                            temp['联系方式'] = this.excelJson[i].userTelephone;
                            temp['上次登陆时间'] = this.excelJson[i].userLoginPreTime;
                            temp['上次登陆IP'] = this.excelJson[i].userLoginIp;
                            temp['授权登陆'] = this.excelJson[i].userIsAuthorized ? '是' : '否';
                            json.push(temp);
                        }
                        json = JSON.stringify(json);
                        Excelpost('http://47.94.206.242/meet/admin/getExcel.action', {
                            fileName: fileName,
                            headers: headers,
                            json: json
                        });
                    }
                });
            }
        }
    });

    //查询操作
    form.on('submit(btnSearch)', function (data) {

        $.ajax({
            data: {
                "userId": $("#userId").val(),
                "userName": $("#userName").val(),
                "userEmail": $("#userEmail").val()
            },
            type: "POST",
            dataType: "JSON",
            url: "http://47.94.206.242/meet/admin/findUserByCondition.action",
            success: function (result) {
                console.log(result);
                if (result.status == '1') {
                    laypage.render({
                        elem: 'table-pages'
                        , count: result.pageBean.recordNum
                        , limit: 8
                        , layout: ['prev', 'page', 'next', 'count', 'skip']
                        , jump: function (obj, first) {
                            if (!first) {
                                $.ajax({
                                    url: 'http://47.94.206.242/meet/admin/findUserByCondition.action',
                                    dataType: 'json',
                                    data: {
                                        "userId": $("#userId").val(),
                                        "userName": $("#userName").val(),
                                        "userEmail": $("#userEmail").val(),
                                        "pageNum": obj.curr
                                    },
                                    type: 'POST',
                                    success: function (data) {
                                        console.log(data);
                                        if (data.status == '1') {
                                            vm.items = data.pageBean.dataList;
                                            for (var i = 0; i < that.items.length; i++) {
                                                vm.items[i].userLoginPreTime = dateFormate(vm.items[i].userLoginPreTime, "yyyy-MM-dd hh:mm:ss");
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
                                for (var i = 0; i < vm.items.length; i++) {
                                    vm.items[i].userLoginPreTime = dateFormate(vm.items[i].userLoginPreTime, "yyyy-MM-dd hh:mm:ss");
                                }
                            }
                        }
                    });
                } else {
                    layer.msg("数据加载出错");
                }
            }
        });
    });
});

