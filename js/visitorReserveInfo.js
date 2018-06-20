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

    //取URL参数
    function splitUrl(url){
        var str = url.split("?")[1];
        if(str){
            var items = str.split("&");
            var arr = {};
            var json = {};
            for(var i = 0;i<items.length;i++){
                arr = items[i].split("=");
                json[arr[0]] = arr[1];
            }
        return json;
        }
    }

    function getQueryString(key){
        var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
        var result = window.location.search.substr(1).match(reg);
        return result?decodeURIComponent(result[2]):null;
    }

    // console.log(urlObj);
    
    
    function searchFromUrl() {
        $('#guestInfo').css("backgroundColor","#282b33");
        $('#guestInfo').css("color","#bfc0c2");
        $('#guestReservelInfo').css("backgroundColor","#009688");
        $('#guestReservelInfo').css("color","#fff");
        var guestId = getQueryString('guestId');
        // console.log(urlObj.guestId);
        if(guestId){
            $.ajax({
                url:'http://47.94.206.242/meet/admin/findAppointByCondition.action',//
                type:'POST',
                data:{
                    guestId: guestId
                },
                success:function (data) {
                    if(data.status=='1'){
                        laypage.render({
                            elem: 'table-pages'
                            , count: data.pageBean.recordNum,
                            limit: 8
                            , layout: ['prev', 'page', 'next', 'count', 'skip']
                            , jump: function (obj, first) {
                                    $.ajax({
                                        url:'http://47.94.206.242/meet/admin/findAppointByCondition.action',//切分页的接口
                                        dataType: 'json',
                                        data: {
                                          pageNum: obj.curr,
                                          guestId: guestId 
                                        },
                                        type:'POST',
                                        success:function (data) {
                                            if(data.status == '1'){
                                                var str = "";
                                                var data = data.pageBean.dataList;
                                                console.log(data);
                                                for(i in data) {
                                                    //修改时间
                                                    data[i].appointStart = new Date(data[i].appointStart).format("yyyy-MM-dd hh:mm:ss");
                                                    data[i].appointEnd = new Date(data[i].appointEnd).format("yyyy-MM-dd hh:mm:ss");
                                                    data[i].appointCreateDate = new Date(data[i].appointCreateDate).format("yyyy-MM-dd hh:mm:ss");
    
                                                    str += "<tr>"+
                                                    "<td class='layui-table-first'><i class='layui-table-hd'>访客姓名</i><span class='layui-table-bd'>"+data[i].guestName+"</span></td>"+
                                                    "<td><i class='layui-table-hd'>预约会议室名称</i><span class='layui-table-bd'>"+data[i].room.roomName+"</span></td>" +
                                                    "<td><i class='layui-table-hd'>预约用途</i><span class='layui-table-bd'>"+data[i].tagName+"</span></td>" +
                                                    "<td><i class='layui-table-hd'>预约会议室容纳人数</i><span class='layui-table-bd'>"+data[i].room.roomPeople+"</span></td>" +
                                                    "<td><i class='layui-table-hd'>预约会议室占地面积</i><span class='layui-table-bd'>"+data[i].room.roomArea+"</span></td>" +
                                                    "<td><i class='layui-table-hd'>使用会议室时间</i><span class='layui-table-bd'>"+data[i].appointStart+"&nbsp;~&nbsp;"+data[i].appointEnd+"</span></td>" +
                                                    "<td><i class='layui-table-hd'>预约时间</i><span class='layui-table-bd'>"+data[i].appointCreateDate+"</span></td>" +
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
            })
        }        

    }



    //渲染select
    $.get("http://47.94.206.242/meet/admin/findAllTag.action",function (data) { 
        if(data.status=='1'){
            for(var i = 0;i<data.roomTagList.length;i++){
                $("#select-type").append("<option value="+data.roomTagList[i].tagId+">"+data.roomTagList[i].tagName+"</option>");
            }
            form.render('select');
        }
     })

    $("#select").click(function () {
        console.log("1111");
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
    
    // 用例
    // var test1 = new Date(1523493958000).format("yyyy-MM-dd hh:mm:ss");
    // console.log(test1);


    //两个日历组件渲染
    laydate.render({
        elem: '#usetime'
        , range: true
        , type: 'date'  // 'month'  'date' 'datetime'
        , done: function (value, date, endDate) {
        }
        ,trigger: 'click'
    });

    laydate.render({
        elem: '#reserveltime'
        , range : true
        , type: 'date'  // 'month'  'date' 'datetime'
        , done: function (value, date, endDate) {
        }
        ,trigger: 'click'
    });

    //页面初始化
    setTimeout(() => {
        //声明name和id(guest)
        var guestName = getQueryString('guestName');
        var guestId = getQueryString('guestId'); 

        //同时存在
        if(guestName&&guestId){
            //赋值
            $("#guestName").val(guestName);
            //拿Id进行搜索
            searchFromUrl();

        }else{
            $.ajax({
                url:"http://47.94.206.242/meet/admin/findAppointByCondition.action",
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
                                        url:'http://47.94.206.242/meet/admin/findAppointByCondition.action',//切分页的接口
                                        dataType: 'json',
                                        data:{
                                            "guestName": $("#guestName").val(),
                                            "tagName": $("select-type").val(),
                                            "beginTime": $("#reserveltime").val().split(" - ")[0],
                                            "endTime":　$("#reserveltime").val().split(" - ")[1],
                                            "useRoomBeginTime": $("#usetime").val().split(" - ")[0],
                                            "useRoomEndTime": $("#usetime").val().split(" - ")[1],
                                            "pageNum": obj.curr
                                        },
                                        type:'POST',
                                        success:function (data) {
                                            if(data.status == '1'){
                                                var str = "";
                                                var data = data.pageBean.dataList;

                                                for(i in data) {
                                                 // 修改时间
                                                 data[i].appointStart = new Date(data[i].appointStart).format("yyyy-MM-dd hh:mm:ss");
                                                 data[i].appointEnd = new Date(data[i].appointEnd).format("yyyy-MM-dd hh:mm:ss");
                                                 data[i].appointCreateDate = new Date(data[i].appointCreateDate).format("yyyy-MM-dd hh:mm:ss");
                                                 str += "<tr>"+
                                                 "<td class='layui-table-first'><i class='layui-table-hd'>访客姓名</i><span class='layui-table-bd'>"+data[i].guestName+"</span></td>"+
                                                 "<td><i class='layui-table-hd'>预约会议室名称</i><span class='layui-table-bd'>"+data[i].room.roomName+"</span></td>" +
                                                 "<td><i class='layui-table-hd'>预约用途</i><span class='layui-table-bd'>"+data[i].tagName+"</span></td>" +
                                                 "<td><i class='layui-table-hd'>预约会议室容纳人数</i><span class='layui-table-bd'>"+data[i].room.roomPeople+"</span></td>" +
                                                 "<td><i class='layui-table-hd'>预约会议室占地面积</i><span class='layui-table-bd'>"+data[i].room.roomArea+"</span></td>" +
                                                 "<td><i class='layui-table-hd'>使用会议室时间</i><span class='layui-table-bd'>"+data[i].appointStart+"&nbsp;&nbsp;～&nbsp;&nbsp;"+data[i].appointEnd+"</span></td>" +
                                                 "<td><i class='layui-table-hd'>预约时间</i><span class='layui-table-bd'>"+data[i].appointCreateDate+"</span></td>" +
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
                             //修改时间
                             data[i].appointStart = new Date(data[i].appointStart).format("yyyy-MM-dd hh:mm:ss");
                             data[i].appointEnd = new Date(data[i].appointEnd).format("yyyy-MM-dd hh:mm:ss");
                             data[i].appointCreateDate = new Date(data[i].appointCreateDate).format("yyyy-MM-dd hh:mm:ss");
     
                             str += "<tr>"+
                             "<td class='layui-table-first'><i class='layui-table-hd'>访客姓名</i><span class='layui-table-bd'>"+data[i].guestName+"</span></td>"+
                             "<td><i class='layui-table-hd'>预约会议室名称</i><span class='layui-table-bd'>"+data[i].room.roomName+"</span></td>" +
                             "<td><i class='layui-table-hd'>预约用途</i><span class='layui-table-bd'>"+data[i].tagName+"</span></td>" +
                             "<td><i class='layui-table-hd'>预约会议室容纳人数</i><span class='layui-table-bd'>"+data[i].room.roomPeople+"</span></td>" +
                             "<td><i class='layui-table-hd'>预约会议室占地面积</i><span class='layui-table-bd'>"+data[i].room.roomArea+"</span></td>" +
                             "<td><i class='layui-table-hd'>使用会议室时间</i><span class='layui-table-bd'>"+data[i].appointStart+"&nbsp;~&nbsp;"+data[i].appointEnd+"</span></td>" +
                             "<td><i class='layui-table-hd'>预约时间</i><span class='layui-table-bd'>"+data[i].appointCreateDate+"</span></td>" +
                             "</tr>";
                        }
                        tableResult.innerHTML = str;
                        $(".loading").css("display","none");
                        $(".tac").css("display","block");
                    }
     
                }
             })
        }
        
    }, 1500);



    //查询操作
    form.on('submit(btnSearch)', function (data) {
        var formData = data.field;
        //取预约时间的val
        var reservelTime = $("#reserveltime").val().split(" - ");
        if(reservelTime==""){
            formData.beginTime = reservelTime[0];
            formData.endTime = reservelTime[0];
        } else {
            formData.beginTime = reservelTime[0];
            formData.endTime = reservelTime[1];
        }
        
        //取到使用时间的val
        var useRoomTime = $("#usetime").val().split(" - ");;
        if(useRoomTime==""){
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
                if(data.status == '1'){
                    laypage.render({
                        elem: 'table-pages'
                        , count: data.pageBean.recordNum,
                        limit: 8
                        , layout: ['prev', 'page', 'next', 'count', 'skip']
                        , jump: function (obj, first) {
                            formData.pageNum = obj.curr;
                                $.ajax({
                                    url:'http://47.94.206.242/meet/admin/findAppointByCondition.action',//切分页的接口
                                    dataType: 'json',
                                    data: formData,
                                    type:'POST',
                                    success:function (data) {
                                        if(data.status == '1'){
                                            var str = "";
                                            var data = data.pageBean.dataList;
                                            console.log(data);
                                            for(i in data) {
                                                //修改时间
                                                data[i].appointStart = new Date(data[i].appointStart).format("yyyy-MM-dd hh:mm:ss");
                                                data[i].appointEnd = new Date(data[i].appointEnd).format("yyyy-MM-dd hh:mm:ss");
                                                data[i].appointCreateDate = new Date(data[i].appointCreateDate).format("yyyy-MM-dd hh:mm:ss");

                                                str += "<tr>"+
                                                "<td class='layui-table-first'><i class='layui-table-hd'>访客姓名</i><span class='layui-table-bd'>"+data[i].guestName+"</span></td>"+
                                                "<td><i class='layui-table-hd'>预约会议室名称</i><span class='layui-table-bd'>"+data[i].room.roomName+"</span></td>" +
                                                "<td><i class='layui-table-hd'>预约用途</i><span class='layui-table-bd'>"+data[i].tagName+"</span></td>" +
                                                "<td><i class='layui-table-hd'>预约会议室容纳人数</i><span class='layui-table-bd'>"+data[i].room.roomPeople+"</span></td>" +
                                                "<td><i class='layui-table-hd'>预约会议室占地面积</i><span class='layui-table-bd'>"+data[i].room.roomArea+"</span></td>" +
                                                "<td><i class='layui-table-hd'>使用会议室时间</i><span class='layui-table-bd'>"+data[i].appointStart+"&nbsp;~&nbsp;"+data[i].appointEnd+"</span></td>" +
                                                "<td><i class='layui-table-hd'>预约时间</i><span class='layui-table-bd'>"+data[i].appointCreateDate+"</span></td>" +
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
                }else {
                    layer.msg("数据加载时出错");
                }
            }
        });
    });
 


});