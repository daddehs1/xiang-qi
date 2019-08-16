<template>
<g class="board-art">
  <!-- horizontal lines -->
  <line x1="5.55%" y1="5%" x2="94.44%" y2="5%" ref="h-line" />
  <line x1="5.55%" y1="15%" x2="94.44%" y2="15%" ref="h-line" />
  <line x1="5.55%" y1="25%" x2="94.44%" y2="25%" ref="h-line" />
  <line x1="5.55%" y1="35%" x2="94.44%" y2="35%" ref="h-line" />
  <line x1="5.55%" y1="45%" x2="94.44%" y2="45%" ref="h-line" />
  <line x1="5.55%" y1="55%" x2="94.44%" y2="55%" ref="h-line" />
  <line x1="5.55%" y1="65%" x2="94.44%" y2="65%" ref="h-line" />
  <line x1="5.55%" y1="75%" x2="94.44%" y2="75%" ref="h-line" />
  <line x1="5.55%" y1="85%" x2="94.44%" y2="85%" ref="h-line" />
  <line x1="5.55%" y1="95%" x2="94.44%" y2="95%" ref="h-line" />

  <line x1="5.55%" y1="5%" x2="5.55%" y2="95%" />
  <line x1="94.44%" y1="5%" x2="94.44%" y2="95%" />

  <!-- top vertical lines -->
  <line x1="16.66%" y1="5%" x2="16.66%" y2="45%" />
  <line x1="27.77%" y1="5%" x2="27.77%" y2="45%" />
  <line x1="38.88%" y1="5%" x2="38.88%" y2="45%" />
  <line x1="50%" y1="5%" x2="50%" y2="45%" />
  <line x1="61.11%" y1="5%" x2="61.11%" y2="45%" />
  <line x1="72.22%" y1="5%" x2="72.22%" y2="45%" />
  <line x1="83.33%" y1="5%" x2="83.33%" y2="45%" />

  <!-- bottom vertical lines -->
  <line x1="16.66%" y1="55%" x2="16.66%" y2="95%" />
  <line x1="27.77%" y1="55%" x2="27.77%" y2="95%" />
  <line x1="38.88%" y1="55%" x2="38.88%" y2="95%" />
  <line x1="50%" y1="55%" x2="50%" y2="95%" />
  <line x1="61.11%" y1="55%" x2="61.11%" y2="95%" />
  <line x1="72.22%" y1="55%" x2="72.22%" y2="95%" />
  <line x1="83.33%" y1="55%" x2="83.33%" y2="95%" />

  <!-- diagnols -->
  <line x1="38.88%" y1="5%" x2="61.11%" y2="25%" />
  <line x1="61.11%" y1="5%" x2="38.88%" y2="25%" />
  <line x1="38.88%" y1="75%" x2="61.11%" y2="95%" />
  <line x1="61.11%" y1="75%" x2="38.88%" y2="95%" />

  <!-- borders -->
  <!-- <line x1="0" y1="100%" x2="100%" y2="100%" />
  <line x1="0" y1="0" x2="100%" y2="0" />
  <line x1="0" y1="0" x2="0" y2="100%" />
  <line x1="100%" y1="0" x2="100%" y2="100%" /> -->
</g>
</template>

<style lang="scss" scoped>
.board-art {
    height: 100%;
    width: 100%;

    & line {
        stroke: $colorDark1;
        stroke-width: 1.2px;
        transition: stroke-width 0.5s ease-in-out;
    }

    .u-line-fat {
        stroke-width: 2px;
    }
}
</style>
