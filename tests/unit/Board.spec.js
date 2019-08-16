import Vuex from 'vuex'

import {
  expect
} from 'chai'

import {
  shallowMount,
  createLocalVue
} from '@vue/test-utils'

import Board from '@/components/Board.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Board.vue', () => {

  // create dummy functions to act as getters
  var getTrue = () => true;
  var getEmptyObject = () => {
    return {}
  }

  var getEmptyArray = () => [];

  var getters, actions, store;


  // called before each it
  beforeEach(() => {
    // set up initial state, getters, setters
    actions = {
      setCheckStatus: () => {}
    };
    getters = {
      initialBoardMovesLoadedFlag: getTrue,
      messageBoxPromise: getEmptyObject,
      gameHasLoaded: getTrue,
      characterArray: () => ['兵', '卒', '炮', '砲', '俥', '車', '傌', '馬', '象', '相', '仕', '士', '帥', '將', 'L', 'O', 'A', 'D', 'I', 'N', 'G', 'G', 'A', 'M', 'E', '!'],
      selectedPiece: () => {
        return {
          row: -1,
          col: -1,
          pieceType: null
        }
      },
      currentTurn: () => 1,
      playerColor: () => 1,
      checkStatus: () => 0,
      currentGameID: () => 0,
      moves: getEmptyArray
    };
    store = new Vuex.Store({
      getters,
      actions
    })
  });

  // tests that initial loading message is properly displayed on the board with pieces
  it('displays loading message on pieces', () => {
    const wrapper = shallowMount(Board, {
      store,
      localVue
    })
    // collapsed version of initial loading message
    const expectedLoadingMessage = "LOADINGGAME!"
    // collapse the text of pieces on the board into a single string
    // iterate through each row of piece matrix
    const actualLoadingMessage = wrapper.vm.$data.pieceMatrix.map(row =>
      // iterate through each cell in row
      row.map(pieceType =>
        // pieces only exist where pieceMatrix value is non-zero
        pieceType ? wrapper.vm.characterArray[pieceType - 1] : ""
      ).join('')
    ).join('');
    expect(actualLoadingMessage).to.equal(expectedLoadingMessage)
  })

  // tests that the initial pieces are correct after setting board
  it('displays correct initial pieces after setting board', () => {
    const wrapper = shallowMount(Board, {
      store,
      localVue
    })
    // set the board
    wrapper.vm.setBoard();
    const expectedPieceMatrix = [
      [6, 8, 10, 12, 14, 12, 10, 8, 6],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 4, 0, 0, 0, 0, 0, 4, 0],
      [2, 0, 2, 0, 2, 0, 2, 0, 2],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 0, 1, 0, 1, 0, 1],
      [0, 3, 0, 0, 0, 0, 0, 3, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [5, 7, 9, 11, 13, 11, 9, 7, 5]
    ]
    const actualPieceMatrix = wrapper.vm.$data.pieceMatrix;
    expect(actualPieceMatrix).to.eql(expectedPieceMatrix);
  })

  // tests that piece move is accurately reflected in the board pieceMatrix
  it('updates board after moving piece', () => {
    const wrapper = shallowMount(Board, {
      store,
      localVue
    })
    wrapper.vm.setBoard();
    // move black's A0 chariot to A1
    wrapper.vm.movePiece({
      row: 0,
      col: 0,
      pieceType: 6
    }, 1, 0);
    const expectedPieceMatrix = [
      [0, 8, 10, 12, 14, 12, 10, 8, 6],
      [6, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 4, 0, 0, 0, 0, 0, 4, 0],
      [2, 0, 2, 0, 2, 0, 2, 0, 2],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 0, 1, 0, 1, 0, 1],
      [0, 3, 0, 0, 0, 0, 0, 3, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [5, 7, 9, 11, 13, 11, 9, 7, 5]
    ]
    const actualPieceMatrix = wrapper.vm.$data.pieceMatrix;
    expect(actualPieceMatrix).to.eql(expectedPieceMatrix);
  })

  // tests that there is no check with the initial placement of the board, a known non-check condition
  it('contains status "no check" in initial condition', () => {
    const wrapper = shallowMount(Board, {
      store,
      localVue
    })
    wrapper.vm.setBoard();
    const expectedIsCheck = false;
    // check for check against player red
    const actualIsCheck = wrapper.vm.checkForCheck(1);
    expect(actualIsCheck).to.equal(expectedIsCheck);
  });

  // tests that there is a check with piece placement reflecting a known check condition
  it('contains status "check" in check condition', () => {
    const wrapper = shallowMount(Board, {
      store,
      localVue
    })
    wrapper.vm.setBoard();
    // black's A0 chariot is in position E7, threatening red general
    wrapper.setData({
      pieceMatrix: [
        [0, 8, 10, 12, 14, 12, 10, 8, 6],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 4, 0, 0, 0, 0, 0, 4, 0],
        [2, 0, 2, 0, 2, 0, 2, 0, 2],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 3, 0, 0, 6, 0, 0, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [5, 7, 9, 11, 13, 11, 9, 7, 5]
      ]
    });

    const expectedIsCheck = true;
    // check for check against player red
    const actualIsCheck = wrapper.vm.checkForCheck(1);
    expect(actualIsCheck).to.equal(expectedIsCheck);
  })

  // tests that there is a checkmate with piece placement reflecting a known checkmate condition
  it('contains status "checkmate" in checkmate condition', () => {
    const wrapper = shallowMount(Board, {
      store,
      localVue
    })
    wrapper.vm.setBoard();
    // black's A0 chariot is in position E7, threatening red general
    // black's I0 chariot is in position C9, threatening red general
    // red has no method of neutralizing both threats, therefore checkmate
    wrapper.setData({
      pieceMatrix: [
        [0, 8, 10, 12, 14, 12, 10, 8, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 4, 0, 0, 0, 0, 0, 4, 0],
        [2, 0, 2, 0, 2, 0, 2, 0, 2],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 3, 0, 0, 6, 0, 0, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [5, 7, 6, 0, 13, 0, 0, 7, 5]
      ]
    });

    const expectedIsCheckmate = true;
    // check for checkmate against player red
    const actualIsCheckmate = wrapper.vm.checkForCheckmate(1);
    expect(actualIsCheckmate).to.equal(expectedIsCheckmate);
  })

  // tests that piece move is reflected in board history stack
  it('updates history with after moving piece with history', () => {
    const wrapper = shallowMount(Board, {
      store,
      localVue
    })
    wrapper.vm.setBoard();
    // move black's A0 chariot to A1, recording information about move and state of game before the move
    wrapper.vm.movePieceWithHistory({
      row: 0,
      col: 0,
      pieceType: 6
    }, 1, 0);
    const expectedHistory = [{
      checkStatus: 0,
      originRow: 0,
      originCol: 0,
      originPieceType: 6,
      targetRow: 1,
      targetCol: 0,
      targetPieceType: 0,
      generalLocations: {
        0: {
          row: 0,
          col: 4
        },
        1: {
          row: 9,
          col: 4
        }
      }
    }];
    const actualHistory = wrapper.vm.$data.historyStack;
    expect(actualHistory).to.eql(expectedHistory);
  })

  // tests that undoing a move will step board back in history
  it('resets board to previous position after move is undone', () => {
    const wrapper = shallowMount(Board, {
      store,
      localVue
    })
    wrapper.vm.setBoard();
    // move black's A0 chariot to A1,
    wrapper.vm.movePieceWithHistory({
      row: 0,
      col: 0,
      pieceType: 6
    }, 1, 0);

    // take a snapshot
    const snapshotPieceMatrix = JSON.parse(JSON.stringify(wrapper.vm.$data.pieceMatrix));

    // move black's A0 (now at A1) chariot to B1,
    wrapper.vm.movePieceWithHistory({
      row: 1,
      col: 0,
      pieceType: 6
    }, 1, 1);

    // undo move, popping state off of history stack and return back a position in history
    wrapper.vm.undoMove();
    // expect the board to reflect our previous snapshot
    const expectedPieceMatrix = snapshotPieceMatrix;
    const actualPieceMatrix = wrapper.vm.$data.pieceMatrix;
    expect(actualPieceMatrix).to.eql(expectedPieceMatrix);
  })

})