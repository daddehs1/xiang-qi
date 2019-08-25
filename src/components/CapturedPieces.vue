<template>
<!-- A container for captured pieces for a given color -->
<div class="captured-pieces" :class="classObject">
  <template v-for="(p, index) in 16">
    <!-- add an empty slot for this player -->
    <div :key=" 'cp-'+ index + '-' + playerColor" class="captured-pieces__piece">
      <div class="captured-pieces__text">
        <!-- add pieces text that are part of this players captures pieces -->
        <span v-if="index < playerCapturedPieces.length">
          {{characterArray[playerCapturedPieces[index]-1]}}
        </span>
      </div>
    </div>
    <!-- dummy break piece to help the pieces to subdivide more aesthetically (groups of 8) -->
    <div v-if="index == 7" class="captured-pieces__break"></div>
  </template>
</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'

export default {
  name: 'captured-pieces',
  props: ['playerColor'],
  computed: {
    ...mapGetters(['characterArray', 'capturedPieces']),
    classObject() {
      return {
        'captured-pieces--black': this.playerColor == 0,
        'captured-pieces--red': this.playerColor == 1
      }
    },
    playerCapturedPieces() {
      return this.capturedPieces[this.playerColor];
    }
  }
}
</script>

<style lang="scss">
.captured-pieces {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    &__break {
        height: 1px;
        width: 100%;
        margin-top: -1px;
    }

    &__piece {
        text-align: center;
        border: 1px solid;
        border-color: black;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        width: 6vmin;
        height: 6vmin;
        padding: 0.5vmin;
        margin: 0.5vmin;

    }

    &__text {
        font-size: 3.5vmin;
    }

    $root: &;
    &--dummy {
        #{$root} {
            &__text {}
        }
    }
    &--red {
        #{$root} {
            &__piece {
                border-color: $colorDark1;
            }
            &__text {
                color: $colorDark1;
            }
        }
    }
    &--black {
        #{$root} {
            &__piece {
                border-color: $colorRed2;
            }
            &__text {
                color: $colorRed2;
            }
        }
    }
}
</style>
