import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: { title: '首页', requireLogin: true },
      component: () => import('./pages/index.vue'),
      redirect: '/IndexPage',
      children: [
        {
          path: 'IndexPage',
          name: 'IndexPage',
          meta: { title: 'IndexPage', requireLogin: true },
          component: () => import('cmpt/IndexPage/indexPage.vue')
        },
        // 访客管理路由
        {
          path: '/VisitorInfo',
          name: 'VisitorInfo',
          meta: { title: 'VisitorInfo', requireLogin: true },
          component: () => import('cmpt/visitorManage/visitorInfo.vue')
        },
        {
          path: '/VisitorAppointmentInfo',
          name: 'VisitorAppointmentInfo',
          meta: { title: 'VisitorAppointmentInfo', requireLogin: true },
          component: () => import('cmpt/visitorManage/appointmentInfo.vue')
        },
        {
          path: '/AccessRecord',
          name: 'AccessRecord',
          meta: { title: 'AccessRecord', requireLogin: true },
          component: () => import('cmpt/visitorManage/accessRecord.vue')
        },
        // 会议室管理路由
        {
          path: '/councilRoomInfo',
          name: 'councilRoomInfo',
          meta: { title: 'councilRoomInfo', requireLogin: true },
          component: () => import('cmpt/councilRoomManage/councilRoomInfo.vue')
        },
        {
          path: '/councilRoomAppointmentInfo',
          name: 'councilRoomAppointmentInfo',
          meta: { title: 'councilRoomAppointmentInfo', requireLogin: true },
          component: () => import('cmpt/councilRoomManage/appointmentInfo.vue')
        },
        {
          path: '/usedRecord',
          name: 'usedRecord',
          meta: { title: 'usedRecord', requireLogin: true },
          component: () => import('cmpt/councilRoomManage/usedRecord.vue')
        },
        // 统计分析路由
        {
          path: '/councilRoomAnalysis',
          name: 'councilRoomAnalysis',
          meta: { title: 'councilRoomAnalysis', requireLogin: true },
          component: () =>
            import('cmpt/statisticalAnalysis/roomAnalysis/councilRoomAnalysis.vue'),
          redirect: '/timeAnalysis',
          children: [
            {
              path: '/timeAnalysis',
              name: 'timeAnalysis',
              meta: { title: 'timeAnalysis', requireLogin: true },
              component: () =>
                import('cmpt/statisticalAnalysis/roomAnalysis/timeAnalysis.vue')
            },
            {
              path: '/capacityAnalysis',
              name: 'capacityAnalysis',
              meta: { title: 'capacityAnalysis', requireLogin: true },
              component: () =>
                import('cmpt/statisticalAnalysis/roomAnalysis/capacityAnalysis.vue')
            }
          ]
        },
        {
          path: '/visitorActionAnalysis',
          name: 'visitorActionAnalysis',
          meta: { title: 'visitorActionAnalysis', requireLogin: true },
          component: () =>
            import('cmpt/statisticalAnalysis/visitorAnalysis/visitorActionAnalysis.vue'),
          redirect: '/behaviorAnalysis',
          children: [
            {
              path: '/behaviorAnalysis',
              name: 'behaviorAnalysis',
              meta: { title: 'behaviorAnalysis', requireLogin: true },
              component: () =>
                import('cmpt/statisticalAnalysis/visitorAnalysis/behaviorAnalysis.vue')
            },
            {
              path: '/attendanceAnalysis',
              name: 'attendanceAnalysis',
              meta: { title: 'attendanceAnalysis', requireLogin: true },
              component: () =>
                import('cmpt/statisticalAnalysis/visitorAnalysis/attendanceAnalysis.vue')
            }
          ]
        },
        // 用户管理路由
        {
          path: '/userInfo',
          name: 'userInfo',
          meta: { title: 'userInfo', requireLogin: true },
          component: () => import('cmpt/userManage/userInfo.vue')
        },
        // 系统设置路由
        {
          path: '/systemLog',
          name: 'systemLog',
          meta: { title: 'systemLog', requireLogin: true },
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

router.beforeEach((to, name, next)=>{
  const userInfo = sessionStorage.getItem('userInfo');
  if(userInfo !== null || !to.meta.requireLogin) {
    next();
  } else {
    next({name: 'login', params: {path: '/login'}});
  }
});


export default router;