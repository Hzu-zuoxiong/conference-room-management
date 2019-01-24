# MeetingRoomManagementSystem

该会议室管理后台系统有以下功能：
* 查询当天、近七天、近七年访客与会议室使用数据
* 访客管理（访客信息、访客预约、访客访问）
* 会议室管理（会议室信息、会议室预约、会议室使用）
* 会议室与访客不同类型的统计分析
* 用户管理
* 操作日志

管理员账号：admin
管理员密码：admin-123

该系统原先使用渐进式vue与layui框架进行搭建（git版本 3bce2f3bf88855312890e1b2e1c8e5e7cd5ea4a0）

现如今的文件目录列表为: [文件目录](/oldProjectMddir.md "文件目录")
```
// 可使用git回退到原版本查看
git reset --hard 3bce2f3bf88855312890e1b2e1c8e5e7cd5ea4a0
```
现在已经对该系统进行重构，使用vue-cli3.0和ElementUI进行搭建,项目尚未完成，正在努力完善当中

现如今的文件目录列表为: [文件目录](/newProjectMddir.md "文件目录")

## 效果如图：
![图片名称](/ReadMe/meetingRoomManagement.gif)
![图片名称](/ReadMe/statisticsAndOperation.gif)