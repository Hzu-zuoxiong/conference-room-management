/**
 * Created by nole on 2018/4/18.
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
            items: {},
            excelJson: []
        },
        methods: {
            initData() {
                var that = this;
                $.ajax({
                    url: "http://47.94.206.242/meet/admin/findVisitByCondition.action",
                    dataType: 'JSON',
                    type: 'GET',
                    success: function (data) {
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
                                            url: 'http://47.94.206.242/meet/admin/findVisitByCondition.action',
                                            dataType: 'json',
                                            data: {
                                                "guestName": $("#guestName").val(),
                                                "tagId": $("#select-type").val(),
                                                "visitArriveTime": $("#visitTime").val().split(" - ")[0],
                                                "visitLeaveTime": $("#visitTime").val().split(" - ")[1],
                                                "pageNum": obj.curr
                                            },
                                            type: 'POST',
                                            success: function (data) {
                                                if (data.status == '1') {
                                                    that.items = data.pageBean.dataList;
                                                    //    if(data[i].guestSex == '0'){
                                                    //        data[i].guestSex = "女";
                                                    //    }else if(data[i].guestSex == '1'){
                                                    //        data[i].guestSex = "男";
                                                    //    }
                                                    for (let item of that.items) {
                                                        //修改值
                                                        item.visitArriveTime = dateFormate(item.visitArriveTime, "yyyy-MM-dd hh:mm:ss");
                                                        item.visitLeaveTime = dateFormate(item.visitLeaveTime, "yyyy-MM-dd hh:mm:ss");
                                                    }
                                                    $(".loading").css("display", "none");
                                                    $(".tac").css("display", "block");
                                                }
                                            }
                                        })
                                    }
                                }
                            });
                            //初始化渲染
                            that.items = data.pageBean.dataList;
                            for (let item of that.items) {
                                item.visitArriveTime = dateFormate(item.visitArriveTime, "yyyy-MM-dd hh:mm:ss");
                                item.visitLeaveTime = dateFormate(item.visitLeaveTime, "yyyy-MM-dd hh:mm:ss");
                            }
                            $(".loading").css("display", "none");
                            $(".tac").css("display", "block");
                        }

                    }
                })
            },
            exportExcel() {
                $.ajax({
                    data: {
                        "pageNum": -1,
                        "guestName": $("#guestName").val(),
                        "tagId": $("#select-type").val(),
                        "visitArriveTime": $("#visitTime").val().split(" - ")[0],
                        "visitLeaveTime": $("#visitTime").val().split(" - ")[1],
                    },
                    url: "http://47.94.206.242/meet/admin/findVisitByCondition.action",
                    dataType: 'JSON',
                    type: 'POST',
                    success(data) {
                        console.log(data);
                        this.excelJson = data.pageBean.dataList;
                        console.log(this.excelJson);
                        let fileName = 'visitHistory';
                        let headers = '姓名,会议室名称,用途,容纳人数,占地面积,开始时间,结束时间,';
                        let json = [];
                        console.log(this.excelJson);
                        for (let i in this.excelJson) {
                            let temp = {};
                            temp['姓名'] = this.excelJson[i].guestName;
                            temp['用途'] = this.excelJson[i].tagName;
                            temp['会议室名称'] = this.excelJson[i].roomName;
                            temp['容纳人数'] = this.excelJson[i].roomPeople;
                            temp['占地面积'] = this.excelJson[i].roomArea;
                            temp['开始时间'] = ""+dateFormate(this.excelJson[i].visitArriveTime,  "yyyy-MM-dd hh:mm:ss");
                            temp['结束时间'] = ""+dateFormate(this.excelJson[i].visitLeaveTime,  "yyyy-MM-dd hh:mm:ss");
                            json.push(temp);
                        }
                        json = JSON.stringify(json);
                        console.log(json);
                        Excelpost('http://47.94.206.242/meet/admin/getExcel.action', {fileName: fileName, headers: headers, json: json});
                    }
                });
            }
        }
    });

    //页面初始化
    setTimeout(() => {
        //加载表格数据
        vm.initData();
    }, 150);

    //渲染时间
    laydate.render({
        elem: '#visitTime'
        , range: true
        , type: 'date'  // 'month'  'date' 'datetime'
        , done: function (value, date, endDate) {
        }
        , trigger: 'click'
    });

    //查询操作
    form.on('submit(btnSearch)', function (data) {

        var formData = data.field;

        var visitTime = $("#visitTime").val().split(" - ");
        if (visitTime == "") {
            formData.visitArriveTime = visitTime[0];
            formData.visitLeaveTime = visitTime[0];
        } else {
            formData.visitArriveTime = visitTime[0];
            formData.visitLeaveTime = visitTime[1];
        }

        //加拜访时间两个字段
        console.log(formData);

        $.ajax({
            data: formData,
            type: "POST",
            dataType: "JSON",
            url: "http://47.94.206.242/meet/admin/findVisitByCondition.action",
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
                                url: 'http://47.94.206.242/meet/admin/findVisitByCondition.action',//切分页的接口
                                dataType: 'json',
                                data: formData,
                                type: 'POST',
                                success: function (data) {
                                    if (data.status == '1') {
                                        vm.items = data.pageBean.dataList;
                                        console.log(data);
                                        for (let item of vm.items) {
                                            //改值
                                            // if(data[i].guestSex == '0'){
                                            //     data[i].guestSex = "女";
                                            // }else if(data[i].guestSex == '1'){
                                            //     data[i].guestSex = "男";
                                            // }
                                            //改值
                                            item.visitArriveTime = dateFormate(item.visitArriveTime, "yyyy-MM-dd hh:mm:ss");
                                            item.visitLeaveTime = dateFormate(item.visitLeaveTime, "yyyy-MM-dd hh:mm:ss");
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
        });
    });

});