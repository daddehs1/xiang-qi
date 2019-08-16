<template>
<xq-info-container>
  <xq-info-group>
    <template v-slot:content>
        <p>Invite a friend to your game with the following code: <span class="u-emphasis">{{opponentID}}</span></p>
        <p>Or by sharing this <a class="u-link-external" :href="`/game/${opponentID}`">game link</a></p>
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
  name: 'invite-friend',
  components: {
    xqInfoContainer,
    xqInfoGroup
  },
  computed: {
    ...mapGetters(['playerColor', 'redID', 'blackID']),
    opponentID() {
      return this.playerColor == 1 ? this.blackID : this.redID;
    }
  }
}
</script>

<style lang="scss">
</style>
