<template>
<div class="message-box" :class="classObject">
  <!-- close message box if clicking outside of contents -->
  <div ref="wrapper" @click="close" class="message-box__wrapper">
    <div class="message-box__contents">
      <span class="message-box__title">
        <!-- slot for the title of the message box, displayed at the top -->
        <slot name="title"></slot>
      </span>
      <!-- "X" to close the message box, displayed at the top right -->
      <span ref="exit" @click="close" class="message-box__exit">X</span>
      <div class="message-box__message">
        <!-- slot for the content of the message box, displayed under the title -->
        <slot name="contents"></slot>
      </div>
      <!-- <div class="message-box__button">
        <xq-button>Home</xq-button>
      </div> -->
    </div>
  </div>
</div>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex';

import xqButton from '@/components/Button'

export default {
  name: 'message-box',
  // mb-target refers to the message-box target
  // is used to communicate with store
  props: ['onExit', 'mb-target'],
  components: {
    xqButton
  },
  methods: {
    // actions mapped from the store
    ...mapActions(['closeMessageBox', 'activateMessageBox', 'deactivateMessageBox']),

    /**
     * [helper function to attach a keypress listener to the window for closing on enter press]
     * @param  {[Event Object]} event The Event Object associated with the keypress
     */
    addEventListenerFunc(event) {
      // if this message box is open AND the key pressed is "enter"
      if (this.isOpen && event.keyCode === 13) {
        this.close();
      }
    },

    /**
     * [communicate with store to close this message box]
     */
    close(e) {
      if (e.target == this.$refs.wrapper || e.target == this.$refs.exit) {
        this.closeMessageBox({
          target: this.mbTarget
        });
        this.$emit('mb-exit');
      }
    }
  },
  computed: {
    // getters mapped from store
    ...mapGetters(['isMessageBoxOpen']),

    // helper to bind class to component root
    classObject() {
      return {
        // modifier class to signify message box is open
        "message-box--active": this.isOpen
      };
    },

    // communicates with store to determine whether this message box is open
    isOpen() {
      return this.isMessageBoxOpen({
        target: this.mbTarget
      })
    }
  },
  mounted() {
    // globally listen to enter key in order to exit out of message box
    // use named method to be able to match in case of multiple listeners
    window.addEventListener('keyup', this.addEventListenerFunc);
  },
  destroyed() {
    window.removeEventListener('keyup', this.addEventListenerFunc);
  }
}
</script>

<style lang="scss">
.message-box {
    &__wrapper {
        position: fixed;
        height: 0;
        width: 100%;
        top: 0;
        left: 0;

        z-index: 1000;
        background-color: rgba($colorWhite, .8);
        overflow: hidden;
        opacity: 0;
        transition: height 0s 0.3s, opacity 0.3s 0s;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    &__contents {
        position: fixed;
        min-height: 0;
        //height: 0;
        width: 50%;
        padding: 2rem;
        text-align: center;
        background-color: $colorWhite;
        overflow: hidden;
        border: 2px solid $colorRed2;
        display: none;

        .mq-mobile &,
        .mq-tablet &,
        .mq-tiny & {
            width: 90%;
        }

        transition: min-height 0s 0.3s;
    }

    &__title {
        display: block;
        color: $colorRed2;
        font-size: 2.4rem;
        font-weight: 300;
        margin-bottom: 0.5rem;
    }

    &__message {
        position: relative;
        display: flex;
        color: $colorBlack;
        font-size: 1.4rem;
        // overflow-y: scroll;
        // -webkit-overflow-scrolling: touch;
        flex: 1 1 0;
    }

    &__button {
        margin: auto 0 1rem;
    }

    &__exit {
        font-size: 1.6rem;
        color: $colorDark1;
        position: absolute;
        top: 1rem;
        right: 2rem;
        cursor: pointer;
    }

    $mb: &;
    &--active {
        #{$mb} {
            &__wrapper {
                height: var(--windowHeight);
                opacity: 1;
                transition: height 0s 0s, opacity 0.3s 0s;
            }

            &__contents {
                display: flex;
                flex-direction: column;
                min-height: calc(.5 * var(--windowHeight));
                transition: min-height 0s 0s;
            }
        }
    }
}
//TODO: Add modal-open modifier (through store?) to prevent body from scrolling
</style>
