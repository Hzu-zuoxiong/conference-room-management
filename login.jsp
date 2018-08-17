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
</head>
<body class="body_bj">
<div id="particles-js">
        <div class="login">
            <div class="logo">
                <span>掌上智能访客及会议室管理系统</span><br/>
                <span> <font size="3" color="red">
                ${sessionScope.message }</font></span>
            </div>
            <ul class="login-list" onkeydown="enterLogin()">
                <li><input id="username" type="text" placeholder="请输入账号"></li>
                <li><input id="password" type="password" placeholder="请输入密码"></li>
                <li><a id="login" class="btn">登 录</a></li>
                <li class="tar"><a href="forgetPassword.html">忘记密码？</a></li>
            </ul>
        </div>
</div>

<script type="text/javascript" src="<%=basePath %>layui/layui.js"></script>
<script type="text/javascript" src="<%=basePath %>js/particles.min.js"></script>
<script type="text/javascript" src="<%=basePath %>js/login.js"></script>
</body>
</html>