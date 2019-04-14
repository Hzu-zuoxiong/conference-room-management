|-- MeetingRoomManagementSystem
|-- .browserslistrc
|-- .eslintrc.js
|-- .gitignore
|-- babel.config.js
|-- cypress.json
|-- package-lock.json
|-- package.json
|-- postcss.config.js
|-- README.md
|-- vue.config.js // webpack 配置文件
|-- public
| |-- favicon.ico
| |-- index.html
|-- ReadMe // 存放 readme.md 的图片文件
| |-- meetingRoomManagement.gif
| |-- statisticsAndOperation.gif
|-- src
|-- App.vue
|-- main.js
|-- router.js // 路由文件
|-- utils.js // 常用工具
|-- assets // 静态资源
| |-- logo.png
| |-- css
| | |-- common.scss
| | |-- reset.scss
| | |-- variables.scss
| |-- images
| |-- bj.jpg
| |-- closeX.png
| |-- nav.png
|-- components
| |-- common // 公共组件
| | |-- InfoSearch.vue // 搜索组件
| | |-- vAside.vue // 侧边栏组件
| | |-- vHeader.vue // 头部组件
| |-- councilRoomManage // 会议室管理组件
| | |-- appointmentInfo.vue
| | |-- councilRoomInfo.vue
| | |-- usedRecord.vue
| |-- IndexPage // 首页组件
| | |-- indexPage.vue
| |-- statisticalAnalysis // 统计分析组件
| | |-- roomAnalysis // 会议室统计分析
| | | |-- capacityAnalysis.vue
| | | |-- councilRoomAnalysis.vue
| | | |-- timeAnalysis.vue
| | |-- visitorAnalysis // 访客统计分析
| | |-- visitorActionAnalysis.vue
| |-- systemSetting // 系统日志组件
| | |-- systemLog.vue
| |-- userManage // 用户信息组件
| | |-- userInfo.vue
| |-- visitorManage // 访客管理组件
| |-- accessRecord.vue
| |-- appointmentInfo.vue
| |-- visitorInfo.vue
|-- mixins // 接口文件
| |-- ajax.js
| |-- fetch.js
|-- pages  
 |-- index.vue
|-- login.vue
