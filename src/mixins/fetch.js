import Ajax from './ajax.js';

export default {
  methods: {
    // 获取账户信息
    $_fetch_account() {
      return Ajax({
        method: 'GET',
        url: 'im/getAccount.action'
      });
    },
    // 登陆
    $_fetch_login(loginParams) {
      return Ajax({
        method: 'POST',
        url: 'admin/login.action',
        data: loginParams
      });
    },
    // 退出登陆
    $_fetch_exitLogin() {
      return Ajax({
        method: 'GET',
        url: 'admin/logout.action'
      });
    },
    // 修改密码
    $_fetch_forgetPassWord(forgetParams) {
      return Ajax({
        data: forgetParams,
        method: 'POST',
        url: 'admin/findBackPassword.action'
      });
    },
    // 导出excel
    $_fetch_exportExcel(excelParams) {
      return Ajax({
        method: 'POST',
        url: 'admin/getExcel.action',
        data: excelParams,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      });
    },
    // 首页--近七年使用情况图表数据接口
    // 近七年会议室使用数据
    $_fetch_visitReservation() {
      return Ajax({
        method: 'GET',
        url: 'admin/statVisitByYearRange.action'
      });
    },
    // 近七年会议室取消数据
    $_fetch_cancelReservation() {
      return Ajax({
        method: 'GET',
        url: 'admin/statAppintmentByYearRangeByStatus.action?status=-1'
      });
    },
    // 近七年会议室爽约数据
    $_fetch_breakReservation() {
      return Ajax({
        method: 'GET',
        url: 'admin/statAppintmentByYearRangeByStatus.action?status=-2'
      });
    },
    // 访客管理页
    // 访客信息数据
    $_fetch_visitorInfo(visitorInfoParams) {
      return Ajax({
        params: visitorInfoParams,
        method: 'GET',
        url: 'admin/findGuestByCondition.action'
      });
    },
    // 预约用途数据
    $_fetch_appointPurpose() {
      return Ajax({
        method: 'GET',
        url: 'admin/findAllTag.action'
      });
    },
    // 访客预约数据
    $_fetch_visitorAppointInfo(AppointInfoParams) {
      return Ajax({
        params: AppointInfoParams,
        method: 'GET',
        url: 'admin/findAppointByCondition.action'
      });
    },
    // 访客访问记录
    $_fetch_visitorUsedRecordInfo(useRecordParams) {
      return Ajax({
        params: useRecordParams,
        method: 'GET',
        url: 'admin/findVisitByCondition.action'
      });
    },
    // 会议室管理页
    // 会议室信息数据
    $_fetch_councilRoomInfo(roomInfoParams) {
      return Ajax({
        params: roomInfoParams,
        method: 'GET',
        url: 'admin/findRoomByCondition.action'
      });
    },
    // 删除会议室信息
    $_fetch_deleteCouncilRoom(roomId) {
      return Ajax({
        params: roomId,
        method: 'GET',
        url: 'admin/deleteRoomByRoomId.action'
      });
    },
    // 更新会议室信息
    $_fetch_updateCouncilRoom(councilRoomInfo) {
      return Ajax({
        params: councilRoomInfo,
        method: 'GET',
        url: 'admin/updateRoom.action'
      });
    },
    // 会议室预订信息数据
    $_fetch_roomAppointmentInfo(AppointmentInfo) {
      return Ajax({
        params: AppointmentInfo,
        method: 'GET',
        url: 'admin/findRoomAppointByCondition.action'
      });
    },
    // 会议室使用记录数据
    $_fetch_roomUsedRecordInfo(usedRecordInfo) {
      return Ajax({
        params: usedRecordInfo,
        method: 'GET',
        url: 'admin/findRoomUsingByCondition.action'
      });
    },
    // 会议室统计分析页
    // 时间分布统计
    // 会议室时间统计，总折线图
    $_fetch_drawMeetingRoomUsedAll() {
      return Ajax({
        method: 'GET',
        url: 'admin/statAllVistByHoursRange.action'
      });
    },
    // 会议室时间统计，近期圆饼图
    $_fetch_drawMeetingRoomUsedNear() {
      return Ajax({
        method: 'GET',
        url: 'admin/statVisitByDayRange.action'
      });
    },
    // 会议室时间统计，近期折线图
    $_fetch_drawMeetingRoomUsedNearAnalysic(dateTime) {
      return Ajax({
        params: dateTime,
        method: 'GET',
        url: 'admin/statVisitByTimeSpan.action'
      });
    },
    // 容量分布统计
    // 会议室容量，圆饼图
    $_fetch_drawMeetingRoomCapacity() {
      return Ajax({
        method: 'GET',
        url: 'admin/statRoomByPeople.action'
      });
    },
    //会议室容量，折线图
    $_fetch_drawMeetingRoomAreaAnalysic(RoomAreaInfo) {
      return Ajax({
        params: RoomAreaInfo,
        method: 'GET',
        url: 'admin/statDirVisitByRoomPeopleAndQueryKindAndDate.action'
      });
    },
    // 会议室容量，柱状图
    $_fetch_drawMeetingRoomCapacityUsedNumber() {
      return Ajax({
        method: 'GET',
        url: 'admin/statDirRoomAllVisit.action'
      });
    },
    // 访客统计分析图
    // 访客行为统计，圆饼图
    $_fetch_drawGuestBehave(day) {
      return Ajax({
        params: day,
        method: 'GET',
        url: 'admin/statGuestRoomTag.action'
      });
    },
    // 访客行为统计，柱形图
    $_fetch_drawGuestBehaveAnalysic(guestBehaveAnalysicOptin) {
      return Ajax({
        params: guestBehaveAnalysicOptin,
        method: 'GET',
        url: 'admin/statVisitByTagNameAndDay.action'
      });
    },
    // 访客考勤情况，圆饼图
    $_fetch_drawGuestAttendance(day) {
      return Ajax({
        params: day,
        method: 'GET',
        url: 'admin/statAttendance.action'
      });
    },
    // 访客考勤分析, 柱状图
    $_fetch_drawGuestAttendanceAnalysic(guestAttendanceOptin) {
      return Ajax({
        params: guestAttendanceOptin,
        method: 'GET',
        url: 'admin/statDifAttendanceAndGuestName.action'
      });
    },
    // 获取用户信息数据
    $_fetch_userInfo(userInfo) {
      return Ajax({
        params: userInfo,
        method: 'GET',
        url: 'admin/findUserByCondition.action'
      });
    },
    // 更改用户权限
    $_fetch_updateUserAuthority(userId) {
      return Ajax({
        params: userId,
        method: 'GET',
        url: 'admin/updateUserAuthority.action'
      });
    },
    // 操作日志信息数据
    $_fetch_systemLogInfo(systemLogInfo) {
      return Ajax({
        params: systemLogInfo,
        method: 'GET',
        url: 'admin/findOperationByCondition.action'
      });
    }
  }
};
