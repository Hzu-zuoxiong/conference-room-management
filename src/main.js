import Vue from 'vue';
import VueParticles from 'vue-particles';
import App from './App.vue';
import router from './router';
import qs from 'qs';
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';

let bus = new Vue();
Vue.prototype.$bus = bus;
Vue.prototype.$qs = qs;

Vue.config.productionTip = false;

Vue.use(VueParticles);
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
