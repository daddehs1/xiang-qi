<template>
<!-- A xiangqi piece on the board -->
<g @click="attemptSelect" class="piece" :class="getClassObject">
  <circle class="piece__circle piece__circle--outer" cx="0" cy="0" r="4%" stroke-width="1" fill="white" /></circle>
  <circle class="piece__circle piece__circle--inner" cx="0" cy="0" r="3.4%" stroke-width="1" fill="white" /></circle>
  <text class="piece__character" x="0" y="1.5%">{{ pieceCharacter }}</text>
</g>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex';

export default {
  props: ['r', 'c', 'pieceType', 'pieceCharacter', 'isTutorial'],
  methods: {
    ...mapActions(['setSelectedPiece']),
    /**
     * Gets called when Piece is clicked
     * Attempts to select a piece for the current player
     */
    attemptSelect() {
      // only can select if 1. is a tutorial OR 2. player is selected own piece during own turn
      if (this.isTutorial || (this.currentTurn == this.pieceColor && this.currentTurn == this.playerColor)) {
        this.setSelectedPiece({
          row: this.r,
          col: this.c,
          pieceType: this.pieceType
        })
      }
    },
  },
  computed: {
    ...mapGetters(['currentTurn', 'playerColor', 'selectedPiece']),
    pieceColor() {
      return this.pieceType % 2
    },
    isSelected() {
      return this.r == this.selectedPiece.row && this.c == this.selectedPiece.col
    },
    getClassObject() {
      return {
        "piece--black": this.pieceColor == 0,
        "piece--red": this.pieceColor == 1,
        "piece--selected": this.isSelected,
      }
    }
  }
}
</script>

<style lang="scss">
.piece {

    // styles for all pieces
    &__circle {
        cursor: pointer;
        transition: 0.5s fill ease-in-out, 0.5s stroke ease-in-out, 0.2s transform;
    }

    &__character {
        text-anchor: middle;
        user-select: none;
        cursor: pointer;
        transition: 0.5s fill ease-in-out;

        font-size: 3vmin;

        .mq-mobile &,
        .mq-tiny & {
            font-size: 4vmin;
        }
    }

    // styles for pieces of certain color
    &--red {
        & .piece__circle {
            stroke: $colorRed2;
        }

        & .piece__character {
            fill: $colorRed2;
        }
    }

    &--black {
        & .piece__circle {
            stroke: $colorDark1;
        }

        & .piece__character {
            fill: $colorDark1;
        }
    }

    // styles for selected pieces
    $root: &;
    &--selected {
        #{$root} {
            &__character,
            &__circle {
                transform: scale(1.2);
            }

            &__character {
                fill: $colorWhite;
            }

            &__circle {
                &--inner {
                    stroke: $colorWhite;
                    stroke-width: 1.5px;
                }
            }
        }

        // match selected AND specific color
        &#{$root}--black {
            #{$root}__circle {
                fill: $colorDark1;
            }
        }
        &#{$root}--red {
            #{$root}__circle {
                fill: $colorRed2;
            }
        }
    }
}
</style>
