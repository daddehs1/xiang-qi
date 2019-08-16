<template>
<div class="info-group" :class="classObject">
  <!-- slot for the label which will title the info group -->
  <span class="info-group__label" v-if="hasLabel">
    <slot name="label" />
  </span>

  <!-- slot for the content that will go inside of the message group under the label-->
  <div class="info-group__content">
    <slot name="content" />
  </div>
</div>
</template>

<script>
export default {
  name: 'info-group',
  props: ['isCentered'],
  computed: {
    hasLabel() {
      // returns true if label is being used (i.e. slot is filled)
      return this.$slots.hasOwnProperty("label")
    },
    classObject() {
      var classObject = {
        "info-group--centered": this.$props.isCentered == true
      };
      return classObject;
    }
  }
}
</script>

<style lang="scss">
.info-group {
    width: 100%;
    text-align: center;
    &:not(:last-of-type) {
        padding-bottom: 2rem;
    }
    margin: 1rem;
    &:not(:last-of-type) {
        border-bottom: 1px dashed $colorDark1;
    }

    &__label {
        display: inline-block;
        font-size: 1.6rem;
        margin-bottom: 0.75rem;
        color: $colorDark1;
    }

    p {
        text-align: left;
    }

    &--centered {
        p {
            text-align: center;
        }
    }

    p,
    p * {
        user-select: text !important;
    }

    p:not(:first-of-type) {
        margin-top: 1rem;
    }
}
</style>
