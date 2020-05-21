<template>
  <button 
    class="refresh-button" 
    :class="{ 'is-refreshing': isRefreshingClassActive }" 
    @animationiteration="onAnimationIteration"
  >↻</button>
</template>

<script>
  export default {
    name: 'RefreshButton',
    props: [ 'isLoading' ],

    data: () => ({
      isRefreshing: false,
      isRefreshingClassActive: false,
    }),

    watch: {
      isLoading() {
        if (this.isLoading) {
          this.isRefreshingClassActive = true
          this.isRefreshing = true
        } else
          this.isRefreshing = false
      }
    },
    
    methods: {
      onAnimationIteration() {
        if (!this.isRefreshing) {
          // I'm about to end this whole animation's career!
          this.isRefreshing = false
          this.isRefreshingClassActive = false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .refresh-button {
    height: 40px;
    width: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 24px;
    -webkit-appearance: none;
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    transition: all 150ms ease;
    cursor: pointer;
    border-radius: 40px;
    background: transparent;
    color: rgba(#fff, .25);
    transform: rotate(45deg);
    user-select: none;
    
    
    &:hover {
      color: rgba(#fff, .5);
    }

    &.is-refreshing {
      animation: buttonRotate 450ms linear infinite;
    }
  }

  @keyframes buttonRotate {
    from { transform: rotate(45deg) }
    to { transform: rotate(calc(360deg + 45deg)) }
  }
</style>