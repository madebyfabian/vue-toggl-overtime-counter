<template>
  <div class="entry-list">
    <section 
      class="entry-group"
      v-for="(entryGroup, i) of computedEntryData"
      :key="i">

      <div class="entry-group__headline">
        <span>{{ $date(entryGroup.date, 'YYYY-MM-DD').format('DD. MMM') }}</span>
        <span class="seperator"> / </span>
        <span>{{entryGroup.completeDuration.hours}}:{{entryGroup.completeDuration.minutes.toString().padStart(2, '0')}} h</span>
      </div>

      <article 
        class="entry-group__item"
        v-for="entryItem of entryGroup.entries"
        :key="entryItem.id">

        <pre>{{ entryItem }}</pre>
      </article>

    </section>
  </div>
</template>

<script>
  import PapierkramHelpers from '@/plugins/Papierkram/helpers/PapierkramHelpers'

  export default {
    props: {
      entryData: {
        type: Array,
        required: true
      }
    },

    computed: {
      computedEntryData() {
        return this.entryData.map(entryGroup => {
          // calc completeDuration from seconds to human-readable time.
          return { ...entryGroup, completeDuration: PapierkramHelpers.secondsToHMS(entryGroup.completeDuration) }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .entry-list {
    padding: 0 12px 40px;

    .entry-group {
      &__headline {
        padding: 24px 0 8px 20px;
        font-size: 16px;
        line-height: 24px;
        color: rgba(#fff, .5);

        span:first-child {
          font-weight: 600;
        }

        .seperator {
          color: rgba(#fff, .25);
        }
      }

      &__item {
        padding: 12px 20px;
        border-radius: 12px;
      }
    }
  }
</style>