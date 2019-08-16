<template>
<div id="app">
  <xq-window-wrapper>
    <router-view></router-view>
  </xq-window-wrapper>
</div>
</template>

<script>
import xqWindowWrapper from '@/components/WindowWrapper.vue';
import xqBoard from '@/components/Board.vue';

export default {
  components: {
    xqWindowWrapper,
    xqBoard
  }
}
</script>

<style lang="scss">
@import "./sass/global.scss";
</style>

<style lang="scss">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#socket {
    display: none;
}
</style>
