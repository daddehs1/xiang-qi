import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/game/:playerID',
      name: 'game',
      // lazy-load component
      component: function() {
        return import ('./views/Game.vue')
      }
    },
    {
      path: '/tutorial',
      name: 'tutorial',
      // lazy-load component
      component: function() {
        return import ('./views/Tutorial.vue')
      }
    }
  ]
})