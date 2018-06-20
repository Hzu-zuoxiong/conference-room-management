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

    //页面初始化请求数据
    setTimeout(function () {
        vm.initData();
        $(".loading").css("display","none");
        $(".tac").css("display","block");
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
                    type: "GET",
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
                                                "userEmail": $("#userEmail").val()
                                            },
                                            type: 'POST',
                                            success: function (data) {
                                                console.log(data);
                                                if (data.status == '1') {
                                                    that.items = data.pageBean.dataList;
                                                    //将管理员字段截取出管理员与管理员联系方式
                                                    for(var i = 0; i < that.items.length; i++) {
                                                        that.items[i].userLoginPreTime = new Date(that.items[i].userLoginPreTime).format("yyyy-MM-dd hh:mm:ss");
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
                                        for(var i = 0; i < that.items.length; i++) {
                                            that.items[i].userLoginPreTime = new Date(that.items[i].userLoginPreTime).format("yyyy-MM-dd hh:mm:ss");
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

                layer.confirm('您确认要修改该用户登陆权限？', {title: '更新操作'}, function (index) {
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
                if(result.status == '1') {
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
                                            for(var i = 0; i < that.items.length; i++) {
                                                vm.items[i].userLoginPreTime = new Date(vm.items[i].userLoginPreTime).format("yyyy-MM-dd hh:mm:ss");
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
                                    vm.items[i].userLoginPreTime = new Date(vm.items[i].userLoginPreTime).format("yyyy-MM-dd hh:mm:ss");
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

