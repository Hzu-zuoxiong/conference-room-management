// 格式化日期代码
export function dateFormate(data, format) {
  let date = new Date(data);
  let args = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3), //quarter
    S: date.getMilliseconds()
  };
  if (/(y+)/.test(format))
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  for (var i in args) {
    var n = args[i];
    if (new RegExp('(' + i + ')').test(format))
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? n : ('00' + n).substr(('' + n).length)
      );
  }
  return format;
}

// 拆分管理员字段
export function $_splitField(args) {
  let manager = [];
  // 数组
  for (let i = 0; i < args.length; i++) {
    if (args[i].room) {
      manager = args[i].room.roomManager.split('#');
    } else {
      manager = args[i].roomManager.split('#');
    }
    args[i].administrator = manager[0];
    args[i].adminContact = manager[1];
  }
}
