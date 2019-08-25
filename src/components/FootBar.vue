<template>
<!-- Footer for the menu, containing creater information -->
<div class="foot-bar">
  <span class="foot-bar__text">Made by
    <span class="foot-bar__name"><a class="u-link-external" target="_blank" href="https://github.com/daddehs1">daddehs1</a></span>
  </span>
</div>
</template>

<script>
export default {
  name: "foot-bar"
}
</script>

<style lang="scss">
.foot-bar {
    width: 100%;
    position: absolute;
    bottom: 0;
    text-align: center;
    background-color: transparent;

    padding-top: 0.5rem;
    padding-bottom: 1.5rem;
    .mq-tiny & {
        padding-bottom: 1rem;
    }

    &__text {
        font-size: 1.2rem;
        color: white;
    }
}
</style>
