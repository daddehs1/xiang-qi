<template>
<div class="board" :class="classObject">
  <svg class="board__graphics" ref="graphics" xmlns="http://www.w3.org/2000/svg">
    <xq-board-art></xq-board-art>

    <template v-if="!isTutorial && ghostPieces" v-for="ghost in ghostPieces">
      <xq-ghost :style="getTranslatePieceStyleObject(ghost.row, ghost.col)" :color="ghost.pieceColor" :isOrigin="ghost.isOrigin" ref="ghost" />
    </template>


    <template v-for="(row, r) in pieceMatrix">
      <template v-for="(col, c) in row">
        <template v-if="pieceMatrix[r][c] != 0">
          <xq-piece :key="r+ '-' + c + '-' + keySuffix" :r="r" :c="c"
                    :pieceType="pieceMatrix[r][c]"
                    :pieceCharacter= "characterArray[pieceMatrix[r][c]-1]"
                    :style="getTranslatePieceStyleObject(r, c)"
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
    localMoves: [],
    ghostPieces: [],
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
    historyStack: [],
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
    handleTutorialReset() {
      this.setBoard();
    },
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
    resetBoardState() {
      // Fetch the initialState object locally, so we do not have to call the function again
      let initialData = getInitialData();
      for (let prop in initialData) {
        this[prop] = initialData[prop];
      }
    },
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
    getXShift(c) {
      var fixedXShift = 50 / BOARD_WIDTH_SPACES;
      var variableXShiftFactor = 100 / BOARD_WIDTH_SPACES;
      var boardShouldReverse = this.playerColor == 0;
      return fixedXShift + c * variableXShiftFactor;
    },
    getYShift(r) {
      var fixedYShift = 50 / BOARD_HEIGHT_SPACES;
      var variableYShiftFactor = 100 / BOARD_HEIGHT_SPACES;
      return fixedYShift + r * variableYShiftFactor;
    },
    getTranslatePieceStyleObject(r, c) {
      var boardShouldReverse = this.playerColor == 0 && this.gameHasLoaded;
      return boardShouldReverse ? {
        transform: 'translate(' + (100 - this.getXShift(c)) + '%, ' + (100 - this.getYShift(r)) + '%)'
      } : {
        transform: 'translate(' + this.getXShift(c) + '%, ' + this.getYShift(r) + '%)'
      }
    },
    toggleKeySuffix() {
      // "key-change method" to force component to
      // workaround to allow pieces to reposition themselves on window resize (as window is not reactive)
      this.keySuffix = !this.keySuffix;
    },
    handleWindowResize() {
      this.toggleKeySuffix();
    },
    // GAME LOGIC
    handleMoveMade(payload) {
      this.attemptMovePiece(this.selectedPiece, payload.row, payload.col);
      //this.movePiece(this.selectedPiece, payload.row, payload.col);
    },
    attemptMovePiece(piece, targetRow, targetCol, isSimulation) {
      var pieceColor = piece.pieceType % 2;
      var opponentPieceColor = (piece.pieceType + 1) % 2;

      var targetPieceType = this.pieceMatrix[targetRow][targetCol];
      this.movePieceWithHistory(piece, targetRow, targetCol);

      // disallow move if the move will result in a check against moving player

      if (this.checkForCheck(pieceColor)) {
        this.undoMove();
        return false;
      }

      // Move is Accepted

      // place ghost in previous location
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

      if (!this.isTutorial) {
        if (targetPieceType) {
          this.addCapturedPiece({
            pieceType: targetPieceType
          });
        }

        if (this.checkForCheck(opponentPieceColor)) {
          this.checkForCheckmate(opponentPieceColor);
        }

        var moveString = this.encodeMoveString(piece.row, piece.col, targetRow, targetCol);
        this.localMoves.push(moveString);
        if (!isSimulation) {
          this.pushMove({
            moveString
          });
        }
      }

      this.setSelectedPiece({
        row: -1,
        col: -1,
        pieceType: 0
      });
      this.switchCurrentTurn();
      return true;

    },
    encodeMoveString(originRow, originCol, targetRow, targetCol) {
      var letters = "ABCDEFGHIJ"
      return letters[originRow] + originCol + letters[targetRow] + targetCol;
    },
    decodeMoveString(moveString) {
      var letters = "ABCDEFGHIJ"
      return {
        originRow: letters.indexOf(moveString[0]),
        originCol: parseInt(moveString[1]),
        targetRow: letters.indexOf(moveString[2]),
        targetCol: parseInt(moveString[3])
      }
    },
    movePiece(piece, targetRow, targetCol) {
      var originRow = piece.row;
      var originCol = piece.col;
      var originPieceType = piece.pieceType;

      this.setPieceMatrixCell(targetRow, targetCol, originPieceType);
      this.setPieceMatrixCell(originRow, originCol, 0);

      if (originPieceType == 13 || originPieceType == 14) {
        var pieceColor = originPieceType % 2;
        var newGeneralLocation = {
          row: targetRow,
          col: targetCol
        };
        this.$set(this.generalLocations, pieceColor, newGeneralLocation);
      }

    },
    movePieceWithHistory(piece, row, col) {
      var historyEvent = {
        checkStatus: this.checkStatus,
        originRow: piece.row,
        originCol: piece.col,
        originPieceType: piece.pieceType,
        targetRow: row,
        targetCol: col,
        targetPieceType: this.pieceMatrix[row][col],
        generalLocations: Object.assign({}, this.generalLocations)
      }
      this.movePiece(piece, row, col);
      this.pushEventToHistoryStack(historyEvent)
    },
    pushEventToHistoryStack(historyEvent) {
      this.historyStack.push(historyEvent);
    },
    popEventFromHistoryStack() {
      return this.historyStack.pop();
    },
    undoMove() {
      var historyEvent = this.popEventFromHistoryStack();
      this.setCheckStatus(historyEvent.checkStatus);
      this.setPieceMatrixCell(historyEvent.originRow, historyEvent.originCol, historyEvent.originPieceType);
      this.setPieceMatrixCell(historyEvent.targetRow, historyEvent.targetCol, historyEvent.targetPieceType);
      this.generalLocations = Object.assign({}, historyEvent.generalLocations);
    },
    setPieceMatrixCell(row, col, pieceType) {
      this.$set(this.pieceMatrix[row], col, pieceType);
    },
    checkForCheck(playerColorToCheck) {
      var targetGeneralLocation = this.generalLocations[playerColorToCheck];
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
            var currentMovableMap = this.getMovableMapByPiece(currentPiece);
            if (currentMovableMap[targetGeneralLocation.row][targetGeneralLocation.col] == 1) {
              this.setCheckStatus(1);
              return true;
            }
          }
        }
      }
      this.setCheckStatus(0);
      return false;
    },
    checkForCheckmate(playerColorToCheck) {
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
            var currentMovableMap = this.getMovableMapByPiece(currentPiece)
            for (var moveRow = 0; moveRow < currentMovableMap.length; moveRow++) {
              for (var moveCol = 0; moveCol < currentMovableMap[0].length; moveCol++) {
                if (currentMovableMap[moveRow][moveCol] == 1) {
                  this.movePieceWithHistory(currentPiece, moveRow, moveCol);
                  var isStillCheck = this.checkForCheck(playerColorToCheck);
                  this.undoMove();
                  if (!isStillCheck) {
                    return false;
                  }
                }
              }
            }
          }
        }
      }
      this.setCheckStatus(2);
      return true;
    },
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
            // make sure adjacent diagnol is empty first before checking second adjacent diagnol
            // this is 'elphant can't jump pieces' rule
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
    moveMapAdd(row, col, moveMap) {
      return moveMap[row][col] = 1;
    },
    attemptMoveMapAdd(row, col, moveMap, piece) {
      if (this.checkSpaceEmptyOrEnemy(row, col, piece)) {
        return moveMap[row][col] = 1;
      }
      return moveMap;
    },
    checkSpaceEmptyOrEnemy(row, col, piece) {
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
    checkSpaceInBounds(row, col) {
      return row >= 0 && row <= 9 && col >= 0 && col <= 8;
    },
    checkSpaceEmpty(row, col) {
      return this.checkSpaceInBounds(row, col) && (this.pieceMatrix[row][col] == 0);
    },
    checkInsidePalaceRed(row, col) {
      return row >= 7 && row <= 9 && col >= 3 && col <= 5;
    },
    checkInsidePalaceBlack(row, col) {
      return row >= 0 && row <= 2 && col >= 3 && col <= 5;
    },
    animateBoardTick(options) {
      // set default options
      options = options || {
        loopAnimation: false
      };
      this.$refs['piece'].forEach(piece => {
        if (piece.r + piece.c == this.animationIndex) {
          piece.$el.classList.add("piece--selected");
          setTimeout(() => {
            piece.$el.classList.remove("piece--selected")
          }, 400)
        }
      })
      this.animationIndex++;
      if (this.animationIndex > 25) {
        this.animationIndex = 0;
        if (!options.loopAnimation) {
          clearInterval(this.animationInterval);
          this.finalizeBoardInitialization();
        }
      }
    },
    resolveMoveDeltas(moveDeltas) {
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
        this.attemptMovePiece(piece, moveInfo.targetRow, moveInfo.targetCol, true);
      })
    },
    animateBoard(options) {
      clearInterval(this.animationInterval);
      this.animationIndex = 0;
      this.animationInterval = setInterval(this.animateBoardTick, 80, options);
    },
    openWelcomeMessageBox() {
      this.messageBoxPromise('game-information').then(() => {
        this.openMessageBox({
          target: 'game-information'
        })
      });
    },
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
    }
  },
  computed: {
    ...mapGetters(['initialBoardMovesLoadedFlag', 'messageBoxPromise', 'gameHasLoaded', 'characterArray', 'selectedPiece', 'currentTurn', 'playerColor', 'checkStatus', 'currentGameID', 'moves']),
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
      console.log(oldCurrentTurn)
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
    $route() {
      this.initializeBoard();
    },
    gameHasLoaded(gameHasLoadedNewValue) {
      console.log("the game has loaded");
      if (gameHasLoadedNewValue) {
        this.setBoard();
        this.animateBoard();
        if (this.$route.params.isNewGame || !this.moves.length) {
          this.setInitialBoardMovesLoadedFlag();
        }
      }
    },
    moves(newMoves) {
      if (newMoves && newMoves.length) {
        var moveDeltas = newMoves.filter((move, index) => move.moveString != this.localMoves[index]);
        this.resolveMoveDeltas(moveDeltas);
        console.log("the moves have been updated");
        if (!this.initialBoardMovesLoadedFlag) {
          this.setInitialBoardMovesLoadedFlag();
        }
      }
    },
  },
  mounted() {
    this.initializeBoard();
    EventBus.$on('tutorial-reset', this.handleTutorialReset);
    EventBus.$on('window-resized', this.handleWindowResize);
    EventBus.$on('move-made', this.handleMoveMade);
  },
  destroyed() {
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
