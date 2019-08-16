import axios from 'axios'
import router from '@/router'
var shortID = require('shortid');

import io from '@/socket.io.js'
var socket = io('localhost');
const API_URL = '/api/v1';

const GameStore = {
  state: {
    menuType: null,
    initialBoardMovesLoadedFlag: false,
    gameHasLoaded: false,
    currentGameID: 0,
    selectedPiece: {
      row: -1,
      col: -1,
      pieceType: 0
    },
    games: {
      0: {
        currentTurn: null,
        playerColor: null,
        // 0 = no check, 1 = check, 2 = checkmate
        checkStatus: null,
        // here 0 captureed pieces refered to pieces captured BY 0
        //  not those pieces BELONGING TO 0
        capturedPieces: {
          0: [],
          1: []
        },
        moves: [],
        redID: null,
        blackID: null
      }
    },

  },
  getters: {
    menuType: state => state.menuType,
    initialBoardMovesLoadedFlag: state => state.initialBoardMovesLoadedFlag,
    gameHasLoaded: state => state.gameHasLoaded,
    currentGameID: state => state.currentGameID,
    selectedPiece: state => state.selectedPiece,
    currentTurn: state => state.games[state.currentGameID].currentTurn,
    playerColor: state => state.games[state.currentGameID].playerColor,
    checkStatus: state => state.games[state.currentGameID].checkStatus,
    capturedPieces: state => state.games[state.currentGameID].capturedPieces,
    moves: state => state.games[state.currentGameID].moves,
    redID: state => state.games[state.currentGameID].redID,
    blackID: state => state.games[state.currentGameID].blackID,
    ghostPieces: state => state.games[state.currentGameID].ghostPieces
  },
  mutations: {
    resetGameState(state) {
      state.currentGameID = 0;
      state.games = Object.assign({}, {
        0: state.games[0]
      });
      state.gameHasLoaded = false;
      state.initialBoardMovesLoadedFlag = false;
      state.selectedPiece = {
        row: -1,
        col: -1,
        pieceType: 0
      };
    },
    setInitialBoardMovesLoadedFlag: state => {
      state.initialBoardMovesLoadedFlag = true
    },
    setCheckStatus: (state, payload) => {
      state.games[state.currentGameID].checkStatus = payload
    },
    switchCurrentTurn: state => {
      state.games[state.currentGameID].currentTurn = state.games[state.currentGameID].currentTurn == 0 ? 1 : 0;
    },
    addCapturedPiece: (state, payload) => {
      var pieceType = payload.pieceType;
      state.games[state.currentGameID].capturedPieces[(pieceType + 1) % 2].push(pieceType);
    },
    setCurrentGameID: (state, payload) => {
      state.currentGameID = payload
    },
    setSelectedPiece: (state, payload) => {
      state.selectedPiece.row = payload.row;
      state.selectedPiece.col = payload.col;
      state.selectedPiece.pieceType = payload.pieceType;
    },
    setGhostPieces: (state, payload) => {
      state.games[state.currentGameID].ghostPieces = payload;
    },
    setMenuType: (state, payload) => {
      state.menuType = payload
    }
  },
  actions: {
    resetGameState({
      commit
    }) {
      commit('resetGameState');
    },
    setInitialBoardMovesLoadedFlag({
      commit
    }) {
      commit('setInitialBoardMovesLoadedFlag');
    },
    async loadGame({
      state,
      dispatch
    }, playerID) {
      try {
        var response = await axios.get(`${API_URL}/game/${playerID}`)
        var gameInfo = response.data

        var loadedGame = {
          currentTurn: 1,
          playerColor: gameInfo.playerColor,
          checkStatus: 0,
          capturedPieces: {
            0: [],
            1: []
          },
          moves: [],
        };

        if (gameInfo.playerColor == 0) {
          loadedGame.blackID = playerID;
          loadedGame.redID = gameInfo.opponentID;
        } else {
          loadedGame.blackID = gameInfo.opponentID;
          loadedGame.redID = playerID;
        }
        state.games[gameInfo.gameID] = loadedGame;
        state.currentGameID = gameInfo.gameID;
        state.games = Object.assign({}, state.games)

        socket.emit('clientListenGame', {
          gameID: gameInfo.gameID
        })

        socket.on('serverUpdateGame', ({
          moves
        }) => {
          state.games[gameInfo.gameID].moves = moves;
          state.games = Object.assign({}, state.games)
          state.gameHasLoaded = true;
        })
      } catch (error) {
        dispatch('displayError', {
          errorMessage: error.response.data.errorMessage || "There has been an error. Please try again later."
        });
      }
    },

    setSelectedPiece({
      commit
    }, payload) {
      commit('setSelectedPiece', payload);
    },

    setGhostPieces({
      commit
    }, payload) {
      commit('setGhostPieces', payload);
    },

    setMenuType({
      commit
    }, menuType) {
      commit('setMenuType', menuType)
    },

    async newGame({
      commit,
      state,
    }) {
      commit('resetGameState');
      var gameID = shortID.generate();
      var blackID = shortID.generate();
      var redID = shortID.generate();

      router.push({
        name: 'game',
        params: {
          playerID: redID,
          isNewGame: true
        }
      });

      var params = {
        gameID,
        blackID,
        redID
      };

      await axios.post(`${API_URL}/game`, params);
      var loadedGame = {
        currentTurn: 1,
        playerColor: 1,
        checkStatus: 0,
        capturedPieces: {
          0: [],
          1: []
        },
        moves: [],
      };

      loadedGame.blackID = blackID;
      loadedGame.redID = redID;

      state.games[gameID] = loadedGame;
      state.currentGameID = gameID;
      state.games = Object.assign({}, state.games)
      state.gameHasLoaded = true;
      //state.initialBoardMovesLoadedFlag = true;
    },

    setCheckStatus({
      commit
    }, payload) {
      commit('setCheckStatus', payload);
    },

    switchCurrentTurn({
      commit
    }) {
      commit('switchCurrentTurn');
    },

    pushMove({
      state
    }, payload) {
      socket.emit('move-made', {
        gameID: state.currentGameID,
        moveString: payload.moveString
      })
    },

  }
}

export default GameStore;