<template>
  <div class="loading-spinner" :style="style">
    <span>↻</span>
  </div>
</template>

<script>
const sizes = { 100: '24px', 200: '40px' }
export default {
  name: 'LoadingSpinner',

  props: [ 'color', 'size' ],

  data: () => ({
    sizes: { 100: '24px', 200: '40px' }
  }),

  props: {
    color: {
      type: String,
    },
    size: {
      type: Number,
      default: 100,
      validator: value => sizes[value]
    }
  },

  computed: {
    style() {
      const size = this.sizes[this.size]
      return {
        '--color': this.color,
        '--size': size,
        '--fontSize': size,
        '--lineHeight': size
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .loading-spinner {
    user-select: none;
    display: inline-block;
    
    span {
      display: block;
      color: var(--color, rgba(255, 255, 255, .5));
      width: var(--size, 24px);
      height: var(--size, 24px);
      font-size: var(--size, 24px);
      line-height: var(--size, 24px);
      font-weight: 400;
      animation: buttonRotate 500ms linear infinite;
      text-align: center;
    }
  }
  
  @keyframes buttonRotate {
    from { transform: rotate(45deg) }
    to { transform: rotate(calc(360deg + 45deg)) }
  }
</style>