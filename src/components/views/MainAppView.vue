<template>
  <div id="mainAppView">
    <router-view />
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<style lang="scss" scoped>
  #mainAppView {
    background: #363B3E;
    border-radius: 24px;
    padding: 80px 24px;
    text-align: center;
    overflow: hidden;
  }
</style>