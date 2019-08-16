<template>
<form ref="load-form" class="load-form" @submit.prevent="handleSubmit">
  <xq-info-container class="load-game">
    <xq-info-group :isCentered="true" class="load-game__info">
      <template v-slot:content class="chicken">
        <p>Enter game code: </p>
        <xq-input-bar name="player-id" class="load-game__input"></xq-input-bar>
    </template>
    </xq-info-group>
    <xq-button class="load-game__button">Load</xq-button>
  </xq-info-container>
</form>
</template>


<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

import xqInfoContainer from '@/components/Info/InfoContainer.vue'
import xqInfoGroup from '@/components/Info/InfoGroup.vue'
import xqButton from '@/components/Button.vue'
import xqInputBar from '@/components/InputBar.vue'

export default {
  name: 'load-game',
  components: {
    xqInfoContainer,
    xqInfoGroup,
    xqButton,
    xqInputBar,
  },
  methods: {
    ...mapActions(['resetGameState', 'closeMessageBox']),
    handleSubmit() {
      var inputPlayerID = this.$refs['load-form']['player-id'].value;
      if (inputPlayerID) {
        this.$router.push({
          name: 'game',
          params: {
            playerID: inputPlayerID
          }
        });
        this.closeMessageBox({
          target: 'load-game'
        });
        //this.resetGameState();
      }
    }
  }
}
</script>

<style lang="scss">
.load-form {
    width: 100%;
    flex: 1 1 auto;
    display: flex;
}

.load-game {
    flex: 1 1 auto;

    &__input {
        margin-top: 1.2rem;
    }

    &__info {
        flex: 1 1 auto;
    }
}
</style>
