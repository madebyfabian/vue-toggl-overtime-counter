<template>
  <InputCard 
    :isSelected="isChecked" 
    @click.native="onClick" 
    @keypress.native.prevent="keyDown"
    type="checkbox">

    <template v-slot:label><slot name="label" /></template>
    <template v-slot:sublabel><slot name="sublabel" /></template>
  </InputCard>
</template>

<script>
  import InputCard from './helpers/InputCard'

  export default {
    name: 'InputCheckboxCard',

    components: { InputCard },

    props: [ 'value', 'val' ],

    data () {
      return {
        checkedProxy: false
      }
    },

    computed: {
      isChecked() {
        return this.value.includes(this.val)
      }
    },

    created () {
      // set the checked proxy if we start with this value included.
      if (this.value.includes(this.val))
        this.checkedProxy = true
    },

    methods: {
      keyDown(e) {
        if (e.keyCode === 32) // If user hit's spacebar while focused
          this.onClick()
      },

      onClick () {
        this.checkedProxy = !this.checkedProxy
        let value = [].concat(this.value) // copy so we dont mutate directly
        if(!this.checkedProxy && value.includes(this.val))
          value.splice(value.indexOf(this.val), 1)
        else 
          value.push(this.val)
        
        this.$emit('input', value) // emit the new value.
      }
    }
  }
</script>