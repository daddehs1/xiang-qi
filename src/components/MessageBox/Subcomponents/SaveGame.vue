<template>
<xq-info-container>
  <xq-info-group>
    <template v-slot:content>
      <p>Your game saves automatically as you play!</p>
      <p>Load your game with the following code: <span class="u-emphasis">{{playerID}}</span></p>
      <p>Or by using this <a class="u-link-external" :href="`/game/${playerID}`">game link</a></p>
    </template>
  </xq-info-group>
</xq-info-container>
</template>


<script>
import {
  mapGetters
} from 'vuex'

import xqInfoContainer from '@/components/Info/InfoContainer.vue'
import xqInfoGroup from '@/components/Info/InfoGroup.vue'

export default {
  name: 'save-game',
  components: {
    xqInfoContainer,
    xqInfoGroup
  },
  computed: {
    ...mapGetters(['playerColor', 'redID', 'blackID']),
    playerID() {
      return this.playerColor == 0 ? this.blackID : this.redID;
    }
  }
}
</script>

<style lang="scss">
</style>
