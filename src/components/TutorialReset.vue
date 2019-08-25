<template>
<!-- Reset button to reset board to initial state for tutorial view -->
<div class="tutorial-reset">
  <span @click="reset" class="tutorial-reset__link">Reset Board</span>
</div>
</template>

<script>
import {
  EventBus
} from '@/event-bus.js';

export default {
  name: 'tutorial-reset',
  methods: {
    /**
     * Gets called when tutorial reset is clicked
     * Emits reset event to board via EventBus
     */
    reset() {
      EventBus.$emit('tutorial-reset');
    }
  }
}
</script>

<style lang="scss">
.tutorial-reset {
    &__link {
        font-size: calc(1.3 * #{$ru});
        color: $colorDark1;
        cursor: pointer;
    }
}
</style>
