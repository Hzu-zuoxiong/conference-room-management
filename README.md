# MeetingRoomManagementSystem

## 掌上智能访客及会议室管理系统

该系统是在大三时期与朋友一起组队参加大学生计算机设计大赛的作品，我主要负责后台管理系统部分

该会议室管理后台系统有以下功能：

- 查询当天、近七天、近七年访客与会议室使用数据
- 访客管理（访客信息、访客预约、访客访问）
- 会议室管理（会议室信息、会议室预约、会议室使用）
- 会议室与访客不同类型的统计分析
- 用户管理
- 操作日志

该系统原先使用渐进式 vue 与 layui 框架进行搭建（git 版本 3bce2f3bf88855312890e1b2e1c8e5e7cd5ea4a0）

```
// 可使用git回退到原版本查看
git reset --hard 3bce2f3bf88855312890e1b2e1c8e5e7cd5ea4a0
```

原先系统的文件目录列表为: [文件目录](/oldProjectMddir.md '文件目录')

现在已经对该系统进行重构，使用 vue-cli3.0 和 ElementUI 进行搭建,项目尚未完成，正在努力完善当中

现如今的文件目录列表为: [文件目录](/newProjectMddir.md '文件目录')

目前存在的 bug 有：

- 未实现登录拦截
- 会议室与访客的详细信息跳转到预约信息的 bug
- 未实现会议室容量分布统计折线图日期条件限制
- 未实现访客统计日期条件限制
- 未实现退出登陆功能
- 未实现修改密码功能
- 部分接口报 Provisional headers are shown 错误

## 效果如图：

![图片名称](/ReadMe/meetingRoomManagement.gif)

![图片名称](/ReadMe/statisticsAndOperation.gif)
