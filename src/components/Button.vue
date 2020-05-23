<template>
  <button 
    class="button" 
    :type="type || 'button'" 
    :class="`button--${buttonType || 'primary'}`"
    :isLoading="isLoading">

    <slot/>
  </button>
</template>

<script>
  export default {
    name: 'Button',
    props: [ 'type', 'buttonType', 'isLoading' ]
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
    font-weight: bold;
    position: relative;
    cursor: pointer;
    transition: opacity 150ms ease, transform 150ms ease, box-shadow 150ms ease;

    &--secondary {
      color: #C0C5C8; 
      border: 2px solid #454B4E;
      background: transparent;
    }

    &[isLoading=true] {
      color: transparent;

      &::after {
        color: #2F3437;
        content: '↻';
        top: 0;
        height: 56px;
        width: 56px;
        left: calc(50% - (56px / 2));
        line-height: 56px;
        position: absolute;
        text-align: center;
        animation: buttonRotate 450ms linear infinite;
        font-size: 24px;
      }
      
      @keyframes buttonRotate {
        from { transform: rotate(45deg) }
        to { transform: rotate(calc(360deg + 45deg)) }
      }
    }

    &:hover {
      opacity: .75;
    }

    &:active {
      transform: translateY(2px);
    }
  }
</style>