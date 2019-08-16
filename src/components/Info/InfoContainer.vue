<template>
<div class="info-container">
  <slot></slot>
</div>
</template>

<script>
export default {
  name: 'info-container'
}
</script>

<style lang="scss">
.info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1rem 10%;
}
</style>
