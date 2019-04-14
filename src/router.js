import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: { title: 'index', requireLogin: true },
      component: () => import('./pages/index.vue'),
      redirect: '/IndexPage',
      children: [
        {
          path: 'IndexPage',
          name: 'IndexPage',
          meta: { title: '首页', requireLogin: true },
          component: () => import('cmpt/IndexPage/indexPage.vue')
        },
        // 访客管理路由
        {
          path: '/VisitorInfo',
          name: 'VisitorInfo',
          meta: { title: '访客信息', requireLogin: true },
          component: () => import('cmpt/visitorManage/visitorInfo.vue')
        },
        {
          path: '/VisitorAppointmentInfo',
          name: 'VisitorAppointmentInfo',
          meta: { title: '访客预约信息', requireLogin: true },
          component: () => import('cmpt/visitorManage/appointmentInfo.vue')
        },
        {
          path: '/AccessRecord',
          name: 'AccessRecord',
          meta: { title: '访客访问记录', requireLogin: true },
          component: () => import('cmpt/visitorManage/accessRecord.vue')
        },
        // 会议室管理路由
        {
          path: '/councilRoomInfo',
          name: 'councilRoomInfo',
          meta: { title: '会议室信息', requireLogin: true },
          component: () => import('cmpt/councilRoomManage/councilRoomInfo.vue')
        },
        {
          path: '/councilRoomAppointmentInfo',
          name: 'councilRoomAppointmentInfo',
          meta: { title: '会议室预约信息', requireLogin: true },
          component: () => import('cmpt/councilRoomManage/appointmentInfo.vue')
        },
        {
          path: '/usedRecord',
          name: 'usedRecord',
          meta: { title: '会议室使用记录', requireLogin: true },
          component: () => import('cmpt/councilRoomManage/usedRecord.vue')
        },
        // 统计分析路由
        {
          path: '/councilRoomAnalysis',
          name: 'councilRoomAnalysis',
          meta: { title: '会议室统计', requireLogin: true },
          component: () =>
            import('cmpt/statisticalAnalysis/roomAnalysis/councilRoomAnalysis.vue')
        },
        {
          path: '/visitorActionAnalysis',
          name: 'visitorActionAnalysis',
          meta: { title: '访客统计', requireLogin: true },
          component: () =>
            import('cmpt/statisticalAnalysis/visitorAnalysis/visitorActionAnalysis.vue')
        },
        // 用户管理路由
        {
          path: '/userInfo',
          name: 'userInfo',
          meta: { title: '用户信息', requireLogin: true },
          component: () => import('cmpt/userManage/userInfo.vue')
        },
        // 系统设置路由
        {
          path: '/systemLog',
          name: 'systemLog',
          meta: { title: '系统日志', requireLogin: true },
          component: () => import('cmpt/systemSetting/systemLog.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      meta: { title: '登陆' },
      component: () => import('./pages/login.vue')
    }
  ]
});

// router.beforeEach((to, name, next) => {
//   const userInfo = sessionStorage.getItem('userInfo');
//   if (userInfo !== null || !to.meta.requireLogin) {
//     next();
//   } else {
//     next({ name: 'login', params: { path: '/login' } });
//   }
// });

router.afterEach(route => {
  if (route.meta.title) {
    document.title = route.meta.title;
  }
});

export default router;
