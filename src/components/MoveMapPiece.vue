<template>
<g @click="handleMoveMapClick" class="move-map-piece" :class="getClassObject">
  <circle class="move-map-piece__circle" r="4%" /></circle>
</g>
</template>

<script>
import {
  EventBus
} from '@/event-bus.js';

export default {
  name: 'move-map-piece',
  props: ['pieceColor', 'r', 'c', 'invisible'],
  methods: {
    handleMoveMapClick() {
      EventBus.$emit('move-made', {
        row: this.r,
        col: this.c
      });
    }
  },
  computed: {
    getClassObject() {
      return {
        "move-map-piece--black": this.pieceColor == 0,
        "move-map-piece--red": this.pieceColor == 1,
        "move-map-piece--invisible": this.invisible
      }
    }
  }
}
</script>

<style lang="scss">
.move-map-piece {
    cursor: pointer;
    $root: &;
    &__circle {
        opacity: 0.5;
        stroke-width: 1;
    }

    &--black {
        #{$root}__circle {
            fill: $colorDark1;
        }
    }

    &--red {
        #{$root}__circle {
            fill: $colorRed2;
        }
    }

    &--invisible {
        #{$root}__circle {
            fill: transparent;
        }
    }
}
</style>
