<template>
  <div>
    <label>
      Mein Workspace
      <input type="radio" name="test" value="Mein Workspace" v-model="selectedItem">
    </label><br><br>

    <label>
      Mein Workspace2
      <input type="radio" name="test" value="Mein Workspace2" v-model="selectedItem">
    </label>

    <br><br>
    <span>Checked name: {{ selectedItem }}</span>
  </div>
</template>

<script>
  export default {
    name: 'Test',

    components: { },

    data: () => ({
      selectedItem: null
    })
  }
</script>

<style lang="scss" scoped>

</style>