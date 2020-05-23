<template>
  <div class="alert-box" :type="type">
    <span class="alert-box__icon">{{ icon }}</span>
    <span class="alert-box__content"><slot /></span>
  </div>
</template>

<script>
  export default {
    name: 'AlertBox',

    props: [ 'icon', 'type' ]
  }
</script>

<style lang="scss" scoped>
  .alert-box {
    padding: 16px 24px;
    border-radius: 8px;
    display: flex;
    max-width: 328px;
    margin: 0 auto;
    width: 100%;
    margin-bottom: 32px;

    &[type=error] {
      color: #D4C4C4;
      background: #594141;
    }

    &[type=success] {
      color: #C3D5D4;
      background: #354C4B;
    }

    &__icon {
      width: 24px;
      height: 24px;
      font-size: 24px;
      line-height: 24px;
      align-self: center;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
    }

    &__content {
      flex: 1;
      font-size: 16px;
      line-height: 24px;
      text-align: left;
    }
  }
</style>