layui.use(['jquery', 'layer'], function () {
    var $ = layui.jquery,
        layer = layui.layer;
    $(function () {
        FastClick.attach(document.body);
    });

    var cancelReservation = [];
    var breakReservation =[];

    // 近七天图表数据
    var useOfTheLastSevenDays = function () {
        var myChart = echarts.init(document.getElementById('useOfTheLastSevenDays'));
        $.ajax({
            url:'http://120.78.91.71:80/Meeting/admin/countRoomAndGuest.action',
            type:'GET',
            dataType:'JSON',
            success: function (data) {
                console.log(data);
                $("#lastLoginTime").html(data.lastTime);
                $("#todayVisit").html(data.details[6].vistPeople);
                $("#endVisit").html(data.details[6].overPeople);
                $("#reservelRoom").html(data.details[6].roomNumber);
                $("#signRoom").html(data.details[6].roomArrive);

                var date=[];
                var reservePeople =[];
                var visitPeople =[];
                var reserveRoom =[];
                var visitRoom = [];
                for(var i=0;i<data.details.length;i++){
                    date.push(data.details[i].dayDetail);
                    reservePeople.push(data.details[i].vistPeople);
                    visitPeople.push(data.details[i].overPeople);
                    reserveRoom.push(data.details[i].roomNumber);
                    visitRoom.push(data.details[i].roomArrive);
                }
                var option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    title : {
                        text: '近七天使用情况'
                    },
                    legend: {
                        data: ['预约人数', '实际拜访人数', '被预约会议室的数量', '实际被拜访会议室的数量']
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: date
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '预约人数',
                            type: 'line',
                            data: reservePeople
                        }, {
                            name: '实际拜访人数',
                            type: 'line',
                            data: visitPeople
                        }, {
                            name: '被预约会议室的数量',
                            type: 'line',
                            data: reserveRoom
                        },
                        {
                            name: '实际被拜访会议室的数量',
                            type: 'line',
                            data: visitRoom
                        }]
                };
                myChart.setOption(option);
                //随窗口大小自适应
                window.addEventListener("resize",function(){
                    myChart.resize();
                });

            }
        });
    };

    // 近七年图表数据
    var useOfTheLastSevenYears = function (cancelReservation, breakReservation) {
        var myChart = echarts.init(document.getElementById('useOfTheLastSevenYears'));
        $.ajax({
            url:'http://47.94.206.242/meet/admin/statVisitByYearRange.action',
            type:'GET',
            dataType:'JSON',
            success: function (data) {
                var years = [];
                var yearValue = [];
                console.log(data);
                for(var i = 0; i < data.length; i++) {
                    years.push(data[i].key);
                    yearValue.push(data[i].value);
                }
                var option = {
                    color: ['#003366', '#4cabce', '#e5323e'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '3%',
                        bottom: '5%',
                        containLabel: true
                    },
                    title : {
                        text: '近七年使用情况'
                    },
                    legend: {
                        data: ['会议室使用次数', '取消预约次数', '爽约次数']
                    },
                    xAxis: {
                        type: 'category',
                        data: years
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '会议室使用次数',
                            type: 'bar',
                            data: yearValue,
                            barGap:'10%',
                            barCategoryGap:'60%',
                            animation: false,
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            }
                        },
                        {
                            name: '爽约次数',
                            type: 'bar',
                            data: cancelReservation,
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            }
                        },
                        {
                            name: '取消预约次数',
                            type: 'bar',
                            data: breakReservation,
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            }
                        }]
                };
                myChart.setOption(option);
                //随窗口大小自适应
                window.addEventListener("resize",function(){
                    myChart.resize();
                });

            }
        });
    };

    // 页面初始化
    setTimeout(function () {
        useOfTheLastSevenDays();
        $.ajax({
            url:'http://47.94.206.242/meet/admin/statAppintmentByYearRangeByStatus.action?status=-1',
            type:'POST',
            dataType:'JSON',
            success: function (data) {
                cancelReservation = data;
                $.ajax({
                    url:'http://47.94.206.242/meet/admin/statAppintmentByYearRangeByStatus.action?status=-2',
                    type:'POST',
                    dataType:'JSON',
                    success: function (result) {
                        cancelReservation = data;
                        breakReservation = result;
                        useOfTheLastSevenYears(cancelReservation, breakReservation);
                    }
                });

            }
        });
    },100);

});