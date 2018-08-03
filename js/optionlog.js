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

    //渲染时间
    laydate.render({
        elem: '#operateTime'
        ,  type: 'date'  // 'month'  'date' 'datetime'
        , done: function (value, date, endDate) {
        }
        ,trigger: 'click'
    });

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
                if(data.status == '1'){
                    laypage.render({
                        elem: 'table-pages'
                        , count: data.pageBean.recordNum,
                        limit: 8
                        , layout: ['prev', 'page', 'next', 'count', 'skip']
                        , jump: function (obj, first) {
                               formData.pageNum = obj.curr;
                               $.ajax({
                                    url:'http://47.94.206.242/meet/admin/findOperationByCondition.action',//切分页的接口
                                    dataType: 'json',
                                    data: formData,
                                    type:'POST',
                                    success:function (data) {
                                        if(data.status == '1'){
                                            var str = "";
                                            var data = data.pageBean.dataList;
                                            // console.log(data);
                                            for(i in data) {
                                                data[i].operateTime = dateFormate(data[i].operateTime, "yyyy-MM-dd hh:mm:ss");
                                                str += "<tr>"+
                                                "<td class='layui-table-first'><i class='layui-table-hd'>用户名</i><span class='layui-table-bd'>"+data[i].adminId+"</span></td>" +
                                                "<td><i class='layui-table-hd'>操作时间</i><span class='layui-table-bd'>"+data[i].operateTime+"</span></td>" +
                                                "<td><i class='layui-table-hd'>用户IP</i><span class='layui-table-bd'>"+data[i].operateIp+"</span></td>" +
                                                "<td><i class='layui-table-hd'>操作类型</i><span class='layui-table-bd'>"+data[i].operateKind+"</span></td>" +
                                                "<td><i class='layui-table-hd'>说明</i><span class='layui-table-bd'>"+data[i].operateState+"</span></td>" +
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
                    );
                } 
            }
        });
    });



  // 页面初始化时加载数据
     setTimeout(() => {
         $.ajax({
            url:"http://47.94.206.242/meet/admin/findOperationByCondition.action",
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
                                    url:'http://47.94.206.242/meet/admin/findOperationByCondition.action',//切分页的接口
                                    dataType: 'json',
                                    data:{
                                        // "guestName": $("#guestName").val(),
                                        // "guestCredit": $("#guestCredit").val(),
                                        // "guestSex": $("#select-year").val(),
                                        "adminId": $("#adminId").val(),
                                        "beginTime": $("#operateTime").val(),
                                        "operateKind": $("#operateKind").val(),
                                        "pageNum": obj.curr
                                    },
                                    type:'POST',
                                    success:function (data) {
                                        if(data.status == '1'){
                                            var str = "";
                                            var data = data.pageBean.dataList;

                                            for(i in data) {

                                                data[i].operateTime = dateFormate(data[i].operateTime, "yyyy-MM-dd hh:mm:ss");
                                                str += "<tr>"+
                                                "<td class='layui-table-first'><i class='layui-table-hd'>用户名</i><span class='layui-table-bd'>"+data[i].adminId+"</span></td>" +
                                                "<td><i class='layui-table-hd'>操作时间</i><span class='layui-table-bd'>"+data[i].operateTime+"</span></td>" +
                                                "<td><i class='layui-table-hd'>用户IP</i><span class='layui-table-bd'>"+data[i].operateIp+"</span></td>" +
                                                "<td><i class='layui-table-hd'>操作类型</i><span class='layui-table-bd'>"+data[i].operateKind+"</span></td>" +
                                                "<td><i class='layui-table-hd'>说明</i><span class='layui-table-bd'>"+data[i].operateState+"</span></td>" +
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
                        data[i].operateTime = dateFormate(data[i].operateTime, "yyyy-MM-dd hh:mm:ss");

                        str += "<tr>"+
                        "<td class='layui-table-first'><i class='layui-table-hd'>用户名</i><span class='layui-table-bd'>"+data[i].adminId+"</span></td>" +
                        "<td><i class='layui-table-hd'>操作时间</i><span class='layui-table-bd'>"+data[i].operateTime+"</span></td>" +
                        "<td><i class='layui-table-hd'>用户IP</i><span class='layui-table-bd'>"+data[i].operateIp+"</span></td>" +
                        "<td><i class='layui-table-hd'>操作类型</i><span class='layui-table-bd'>"+data[i].operateKind+"</span></td>" +
                        "<td><i class='layui-table-hd'>说明</i><span class='layui-table-bd'>"+data[i].operateState+"</span></td>" +
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

