const GeneralStore = {
  state: {
    windowHeight: 0,
    windowWidth: 0,
    characterArray: ['兵', '卒', '炮', '砲', '俥', '車', '傌', '馬', '象', '相', '仕', '士', '帥', '將',
      'L', 'O', 'A', 'D', 'I', 'N', 'G', 'G', 'A', 'M', 'E', '!'
    ],
    redID: null,
    blackID: null,
    menuBarType: "game"
  },
  getters: {
    windowHeight: state => state.windowHeight,
    windowWidth: state => state.windowWidth,
    characterArray: state => state.characterArray,
    menuBarType: state => state.menuBarType,
  },
  mutations: {
    setWindowHeight: (state, payload) => {
      state.windowHeight = payload;
    },
    setWindowWidth: (state, payload) => {
      state.windowWidth = payload;
    },
    setMenuBarType: (state, payload) => {
      state.menuBarType = payload;
    },
    setCheckStatus: (state, payload) => {
      state.checkStatus = payload
    }
  },
  actions: {
    setWindowHeight: ({
      commit
    }, payload) => {
      commit('setWindowHeight', payload);
    },
    setWindowWidth: ({
      commit
    }, payload) => {
      commit('setWindowWidth', payload);
    },
    setMenuBarType: ({
      commit
    }, payload) => {
      commit('setMenuBarType', payload);
    },
    addCapturedPiece: ({
      commit
    }, payload) => {
      commit('addCapturedPiece', payload);
    },
    setCurrentGameID: ({
      commit
    }, payload) => {
      commit('setCurrentGameID', payload);
    }
  }
}

export default GeneralStore;