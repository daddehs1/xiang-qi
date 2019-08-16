<template>
<div class="home">
  <div class="home__heading">
    <xq-head-bar/>
  </div>
</div>
</template>


<script>
import xqHeadBar from '@/components/HeadBar';

import {
  mapGetters
} from 'vuex';

import {
  mapActions
} from 'vuex';

export default {
  components: {
    xqHeadBar
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['windowHeight']),
  },
  methods: {
    //TO DO
    //navigate to page should not be in store.js
    ...mapActions(['startNewGame', 'navigateToPage', 'setMenuType']),
    initiateTutorial() {
      this.$router.push({
        name: 'tutorial'
      });
    },
  },
  mounted() {
    this.setMenuType('home');
  }
};
</script>

<style lang="scss">
.home {
    height: 100%;
    // display: flex;
    // flex-direction: column;

    &__heading {
        // height: 100%;
    }

}
</style>
