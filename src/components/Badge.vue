<template>
  <div class="badge" :data-badge-type="renderedData.type">
    {{ renderedData.value }}
  </div>
</template>

<script>
  export default {
    name: 'Badge',
    props: [ 'value' ],

    computed: {
      renderedData() {
        const value = this.value
        if (typeof value !== 'number')
          return { type: 'empty', value: '–' }

        switch (Math.sign(value)) {
          case 1: // Positive
            return { type: 'overhours', value: `+${value.toLocaleString()}` }
        
          case -1: // Negative
            return { type: 'minushours', value: value.toLocaleString() }

          case 0:
            return { type: 'neutral', value: `0` }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .badge {
    height: 40px;
    width: 40px;
    border-radius: 40px;
    line-height: 40px;
    font-weight: 500;
    font-size: 16px;
    line-height: 40px;
    font-feature-settings: 'ss04' on, 'cv03' on, 'cv01' on, 'cv02' on, 'cv04' on, 'cv09' on, 'liga' off;
    font-variant-numeric: diagonal-fractions;

    &[data-badge-type="empty"] {
      color: rgba(#fff, .25);
    }

    &[data-badge-type="overhours"] {
      color: #D4C4C4;
      background: #594141;
    }

    &[data-badge-type="minushours"] {
      color: #C9CDCF;
      background: #454B4E;
    }

    &[data-badge-type="neutral"] {
      color: #C3D5D4;
      background: #354C4B;
    }
  }
</style>