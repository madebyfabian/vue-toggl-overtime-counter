<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
  body {
    margin: 0;
    padding: 0;
    background: #2F3437;
    color: #fff;
  }

  html, * { 
    font-family: 'Inter', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    // user-select: none;
    box-sizing: border-box;
  }

  @supports (font-variation-settings: normal) {
    html, * {
      font-family: 'Inter var', system-ui, sans-serif;
    }
  }

  #app {
    background: #363B3E;
    border-radius: 24px;
    padding: 80px 24px 24px;
    text-align: center;
  }

  h1, h2, h3, p {
    margin: 0;
  }

  h1 {
    font-weight: bold;
    font-size: 48px;
    line-height: 64px;
    min-height: 64px;
    margin: 0 0 40px;
    font-variant-numeric: diagonal-fractions;
  }

  h2 {
    font-weight: 400;
    font-size: 20px;
    line-height: 32px;
    color: rgba(255, 255, 255, 0.75);
    margin: 0 0 16px;
  }
</style>
