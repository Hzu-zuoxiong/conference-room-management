/**
 * Created by nole on 2018/4/23.
 */
layui.use(['jquery', 'form', 'laydate', 'layer', 'laypage', 'element'], function () {
    var $ = layui.jquery,
        laydate = layui.laydate,
        layer = layui.layer,
        laypage = layui.laypage,
        element = layui.element;
    form = layui.form;
    $(function () {
        FastClick.attach(document.body);
    });

    // element.on('tab(docDemoTabBrief)', function(data){
    //     // console.log(this); //当前Tab标题所在的原始DOM元素
    //     // console.log(data.index); //得到当前Tab的所在下标
    //     // console.log(data.elem); //得到当前的Tab大容器
    //     // document.getElementById("all").selected=true;
    // });

    // 防抖函数
    function debounce(fn, delay) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        }
    }

    // 访客行为统计，圆饼图
    // 默认参数用来判断是否为下拉框选择渲染，防止绑定两次鼠标悬浮事件
    var drawGuestBehave = function (flag = false) {
        var myChart3 = echarts.init(document.getElementById('guestBehave'), 'macarons');
        $("#guestBehave").css('width', $('#guestBehave').width());
        var day = $("#day").val();
        day = day == '' ? -1 : day;
        $.ajax({
            type: "POST",
            data: {
                day: day
            },
            dataType: "JSON",
            url: "http://47.94.206.242:80/meet/admin/statGuestRoomTag.action",
            success: function (data) {
                var option = {
                    title: {
                        text: '访客访问情况统计',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['培训会', '例会', '节日活动', '学术报告', '招待会', '其他']
                    },
                    series: [
                        {
                            name: '数量',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: [
                                {value: data[1], name: '培训会'},
                                {value: data[2], name: '例会'},
                                {value: data[3], name: '节日活动'},
                                {value: data[4], name: '学术报告'},
                                {value: data[5], name: '招待会'},
                                {value: data[0], name: '其他'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                myChart3.setOption(option, true);
                // 下拉框选择不绑定鼠标悬浮事件
                if (!flag) {
                    myChart3.on('mouseover', function (params) {
                        debounce(guestBehaveAnalysic(params.dataIndex, params.name), 500);
                    });
                }
                window.addEventListener("resize", function () {
                    myChart3.resize();
                });
            }
        });

    };

    //访客行为统计，柱形图
    var guestBehaveAnalysic = function (index, name) {
        var myChart4 = echarts.init(document.getElementById('guestBehaveAnalysic'), 'macarons');
        $("#guestBehaveAnalysic").css('width', $('#guestBehaveAnalysic').width());
        $(".loadingContent1").fadeOut();
        // var day = sessionStorage.getItem("day");
        var day = $("#day").val();
        day = day == '' ? -1 : day;
        // console.log(day)
        $.ajax({
            data: {
                tagName: name,
                day: day
            },
            // async: false,
            type: "POST",
            dataType: "JSON",
            url: "http://47.94.206.242/meet/admin/statVisitByTagNameAndDay.action",
            success: function (data) {
                // console.log(data);
                guestName = [];
                guestTimes = [];
                // console.log(data);
                for (var i = 0; i < data.length - 1; i++) {
                    // foldLindeDataTime.push(new Date(data[i].key).format("yyyy-MM-dd"));
                    guestName.push(data[i].key)
                    guestTimes.push(data[i].value)
                }

                var option = {
                    title: {
                        text: '访问量前5的访客',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: guestName,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '访问次数',
                            type: 'bar',
                            barWidth: '20%',
                            data: guestTimes,
                            itemStyle: {
                                //通常情况下：
                                normal: {
                                    //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                                    color: function (params) {
                                        var colorList = ['#878787', '#A4D3EE', '#836FFF', '#63B8FF', '#5CACEE'];
                                        return colorList[params.dataIndex];
                                    }
                                },
                                //鼠标悬停时：
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                        }
                    ]
                };
                myChart4.setOption(option, true);
                $("#guestBehaveAnalysic").css("display", "block");
                window.addEventListener("resize", function () {
                    myChart4.resize();
                });
            },
            error: function (textStatus) {
                console.log(textStatus);
            }
        });
    };

    //访客考勤情况，圆饼图
    // 默认参数用来判断是否为下拉框选择渲染，防止绑定两次鼠标悬浮事件
    var drawGuestAttendance = function (flag = false) {
        var myChart10 = echarts.init(document.getElementById('guestAttendance'), 'macarons');
        // var day = sessionStorage.getItem("day")
        // $('.loadingContent1').fadeOut();
        var day = $("#day").val();
        day = day == '' ? -1 : day;
        // console.log(day);
        $("#guestAttendance").css('width', $('#guestAttendance').width());

        $.ajax({
            url: 'http://47.94.206.242/meet/admin/statAttendance.action',
            type: 'POST',
            dataType: 'JSON',
            data: {
                day: day
            },
            success: function (data) {
                var option = {
                    title: {
                        text: '访客考勤统计情况',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['提前到', '准时', '早退', '到点退场', '爽约']
                    },
                    series: [
                        {
                            name: '考勤情况',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: [
                                {value: data[0], name: '提前到'},
                                {value: data[1], name: '准时'},
                                {value: data[2], name: '早退'},
                                {value: data[3], name: '到点退场'},
                                {value: data[4], name: '爽约'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                myChart10.setOption(option, true);
                // 下拉框选择不绑定鼠标悬浮事件
                if (!flag) {
                    myChart10.on('mouseover', function (params) {
                        // console.log(params.dataIndex);
                        // console.log(params.name);
                        debounce(guestAttendanceAnalysic(params.dataIndex, params.name), 500);
                    });
                }
                // console.log(myChart1);
                window.addEventListener("resize", function () {
                    myChart10.resize();
                });
            }
        })
    };

    //访客考勤柱状图
    var guestAttendanceAnalysic = function (index, name) {
        var myChart4 = echarts.init(document.getElementById('guestAttendanceAnalysic'), 'macarons');
        $("#guestAttendanceAnalysic").css('width', $('#guestAttendanceAnalysic').width());
        $('.loadingContent2').fadeOut();
        console.log(name);
        // console.log(index);
        // var day = sessionStorage.getItem("day");
        var day = $("#day").val();
        day = day == '' ? -1 : day;
        // console.log(index);
        // console.log(day);
        $.ajax({
            data: {
                status: index,
                day: day
            },
            // async: false,
            type: "POST",
            dataType: "JSON",
            url: "http://47.94.206.242/meet/admin/statDifAttendanceAndGuestName.action",
            success: function (data) {
                console.log(data);
                guestName = [];
                guestTimes = [];
                // console.log(data);
                for (var i = 0; i < data.length; i++) {
                    // foldLindeDataTime.push(new Date(data[i].key).format("yyyy-MM-dd"));
                    guestName.push(data[i].key);
                    guestTimes.push(data[i].value);
                }

                var option = {
                    title: {
                        text: name + '的次数',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: guestName,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: name + '的次数',
                            type: 'bar',
                            barWidth: '20%',
                            data: guestTimes,
                            itemStyle: {
                                //通常情况下：
                                normal: {
                                    //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                                    color: function (params) {
                                        var colorList = ['#878787', '#A4D3EE', '#836FFF', '#63B8FF', '#5CACEE'];
                                        return colorList[params.dataIndex];
                                    }
                                },
                                //鼠标悬停时：
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                        }
                    ]
                };
                myChart4.setOption(option, true);
                myChart4.on('mouseover', function (param) {

                    $.ajax({
                        url: 'http://47.94.206.242/meet/admin/findDetailsByGuestName.action',
                        type: 'POST',
                        data: {
                            guestName: param.name
                        },
                        dataType: 'JSON',
                        success: function (data) {
                            layer.open({
                                type: 1,
                                title: '该访客信息',
                                offset: 'auto',
                                id: 'lay', //防止重复弹出
                                content: '<div style="padding: 20px 90px;">' + '姓名:' + data.guestName + '</br>电话:' + data.guestTelephone + '</br>邮箱:' + data.guestEmail + '</div>',
                                btn: '确定',
                                btnAlign: 'c', //按钮居中
                                shade: 0 //不显示遮罩
                            });
                        }
                    })
                });
                $("#guestAttendanceAnalysic").css("display", "block");
                window.addEventListener("resize", function () {
                    myChart4.resize();
                });
            },
            error: function (textStatus) {
                console.log(textStatus);
            }
        });
    };

    form.on('select(viewTime)', function (data) {
        console.log("form:" + data.value); //得到被选中的值
        $("#day").val(data.value);
        var day = $("#day").val();
        day = day == '' ? -1 : day;
        console.log(day);
        //  debugger;
        //  sessionStorage.setItem("day",data.value);
        //  window.location.reload();
        $("#guestBehaveAnalysic").css("display", "none");
        $("#guestAttendanceAnalysic").css("display", "none");

        // 参数true代表为下拉框选择渲染
        drawGuestBehave(true);
        drawGuestAttendance(true);
        //  debugger;
        // $("#guestAttendance").css('display','none');
    });

    //页面加载绘制访客行为圆饼图
    drawGuestBehave();
    $(".tabToggle").click(function () {
        if ($(this).val() == 1) {
            drawGuestAttendance();//第二个tab图表初始化 
            // drawGuestAttendancer();
            // $("#guestAttendance").css('display','block');
        }
    })
});