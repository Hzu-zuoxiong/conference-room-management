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
                if(data.status == '1'){
                    laypage.render({
                        elem: 'table-pages'
                        , count: data.pageBean.recordNum,
                        limit: 8
                        , layout: ['prev', 'page', 'next', 'count', 'skip']
                        , jump: function (obj, first) {

                             var guestName = $("#guestName").val();
                             var guestCredit = $("#guestCredit").val();

                            if (!first) {
                                $.ajax({
                                    url:'http://47.94.206.242/meet/admin/findGuestByCondition.action',//切分页的接口
                                    dataType: 'json',
                                    data:{
                                        "guestName": $("#guestName").val(),
                                        "guestCredit": $("#guestCredit").val(),
                                        "pageNum": obj.curr //页码
                                    },
                                    type:'POST',
                                    success:function (data) {
                                        if(data.status == '1'){
                                            var str = "";
                                            var data = data.pageBean.dataList;
                                            console.log(data);
                                            for(i in data) {

                                                str += "<tr>"+
                                                "<td class='layui-table-first'><span class='layui-table-bd'><a style='color:blue;' href='visitorReserveInfo.html?guestName="+data[i].guestName+"&&guestId="+data[i].guestId+"' title='查看预约详情'>"+data[i].guestName+"</a></span></td>" +
                                                // "<td><i class='layui-table-hd'>访客性别</i><span class='layui-table-bd'>"+data[i].guestSex+"</span></td>" +
                                                "<td><span class='layui-table-bd'>"+data[i].guestId+"</span></td>" +
                                                "<td><span class='layui-table-bd'>"+data[i].guestTelephone+"</span></td>" +
                                                "<td><span class='layui-table-bd'>"+data[i].guestEmail+"</span></td>" +
                                                "<td><span class='layui-table-bd'>"+data[i].guestCompany+"</span></td>" +
                                                "<td><span class='layui-table-bd'>"+data[i].guestCredit+"</span></td>" +
                                                "</tr>";
                                            }
                                            tableResult.innerHTML = str;
                                            $(".loading").css("display","none");
                                            $(".tac").css("display","block");
                                        } else {
                                            layer.msg("数据加载出错");
                                        }
                                    },                 
                                })
                            }
                        }
                    });
                    var str = "";
                    var data = data.pageBean.dataList;
                    for(i in data) {
                        // if(data[i].guestSex == '0'){
                        //     data[i].guestSex = "女";
                        // }else if(data[i].guestSex == '1'){
                        //     data[i].guestSex = "男";
                        // }
                        str += "<tr>"+
                        "<td class='layui-table-first'><span class='layui-table-bd'><a style='color:blue;' href='visitorReserveInfo.html?guestName="+data[i].guestName+"&&guestId="+data[i].guestId+"' title='查看预约详情'>"+data[i].guestName+"</a></span></td>" +
                        // "<td><i class='layui-table-hd'>访客性别</i><span class='layui-table-bd'>"+data[i].guestSex+"</span></td>" +
                        "<td><span class='layui-table-bd'>"+data[i].guestId+"</span></td>" +
                        "<td><span class='layui-table-bd'>"+data[i].guestTelephone+"</span></td>" +
                        "<td><span class='layui-table-bd'>"+data[i].guestEmail+"</span></td>" +
                        "<td><span class='layui-table-bd'>"+data[i].guestCompany+"</span></td>" +
                        "<td><span class='layui-table-bd'>"+data[i].guestCredit+"</span></td>" +
                        "</tr>";
                    }
                    tableResult.innerHTML = str;
                    $(".loading").css("display","none");
                    $(".tac").css("display","block");
                } 
            }
        });
    });



  // 页面初始化时加载数据
     setTimeout(() => {
         $.ajax({
            url:"http://47.94.206.242/meet/admin/findGuestByCondition.action",
            dataType: 'JSON',
            type: 'GET',
            success: function (data) {
                if(data.status == '1'){
                    laypage.render({
                        elem: 'table-pages'
                        , count: data.pageBean.recordNum,
                        limit: 8
                        , layout: ['prev', 'page', 'next', 'count', 'skip']
                        , jump: function (obj, first) {
                            if (!first) {
                                $.ajax({
                                    url:'http://47.94.206.242/meet/admin/findGuestByCondition.action',//切分页的接口
                                    dataType: 'json',
                                    data:{
                                        "guestName": $("#guestName").val(),
                                        "guestCredit": $("#guestCredit").val(),
                                        // "guestSex": $("#select-year").val(),
                                        "pageNum": obj.curr
                                    },
                                    type:'POST',
                                    success:function (data) {
                                        if(data.status == '1'){
                                            var str = "";
                                            var data = data.pageBean.dataList;

                                            for(i in data) {
                                                str += "<tr>"+
                                                "<td class='layui-table-first'><span class='layui-table-bd'><a style='color:blue;' href='visitorReserveInfo.html?guestName="+data[i].guestName+"&&guestId="+data[i].guestId+"' title='查看预约详情'>"+data[i].guestName+"</a></span></td>" +
                                                // "<td><i class='layui-table-hd'>访客性别</i><span class='layui-table-bd'>"+data[i].guestSex+"</span></td>" +
                                                "<td><span class='layui-table-bd'>"+data[i].guestId+"</span></td>" +
                                                "<td><span class='layui-table-bd'>"+data[i].guestTelephone+"</span></td>" +
                                                "<td><span class='layui-table-bd'>"+data[i].guestEmail+"</span></td>" +
                                                "<td><span class='layui-table-bd'>"+data[i].guestCompany+"</span></td>" +
                                                "<td><span class='layui-table-bd'>"+data[i].guestCredit+"</span></td>" +
                                                "</tr>";
                                            }
                                            tableResult.innerHTML = str;
                                            $(".loading").css("display","none");
                                            $(".tac").css("display","block");
                                        } else {
                                            layer.msg("数据加载出错");
                                        }
                                    },                 
                                })
                            }
                        }
                    });

                    var str = "";
                    var data = data.pageBean.dataList;
                    for(i in data) {
                        //改值
                        // if(data[i].guestSex == '0'){
                        //     data[i].guestSex = "女";
                        // }else if(data[i].guestSex == '1'){
                        //     data[i].guestSex = "男";
                        // }
                        str += "<tr>"+
                        "<td class='layui-table-first'><span class='layui-table-bd'><a style='color:blue;' href='visitorReserveInfo.html?guestName="+data[i].guestName+"&&guestId="+data[i].guestId+"' title='查看预约详情'>"+data[i].guestName+"</a></span></td>" +
                        // "<td><i class='layui-table-hd'>访客性别</i><span class='layui-table-bd'>"+data[i].guestSex+"</span></td>" +
                        "<td><span class='layui-table-bd'>"+data[i].guestId+"</span></td>" +
                        "<td><span class='layui-table-bd'>"+data[i].guestTelephone+"</span></td>" +
                        "<td><span class='layui-table-bd'>"+data[i].guestEmail+"</span></td>" +
                        "<td><span class='layui-table-bd'>"+data[i].guestCompany+"</span></td>" +
                        "<td><span class='layui-table-bd'>"+data[i].guestCredit+"</span></td>" +
                        "</tr>";
                    }
                    tableResult.innerHTML = str;
                    $(".loading").css("display","none");
                    $(".tac").css("display","block");
                }

            }
         })
     }, 1500);

});

