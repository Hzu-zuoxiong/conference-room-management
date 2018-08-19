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

    //移动端click时间延迟300ms
    $(function () {
        FastClick.attach(document.body);
    });

    

    //查询操作
    form.on('submit(btnSearch)', function (data) {
        var formData = data.field;
        $.ajax({
            data: formData,
            type: "POST",
            dataType: "JSON",
            url: "http://47.94.206.242/meet/admin/findGuestByCondition.action",//访客信息接口
            success: function (data) {
                if (data.status == '1') {
                    laypage.render({
                        elem: 'table-pages'
                        , count: data.pageBean.recordNum
                        , limit: 8
                        , layout: ['prev', 'page', 'next', 'count', 'skip']
                        , jump: function (obj, first) {
                            var guestName = $("#guestName").val();
                            var guestCredit = $("#guestCredit").val();
                            if (!first) {
                                $.ajax({
                                    url: 'http://47.94.206.242/meet/admin/findGuestByCondition.action',//切分页的接口
                                    dataType: 'json',
                                    data: {
                                        "guestName": $("#guestName").val(),
                                        "guestCredit": $("#guestCredit").val(),
                                        "pageNum": obj.curr //页码
                                    },
                                    type: 'POST',
                                    success: function (data) {
                                        if (data.status == '1') {
                                            vm.items = data.pageBean.dataList;
                                            $(".loading").css("display", "none");
                                            $(".tac").css("display", "block");
                                        } else {
                                            layer.msg("数据加载出错");
                                        }
                                    },
                                })
                            }
                        }
                    });
                    vm.items = data.pageBean.dataList;
                    $(".loading").css("display", "none");
                    $(".tac").css("display", "block");
                }
            }
        });
    });

    var vm = new Vue({
        el: '#app',
        data: {
            items: {},
            excelJson: []
        },
        methods: {
            initData() {
                var that = this;
                $.ajax({
                    url: "http://47.94.206.242/meet/admin/findGuestByCondition.action",
                    dataType: 'JSON',
                    type: 'GET',
                    success: function (data) {
                        if (data.status == '1') {
                            laypage.render({
                                elem: 'table-pages'
                                , count: data.pageBean.recordNum,
                                limit: 8
                                , layout: ['prev', 'page', 'next', 'count', 'skip']
                                , jump: function (obj, first) {
                                    if (!first) {
                                        $.ajax({
                                            url: 'http://47.94.206.242/meet/admin/findGuestByCondition.action',//切分页的接口
                                            dataType: 'json',
                                            data: {
                                                "guestName": $("#guestName").val(),
                                                "guestCredit": $("#guestCredit").val(),
                                                // "guestSex": $("#select-year").val(),
                                                "pageNum": obj.curr
                                            },
                                            type: 'POST',
                                            success: function (data) {
                                                if (data.status == '1') {
                                                    that.items = data.pageBean.dataList;
                                                    // console.log(that.items);
                                                    $(".loading").css("display", "none");
                                                    $(".tac").css("display", "block");
                                                } else {
                                                    layer.msg("数据加载出错");
                                                }
                                            }
                                        })
                                    }
                                }
                            });
                            that.items = data.pageBean.dataList;
                            // console.log(that.items);
                            $(".loading").css("display", "none");
                            $(".tac").css("display", "block");
                        }
                    }
                })
            },
            exportExcel() {
                $.ajax({
                    data: {
                        pageNum: -1,
                        guestName: $('#guestName').val(),
                        guestCredit: $('#guestCredit').val()
                    },
                    url: "http://47.94.206.242/meet/admin/findGuestByCondition.action",
                    dataType: 'JSON',
                    type: 'POST',
                    success(data) {
                        this.excelJson = data.pageBean.dataList;
                        let fileName = 'visitinfo';
                        let headers = '姓名,身份证,联系方式,邮箱,单位,信誉分,';
                        let json = [];
                        for (let i in this.excelJson) {
                            let temp = {};
                            temp['姓名'] = this.excelJson[i].guestName;
                            temp['身份证'] = this.excelJson[i].guestId;
                            temp['联系方式'] = this.excelJson[i].guestTelephone;
                            temp['邮箱'] = this.excelJson[i].guestEmail;
                            temp['单位'] = this.excelJson[i].guestCompany;
                            temp['信誉分'] = this.excelJson[i].guestCredit.toString();
                            json.push(temp);
                        }
                        json = JSON.stringify(json);
                        Excelpost('http://47.94.206.242/meet/admin/getExcel.action', {fileName: fileName, headers: headers, json: json});
                    }
                });
            }
        }
    });

    // 页面初始化时加载数据
    setTimeout(() => {
        vm.initData();
    }, 1500);

});

