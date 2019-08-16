<template>
<div class="game" :style="styleObject">
  <xq-message-box-link mb-target="game-information" />
  <xq-message-box-link mb-target="game-error" />

  <div class="game__heading">
    <xq-head-bar>
      <xq-game-status/>
    </xq-head-bar>
  </div>

  <mq-layout :mq="['tiny', 'mobile']" class="game__hud">
    <xq-game-status/>
  </mq-layout>

  <template v-if="gameHasLoaded">
    <div class="game__info game__info--black">
      <xq-captured-pieces :playerColor="0" />
    </div>

    <div class="game__info game__info--red">
      <xq-captured-pieces :playerColor="1" />
    </div>
  </template>

  <div class="game__board-area" :style="boardAreaDimensionsStyleObject">
    <xq-board class="game__board" />
  </div>
</div>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

import xqHeadBar from '@/components/HeadBar';
import xqBoard from '@/components/Board'
import xqGameStatus from '@/components/GameStatus'
import xqCapturedPieces from '@/components/CapturedPieces'
import xqMessageBoxLink from '@/components/MessageBox/MessageBoxLink'
import xqMessageBoxContainer from '@/components/MessageBox/MessageBoxContainer'

export default {
  name: 'game',
  components: {
    xqHeadBar,
    xqBoard,
    xqGameStatus,
    xqCapturedPieces,
    xqMessageBoxLink,
    xqMessageBoxContainer
  },
  methods: {
    ...mapActions(['resetGameState', 'loadGame', 'setMenuType']),
    initializeGame() {
      this.resetGameState();
      var playerID = this.$route.params.playerID;
      var isNewGame = this.$route.params.isNewGame
      if (!isNewGame) {
        this.loadGame(playerID);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setMenuType('game');
    });
    this.initializeGame();
  },
  computed: {
    ...mapGetters(['gameHasLoaded', 'windowWidth', 'windowHeight', 'currentGameID']),
    styleObject() {
      var styleObject;
      if (this.windowWidth >= this.windowHeight) {
        styleObject = {
          'grid-template-columns': "minmax(auto, calc(var(--vw) * 30)) minmax(calc(var(--vh) * 80), auto) minmax(auto, calc(var(--vw) * 30))",
          'grid-template-areas': "'header header header' 'info-black board-area info-red'"
        }
      } else {
        styleObject = {
          'grid-template-rows': "calc(var(--vh) * 10) auto 1fr 1fr 1fr",
          'grid-template-areas': "'header' 'status' 'board-area' 'info-red' 'info-black'",
          'align-items': 'center'
        }
      }
      return styleObject;
    },
    boardAreaDimensionsStyleObject() {
      // landscape mode
      var styleObject;
      if (this.windowWidth >= this.windowHeight) {
        styleObject = {
          height: .8 * this.windowHeight + "px",
          width: .8 * this.windowHeight + "px"
        }
        // portrait mode
      } else {
        if (this.windowHeight <= 1.4 * this.windowWidth) {
          styleObject = {
            height: .6 * this.windowHeight + "px",
            width: .6 * this.windowHeight + "px"
          }
        } else {
          styleObject = {
            height: this.windowWidth + "px",
            width: this.windowWidth + "px"
          }
        }
      }
      return styleObject;
    }
  },
  watch: {
    $route() {
      this.initializeGame();
    }
  }
}
</script>

<style lang="scss">
.game {
    height: 100%;
    display: grid;

    &__heading {
        height: 100%;
        grid-area: header;
    }

    &__hud {
        margin: 0 auto;
        width: 100%;
        order: 1;
        grid-area: status;
    }

    &__info {
        width: 100%;
        align-self: center;

        &--black {
            grid-area: info-black;
        }

        &--red {
            grid-area: info-red;
        }
    }

    &__board-area {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        order: 4;
        grid-area: board-area;
        justify-self: center;
    }

    &__board {
        padding: 1rem;
        height: 100%;
        width: 100%;
    }
}
</style>
