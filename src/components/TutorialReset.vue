<template>
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
