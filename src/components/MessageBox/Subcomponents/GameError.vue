<template>
<xq-info-container class="game-error">
  <xq-info-group>
    <template v-slot:content>
        <p>{{gameErrorMessage}}</p>
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
  name: 'game-error',
  components: {
    xqInfoContainer,
    xqInfoGroup
  },
  computed: {
    ...mapGetters(['gameErrorMessage'])
  }
}
</script>

<style lang="scss">
.load-game {
    &__input {
        margin-top: 1.2rem;
    }

    &__button {
        margin-top: 1.2rem;
    }
}
</style>
