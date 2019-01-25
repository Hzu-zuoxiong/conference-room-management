# MeetingRoomManagementSystem

## 掌上智能访客及会议室管理系统

该系统是在大三时期与朋友一起组队参加大学生计算机设计大赛的作品，我主要负责后台管理系统模块

该后台管理系统模块有以下功能：

- 查询当天、近七天、近七年访客与会议室使用数据
- 访客管理（访客信息、访客预约、访客访问）
- 会议室管理（会议室信息、会议室预约、会议室使用）
- 会议室与访客不同类型的统计分析
- 用户管理
- 操作日志

该系统原先使用渐进式 vue 与 layui 框架进行搭建（git 版本 3bce2f3bf88855312890e1b2e1c8e5e7cd5ea4a0），项目结构较为混乱。

```
// 可使用git回退到原版本查看
git reset --hard 3bce2f3bf88855312890e1b2e1c8e5e7cd5ea4a0
```

原先系统的文件目录列表为: [文件目录](/oldProjectMddir.md '文件目录')

现在已经对该系统进行重构，使用 vue-cli3.0 和 ElementUI 进行搭建,项目尚未完成，正在努力完善当中

现如今的文件目录列表为: [文件目录](/newProjectMddir.md '文件目录'

目前重构后还存在的 bug 有：

- 会议室与访客的详细信息跳转到预约信息的 bug
- 未实现会议室容量分布统计折线图日期条件限制
- 未实现访客统计日期条件限制
- 退出登陆功能(需修改后台接口)
- 未实现修改密码功能
- 部分接口报 Provisional headers are shown 错误

项目运行

```
// 安装依赖
npm install

// 项目运行
npm run serve

// 项目构建
npm run build

```

管理员账号： admin

管理员密码： admin-123

修改账号密码的授权码：0b47860265c14a7999648045a1e9a96e

## 效果如图：

![图片名称](/ReadMe/meetingRoomManagement.gif)

![图片名称](/ReadMe/statisticsAndOperation.gif)
