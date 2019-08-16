<template>
<div class="head-bar" :class="classObject">
  <div class="head-bar__logo">
    <xq-logo :colorInverted="!this.menuIsOpen" />
  </div>

  <div class="head-bar__title">
    xiangqi
  </div>

  <mq-layout mq="tablet+" class="head-bar__status-bar">
    <slot></slot>
  </mq-layout>

  <div v-if="!this.isHomePage" class="head-bar__menu">
    <div @click="toggleMenu" class="menu-icon">
      <div class="menu-icon__line"></div>
    </div>
  </div>

  <div class="head-bar__menu-screen">
    <xq-menu-bar/>
  </div>
</div>
</template>

<script>
import xqLogo from '@/components/Logo';
import xqGameStatus from '@/components/GameStatus';
import xqMenuBar from '@/components/MenuBar';
export default {
  name: 'head-bar',
  components: {
    xqLogo,
    xqGameStatus,
    xqMenuBar
  },
  data() {
    return {
      menuIsOpen: false
    }
  },
  methods: {
    toggleMenu() {
      this.menuIsOpen = !this.menuIsOpen;
    }
  },
  watch: {
    $route() {
      this.menuIsOpen = false;
    }
  },
  computed: {
    isHomePage() {
      return this.$route.name == 'home';
    },
    classObject() {
      return {
        'head-bar--open': this.menuIsOpen
      }
    }
  },
  created() {
    if (this.isHomePage) {
      this.menuIsOpen = true;
    }
  }
}
</script>

<style lang="scss">
.head-bar {
    height: 100%;
    width: 100%;
    // padding: 1rem 2rem;
    padding: calc(.5 * #{$ru}) calc(1 * #{$ru});
    display: flex;
    align-items: center;
    position: relative;
    z-index: 2;

    &__logo {
        transition: scale 0.2s;
    }

    &__title {
        margin-left: 1rem;
        //font-size: 3rem;
        font-size: calc(1.6 * #{$ru});
        font-weight: 300;
        color: $colorRed1;
        transition: color 0.5s ease-in-out;
    }

    &__status-bar {
        margin: auto;
        width: 100%;
        z-index: -1;
    }

    &__menu {
        z-index: 1;
        margin-left: auto;
    }

    &__menu-screen {
        background-image: linear-gradient($colorRed2Pale, $colorRed1Pale);
        height: 0;
        overflow: hidden;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        opacity: 0;
        transition: opacity 0.5s ease-in-out, height 0s 0.5s;
    }

    $root: &;
    &--open {

        #{$root} {
            &__title {
                color: $colorWhite;
            }

            &__menu-screen {
                opacity: 100;
                height: 100vh;
                transition: opacity 0.5s ease-in-out, height 0s 0s;
            }
        }

        .menu-icon {
            &:after,
            &:before,
            &__line {
                background-color: $colorWhite;
            }
        }
    }

    .mq-tiny & {
        padding: 0.5rem 1rem;
    }
}

.menu-icon {
    cursor: pointer;
    margin: 1rem;
    width: 3rem;

    &:after,
    &:before,
    &__line {
        background-color: $colorRed2;
        border-radius: 1rem;
        content: '';
        display: block;
        height: 0.2rem;
        //margin: 7px 0;
        margin: calc(.1 * #{$ru} + 4px) 0;
        transition: all 0.2s ease-in-out;
        margin-left: auto;
        transition: background-color 0.5s ease-in-out;
    }

    &:before {
        width: 95%;
    }

    &__line {
        width: 80%;
    }
}
</style>
