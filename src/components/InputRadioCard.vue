<template>
  <InputCard 
    :isSelected="isChecked" 
    @click.native="onClick" 
    @keypress.native.prevent="keyDown"
    type="radio">

    <template v-slot:label><slot name="label" /></template>
    <template v-slot:sublabel><slot name="sublabel" /></template>
  </InputCard>
</template>

<script>
  import InputCard from '@/components/helpers/InputCard'

  export default {
    name: 'InputRadioCard',

    components: { InputCard },

    props: [ 'value', 'val' ],

    computed: {
      isChecked() {
        return this.value == this.val
      }
    },

    methods: {
      keyDown(e) {
        if (e.keyCode === 32) // If user hit's spacebar while focused
          this.onClick()
      },

      onClick () {
        this.$emit('input', this.val) // emit the new value.
      }
    }
  }
</script>