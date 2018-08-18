/**
 * Created by xiong on 2018/4/21.
 */
layui.use(['jquery', 'form', 'laydate', 'layer', 'laypage', 'element'], function () {
    var $ = layui.jquery,
        laydate = layui.laydate,
        layer = layui.layer,
        laypage = layui.laypage,
        element = layui.element;
    $(function () {
        FastClick.attach(document.body);
    });

    //会议室容量圆饼图数据
    var roundPieChart = [];
    //会议室容量折线图数据
    var foldLindeDataTime = [];
    var foldLindeDataNumber = [];

    //会议室容量时间段选择
    var beginTime = '';
    var endTime = '';
    /*var searchTime = $('#CapacityAnalysicTime').val();
     var beginTime = searchTime.split(' - ')[0];
     var endTime = searchTime.split(' - ')[1];*/

    //会议室容量单选框
    //圆饼图扇片index
    var fanIndex = 0;
    //圆饼图扇片值
    var fanValue = '小型（20人）';
    //tab选项转换
    $(".tabToggle").click(function () {
        if ($(this).val() == 1) {
            drawMeetingRoomCapacity();
            meetingRoomCapacityUsedNumber();
        }
    });

    //会议室时间统计，总折线图
    var drawMeetingRoomUsedAll = function () {
        var myChart1 = echarts.init(document.getElementById('meetingRoomUsedAll'));
        $.ajax({
            type: "GET",
            dataType: "JSON",
            url: "http://47.94.206.242/meet/admin/statAllVistByHoursRange.action",
            success: function (data) {
                var option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['会议室使用次数'],
                        orient: 'vertical',
                        left: 'center'
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['8:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '会议室使用次数',
                            type: 'line',
                            data: [
                                {value: data[0], name: ' 8:00-10:00'},
                                {value: data[1], name: '10:00-12:00'},
                                {value: data[2], name: '12:00-14:00'},
                                {value: data[3], name: '14:00-16:00'},
                                {value: data[4], name: '16:00-18:00'},
                                {value: data[5], name: '18:00-20:00'},
                                {value: data[6], name: '20:00-22:00'}
                            ]
                        }]
                };
                myChart1.setOption(option, true);
            }
        });

        myChart1.setOption(option, true);
        myChart1.on('mouseover', function (params) {
        });

        // console.log(myChart1);
        window.addEventListener("resize", function () {
            myChart1.resize();
        });
    };
    //会议室时间统计，近期圆饼图
    var drawmeetingRoomUsedNear = function () {
        var TimeRoundPieKey = [];
        var TimeRoundPieValue = [];
        var myChart1 = echarts.init(document.getElementById('meetingRoomUsedNear'));
        $.ajax({
            type: "GET",
            dataType: "JSON",
            url: "http://47.94.206.242/meet/admin/statVisitByDayRange.action",
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    TimeRoundPieKey.push(dateFormate(data[i].key, "yyyy-MM-dd"));
                    TimeRoundPieValue.push(data[i].value)
                }
                var option = {
                    title: {
                        text: '会议室近期时间统计',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: TimeRoundPieKey
                    },
                    series: [
                        {
                            name: '数量',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: [
                                {value: TimeRoundPieValue[0], name: TimeRoundPieKey[0]},
                                {value: TimeRoundPieValue[1], name: TimeRoundPieKey[1]},
                                {value: TimeRoundPieValue[2], name: TimeRoundPieKey[2]},
                                {value: TimeRoundPieValue[3], name: TimeRoundPieKey[3]},
                                {value: TimeRoundPieValue[4], name: TimeRoundPieKey[4]},
                                {value: TimeRoundPieValue[5], name: TimeRoundPieKey[5]},
                                {value: TimeRoundPieValue[6], name: TimeRoundPieKey[6]}
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
                myChart1.setOption(option, true);
                myChart1.on('mouseover', function (params) {
                    // console.log(params.dataIndex);
                    // // console.log(params.name);
                    drawMeetingRoomUsedNearAnalysic(params.name);
                });

            }
        });

        // console.log(myChart1);
        window.addEventListener("resize", function () {
            myChart1.resize();
        });
    };
    //会议室时间统计，近期折线图
    var drawMeetingRoomUsedNearAnalysic = function (name) {

        $('.loadingContent1').fadeOut('slow');

        var myChart = echarts.init(document.getElementById('meetingRoomUsedNearAnalysic'));
        var dateTime = name;

        $.ajax({
            data: {
                date: dateTime
            },
            type: "GET",
            dataType: "JSON",
            url: "http://47.94.206.242/meet/admin/statVisitByTimeSpan.action",
            success: function (data) {
                var option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [name + '会议室使用次数'],
                        orient: 'vertical',
                        left: 'center'
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['8:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: name + '会议室使用次数',
                            type: 'line',
                            data: data
                        }]
                };
                myChart.setOption(option, true);
            }
        });

        //随窗口大小自适应
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    };

    //会议室容量，圆饼图
    var drawMeetingRoomCapacity = function () {
        var myChart1 = echarts.init(document.getElementById('meetingRoomCapacity'), 'shine');
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: "http://47.94.206.242/meet/admin/statRoomByPeople.action",
            success: function (data) {
                if (data.status === 1) {
                    roundPieChart = data.dataList;
                    // console.log(roundPieChart);
                    var option = {
                        title: {
                            text: '会议室容量分布',
                            x: 'center'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                            data: ['小型（20人）', '中型（40人）', '偏大型（60人）', '大型（80人）', '豪华（100人）']
                        },
                        series: [
                            {
                                name: '数量',
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '60%'],
                                data: [
                                    {value: roundPieChart[0], name: '小型（20人）'},
                                    {value: roundPieChart[1], name: '中型（40人）'},
                                    {value: roundPieChart[2], name: '偏大型（60人）'},
                                    {value: roundPieChart[3], name: '大型（80人）'},
                                    {value: roundPieChart[4], name: '豪华（100人）'}
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
                    myChart1.setOption(option, true);
                    myChart1.on('mouseover', function (params) {
                        fanIndex = params.dataIndex;
                        fanValue = params.name;
                        drawMetingRoomAreaAnalysic(beginTime, endTime, params.name, params.dataIndex);
                    });
                }
            }
        });
        // console.log(myChart1);
        window.addEventListener("resize", function () {
            myChart1.resize();
        });
    };
    //会议室容量，折线图
    var drawMetingRoomAreaAnalysic = function (beginTime, endTime, name, index=0) {
        $('.loadingContent2').fadeOut();
        var myChart = echarts.init(document.getElementById('meetingRoomCapacityAnalysic'));
        const quarter = ['第一季度', '第二季度', '第三季度', '第四季度'];
        const month = ['1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号', '9号', '10号', '11号', '12号', '13号', '14号', '15号', '16号',
            '17号', '18号', '19号', '20号', '21号', '22号', '23号', '24号', '25号', '26号', '27号', '28号', '29号', '30号', '31号'];
        const weekend = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

        //判断选择季度、月、周
        var radioNum = document.getElementsByName('time');
        // 默认季度
        var xAx = quarter;
        var queryKind = 2;
        if (radioNum[1].checked) {
            queryKind = 1;
            xAx = month;
        } else if (radioNum[2].checked) {
            queryKind = 0;
            xAx = weekend;
        }

        //判断选择的容量
        var maxPeople = 0;
        if (index === 0) {
            maxPeople = 20;
        } else if (index === 1) {
            maxPeople = 40;
        } else if (index === 2) {
            maxPeople = 60;
        } else if (index === 3) {
            maxPeople = 80;
        } else if (index === 4) {
            maxPeople = 100;
        }

        $.ajax({
            data: {
                "queryKind": queryKind,
                "beginTime": beginTime,
                "endTime": endTime,
                "maxPeople": maxPeople
            },
            type: "POST",
            dataType: "JSON",
            url: "http://47.94.206.242/meet/admin/statDirVisitByRoomPeopleAndQueryKindAndDate.action",
            success: function (data) {
                // console.log(data);
                var yAx = data.dataList;
                // console.log(roundPieChart);
                var option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [name + '会议室使用次数'],
                        orient: 'vertical',
                        left: 'center'
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: xAx
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: name + '会议室使用次数',
                            type: 'line',
                            data: yAx
                        }]
                };
                myChart.setOption(option, true);
                window.addEventListener("resize", function () {
                    myChart.resize();
                });
            }
        });
    };

    //会议室容量折线图，季度年月选项事件
    $(".demo--radio:radio").click(function () {
        drawMetingRoomAreaAnalysic(beginTime, endTime, fanIndex, fanValue);
    });
    //日历组件渲染
    laydate.render({
        elem: '#CapacityAnalysicTime'
        , range: true
        , type: 'date'  // 'month'  'date' 'datetime'
        , done: function (value, endDate) {
            beginTime = value;
            endTime = endDate;
            console.log('日历：' + beginTime + ' ' + endDate);
            drawMetingRoomAreaAnalysic(value, endDate, fanIndex, fanValue);
        }
        , trigger: 'click'
    });

    //会议室容量，柱状图
    var meetingRoomCapacityUsedNumber = function (cancelReservation, breakReservation) {
        console.log('meetingRoomCapacityUsedNumber');
        var myChart = echarts.init(document.getElementById('meetingRoomCapacityUsedNumber'));

        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: "http://47.94.206.242/meet/admin/statDirRoomAllVisit.action",
            success: function (data) {
                // console.log(data);
                // console.log(roundPieChart);
                var option = {
                    color: ['#01AAED'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: {
                        left: '5%',
                        right: '5%',
                        bottom: '3%',
                        containLabel: true
                    },
                    title: {
                        text: '不同容量会议室的使用次数',
                        left: 'center'
                    },
                    xAxis: {
                        type: 'category',
                        data: ['小型（20人）', '中型（40人）', '偏大型（60人）', '大型（80人）', '豪华（100人）']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '使用次数',
                            type: 'bar',
                            barCategoryGap: '75%',
                            data: data,
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            }
                        }]
                };
                myChart.setOption(option, true);
                window.addEventListener("resize", function () {
                    myChart.resize();
                });
            }
        });
    }

    //页面加载绘制会议室容量圆饼图
    setTimeout(function () {
        drawMeetingRoomUsedAll();
        drawmeetingRoomUsedNear();
    }, 500);
});

