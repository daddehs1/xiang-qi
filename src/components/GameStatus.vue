<template>
<div class="game-status" :class="classObject">
  <div class="game-status__turn-info">
    <div class="game-status__item ">{{this.checkStatusString}}</div>
    <div class="game-status__divider ">•</div>
    <div class="game-status__item game-status__item--turn">{{this.turnString}}</div>
  </div>
  <div class="game-status__player-info">
    <span class="game-status__player-message"> {{playerColorString}} </span>
  </div>
</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'

export default {
  name: 'game-status',
  data() {
    return {
      checkStatusStrings: ["No Check", "Check", "Checkmate"]
    }
  },
  computed: {
    ...mapGetters(['initialBoardMovesLoadedFlag', 'currentTurn', 'checkStatus', 'playerColor']),
    classObject() {
      return {
        'game-status--black-turn': this.currentTurn == 0,
        'game-status--red-turn': this.currentTurn == 1,
        'game-status--checkmate': this.checkStatus == 2,
        'game-status--player-red': this.playerColor == 1,
        'game-status--player-black': this.playerColor == 0,
        'game-status--board-loaded': this.initialBoardMovesLoadedFlag
      }
    },
    playerColorString() {
      return "You are " + (this.playerColor == 0 ? "Black" : "Red");
    },
    turnString() {
      var turnStr;
      if (this.checkStatus == 2) {
        turnStr = (this.currentTurn == 0 ? "Red " : "Black  ") + "Wins"
      } else {
        turnStr = (this.currentTurn == 0 ? "Black " : "Red ") + "Turn"
      }
      return turnStr;
    },
    checkStatusString() {
      return this.checkStatusStrings[this.checkStatus];
    }
  }
}
</script>

<style lang="scss">
.game-status {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.5s ease-in-out, color 0.5s ease-in-out;

    &--board-loaded {
        opacity: 100;
    }

    height: 100%;
    min-width: 100%;

    @media (orientation: landscape) {
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
    }

    &__turn-info {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &--black-turn &__divider,
    &--black-turn &__item {
        color: $colorDark1;
    }

    &--red-turn &__divider,
    &--red-turn &__item {
        color: $colorRed2;
    }

    &__divider,
    &__item {
        font-size: calc(1.1 * #{$ru});
    }

    &__divider {
        width: 10%;
    }

    &__item {
        margin: 0 1rem;
        white-space: nowrap;
        min-width: 45%;

        &:first-of-type {
            text-align: right;
        }

        &:last-of-type {
            text-align: left;
        }
    }

    $root: &;

    &__player-message {
        font-size: calc(.6 * #{$ru} + .5rem);
        &#{$root}--player-black & {
            color: $colorDark1;
        }

        #{$root}--player-red & {
            color: $colorRed2;
        }
    }

    &--checkmate {
        &#{$root} {
            &--black-turn {
                #{$root}__item--turn {
                    color: $colorRed2;
                }
            }
            &--red-turn {
                #{$root}__item--turn {
                    color: $colorDark1;
                }
            }
        }
    }
}
</style>
