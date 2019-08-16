import Vue from 'vue'

const MessageBoxStore = {
  state: {
    messageBoxes: {},
    messageBoxPromises: {},
    messageBoxDestructionSchedule: {},
    gameErrorMessage: ""
  },
  getters: {
    messageBoxes: state => state.messageBoxes,
    isAnyMessageBoxOpen: state => Object.values(state.messageBoxes).reduce((acc, val) => acc || val.open, false),
    isMessageBoxOpen: state => params => state.messageBoxes.hasOwnProperty(params.target) && state.messageBoxes[params.target].open,
    isMessageBoxRegistered: state => target => state.messageBoxes.hasOwnProperty(target),
    messageBoxPromise: state => target => state.messageBoxPromises[target],
    gameErrorMessage: state => state.gameErrorMessage
  },
  mutations: {
    registerMessageBox(state, payload) {
      Vue.set(state.messageBoxes, payload.target, {
        open: false
      })
      Vue.nextTick(() => {
        state.messageBoxDestructionSchedule[payload.target] = false;
      });
    },
    deregisterMessageBox(state, payload) {
      state.messageBoxDestructionSchedule[payload.target] = true;
      Vue.nextTick(() => {
        if (state.messageBoxDestructionSchedule[payload.target]) {
          Vue.delete(state.messageBoxes, payload.target)
        }
      });
    },
    openMessageBox(state, payload) {
      Vue.set(state.messageBoxes[payload.target], "open", true)
    },
    closeMessageBox(state, payload) {
      Vue.set(state.messageBoxes[payload.target], "open", false)
    },
    setErrorMessage(state, errorMessage) {
      state.gameErrorMessage = errorMessage;
    }
  },
  actions: {
    addMessageBoxToState: ({
      commit
    }, payload) => {
      commit('registerMessageBox', payload);
    },
    registerMessageBox: ({
      dispatch,
      state
    }, payload) => {
      var messageBoxPromise = dispatch('addMessageBoxToState', payload);
      Vue.set(state.messageBoxPromises, payload.target, messageBoxPromise);
    },
    deregisterMessageBox: ({
      commit
    }, payload) => {
      commit('deregisterMessageBox', payload);
    },
    openMessageBox: ({
      commit
    }, payload) => {
      commit('openMessageBox', payload);
    },
    closeMessageBox: ({
      commit
    }, payload) => {
      commit('closeMessageBox', payload);
    },
    displayError({
      commit
    }, {
      errorMessage
    }) {
      commit('setErrorMessage', errorMessage);
      commit('openMessageBox', {
        target: 'game-error'
      });
    }
  }
}

export default MessageBoxStore;