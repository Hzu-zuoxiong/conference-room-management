import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: { title: '首页' },
      component: () => import('./pages/index.vue'),
      redirect: '/IndexPage',
      children: [
        {
          path: 'IndexPage',
          name: 'IndexPage',
          meta: { title: 'IndexPage' },
          component: () => import('cmpt/IndexPage/indexPage.vue')
        },
        // 访客管理路由
        {
          path: '/VisitorInfo',
          name: 'VisitorInfo',
          meta: { title: 'VisitorInfo' },
          component: () => import('cmpt/visitorManage/visitorInfo.vue')
        },
        {
          path: '/VisitorAppointmentInfo',
          name: 'VisitorAppointmentInfo',
          meta: { title: 'VisitorAppointmentInfo' },
          component: () => import('cmpt/visitorManage/appointmentInfo.vue')
        },
        {
          path: '/AccessRecord',
          name: 'AccessRecord',
          meta: { title: 'AccessRecord' },
          component: () => import('cmpt/visitorManage/accessRecord.vue')
        },
        // 会议室管理路由
        {
          path: '/councilRoomInfo',
          name: 'councilRoomInfo',
          meta: { title: 'councilRoomInfo' },
          component: () => import('cmpt/councilRoomManage/councilRoomInfo.vue')
        },
        {
          path: '/councilRoomAppointmentInfo',
          name: 'councilRoomAppointmentInfo',
          meta: { title: 'councilRoomAppointmentInfo' },
          component: () => import('cmpt/councilRoomManage/appointmentInfo.vue')
        },
        {
          path: '/usedRecord',
          name: 'usedRecord',
          meta: { title: 'usedRecord' },
          component: () => import('cmpt/councilRoomManage/usedRecord.vue')
        },
        // 统计分析路由
        {
          path: '/councilRoomAnalysis',
          name: 'councilRoomAnalysis',
          meta: { title: 'councilRoomAnalysis' },
          component: () =>
            import('cmpt/statisticalAnalysis/roomAnalysis/councilRoomAnalysis.vue'),
          redirect: '/timeAnalysis',
          children: [
            {
              path: '/timeAnalysis',
              name: 'timeAnalysis',
              meta: { title: 'timeAnalysis' },
              component: () =>
                import('cmpt/statisticalAnalysis/roomAnalysis/timeAnalysis.vue')
            },
            {
              path: '/capacityAnalysis',
              name: 'capacityAnalysis',
              meta: { title: 'capacityAnalysis' },
              component: () =>
                import('cmpt/statisticalAnalysis/roomAnalysis/capacityAnalysis.vue')
            }
          ]
        },
        {
          path: '/visitorActionAnalysis',
          name: 'visitorActionAnalysis',
          meta: { title: 'visitorActionAnalysis' },
          component: () =>
            import('cmpt/statisticalAnalysis/visitorAnalysis/visitorActionAnalysis.vue'),
          redirect: '/behaviorAnalysis',
          children: [
            {
              path: '/behaviorAnalysis',
              name: 'behaviorAnalysis',
              meta: { title: 'behaviorAnalysis' },
              component: () =>
                import('cmpt/statisticalAnalysis/visitorAnalysis/behaviorAnalysis.vue')
            },
            {
              path: '/attendanceAnalysis',
              name: 'attendanceAnalysis',
              meta: { title: 'attendanceAnalysis' },
              component: () =>
                import('cmpt/statisticalAnalysis/visitorAnalysis/attendanceAnalysis.vue')
            }
          ]
        },
        // 用户管理路由
        {
          path: '/userInfo',
          name: 'userInfo',
          meta: { title: 'userInfo' },
          component: () => import('cmpt/userManage/userInfo.vue')
        },
        // 系统设置路由
        {
          path: '/systemLog',
          name: 'systemLog',
          meta: { title: 'systemLog' },
          component: () => import('cmpt/systemSetting/systemLog.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./pages/login.vue')
    }
  ]
});
