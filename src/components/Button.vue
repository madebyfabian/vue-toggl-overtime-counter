<template>
  <button 
    class="button" 
    :type="type" 
    :data-button-type="buttonType">

    <LoadingSpinner v-if="isLoading" :color="spinnerColor" class="loading-spinner" />
    <slot v-else/>
  </button>
</template>

<script>
  import LoadingSpinner from '../components/LoadingSpinner'

  export default {
    name: 'Button',

    components: { LoadingSpinner },

    props: {
      type: {
        type: String,
        default: 'button',
        validator: (value) => {
          return [ 'button', 'submit', 'reset' ].includes(value)
        }
      },

      buttonType: {
        type: String,
        default: 'primary',
        validator: (value) => {
          return [ 'primary', 'secondary' ].includes(value)
        }
      },

      isLoading: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      spinnerColor () {
        return this.buttonType === 'primary' ? '#2F3437' : null
      }
    }
  }
</script>

<style lang="scss" scoped>
  .button {
    display: block;
    height: 56px;
    width: 100%;
    padding: 0 16px;
    border-radius: 8px;
    border: none;
    outline: none;
    appearance: none;
    background: #2EAADC;
    color: #2F3437;
    font-weight: 600;
    position: relative;
    cursor: pointer;
    transition: opacity 150ms ease, transform 150ms ease, box-shadow 150ms ease;

    .loading-spinner {
      display: inline-block;
      margin-left: 8px;
      color: #fff;
    }

    &[data-button-type=secondary] {
      color: #C0C5C8; 
      border: 2px solid #454B4E;
      background: transparent;
    }

    &:hover {
      opacity: .75;
    }

    &:active {
      transform: translateY(2px);
    }
  }
</style>