import Vue from 'vue'
import Vuex from 'vuex'

import GeneralStore from './modules/GeneralStore';
import MessageBoxStore from './modules/MessageBoxStore';
import GameStore from './modules/GameStore';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    GeneralStore,
    MessageBoxStore,
    GameStore
  }
})