<%@ page language="java" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="en">
<head>
	<title>掌上智能访客及会议室管理系统</title>
    <meta charset="UTF-8">
    <meta name="keywords" content="">
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1, user-scalable=0" name="viewport">
    <meta content="yes" name="apple-mobile-web-app-capable">
    <meta content="black" name="apple-mobile-web-app-status-bar-style">
    <meta content="telephone=no" name="format-detection">
	<link rel="stylesheet" href="<%=basePath %>login/css/style.css"/>
    <!-- 提示升级高级浏览器操作 -->
    <style>
    	.ie-content{  position: fixed; left: 0; top: 0; right: 0; bottom:0; background:#fff; z-index: 1000;}
		.ie-content-bj{ width: 1000px; height: 380px; position: fixed; left: 50%; top: 36%; margin:-190px 0 0 -500px; background:url(img/sj.jpg) no-repeat; }
		.ie-list{ padding:168px 0 0 371px; }
		.ie-list a{ margin-right: 80px; }

		#particles-js {
            width: 100%;
            height: 100%;
            /* background: #000; */
            background-size: cover;
            background-position: 50% 50%;
            background-repeat: no-repeat;
        }
    </style>
</head>
<body class="body_bj">
<div id="particles-js">
<div class="login">
	<div class="logo">
		<span>掌上智能访客及会议室管理系统</span><br/>
		<span> <font size="3" color="red">
		${sessionScope.message }</font></span>
		
	</div>
	<ul class="login-list">
		<li><input id="username" type="text" placeholder="请输入账号"></li>
		<li><input id="password" type="password" placeholder="请输入密码"></li>
		<li><a id="login" class="btn">登 录</a></li>
		<li class="tar"><a href="forgetPassword.html">忘记密码？</a></li>
	</ul>
</div>
</div>
<!--[if lt IE 8]>
<div class="ie-content">
	<div class="ie-content-bj">
	    <div class="ie-list">
		    <a href="http://www.google.cn/intl/zh-CN/chrome/browser/"><img src="img/sj1.jpg" alt=""></a>
			<a href="http://www.firefox.com.cn/"><img src="img/sj2.jpg" alt=""></a>
			<a href="http://chrome.360.cn/"><img src="img/sj3.jpg" alt=""></a>	
	    </div>
	</div>
</div>
<![endif]-->

<script type="text/javascript" src="<%=basePath %>layui/layui.js"></script>
<script type="text/javascript" src="<%=basePath %>js/particles.min.js"></script>
<script type="text/javascript" src="<%=basePath %>js/login.js"></script>
</body>
</html>