<template>
  <section class="week-list" v-if="weekListData">
    <article 
      v-for="(weekday, i) of weekListData.details"
      :key="i"
      class="item">

      <div class="item__day-name">{{ weekday.label }}</div>
      <Badge class="item__badge" :value="weekday.status" />
      <div class="item__current-day-indicator" :class="{ 'is-active' : weekday.isToday }"></div>
    </article>
  </section>
</template>

<script>
  import Badge from '../components/Badge'

  export default {
    name: 'WeekList',

    props: [ 'weekListData' ],

    components: {
      Badge
    }
  }
</script>

<style lang="scss" scoped>
  .week-list {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    user-select: none;

    .item {
      margin: 0 20px;

      &__day-name {
        font-weight: 500;
        font-size: 14px;
        line-height: 24px;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.75);
        margin-bottom: 8px;
      }
      
      &__current-day-indicator.is-active {
        height: 8px;
        width: 8px;
        margin: 16px auto 0;
        background: rgba(#fff, .25);
        border-radius: 8px;
      }
    }
  }
</style>