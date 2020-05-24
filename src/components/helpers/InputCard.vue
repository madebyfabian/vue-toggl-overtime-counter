<template>
  <div 
    :class="{ 'is-selected' : isSelected }"
    :type="`${type}`"
    class="input-card"
    tabindex="0">

    <div class="input-card__content">
      <label><slot name="label" /></label>
      <div class="sublabel"><slot name="sublabel" /></div>
    </div>

    <span class="input-card__visual-item"></span>
  </div>
</template>

<script>
  export default {
    name: 'InputCard',

    props: {
      isSelected: {
        type: Boolean,
        required: true
      },
      type: {
        type: String,
        required: true,
        validator: value => ['checkbox', 'radio'].includes(value)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .input-card {
    box-shadow: inset 0 0 0 2px transparent;
    background: #2F3437;
    padding: 24px;
    width: 100%;
    max-width: 328px;
    margin: 0 auto 16px;
    display: flex;
    text-align: left;
    transition: all 150ms ease;
    cursor: pointer;
    user-select: none;
    border-radius: 8px;

    * { cursor: pointer; }

    &:hover {
      box-shadow: inset 0 0 0 2px rgba(#2EAADC, .5);
    }

    &:active {
      box-shadow: inset 0 0 0 2px rgba(#2EAADC, .75);
    }

    &.is-selected {
      box-shadow: inset 0 0 0 2px #2EAADC;

      .input-card__visual-item {
        box-shadow: inset 0 0 0 2px #2EAADC;
        background: #2EAADC;

        &::after { opacity: 1 }
      }

      &[type=radio] .input-card__visual-item {
        box-shadow: inset 0 0 0 10px #2EAADC;
        background: #fff;
      }
    }

    &__visual-item {
      height: 32px;
      width: 32px;
      border-radius: 8px;
      box-shadow: inset 0 0 0 2px #454B4E;
      margin: 0 0 0 16px;
      display: block;
      flex-shrink: 0;
      transition: all 150ms ease;
      position: relative;
      background: transparent;
      align-self: center;

      &::after {
        content: '✓';
        height: 100%;
        width: 100%;
        text-align: center;
        line-height: 32px;
        font-size: 24px;
        color: #fff;
        font-weight: 400;
        display: block;
        opacity: 0;
        transition: all 150ms ease;
      }
    }

    &[type=radio] .input-card__visual-item {
      border-radius: 32px;

      &::after {
        display: none;
      }
    }

    &__content {
      flex: 1;
      margin-top: -2px;

      label {
        font-weight: bold;
        font-size: 18px;
        line-height: 24px;
        color: #fff;
        margin: 0 0 4px 0;
        display: block;
      }

      .sublabel {
        display: block;
        color: rgba(255, 255, 255, 0.75);
        height: 16px;

        * {
          font-size: 14px;
          line-height: 16px;
          display: inline-block;
        }
      }
    }
  }
</style>