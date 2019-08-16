<template>
<button type="submit" class="button">
  <span class="button__text">
    <slot></slot>
  </span>
</button>
</template>

<script>
export default {
  name: 'xq-button'
}
</script>

<style lang="scss" scoped>
.button {
    // style button full-width for mobile
    .mq-mobile & {
        width: 100%;
    }

    // remove default button styles
    border: 0;
    font: inherit;
    color: inherit;
    &:focus {
        outline: inherit;
    }

    cursor: pointer;
    width: 10rem;
    height: 4rem;
    background-color: $colorRed2;

    &__text {
        user-select: none;
        color: white;
        font-size: 2rem;
        text-align: center;
        letter-spacing: 0.1rem;
        font-weight: 500;
    }
}
</style>
