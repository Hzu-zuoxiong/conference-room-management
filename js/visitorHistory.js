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
    $.get("http://47.94.206.242/meet/admin/findAllTag.action",function (data) { 
        if(data.status=='1'){
            for(var i = 0;i<data.roomTagList.length;i++){
                $("#select-type").append("<option value="+data.roomTagList[i].tagId+">"+data.roomTagList[i].tagName+"</option>");
            }
            form.render('select');
        }
     })




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


    //渲染时间
    laydate.render({
        elem: '#visitTime'
        , range: true
        , type: 'date'  // 'month'  'date' 'datetime'
        , done: function (value, date, endDate) {
        }
        ,trigger: 'click'
    });

    //页面初始化
    setTimeout(() => {
        //加载表格数据
        $.ajax({
           url:"http://47.94.206.242/meet/admin/findVisitByCondition.action",
           dataType: 'JSON',
           type: 'GET',
           success: function (data) {
               if(data.status == '1'){
                   //分页渲染
                   laypage.render({
                       elem: 'table-pages'
                       , count: data.pageBean.recordNum,
                       limit: 8
                       , layout: ['prev', 'page', 'next', 'count', 'skip']
                       , jump: function (obj, first) {
                           if (!first) {
                               $.ajax({
                                   url:'http://47.94.206.242/meet/admin/findVisitByCondition.action',//切分页的接口
                                   dataType: 'json',
                                   data:{
                                       "guestName": $("#guestName").val(),
                                       "tagName": $("select-type").val(),
                                       "visitArriveTime": $("#visitTime").val().split(" - ")[0],
                                       "visitLeaveTime": $("#visitTime").val().split(" - ")[1],
                                       "pageNum": obj.curr
                                   },
                                   type:'POST',
                                   success:function (data) {
                                       if(data.status == '1'){
                                           var str = "";
                                           var data = data.pageBean.dataList;
                                        //    if(data[i].guestSex == '0'){
                                        //        data[i].guestSex = "女";
                                        //    }else if(data[i].guestSex == '1'){
                                        //        data[i].guestSex = "男";
                                        //    }
                                           for(i in data) {
                                            //修改值
                                            data[i].visitArriveTime = new Date(data[i].visitArriveTime).format("yyyy-MM-dd hh:mm:ss");
                                            data[i].visitLeaveTime = new Date(data[i].visitLeaveTime).format("yyyy-MM-dd hh:mm:ss");

                                            str += "<tr>"+
                                            "<td class='layui-table-first'><i class='layui-table-hd'>访客姓名</i><span class='layui-table-bd'>"+data[i].guestName+"</span></td>"+
                                            "<td><i class='layui-table-hd'>拜访会议室名称</i><span class='layui-table-bd'>"+data[i].roomName+"</span></td>" +
                                            "<td><i class='layui-table-hd'>拜访用途</i><span class='layui-table-bd'>"+data[i].tagName+"</span></td>" +
                                            "<td><i class='layui-table-hd'>拜访会议室容纳人数</i><span class='layui-table-bd'>"+data[i].roomPeople+"</span></td>" +
                                            "<td><i class='layui-table-hd'>拜访会议室占地面积</i><span class='layui-table-bd'>"+data[i].roomArea+"</span></td>" +
                                            "<td><i class='layui-table-hd'>开始拜访时间</i><span class='layui-table-bd'>"+data[i].visitArriveTime+"</span></td>" +
                                            "<td><i class='layui-table-hd'>结束拜访时间</i><span class='layui-table-bd'>"+data[i].visitLeaveTime+"</span></td>" +
                                            "</tr>";
                                           }
                                           tableResult.innerHTML = str;
                                           $(".loading").css("display","none");
                                           $(".tac").css("display","block");
                                       }
                                   },                 
                               })
                           }
                       }
                   });
                   //初始化渲染
                   var str = "";
                   var data = data.pageBean.dataList;
                   for(i in data) {

                        data[i].visitArriveTime = new Date(data[i].visitArriveTime).format("yyyy-MM-dd hh:mm:ss");
                        data[i].visitLeaveTime = new Date(data[i].visitLeaveTime).format("yyyy-MM-dd hh:mm:ss");

                        str += "<tr>"+
                        "<td class='layui-table-first'><i class='layui-table-hd'>访客姓名</i><span class='layui-table-bd'>"+data[i].guestName+"</span></td>"+
                        "<td><i class='layui-table-hd'>拜访会议室名称</i><span class='layui-table-bd'>"+data[i].roomName+"</span></td>" +
                        "<td><i class='layui-table-hd'>拜访用途</i><span class='layui-table-bd'>"+data[i].tagName+"</span></td>" +
                        "<td><i class='layui-table-hd'>拜访会议室容纳人数</i><span class='layui-table-bd'>"+data[i].roomPeople+"</span></td>" +
                        "<td><i class='layui-table-hd'>拜访会议室占地面积</i><span class='layui-table-bd'>"+data[i].roomArea+"</span></td>" +
                        "<td><i class='layui-table-hd'>开始拜访时间</i><span class='layui-table-bd'>"+data[i].visitArriveTime+"</span></td>" +
                        "<td><i class='layui-table-hd'>结束拜访时间</i><span class='layui-table-bd'>"+data[i].visitLeaveTime+"</span></td>" +
                        "</tr>";
                   }
                   tableResult.innerHTML = str;
                   $(".loading").css("display","none");
                   $(".tac").css("display","block");
               }

           }
        })
    }, 1500);   





    //查询操作
    form.on('submit(btnSearch)', function (data) {

        var formData = data.field;

        var visitTime = $("#visitTime").val().split(" - ");
        if(visitTime==""){
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
                if(data.status == '1'){
                    laypage.render({
                        elem: 'table-pages'
                        , count: data.pageBean.recordNum,
                        limit: 8
                        , layout: ['prev', 'page', 'next', 'count', 'skip']
                        , jump: function (obj, first) {
                            formData.pageNum = obj.curr;
                                $.ajax({
                                    url:'http://47.94.206.242/meet/admin/findVisitByCondition.action',//切分页的接口
                                    dataType: 'json',
                                    data: formData,
                                    type:'POST',
                                    success:function (data) {
                                        if(data.status == '1'){
                                            var str = "";
                                            var data = data.pageBean.dataList;
                                            console.log(data);
                                            for(i in data) {
                                                //改值
                                                // if(data[i].guestSex == '0'){
                                                //     data[i].guestSex = "女";
                                                // }else if(data[i].guestSex == '1'){
                                                //     data[i].guestSex = "男";
                                                // }

                                                //改值
                                                data[i].visitArriveTime = new Date(data[i].visitArriveTime).format("yyyy-MM-dd hh:mm:ss");
                                                data[i].visitLeaveTime = new Date(data[i].visitLeaveTime).format("yyyy-MM-dd hh:mm:ss");
                                                
                                                
                                                str += "<tr>"+
                                                "<td class='layui-table-first'><i class='layui-table-hd'>访客姓名</i><span class='layui-table-bd'>"+data[i].guestName+"</span></td>"+
                                                "<td><i class='layui-table-hd'>拜访会议室名称</i><span class='layui-table-bd'>"+data[i].roomName+"</span></td>" +
                                                "<td><i class='layui-table-hd'>拜访用途</i><span class='layui-table-bd'>"+data[i].tagName+"</span></td>" +
                                                "<td><i class='layui-table-hd'>拜访会议室容纳人数</i><span class='layui-table-bd'>"+data[i].roomPeople+"</span></td>" +
                                                "<td><i class='layui-table-hd'>拜访会议室占地面积</i><span class='layui-table-bd'>"+data[i].roomArea+"</span></td>" +
                                                "<td><i class='layui-table-hd'>开始拜访时间</i><span class='layui-table-bd'>"+data[i].visitArriveTime+"</span></td>" +
                                                "<td><i class='layui-table-hd'>结束拜访时间</i><span class='layui-table-bd'>"+data[i].visitLeaveTime+"</span></td>" +
                                                "</tr>";
                                            }
                                            tableResult.innerHTML = str;
                                            $(".loading").css("display","none");
                                            $(".tac").css("display","block");
                                        }
                                    },                 
                                })
                    
                        }
                    });
                }
            }
        });
    });

});