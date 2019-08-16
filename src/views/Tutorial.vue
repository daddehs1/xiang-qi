<template>
<div class="tutorial" :style="styleObject">

  <div class="tutorial__heading">
    <xq-head-bar>
      <xq-tutorial-reset/>
    </xq-head-bar>
  </div>

  <mq-layout :mq="['tiny', 'mobile']" class="tutorial__hud">
    <xq-tutorial-reset/>
  </mq-layout>

  <div class="tutorial__info">
    <xq-tutorial-info/>
  </div>

  <div class="tutorial__board-area" :style="boardAreaDimensionsStyleObject">
    <xq-board class="tutorial__board" :isTutorial="true" />
  </div>
</div>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

import xqHeadBar from '@/components/HeadBar';
import xqBoard from '@/components/Board'
import xqTutorialReset from '@/components/TutorialReset'
import xqTutorialInfo from '@/components/TutorialInfo'

export default {
  name: 'game',
  components: {
    xqHeadBar,
    xqBoard,
    xqTutorialReset,
    xqTutorialInfo
  },
  methods: {
    ...mapActions(['setMenuType', 'setSelectedPiece'])
  },
  computed: {
    ...mapGetters(['windowWidth', 'windowHeight']),
    styleObject() {
      var styleObject;
      if (this.windowWidth >= this.windowHeight) {
        styleObject = {
          'grid-template-columns': "minmax(auto, calc(var(--vw) * 50)) minmax(calc(var(--vh) * 80), auto)",
          'grid-template-areas': "'header header' 'tutorial-info board-area'"
        }
      } else {
        styleObject = {
          'grid-template-rows': "calc(var(--vh) * 10) auto 1fr 1fr",
          'grid-template-areas': "'header' 'status' 'board-area' 'tutorial-info'"
        }
      }
      return styleObject;
    },
    boardAreaDimensionsStyleObject() {
      // landscape mode
      var styleObject;
      if (this.windowWidth >= this.windowHeight) {
        styleObject = {
          height: .8 * this.windowHeight + "px",
          width: .8 * this.windowHeight + "px"
        }
        // portrait mode
      } else {
        if (this.windowHeight <= 1.4 * this.windowWidth) {
          styleObject = {
            height: .6 * this.windowHeight + "px",
            width: .6 * this.windowHeight + "px"
          }
        } else {
          styleObject = {
            height: this.windowWidth + "px",
            width: this.windowWidth + "px"
          }
        }
      }
      return styleObject;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setMenuType('tutorial');
    });
  },
  created() {
    this.setSelectedPiece({
      row: -1,
      col: -1,
      pieceType: 0
    });
  }
}
</script>

<style lang="scss">
.tutorial {
    height: 100%;
    display: grid;

    &__heading {
        height: 100%;
        grid-area: header;
    }

    &__hud {
        margin: 0 auto;
        width: 100%;
        order: 1;
        grid-area: status;
    }

    &__info {
        grid-area: tutorial-info;
    }

    &__board-area {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        order: 4;
        grid-area: board-area;
        justify-self: center;
    }

    &__board {
        padding: 1rem;
        height: 100%;
        width: 100%;
    }
}
</style>
