layui.use(["element", "layer"], function () {
    var $ = layui.jquery,
        element = layui.element,
        layer = layui.layer;
        $(function () {
        var l_o = $(".left-menu"),
            tab = "top-tab",
            l_m = "left-menu",
            t_m = "top-menu";
        var mainHeight = $(window).height() - 60;
        l_o.on("click", "li", function () {
            $(this).siblings().removeClass("layui-nav-itemed")
        });

        // 本地存储
        l_o.find("a[data-id]").click(function () {
            sessionStorage .dataId = $(this).attr('data-id')
        });

        $(".menu-flexible").click(function () {
            $(".left-menu-all").toggle();
            $(".layui-body,.layui-footer").css("left", ($(".left-menu-all").is(":hidden")) ? "0" : "200px")
        });

        // 判断是否有本地存储
        if (sessionStorage .getItem('dataId')) {
            var dataId = sessionStorage .getItem('dataId')
            var getNowId = l_o.find("a[data-id=" + dataId + "]")
            var getNowParent = $(getNowId).parent()

            $(getNowParent).addClass('layui-this')
            console.log($(getNowParent)[0]);
            // 判断是否需要展开
            if ($(getNowParent)[0].tagName == 'DD') {
                $(getNowId).parents('.layui-nav-item').addClass('layui-nav-itemed');
            }
        }
        // 目录
        $(document).on("click", ".mulu, .masked", function () {
            $('body').toggleClass('mulu-hide');
        });

        document.body.addEventListener('touchstart', function () { });

    });



    // 搜索
    $(document).on('click', '#search-btn', function () {
        $('.search-res-mask').show();
        $(this).parent().siblings('.search-fix').addClass('cur');

    })

    $(document).on('click', '#search-close', function () {
        $('.search-res-mask').hide();
        $(this).parents('.search-fix').removeClass('cur');

    })

    $(document).on('click', '.search-res-mask', function () {
        $('#search-close').trigger('click');
    })

    // 移动端下拉
    $(document).on('click', '.layui-table .layui-table-first', function () {
        if ($(window).width() > 992) {
            return;
        }
        if ($(this).hasClass('cur')) {
            $(this).siblings().hide();
            $(this).removeClass('cur');
        } else {
            $($(this).siblings()).css('display', '-webkit-box');
            $(this).addClass('cur');
        }
    })

});
  


var header = {
    template:`  
        <!-- 头部 -->
        <div class="layui-header ">
            <div class="layui-main">
                <div class="top-left">
                    <!-- logo -->
                    <a href="javascript:;" class="mulu"><img src="img/nav.png" alt="导航logo"></a>
                    <a href="javascript:;" class="logo">掌上智能访客及会议室管理系统</a>
                    <a href="javascript:;" class="menu-flexible ml10">
                        <i class="layui-icon" id="option">&#xe635;</i> 
                    </a>
                </div>
                <!-- 头部右侧操作 -->
                <ul class="layui-nav operate">
                    <li class="layui-nav-item">
                        <a href="javascript:;">系统管理员</a>
                        <dl class="layui-nav-child">
                            <dd>
                                <a href="forgetPassword.html" class="edit-password">修改密码</a>
                            </dd>
                            <dd>
                                <a href="http://47.94.206.242/meet/admin/logout.action">退出登录</a>
                            </dd>
                        </dl>
                    </li>
                </ul>
            </div>
        </div>
        `
};


var leftSlide =
    {
        template: `   
        <!-- 左侧菜单 -->
        <div class="layui-side layui-bg-black left-menu-all ">
            <div class="layui-side-scroll">
                <div class="info">
                    <div class="name">系统管理员，欢迎您！</div>
                    <div class="oper box">
                        <a class="flex edit-password" href="resetPassword.html">修改密码</a>
                        <a class="flex">退出登录</a>
                    </div>
                </div>
                <ul class="layui-nav layui-nav-tree left-menu" lay-filter="left-menu">
                    <li class="layui-nav-item ">
                        <a href="index.html" data-id="1"><img src="img/index.png" alt="首页logo" style="display: inline-block;width:15px;height:15px;margin-right:8px;margin-bottom:3px;">后台首页</a>
                    </li>
                    <li class="layui-nav-item">
                        <a href="javascript:;"><img src="img/account.png" alt="访客logo" style="display: inline-block;width:15px;height:15px;margin-right:8px;margin-bottom:3px;">访客管理</a>
                        <dl class="layui-nav-child">
                            <dd>
                                <a href="visitorInfo.html" data-id="2" id="guestInfo">访客信息</a>
                            </dd>
                            <dd>
                                <a href="visitorReserveInfo.html" data-id="3"id="guestReservelInfo" >访客预约信息</a>
                            </dd>
                            <dd>
                                <a href="visitHistory.html" data-id="4">访客访问记录</a>
                            </dd>
                        </dl>
                    </li>
                    <li class="layui-nav-item">
                        <a href="javascript:;"><img src="img/room.png" alt="会议室logo" style="display: inline-block;width:15px;height:15px;margin-right:8px;margin-bottom:3px;">会议室管理</a>
                        <dl class="layui-nav-child">
                            <dd>
                                <a href="meetingRoomInfo.html" id="meetingRoomInfo" data-id="5">会议室信息</a>
                            </dd>
                            <dd>
                                <a href="meetingRoomReservelInfo.html" id="meetingRoomReservelInfo" data-id="6">会议室预订信息</a>
                            </dd>
                            <dd>
                                <a href="meetingRoomUsedHistory.html" data-id="7">会议室使用记录</a>
                            </dd>
                        </dl>
                    </li>
                    <li class="layui-nav-item">
                        <a href="javascript:;"><img src="img/icon-statics.png" alt="统计logo" style="display: inline-block;width:15px;height:15px;margin-right:8px;margin-bottom:3px;">统计分析</a>
                        <dl class="layui-nav-child">
                            <dd>
                                <a href="meetingRoomAnalysic.html" data-id="8">会议室统计分析</a>
                            </dd>
                            <dd>
                                <a href="visitorBehave.html" data-id="9">访客行为分析</a>
                            </dd>
                        </dl>
                    </li>
                    <li class="layui-nav-item">
                        <a href="javascript:;"><img src="img/account.png" alt="用户logo" style="display: inline-block;width:15px;height:15px;margin-right:8px;margin-bottom:3px;">用户管理</a>
                        <dl class="layui-nav-child">
                            <dd>
                                <a href="userInfo.html" data-id="10">用户信息</a>
                            </dd>
                            <!-- <dd>
                                 <a href="" data-id="11">会员账号</a>
                             </dd> -->
                        </dl>
                    </li>
                    <li class="layui-nav-item">
                        <a href="javascript:;"><img src="img/set.png" alt="设置logo" style="display: inline-block;width:15px;height:15px;margin-right:8px;margin-bottom:3px;">系统设置</a>
                        <dl class="layui-nav-child">
                            <dd>
                                <a href="optionLog.html" data-id="12">操作日志</a>
                            </dd>
   
                        </dl>
                    </li>
                </ul>
            </div>
        </div>
        `
    };

// 创建根实例
new Vue({
    el: '#header',
    components: {
        'header-component': header
    },
//    methods:{
//    	logout:function(){
//    		$.ajax({			
//    			url:'http://47.94.206.242/meet/admin/logout.action', //注销接口
//    			dataType:'JSON',
//    			type:'GET',
//    			debugger
//    			success:function(data){
//    				window.location.href="login.jsp";
//    			}
//    		})
//    	}
//    }

});

new Vue({
    el: '#leftSlide',
    components: {
        'leftslide-component': leftSlide
    }
});



