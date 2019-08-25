<template>
<!-- The game's menu bar -->
<div>
  <!-- Iterate over menu bar items to add to DOM -->
  <ul class="menu-bar" :style="styleObject">
    <template v-for="menuItem in activeMenuItems">
    <li class="menu-bar__item">
      <router-link v-if="menuItem.type == 'link'" :to="{ name: menuItem.target}">
          <span class="menu-bar__text">
            {{menuItem.label}}
          </span>
      </router-link>

      <span v-else-if="menuItem.type == 'action'" @click="menuItem.target" class="menu-bar__text">
      {{menuItem.label}}
      </span>

      <span v-else-if="menuItem.type == 'message-box'" class="menu-bar__text">
      <xq-message-box-link :mbTarget="menuItem.target">{{menuItem.label}}</xq-message-box-link>
      </span>

    </li>
  </template>
  </ul>
  <xq-foot-bar/>
</div>
</template>

<script>
import {
  mapActions,
  mapGetters
} from 'vuex'

import xqFootBar from '@/components/FootBar'
import xqMessageBoxLink from '@/components/MessageBox/MessageBoxLink'

export default {
  name: 'menu-bar',
  components: {
    xqFootBar,
    xqMessageBoxLink
  },
  data() {
    return {
      menuItems: {
        game: [],
        tutorial: []
      }
    }
  },
  created() {
    // Menu items
    var home = {
        type: "link",
        target: "home",
        label: "Home"
      },
      newGame = {
        type: "action",
        target: this.newGame,
        label: "New Game"
      },
      loadGame = {
        type: "message-box",
        target: "load-game",
        label: "Load Game"
      },
      saveGame = {
        type: "message-box",
        target: "save-game",
        label: "Save Game"
      },
      inviteFriend = {
        type: "message-box",
        target: "invite-friend",
        label: "Invite a Friend"
      },
      tutorial = {
        type: "link",
        target: "tutorial",
        label: "Tutorial"
      };

    this.menuItems.home = [newGame, loadGame, tutorial];
    this.menuItems.game = [newGame, loadGame, saveGame, inviteFriend, tutorial];
    this.menuItems.tutorial = [newGame, loadGame];
  },
  methods: {
    ...mapActions(['newGame'])
  },
  computed: {
    ...mapGetters(['windowHeight', 'menuType']),
    activeMenuItems() {
      return this.menuItems[this.menuType];
    },
    styleObject() {
      return {
        height: this.windowHeight + "px"
      }
    }
  }
}
</script>

<style lang="scss">
.menu-bar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;

    $root: &;
    &__item {
        color: $colorWhite;
        font-size: calc(1.6 * #{$ru});
        margin: calc(1.2 * #{$ru}) 0;
        display: flex;
        justify-content: center;
    }

    &__text {
        position: relative;

        &:after {
            //width: 100%;
            background-color: $colorWhite;
            transition: width 0.3s ease-out;
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            display: block;
            left: 0;
            transition: width 0.2s ease-in;
            -webkit-transition: width 0.3s ease-out;
        }

        &:hover:after {
            width: 100%;
        }

        @media(hover: none) {
            &:after {
                width: 100%;
            }
        }
    }
}
</style>
