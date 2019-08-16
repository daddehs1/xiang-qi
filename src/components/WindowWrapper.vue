<template>
<div class="window-wrapper" :class="classObject" :style="styleObject">
  <xq-message-box-container />
  <slot></slot>
</div>
</template>
<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

import {
  EventBus
} from '@/event-bus.js';

import xqMessageBoxContainer from '@/components/MessageBox/MessageBoxContainer'

export default {
  name: 'window-wrapper',
  components: {
    xqMessageBoxContainer
  },
  methods: {
    ...mapActions(['setWindowHeight', 'setWindowWidth']),
    handleWindowResize() {
      // publish information for any subscribers
      EventBus.$emit('window-resized');
      this.setWindowHeight(window.innerHeight);
      this.setWindowWidth(window.innerWidth);
      let vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      document.documentElement.style.setProperty('--windowHeight', window.innerHeight + "px");
    }
  },
  computed: {
    ...mapGetters(['windowHeight', 'windowWidth']),
    classObject() {
      var classes = {};
      classes['mq-' + this.$mq] = true;
      return classes;
    },
    styleObject() {
      var vh = this.windowHeight * .01;
      var vw = this.windowWidth * .01;
      return {
        height: this.windowHeight + "px",
        '--vh': `${vh}px`,
        '--vw': `${vw}px`
      }
    }
  },
  mounted() {
    this.$nextTick(this.handleWindowResize);
  },
  created() {
    window.addEventListener('resize', this.handleWindowResize)
  },
  destroyed() {
    window.removeEventListener('resize', this.handleWindowResize)
  }

}
</script>
