<template>
<div class="message-box-container">
  <!-- render list of message boxes from component data -->
  <template v-for="mb in messageBoxesData">
    <!-- only render message box if it is currently registered
    message box is registered iff a corresponding
    message-box-link is currently mounted with the same target -->
    <message-box @mb-exit="mb.onExit" :mb-target="mb.target" v-if="isMessageBoxRegistered(mb.target)">
        <template v-slot:title>{{mb.title}}</template>
  <template v-slot:contents>
    <!-- dynamically render component associated with this message box as the contents -->
      <component :is="mb.componentName"></component>
    </template>
  </message-box>
  </template>
</div>
</template>

<script>
import MessageBox from '@/components/MessageBox/MessageBox.vue'
import xqGameInformation from '@/components/MessageBox/Subcomponents/GameInformation.vue'
import xqSaveGame from '@/components/MessageBox/Subcomponents/SaveGame.vue'
import xqInviteFriend from '@/components/MessageBox/Subcomponents/InviteFriend.vue'
import xqLoadGame from '@/components/MessageBox/Subcomponents/LoadGame.vue'
import xqGameError from '@/components/MessageBox/Subcomponents/GameError.vue'

import {
  mapGetters
}
from 'vuex'

export default {
  name: "message-box-container",
  components: {
    MessageBox,
    xqGameInformation,
    xqSaveGame,
    xqInviteFriend,
    xqLoadGame,
    xqGameError
  },
  data() {
    return {
      // array of information about message boxes
      messageBoxesData: [{
          target: "game-information",
          title: "Game Information",
          componentName: "xqGameInformation",
          onExit() {}
        },
        {
          target: "save-game",
          title: "Save Game",
          componentName: "xqSaveGame",
          onExit() {}
        },
        {
          target: "invite-friend",
          title: "Invite a Friend",
          componentName: "xqInviteFriend",
          onExit() {}
        },
        {
          target: "load-game",
          title: "Load Game",
          componentName: "xqLoadGame",
          onExit() {}
        },
        {
          target: "game-error",
          title: "Error",
          componentName: "xqGameError",
          onExit: () => {
            this.$router.push({
              name: 'home'
            })
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['isMessageBoxRegistered']),
  }
}
</script>

<style lang="scss">
.message-box-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
