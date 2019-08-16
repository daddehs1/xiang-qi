<template>
<g class="ghost">
  <circle class="ghost__circle" cx="0" cy="0" r="4.5%" :class="getClassObject" /></circle>
</g>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex';

export default {
  props: ['color', 'isOrigin'],
  methods: {},
  computed: {
    getClassObject() {
      return {
        "ghost__circle--black": this.color == 0,
        "ghost__circle--red": this.color == 1,
        "ghost__circle--origin": this.isOrigin,
      }
    }
  }
}
</script>

<style lang="scss">
.ghost {
    &__circle {
        fill: transparent;
        stroke-dasharray: 5px;
        stroke-width: 1.75px;

        &--red {
            stroke: $colorRed2;

        }

        &--black {
            stroke: $colorDark1;
        }

        &--origin {
            r: 4%;
            stroke-width: 2px;
        }
    }
}
</style>
