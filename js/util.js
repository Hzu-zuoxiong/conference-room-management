/**
 * Created by xiong on 2018/8/2.
 */
// 格式化日期代码
function dateFormate(data, format) {
    let date = new Date(data);
    let args = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),  //quarter
        "S": date.getMilliseconds()
    };
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var i in args) {
        var n = args[i];
        if (new RegExp("(" + i + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
    }
    return format;
}

// 取URL参数
function splitUrl(url) {
    var str = url.split("?")[1];
    if (str) {
        var items = str.split("&");
        var arr = {};
        var json = {};
        for (var i = 0; i < items.length; i++) {
            arr = items[i].split("=");
            json[arr[0]] = arr[1];
        }
    }
    return json;
}

// URL中文参数转码
function getQueryString(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
}

// 导出excel,利用表单提交数据
function Excelpost(url, params) {
    var temp = document.createElement("form");
    temp.action = url;
    temp.method = "post";
    temp.style.display = "none";
    for (var i in params) {
        var opt = document.createElement("input");
        opt.name = i;
        opt.value = params[i];
        temp.appendChild(opt);
    }
    document.body.appendChild(temp);
    temp.submit();
    return temp;
}