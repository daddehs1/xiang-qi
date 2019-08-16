<template>
<input :name="this.name" maxlength="10" class="input-bar"></input>
</template>

<script>
export default {
  props: ['name'],
  name: 'input-bar'
}
</script>

<style lang="scss" scoped>
.input-bar {
    // unfo default appearance
    color: $colorBlack;
    -webkit-appearance: none;
    height: 4rem;
    width: 100%;
    background-color: white;
    border-radius: 0;
    border: 2px solid $colorDark1;
    text-align: right;
    padding: 0 5rem 0 2.5rem;
    font-size: 1.8rem;
    text-align: left;
    transition: 0.3s all ease;

    &:focus {
        outline: none;
        border-color: $colorRed2;
    }
}
</style>
