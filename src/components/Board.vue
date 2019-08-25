<template>
<div class="board" :class="classObject">
  <svg class="board__graphics" ref="graphics" xmlns="http://www.w3.org/2000/svg">
    <xq-board-art></xq-board-art>

    <template v-if="!isTutorial && ghostPieces" v-for="(ghost, g) in ghostPieces">
      <xq-ghost :key="g + '-' + keySuffix" :style="getTranslatePieceStyleObject(ghost.row, ghost.col)" :color="ghost.pieceColor" :isOrigin="ghost.isOrigin" ref="ghost" />
    </template>


    <template v-for="(row, r) in pieceMatrix">
      <template v-for="(col, c) in row">
        <template v-if="pieceMatrix[r][c] != 0">
          <xq-piece :key="r+ '-' + c + '-' + keySuffix" :r="r" :c="c"
                    :pieceType="pieceMatrix[r][c]"
                    :pieceCharacter= "characterArray[pieceMatrix[r][c]-1]"
                    :style="getTranslatePieceStyleObject(r, c, true)"
                    :isTutorial="isTutorial"
                    ref="piece" />
        </template>
      </template>
    </template>

    <template v-for = "(row, r) in selectedPieceMoveMap">
      <template v-for = "(col, c) in row">
        <template v-if = "selectedPieceMoveMap[r][c]">
          <xq-move-map-piece :key="'move' + r+ '-' + c + '-' + keySuffix" :r="r" :c="c"
          :pieceColor="selectedPieceColor" :invisible="!isTutorial"
          :style="getTranslatePieceStyleObject(r, c)" />
        </template>
      </template>
    </template>
  </svg>
</div>
</template>

<script>
const BOARD_WIDTH_SPACES = 9;
const BOARD_HEIGHT_SPACES = 10;

import Push from 'push.js'

import {
  EventBus
} from '@/event-bus.js';

import {
  mapGetters,
  mapActions
} from 'vuex';

function getInitialData() {
  return {
    // dummy value used to simulate reactivity on window resize
    keySuffix: false,
    // matrix of piece types as placed on the board
    // initial state is loading message "LOADING GAME!"
    pieceMatrix: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 15, 16, 17, 18, 19, 20, 21, 0],
      [0, 0, 22, 23, 24, 25, 26, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    // moves made on this board
    localMoves: [],
    // zero or two "pieces" that represent the origin and destination of most recent move
    ghostPieces: [],
    // location of the generals of each player
    // used to determine check/checkmate status
    generalLocations: {
      0: {
        row: 0,
        col: 4
      },
      1: {
        row: 9,
        col: 4
      },
    },
    // history of moves made
    // used to undo moves in event of invalid move e.g. causing a check
    // or to simulate movement during check for check / check for checkmate
    historyStack: [],
    // used to run loading screen select/deselect animation
    animationIndex: 0,
    animationInterval: null
  }
}

import xqBoardArt from '@/components/BoardArt.vue'
import xqPiece from '@/components/Piece.vue'
import xqMoveMapPiece from '@/components/MoveMapPiece.vue'
import xqGhost from '@/components/Ghost.vue'
export default {
  name: 'xqBoard',
  components: {
    xqBoardArt,
    xqPiece,
    xqMoveMapPiece,
    xqGhost
  },
  props: ['isTutorial'],
  data: getInitialData,
  methods: {
    ...mapActions(['setInitialBoardMovesLoadedFlag', 'openMessageBox', 'setSelectedPiece', 'switchCurrentTurn', 'setCheckStatus', 'addCapturedPiece', 'pushMove']),
    /**
     * Gets called when the user clicks on "Reset Board" in tutorial view
     * Resets board with pieces placed in initial position
     */
    handleTutorialReset() {
      this.setBoard();
    },
    /**
     * Gets called when there is a route change (i.e. change in gameID) or when component first mounts
     * Sets the board to initial state and runs first-load select/deselect animation
     */
    initializeBoard() {
      if (this.isTutorial) {
        this.setBoard();
        this.animateBoard();
      } else {
        this.resetBoardState();
        this.animateBoard({
          loopAnimation: true
        });
      }
    },
    /**
     * Gets called from initializeBoard
     * Resets component data to initial state
     */
    resetBoardState() {
      // Fetch the initialState object locally, so we do not have to call the function again
      let initialData = getInitialData();
      for (let prop in initialData) {
        this[prop] = initialData[prop];
      }
    },
    /**
     * Gets called from handleTutorialReset and initializeBoard
     * Sets piece matrix to Xiangqi default piece positions
     */
    setBoard() {
      Push.config({
        serviceWorker: '//serviceWorker.min.js'
      });
      Push.Permission.request();
      this.pieceMatrix = [
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
    },
    /**
     * Gets called when board pieces are rendered in DOM
     * Calculates the horizontal and vertical shift of a piece based on its column and row
     * Reverses piece if player is Black so that they are still on the bottom of screen playing upwards
     *
     * @param {Number} r The row number of piece to calculate shift for
     * @param {Number} c The column number of piece to calculate shift for
     *
     * @return {String} a string containing the inline style which handles shift of a piece
     */
    getTranslatePieceStyleObject(r, c) {
      var boardShouldReverse = this.playerColor == 0 && this.gameHasLoaded;
      return boardShouldReverse ? {
        transform: 'translate(' + (100 - this.getXShift(c)) + '%, ' + (100 - this.getYShift(r)) + '%)'
      } : {
        transform: 'translate(' + this.getXShift(c) + '%, ' + this.getYShift(r) + '%)'
      }
    },
    /**
     * Gets called from getTranslatePieceStyleObject
     * Calculates the horizontal shift of a piece based on its column
     *
     * @param {Number} c The column number of piece to calculate shift for
     *
     * @return {Number} the percentage of horizontal shift for this column
     */
    getXShift(c) {
      var fixedXShift = 50 / BOARD_WIDTH_SPACES;
      var variableXShiftFactor = 100 / BOARD_WIDTH_SPACES;
      return fixedXShift + c * variableXShiftFactor;
    },
    /**
     * Gets called from getTranslatePieceStyleObject
     * Calculates the vertical shift of a piece based on its row
     *
     * @param {Number} r The row number of piece to calculate shift for
     *
     * @return {Number} the percentage of vertical shift for this row
     */
    getYShift(r) {
      var fixedYShift = 50 / BOARD_HEIGHT_SPACES;
      var variableYShiftFactor = 100 / BOARD_HEIGHT_SPACES;
      return fixedYShift + r * variableYShiftFactor;
    },
    /**
     * Gets called when window resi
     * toggles keySuffix to trigger reactivty and rerender pieces on window resize
     */
    toggleKeySuffix() {
      // "key-change method" to force component to
      // workaround to allow pieces to reposition themselves on window resize (as window is not reactive)
      this.keySuffix = !this.keySuffix;
    },
    /**
     * Gets called when window resizes
     */
    handleWindowResize() {
      this.toggleKeySuffix();
    },

    //
    // GAME LOGIC
    //

    /**
     * Gets called from MovableMapPiece component via EventBus
     * Gets called when player has selected pieces and clicks on a MovableMapPiece to request to move
     * Handles request to move a piece
     *
     * @param {Object} payload the target row and column of the requested move
     */
    handleMoveMade(payload) {
      this.attemptMovePiece(this.selectedPiece, payload.row, payload.col);
    },
    /**
     * Gets called from handleMoveMade and resolveMoveDeltas
     * Attempts to move a piece and reverses move if invalid (i.e if it would cause or fail to clear a check on player)
     *
     * @param {Object} piece information about the type and origin of piece attempting to be moved
     * @param {Number} targetRow target row of attempted move
     * @param {Number} targetCol target column of attempted move
     * @param {Boolean} isSimulation whether piece is not being moved by player but just to resolve move deltas
     *
     * @return {Boolean} whether or not move was made successfully
     */
    attemptMovePiece(piece, targetRow, targetCol, isSimulation) {
      var pieceColor = piece.pieceType % 2;
      var opponentPieceColor = (piece.pieceType + 1) % 2;

      // record target piece type to add to captured pieces if move accepted
      var targetPieceType = this.pieceMatrix[targetRow][targetCol];
      this.movePieceWithHistory(piece, targetRow, targetCol);

      // disallow move if the move will result in a check against moving player
      if (this.checkForCheck(pieceColor)) {
        this.undoMove();
        return false;
      }

      // From this point move is Accepted

      // place ghost pieces in previous location
      var ghostOrigin = {
        row: piece.row,
        col: piece.col,
        pieceColor,
        isOrigin: true
      };
      var ghostTarget = {
        row: targetRow,
        col: targetCol,
        pieceColor,
        isOrigin: false
      }
      this.ghostPieces = [ghostOrigin, ghostTarget];

      // if not tutorial, add target piece to captured pieces
      if (!this.isTutorial) {
        // only add if target piece exists (i.e. target was not a blank space aka a 0 on the board)
        if (targetPieceType) {
          this.addCapturedPiece({
            pieceType: targetPieceType
          });
        }

        // check if this move has caused a check against opponent player
        if (this.checkForCheck(opponentPieceColor)) {
          // if check, check if this move has caused a checkmate against opponent player
          this.checkForCheckmate(opponentPieceColor);
        }

        // if this is not a simulated move, push it to the local moves and to server
        var moveString = this.encodeMoveString(piece.row, piece.col, targetRow, targetCol);
        this.localMoves.push(moveString);
        if (!isSimulation) {
          this.pushMove({
            moveString
          });
        }
      }

      // deselect piece
      this.setSelectedPiece({
        row: -1,
        col: -1,
        pieceType: 0
      });

      // switch to opponent turn
      this.switchCurrentTurn();
      return true;

    },
    /**
     * Gets called from attemptMovePiece
     * Encodes a move into a 4-character move string
     *
     * @param {Number} originRow origin row of move to be encoded
     * @param {Number} originCol origin col of move to be encoded
     * @param {Number} targetRow target row of move to be encoded
     * @param {Boolean} targetCol target col of move to be encoded
     *
     * @return {String} the encoded move string
     */
    encodeMoveString(originRow, originCol, targetRow, targetCol) {
      var letters = "ABCDEFGHIJ"
      return letters[originRow] + originCol + letters[targetRow] + targetCol;
    },
    /**
     * Gets called from resolveMoveDeltas
     * Decodes a move from a 4-character move string
     *
     * @param {String} moveString 4-character string which encodes information about origin and target of a move
     * @return {Object} decoded information about the move
     */
    decodeMoveString(moveString) {
      var letters = "ABCDEFGHIJ"
      return {
        originRow: letters.indexOf(moveString[0]),
        originCol: parseInt(moveString[1]),
        targetRow: letters.indexOf(moveString[2]),
        targetCol: parseInt(moveString[3])
      }
    },
    /**
     * Gets called from attemptMovePiece and checkForcheck
     * Wrapper function for movePiece which records the history of the move
     *
     * @param {Object} piece information about the type and origin of piece being moved
     * @param {Number} targetRow target row of move being made
     * @param {Number} targetCol target column of move being made
     */
    movePieceWithHistory(piece, targetRow, targetCol) {
      var historyEvent = {
        checkStatus: this.checkStatus,
        originRow: piece.row,
        originCol: piece.col,
        originPieceType: piece.pieceType,
        targetRow,
        targetCol,
        targetPieceType: this.pieceMatrix[targetRow][targetCol],
        generalLocations: Object.assign({}, this.generalLocations)
      }
      this.movePiece(piece, targetRow, targetCol);
      this.pushEventToHistoryStack(historyEvent)
    },
    /**
     * Gets called from movePieceWithHistory
     * Handles the actual movement of a piece
     *
     * @param {Object} piece information about the type and origin of piece being moved
     * @param {Number} targetRow target row of move being made
     * @param {Number} targetCol target column of move being made
     */
    movePiece(piece, targetRow, targetCol) {
      var originRow = piece.row;
      var originCol = piece.col;
      var originPieceType = piece.pieceType;

      // updates pieceMatrix to reflect new move
      this.setPieceMatrixCell(targetRow, targetCol, originPieceType);
      this.setPieceMatrixCell(originRow, originCol, 0);

      // if piece that has been moved is a general, update generalLocations
      if (originPieceType == 13 || originPieceType == 14) {
        var pieceColor = originPieceType % 2;
        var newGeneralLocation = {
          row: targetRow,
          col: targetCol
        };
        this.$set(this.generalLocations, pieceColor, newGeneralLocation);
      }

    },
    /**
     * Gets called from movePieceWithHistory
     * Pushes a history event to the stack in case of a needed removal
     *
     * @param {Object} historyEvent information about the move to push
     */
    pushEventToHistoryStack(historyEvent) {
      this.historyStack.push(historyEvent);
    },
    /**
     * Gets called from undoMove
     * Pops a history event to the stack in case of a needed removal
     *
     * @param {Object} historyEvent information about a move
     *
     * @return {Object} information about the popped move
     */
    popEventFromHistoryStack() {
      return this.historyStack.pop();
    },
    /**
     * Gets called from attemptMovePiece and checkForCheckmate
     * Restores the previous board/game state from the history stack
     *
     */
    undoMove() {
      var historyEvent = this.popEventFromHistoryStack();
      this.setCheckStatus(historyEvent.checkStatus);
      this.setPieceMatrixCell(historyEvent.originRow, historyEvent.originCol, historyEvent.originPieceType);
      this.setPieceMatrixCell(historyEvent.targetRow, historyEvent.targetCol, historyEvent.targetPieceType);
      this.generalLocations = Object.assign({}, historyEvent.generalLocations);
    },
    /**
     * Gets called from movePiece and undoMove
     * Sets a cell in the pieceMatrix to a given pieceType
     *
     * @param {Number} row row of pieceMatrix to update
     * @param {Number} col column of pieceMatrix to update
     * @param {Number} pieceType piece type to set cell to
     */
    setPieceMatrixCell(row, col, pieceType) {
      this.$set(this.pieceMatrix[row], col, pieceType);
    },
    /**
     * Gets called from attemptMovePiece and checkForCheckMate
     * Checks to see if a given player is in check
     *
     * @param {Number} playerColorToCheck color of player being checked for check
     *
     * @return {Boolean} whether or not given player is in check
     */
    checkForCheck(playerColorToCheck) {
      var targetGeneralLocation = this.generalLocations[playerColorToCheck];
      // iterate through every piece on the board
      for (var r = 0; r < this.pieceMatrix.length; r++) {
        for (var c = 0; c < this.pieceMatrix[0].length; c++) {
          var pieceType = this.pieceMatrix[r][c];
          // check to see if current position on board is 1. not empty, 2. contains an enemy piece, 3. doesn't contain an elephant
          // it is impossible for an elephant to be involved in a check-threat, so can skip that check
          if (pieceType != 0 && pieceType % 2 != playerColorToCheck && pieceType != 9 && pieceType != 10) {
            var currentPiece = {
              row: r,
              col: c,
              pieceType: this.pieceMatrix[r][c]
            }
            // get currentMovableMap for the current piece
            var currentMovableMap = this.getMovableMapByPiece(currentPiece);
            // if movableMap contains the target general, player is under check
            if (currentMovableMap[targetGeneralLocation.row][targetGeneralLocation.col] == 1) {
              // set check status
              this.setCheckStatus(1);
              return true;
            }
          }
        }
      }
      // if we have iterated over the board and haven't returned true for check, we are not in check
      // set check status
      this.setCheckStatus(0);
      return false;
    },
    /**
     * Gets called from attemptMpvePiece
     * Checks to see whether the given player is under checkmate
     *
     * @param {Number} playerColorToCheck color of player being checked for checkmate
     *
     * @return {Boolean} whether or not given player is in checkmate
     */
    checkForCheckmate(playerColorToCheck) {
      // iterate over every piece
      for (var r = 0; r < this.pieceMatrix.length; r++) {
        for (var c = 0; c < this.pieceMatrix[0].length; c++) {
          var pieceType = this.pieceMatrix[r][c];
          // check to see if current position on board is 1. not empty, 2. contains a friendly piece,
          if (pieceType != 0 && pieceType % 2 == playerColorToCheck) {
            var currentPiece = {
              row: r,
              col: c,
              pieceType: pieceType
            }
            // get movableMap for current piece
            var currentMovableMap = this.getMovableMapByPiece(currentPiece)
            // iterate over all possible moves
            for (var moveRow = 0; moveRow < currentMovableMap.length; moveRow++) {
              for (var moveCol = 0; moveCol < currentMovableMap[0].length; moveCol++) {
                if (currentMovableMap[moveRow][moveCol] == 1) {
                  // make a poetential move to avaialable space on movableMap
                  this.movePieceWithHistory(currentPiece, moveRow, moveCol);
                  // check to see if this potential move has cleared the check
                  var isStillCheck = this.checkForCheck(playerColorToCheck);
                  // restore the board the original state
                  this.undoMove();
                  // if check has been cleared by this potential move,
                  if (!isStillCheck) {
                    return false;
                  }
                }
              }
            }
          }
        }
      }
      // if we have iterated over every friendly piece and not found a way to clear check
      // then player is under checkmate
      // update check status
      this.setCheckStatus(2);
      return true;
    },
    /**
     * Gets called from attemptMpvePiece
     * Creates a matrix which represents all possible moves on the board for a piece
     *
     * @param {Object} piece information about the piece that moves are being found for
     *
     * @return {Number[][]} a matrix representing the board where 1 indicates a movable position and 0 a non-movable position
     */
    getMovableMapByPiece(piece) {
      var moveMap = [];
      //create empty map
      //0 represents a space we cannot move to
      //1 represents a space we can move to
      //use static loop for compactness
      for (var rowCount = 0; rowCount < 10; rowCount++) {
        moveMap.push([0, 0, 0, 0, 0, 0, 0, 0, 0])
      }
      var sp = piece;
      let r = sp.row;
      let c = sp.col;
      let selectedPieceType = sp.pieceType;

      // switch over piece type to determine appropriate move-finding logic for given piece
      switch (selectedPieceType) {
        case 1: //Advisor (red)
          //check which side of river we are on
          let hasCrossedRiverRed = r <= 4;
          //check one piece ahead regardless of river status
          this.attemptMoveMapAdd(r - 1, c, moveMap, piece);
          if (hasCrossedRiverRed) {
            //if across river, can also move horizontally
            this.attemptMoveMapAdd(r, c - 1, moveMap, piece);
            this.attemptMoveMapAdd(r, c + 1, moveMap, piece);
          }
          break;

        case 2: //Advisor (black)
          //check which side of river we are on
          let hasCrossedRiverBlack = r >= 5;
          //check one piece ahead regardless of river status
          this.attemptMoveMapAdd(r + 1, c, moveMap, piece);
          if (hasCrossedRiverBlack) {
            //if across river, can also move horizontally
            this.attemptMoveMapAdd(r, c - 1, moveMap, piece);
            this.attemptMoveMapAdd(r, c + 1, moveMap, piece);
          }
          break;

        case 3: //Cannon
        case 4:
          // check leftwards
          for (var col = c - 1, screenSet = false; col >= 0; col--) {
            if (!screenSet) {
              if (this.checkSpaceEmpty(r, col)) {
                this.moveMapAdd(r, col, moveMap);
              } else {
                screenSet = true;
              }
            } else {
              if (!this.checkSpaceEmpty(r, col)) {
                this.attemptMoveMapAdd(r, col, moveMap, piece);
                break;
              }
            }
          }
          // check rightwards
          for (var col = c + 1, screenSet = false; col <= 8; col++) {
            if (!screenSet) {
              if (this.checkSpaceEmpty(r, col)) {
                this.moveMapAdd(r, col, moveMap);
              } else {
                screenSet = true;
              }
            } else {
              if (!this.checkSpaceEmpty(r, col)) {
                this.attemptMoveMapAdd(r, col, moveMap, piece);
                break;
              }
            }
          }
          // check downwards
          for (var row = r + 1, screenSet = false; row <= 9; row++) {
            if (!screenSet) {
              if (this.checkSpaceEmpty(row, c)) {
                this.moveMapAdd(row, c, moveMap);
              } else {
                screenSet = true;
              }
            } else {
              if (!this.checkSpaceEmpty(row, c)) {
                this.attemptMoveMapAdd(row, c, moveMap, piece);
                break;
              }
            }
          }
          // check upwards
          for (var row = r - 1, screenSet = false; row >= 0; row--) {
            if (!screenSet) {
              if (this.checkSpaceEmpty(row, c)) {
                this.moveMapAdd(row, c, moveMap);
              } else {
                screenSet = true;
              }
            } else {
              if (!this.checkSpaceEmpty(row, c)) {
                this.attemptMoveMapAdd(row, c, moveMap, piece);
                break;
              }
            }
          }
          break;
        case 5: //Chariot
        case 6:
          // check leftwards
          var col = c;
          do {
            col--;
            this.attemptMoveMapAdd(r, col, moveMap, piece);
          }
          while (this.checkSpaceEmpty(r, col))
          // check rightwards
          col = c;
          do {
            col++;
            this.attemptMoveMapAdd(r, col, moveMap, piece);
          }
          while (this.checkSpaceEmpty(r, col))
          // check upwards
          var row = r;
          do {
            row--;
            this.attemptMoveMapAdd(row, c, moveMap, piece);
          }
          while (this.checkSpaceEmpty(row, c))
          // check downwards
          row = r;
          do {
            row++;
            this.attemptMoveMapAdd(row, c, moveMap, piece);
          }
          while (this.checkSpaceEmpty(row, c))
          break;

        case 7: // Horse
        case 8:
          // check leftwards
          if (this.checkSpaceEmpty(r, c - 1)) {
            this.attemptMoveMapAdd(r + 1, c - 2, moveMap, piece);
            this.attemptMoveMapAdd(r - 1, c - 2, moveMap, piece);
          }
          // check rightwards
          if (this.checkSpaceEmpty(r, c + 1)) {
            this.attemptMoveMapAdd(r + 1, c + 2, moveMap, piece);
            this.attemptMoveMapAdd(r - 1, c + 2, moveMap, piece);
          }
          // check upwards
          if (this.checkSpaceEmpty(r - 1, c)) {
            this.attemptMoveMapAdd(r - 2, c + 1, moveMap, piece);
            this.attemptMoveMapAdd(r - 2, c - 1, moveMap, piece);
          }
          // check downwards
          if (this.checkSpaceEmpty(r + 1, c)) {
            this.attemptMoveMapAdd(r + 2, c + 1, moveMap, piece);
            this.attemptMoveMapAdd(r + 2, c - 1, moveMap, piece);
          }
          break;

        case 9: // Elephant (red)
          // check upwards
          // make sure potential space is not across river
          if (r - 2 >= 5) {
            // make sure adjacent diaganol is empty first before checking second adjacent diagnol
            // this is 'elephant can't jump pieces' rule
            if (this.checkSpaceEmpty(r - 1, c - 1))
              this.attemptMoveMapAdd(r - 2, c - 2, moveMap, piece);
            if (this.checkSpaceEmpty(r - 1, c + 1))
              this.attemptMoveMapAdd(r - 2, c + 2, moveMap, piece);
          }
          // check downwards
          if (this.checkSpaceEmpty(r + 1, c - 1))
            this.attemptMoveMapAdd(r + 2, c - 2, moveMap, piece);
          if (this.checkSpaceEmpty(r + 1, c - 1))
            this.attemptMoveMapAdd(r + 2, c + 2, moveMap, piece);
          break;

        case 10: // Elephant (black)
          // check downwards
          // make sure potential space is not across river
          if (r + 2 <= 4) {
            // make sure adjacent diagnol is empty first before checking second adjacent diagnol
            // this is 'elphant can't jump pieces' rule
            if (this.checkSpaceEmpty(r + 1, c - 1))
              this.attemptMoveMapAdd(r + 2, c - 2, moveMap, piece);
            if (this.checkSpaceEmpty(r + 1, c + 1))
              this.attemptMoveMapAdd(r + 2, c + 2, moveMap, piece);
          }
          // check upwards
          if (this.checkSpaceEmpty(r - 1, c - 1))
            this.attemptMoveMapAdd(r - 2, c - 2, moveMap, piece);
          if (this.checkSpaceEmpty(r - 1, c + 1))
            this.attemptMoveMapAdd(r - 2, c + 2, moveMap, piece);
          break;

        case 11: // Advisor (red)
          // check all diagonal movement
          if (this.checkInsidePalaceRed(r + 1, c + 1))
            this.attemptMoveMapAdd(r + 1, c + 1, moveMap, piece);
          if (this.checkInsidePalaceRed(r + 1, c - 1))
            this.attemptMoveMapAdd(r + 1, c - 1, moveMap, piece);
          if (this.checkInsidePalaceRed(r - 1, c + 1))
            this.attemptMoveMapAdd(r - 1, c + 1, moveMap, piece);
          if (this.checkInsidePalaceRed(r - 1, c - 1))
            this.attemptMoveMapAdd(r - 1, c - 1, moveMap, piece);
          break;

        case 12: // Advisor (black)
          // check all diagonal movement
          if (this.checkInsidePalaceBlack(r + 1, c + 1))
            this.attemptMoveMapAdd(r + 1, c + 1, moveMap, piece);
          if (this.checkInsidePalaceBlack(r + 1, c - 1))
            this.attemptMoveMapAdd(r + 1, c - 1, moveMap, piece);
          if (this.checkInsidePalaceBlack(r - 1, c + 1))
            this.attemptMoveMapAdd(r - 1, c + 1, moveMap, piece);
          if (this.checkInsidePalaceBlack(r - 1, c - 1))
            this.attemptMoveMapAdd(r - 1, c - 1, moveMap, piece);
          break;

        case 13: // General (red)
          // check all orthogonal movement
          if (this.checkInsidePalaceRed(r, c + 1))
            this.attemptMoveMapAdd(r, c + 1, moveMap, piece);
          if (this.checkInsidePalaceRed(r, c - 1))
            this.attemptMoveMapAdd(r, c - 1, moveMap, piece);
          if (this.checkInsidePalaceRed(r - 1, c))
            this.attemptMoveMapAdd(r - 1, c, moveMap, piece);
          if (this.checkInsidePalaceRed(r + 1, c))
            this.attemptMoveMapAdd(r + 1, c, moveMap, piece);

          // check to see if unblocked path to other General
          // this is the 'Generals cannot look at eachother' rule
          for (var row = r - 1; row >= 0; row--) {
            if (!this.checkSpaceEmpty(row, c)) {
              // if not empty, check to see if black general
              if (this.pieceMatrix[row][c] == 14) {
                this.attemptMoveMapAdd(row, c, moveMap, piece);
              } else {
                break;
              }
            }
          }
          break;

        case 14: // General (black)
          // check all orthogonal movement
          if (this.checkInsidePalaceBlack(r, c + 1))
            this.attemptMoveMapAdd(r, c + 1, moveMap, piece);
          if (this.checkInsidePalaceBlack(r, c - 1))
            this.attemptMoveMapAdd(r, c - 1, moveMap, piece);
          if (this.checkInsidePalaceBlack(r - 1, c))
            this.attemptMoveMapAdd(r - 1, c, moveMap, piece);
          if (this.checkInsidePalaceBlack(r + 1, c))
            this.attemptMoveMapAdd(r + 1, c, moveMap, piece);

          // check to see if unblocked path to other General
          // this is the 'Generals cannot look at eachother' rule
          for (var row = r + 1; row <= 9; row++) {
            if (!this.checkSpaceEmpty(row, c)) {
              // if not empty, check to see if red general
              if (this.pieceMatrix[row][c] == 13) {
                this.attemptMoveMapAdd(row, c, moveMap, piece);
              } else {
                break;
              }
            }
          }
      }
      return moveMap;
    },
    /**
     * Gets called from getMovableMapByPiece
     * Adds a move to the move map
     *
     * @param {Number} row row of move
     * @param {Number} col column of move
     * @param {Number[][]} moveMap map of moves that move is being added to
     *
     * @return {moveMap} returns the move map passed in
     */
    moveMapAdd(row, col, moveMap) {
      return moveMap[row][col] = 1;
    },
    /**
     * Gets called from getMovableMapByPiece
     * Adds a move to the move map after if move clears additional checks
     *
     * @param {Number} row row of move
     * @param {Number} col column of move
     * @param {Number[][]} moveMap map of moves that move is being added to
     *
     * @return {moveMap} returns the move map passed in
     */
    attemptMoveMapAdd(row, col, moveMap, piece) {
      if (this.checkSpaceEmptyOrEnemy(row, col, piece)) {
        return moveMap[row][col] = 1;
      }
      return moveMap;
    },
    /**
     * Gets called from attemptMoveMapAdd
     * Checks to see if a given space on the board is either empty or contains an enemy
     *
     * @param {Number} row row of space
     * @param {Number} col column of space
     * @param {Object} piece contains information about the piece to determine enemy status
     *
     * @return {Boolean} whether or not the space is empty of contains an enemy piece
     */
    checkSpaceEmptyOrEnemy(row, col, piece) {
      // first check if given space is in bounds of the board/pieceMatrix
      var inBounds = this.checkSpaceInBounds(row, col);
      if (inBounds) {
        var isEmpty = this.checkSpaceEmpty(row, col);
        // if selected piece and target piece (if any) not same parity (even / odd), then pieces are enemies
        // this is because of the way pieces are mapped (see above)
        var isEnemy = (this.pieceMatrix[row][col] % 2 != piece.pieceType % 2);
        return isEmpty || isEnemy;
      }
      return false;
    },
    /**
     * Gets called from attemptMoveMapAdd and checkSpaceEmptyOrEnemy
     * Checks to see if a given space on the board is empty
     *
     * @param {Number} row row of space
     * @param {Number} col column of space
     *
     * @return {Boolean} whether or not the space is empty
     */
    checkSpaceEmpty(row, col) {
      return this.checkSpaceInBounds(row, col) && (this.pieceMatrix[row][col] == 0);
    },
    /**
     * Gets called from checkSpaceEmptyOrEnemy and checkSpaceEmpty
     * Checks to see if a given space on the board is in bounds
     *
     * @param {Number} row row of space
     * @param {Number} col column of space
     *
     * @return {Boolean} whether or not the space is in bounds
     */
    checkSpaceInBounds(row, col) {
      return row >= 0 && row <= 9 && col >= 0 && col <= 8;
    },
    /**
     * Gets called from attemptMoveMapAdd
     * Checks to see if a given space on the board is in the red palace
     *
     * @param {Number} row row of space
     * @param {Number} col column of space
     *
     * @return {Boolean} whether or not the space is in red palace
     */
    checkInsidePalaceRed(row, col) {
      return row >= 7 && row <= 9 && col >= 3 && col <= 5;
    },
    /**
     * Gets called from attemptMoveMapAdd
     * Checks to see if a given space on the board is in the black palace
     *
     * @param {Number} row row of space
     * @param {Number} col column of space
     *
     * @return {Boolean} whether or not the space is in black palace
     */
    checkInsidePalaceBlack(row, col) {
      return row >= 0 && row <= 2 && col >= 3 && col <= 5;
    },
    /**
     * Gets called from watcher: moves
     * Makes sure local board reflects moves from store
     *
     * @param {Object[]} moveDeltas array of moves which represents the difference between board state and store moves
     */
    resolveMoveDeltas(moveDeltas) {
      // iterate over move deltas
      moveDeltas.forEach(move => {
        var moveInfo = this.decodeMoveString(move.moveString);
        var row = moveInfo.originRow;
        var col = moveInfo.originCol;
        var pieceType = this.pieceMatrix[row][col];

        var piece = {
          row,
          col,
          pieceType
        }
        // attempt to move the piece as simulation (i.e. do not push this move out)
        this.attemptMovePiece(piece, moveInfo.targetRow, moveInfo.targetCol, true);
      })
    },
    /**
     * Gets called from animateBoardTick
     * Handles the finalization of the board being set (i.e. after the initial piece select/deselct animation)
     */
    finalizeBoardInitialization() {
      if (!this.isTutorial) {
        if (this.$route.params.isNewGame) {
          this.openWelcomeMessageBox();
        }
        this.$router.replace({
          name: 'game',
          params: {
            playerID: this.$route.params.playerID
          }
        });
      }
    },

    //
    // UI LOGIC
    //

    /**
     * Gets called from finalizeBoardInitialization
     * Opens the welcome message box
     */
    openWelcomeMessageBox() {
      this.messageBoxPromise('game-information').then(() => {
        this.openMessageBox({
          target: 'game-information'
        })
      });
    },
    /**
     * Gets called from initializeBoard watcher: gameHasLoaded
     * Initiates the select/deselect animation
     *
     * @param {Object} options options about this animation
     */
    animateBoard(options) {
      // remove any previous animation intervals
      clearInterval(this.animationInterval);
      this.animationIndex = 0;
      this.animationInterval = setInterval(this.animateBoardTick, 80, options);
    },
    /**
     * Gets called from animateBoard
     * Represents one tick in the board select/deselect animation
     *
     * @param {Object} options options about this animation
     */
    animateBoardTick(options) {
      // set default options
      options = options || {
        loopAnimation: false
      };
      // iterate over every piece
      this.$refs['piece'].forEach(piece => {
        // determine if this piece should be selected in a diaganol fashion
        if (piece.r + piece.c == this.animationIndex) {
          piece.$el.classList.add("piece--selected");
          setTimeout(() => {
            piece.$el.classList.remove("piece--selected")
          }, 400)
        }
      })
      // increase the animation index
      this.animationIndex++;
      // if over the animation limit, reset
      if (this.animationIndex > 25) {
        this.animationIndex = 0;
        // if this animation is non-looping, do not restart
        if (!options.loopAnimation) {
          clearInterval(this.animationInterval);
          this.finalizeBoardInitialization();
        }
      }
    }
  },
  computed: {
    ...mapGetters(['initialBoardMovesLoadedFlag', 'messageBoxPromise', 'gameHasLoaded', 'characterArray', 'selectedPiece', 'currentTurn', 'playerColor', 'checkStatus', 'currentGameID', 'moves']),
    /**
     * Gets called from Board rendering
     */
    classObject() {
      return {
        "board--piece-selected": this.selectedPiece.row != -1
      }
    },
    selectedPieceColor() {
      return this.selectedPiece.pieceType % 2;
    },
    selectedPieceMoveMap() {
      if (this.selectedPiece.row != -1) {
        return this.getMovableMapByPiece(this.selectedPiece);
      } else {
        return null;
      }
    }
  },
  watch: {
    currentTurn(newCurrentTurn, oldCurrentTurn) {
      // send push notification on current move change
      if (newCurrentTurn == this.playerColor && oldCurrentTurn !== null) {
        Push.create("Your Turn!", {
          icon: '/favicon-120.png',
          onClick: function() {
            window.focus();
            this.close();
          }
        });
      }
    },
    // initialize board if route change (i.e. if the gameID has changed)
    $route() {
      this.initializeBoard();
    },
    // handle game having loaded from store
    gameHasLoaded(gameHasLoadedNewValue) {
      if (gameHasLoadedNewValue) {
        this.setBoard();
        this.animateBoard();
        if (this.$route.params.isNewGame || !this.moves.length) {
          this.setInitialBoardMovesLoadedFlag();
        }
      }
    },
    // watch to see if any moves have come in from the store
    moves(newMoves) {
      if (newMoves && newMoves.length) {
        // create move deltas as any moves from the store that are not present in local moves
        var moveDeltas = newMoves.filter((move, index) => move.moveString != this.localMoves[index]);
        this.resolveMoveDeltas(moveDeltas);
        if (!this.initialBoardMovesLoadedFlag) {
          this.setInitialBoardMovesLoadedFlag();
        }
      }
    },
  },
  // handle initial setting up and taking down of event listeners
  mounted() {
    this.initializeBoard();
    EventBus.$on('tutorial-reset', this.handleTutorialReset);
    EventBus.$on('window-resized', this.handleWindowResize);
    EventBus.$on('move-made', this.handleMoveMade);
  },
  destroyed() {
    EventBus.$off('tutorial-reset', this.handleTutorialReset);
    EventBus.$off('window-resized', this.handleWindowResize);
    EventBus.$off('move-made', this.handleMoveMade);
  }
}
</script>

<style lang="scss">
.board {
    height: 100%;
    width: 100%;

    $root: &;
    &--piece-selected {
        cursor: pointer;
    }

    &__graphics {
        height: 100%;
        width: 100%;
    }
}
</style>
