<template>
  <div class="divider">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
  .divider {
    height: 40px;
    width: 100%;
    display: flex;
    align-items: center;
    margin: 40px 0;
    color: rgba(#fff, .5);
    
    &::before, &::after {
      content: '';
      width: 100%;
      display: inline-block;
      height: 2px;
      background: #454B4E;
      border-radius: 2px;
    }

    &::before {
      margin-right: 12px;
    }

    &::after {
      margin-left: 12px;
    }
  }
</style>