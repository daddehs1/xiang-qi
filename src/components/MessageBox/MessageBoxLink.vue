<template>
<!-- open message box when link is clicked -->
<div @click="open" class="message-box-link">
  <slot></slot>
</div>
</template>

<script>
import {
  mapActions
} from 'vuex';

export default {
  name: "message-box-link",
  props: ["mb-target"],
  methods: {
    ...mapActions(['registerMessageBox', 'deregisterMessageBox', 'openMessageBox']),
    // communicate with store to open this message box
    open() {
      this.openMessageBox({
        target: this.mbTarget
      });
    }
  },
  created() {
    // register message box into store
    this.registerMessageBox({
      target: this.mbTarget
    });
  },
  destroyed() {
    // deregister message box from store
    this.deregisterMessageBox({
      target: this.mbTarget
    });
  }
}
</script>

<style lang="scss">

</style>
