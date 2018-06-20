
layui.use(['jquery', 'layer'], function () {
    var $ = layui.jquery,
        layer = layui.layer;
    //弹框
    var popup = function(str, func) {
        layer.open({
            title: '提示',
            btn: ['确认'],
            yes: func,
            closeBtn: 0,
            shade: 0.5,
            anim: 5,
            move:false,
            area: ['250px', '160px'],
            type: 1,
            content: str
        });
    };
    
    $('#login').click(function() {
        var username = $('#username').val();
        var password = $('#password').val();
        
        if(username !== "" && password !== "") {
            $.ajax({
                type: "POST",
                url: "http://47.94.206.242/meet/admin/login.action", //登录接口
                dataType: "JSON",
                data: {
                    "adminId": username,
                    "adminPassword": password,
                    // "keyId":1,
                },
                success:function(data) {
                    switch(data.status) {
                        case 1://账号密码正确
                            popup('\<\div style="padding:20px;">登录成功\<\/div>',function (index,layero) {
                            	//TODO
                                window.location.href = "index.html";
                            });
                            break;
                        case 0://
                            popup('\<\div style="padding:20px;">用户不存在！\<\/div>');
                            break;
                        case -1://
                             popup('\<\div style="padding:20px;">授权码过期！\<\/div>');
                             break;
                        case -2:
                            popup('\<\div style="padding:20px;">用户密码错误！\<\/div>');
                            break;  
                    }
                }
            });
        } else {
            layer.open({
                title: '提示',
                btn: ['确认'],
                closeBtn: 0,
                shade: 0.5,
                time: 2500,
                anim: 5,
                move:false,
                area: ['250px', '160px'],
                type: 1,
                content: '\<\div style="padding:20px;">请输入你的账号密码！\<\/div>'
            });
        }
    });
});

//Canvas背景
particlesJS('particles-js',
    {
        "particles": {
            "number": {
                "value": 70,  //数量
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#ffffff"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                },
                "image": {
                    "src": "img/github.svg",
                    "width": 100,
                    "height": 100
                }
            },
            "opacity": {
                "value": 0.3,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#ffffff",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 1,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": false,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 150,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": false
    }
);