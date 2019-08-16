import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import VueMq from 'vue-mq'

// Vue.use(VueNativeNotification, {
//   // Automatic permission request before
//   // showing notification (default: true)
//   requestOnNotify: true
// })

Vue.config.productionTip = false

Vue.use(VueMq, {
  breakpoints: {
    tiny: 350,
    mobile: 450,
    tablet: 900,
    laptop: 1250,
    desktop: Infinity,
  },
  defaultBreakpoint: 'desktop'
});

new Vue({
  router,
  store,
  render: function(h) {
    return h(App)
  }
}).$mount('#app')