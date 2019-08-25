<template>
<!-- Container for game information in the tutoral view -->
<div class="tutorial-info">
  <div class="tutorial-info__title">
    Piece Information
  </div>
  <div class="tutorial-info__english-name">
    {{selectedPieceInformation.name}}
  </div>
  <div class="tutorial-info__description">
    {{selectedPieceInformation.description}}
  </div>
  <ul class="tutorial-info__movement-rules">
    <li v-for="movementRule in selectedPieceInformation.movement" class="tutorial-info__movement-item">{{movementRule}}</li>
  </ul>
</div>
</template>

<script>
import pieceInfo from '@/assets/pieceInformation.json'
import {
  mapGetters
} from 'vuex'

export default {
  name: 'tutorial-info',
  data() {
    return {
      pieceInfo
    }
  },
  computed: {
    ...mapGetters(['selectedPiece']),
    selectedPieceInformation() {
      var pieceType = this.selectedPiece.pieceType;
      var pieceCategory = Math.floor((pieceType - 1) / 2) * 2 + 1
      return pieceCategory !== -1 ? pieceInfo[pieceCategory] : {
        name: "Select a Piece",
        description: "Select a piece to learn more about it",
        movement: []
      }
    }
  }
}
</script>

<style lang="scss">
.tutorial-info {
    padding: calc(.8 * #{$ru}) calc(1.5 * #{$ru});

    &__title {
        color: $colorRed2;
        font-size: calc(1.2 * #{$ru});
    }

    &__english-name {
        color: $colorDark1;
        font-size: calc(1 * #{$ru});
        margin-bottom: calc(.5 * #{$ru});
    }

    &__description {
        color: $colorDark1;
        font-size: calc(.8 * #{$ru});
        line-height: calc(.8 * #{$ru} + .4rem);
        font-weight: 400;
        padding: calc(.4 * #{$ru});
        margin-bottom: calc(.1 * #{$ru});
    }

    &__movement-rules {
        list-style: none;
        color: $colorDark1;
        padding: calc(.3 * #{$ru});
    }

    &__movement-item {
        color: $colorDark1;
        font-size: calc(.7 * #{$ru});
        font-weight: 300;
        line-height: calc(.7 * #{$ru} + .4rem);
        &:not(last-of-type) {
            margin-bottom: calc(.5 * #{$ru});
        }
    }
}
</style>
