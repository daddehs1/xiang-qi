<template>
<!-- The game logo -->
<div class="logo" :class="classObject">
  <svg class="logo__svg">
        <circle class="logo__circle" cx="50%" cy="50%">
        </circle>
        <text class="logo__text" x="50%" y="63%">將</text>
      </svg>
</div>
</template>

<script>
export default {
  name: 'logo',
  props: ['colorInverted'],
  computed: {
    classObject() {
      return {
        'logo--color-inverted': this.colorInverted
      }
    }
  }
}
</script>

<style lang="scss">
.logo {
    text-align: center;
    height: 5rem;
    width: 5rem;

    &__svg {
        height: 100%;
        width: 100%;
    }

    &__circle {
        stroke: white;
        stroke-width: 2px;
        fill-opacity: 0;
        transition: stroke 0.5s ease-in-out;
        r: 2.2rem;
    }

    &__text {
        fill: white;
        font-size: 2rem;
        //font-weight: 100;
        text-anchor: middle;
        user-select: none;
        transition: 0.5s fill ease-in-out;
    }

    $root: &;
    &--color-inverted {
        #{$root} {
            &__circle {
                stroke: $colorRed1;
            }

            &__text {
                fill: $colorRed1;
            }
        }

    }

    .mq-tiny & {
        height: 3rem;
        width: 3rem;

        &__circle {
            stroke-width: 1.2px;
            r: 1.4rem;
        }

        &__text {
            font-size: 1.6rem;
        }
    }
}
</style>
