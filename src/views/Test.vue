<template>
  <div>
    <Button :isLoading="true">Lol, oder?</Button>
  </div>
</template>

<script>
  import Button from '../components/Button'

  export default {
    name: 'Test',

    components: { Button },

    data: () => ({
      selectedItem: 'omg'
    })
  }
</script>

<style lang="scss" scoped>

</style>