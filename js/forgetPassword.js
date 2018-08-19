/**
 * Created by xiong on 2018/4/13.
 */
layui.use(['jquery', 'layer', 'form'], function () {
    var $ = layui.jquery;
    var layer = layui.layer;
    var form = layui.form;

    //弹框
    var popup = function (str, func) {
        layer.open({
            title: '提示',
            btn: ['确认'],
            yes: func,
            closeBtn: 0,
            shade: 0.5,
            anim: 5,
            move: false,
            area: ['250px', '160px'],
            type: 1,
            content: str
        });
    };
    
    // 提交修改密码
    $("#changes").click(function () {
        var userName = $('#userName').val();
        var authorization = $('#authorization').val();
        var newPassword1 = $('#newPassword1').val();
        var newPassword2 = $('#newPassword2').val();
        var newPasswordLength = newPassword1.length;

        //密码正则验证：不可以为纯字母、纯数字、纯特殊字符
        var passwordParn = /^(?:\d+|[a-zA-Z]+|[!@#$%^&.*]+)$/;

        if (userName === '') {
            popup("\<\div style='padding:20px;'>请输入账号！\<\/div>");
        } else if (authorization === '') {
            popup("\<\div style='padding:20px;'>授权码为空！\<\/div>");
        } else if (newPassword1 === '' && newPassword2 === '') {
            popup("\<\div style='padding:20px;'>新密码不能为空！\<\/div>");
        } else if (passwordParn.exec(newPassword1) || newPasswordLength < 8) {
            popup("\<\div style='padding:20px;'>密码不符合规定！\<\/div>");
        } else if (newPassword1 !== newPassword2) {
            popup("\<\div style='padding:20px;'>新密码不一致！\<\/div>");
        }

        if (userName !== '' && newPassword1 === newPassword2 && authorization !== '' && newPassword1 !== '' &&
            newPassword2 !== '' && newPasswordLength >= 8 && !passwordParn.exec(newPassword1)) {
            //URL路径
            $.post("http://47.94.206.242/meet/admin/findBackPassword.action", {
                "adminPassword": newPassword1,
                "adminId": userName,
                "keyId": authorization
            }, function (data) {

                // console.log(result);
                if (data.status == "1") {
                    //密码修改成功
                    popup('\<\div style="padding:20px;">密码更改成功！\<\/div>', function (index, layero) {
                        window.location.href = "login.jsp";
                    });
                }
                else if (data.status == "-1") {
                    //授权码错误
                    // $("#false").html("原密码输入错误");
                    popup('\<\div style="padding:20px;">授权码过期\<\/div>');
                }
                else if (data.status == "-2") {
                    // 用户与授权码不对应
                    popup('\<\div style="padding:20px;">用户与授权码不对应\<\/div>');
                } else if (data.statue == "0") {
                    //用户不存在 
                    popup('\<\div style="padding:20px;">用户不存在\<\/div>');
                }
            });
        }
        return false;
    });
});