<template>
  <div class="default-view">
    <RefreshButton 
      class="refresh-button" 
      @click.native="fetchApiResponse" 
      :isLoading="isLoading"
    />
    <h2>Hej, {{ user.user_metadata.full_name }}! Du hast diese Woche</h2>
    <BigHeadline :weekListData="weekListData" />
    <WeekList class="week-list" :weekListData="weekListData" />
    <!-- <div class="bottom-banner">
      Du hast insgesamt <strong>13 Überstunden</strong> im Jahr 2020! 🤓
      <router-link class="bottom-banner__link" to="/details">Ansehen →</router-link>
    </div> -->
    <br>
    <router-link :to="{ name: 'AuthSignin', query: { signout: true } }">Logout</router-link>
  </div>
</template>

<style lang="scss" scoped>
  .default-view {
    text-align: center;
    min-height: 480px;
    position: relative;

    &:hover .refresh-button {
      opacity: 1;
    }

    .refresh-button {
      position: fixed;
      top: 24px;
      left: 24px;
      opacity: 0;
    }

    .week-list {
      margin-bottom: 56px;
    }

    .bottom-banner {
      font-size: 18px;
      line-height: 24px;
      color: rgba(#fff, 0.5);
      padding: 24px 16px;
      border-radius: 16px;
      background: #2F3437;

      &__link {
        padding-left: 12px;
      }
    }
  }
</style>

<script>
  import auth from '@/plugins/GotrueAuth'
  import TogglAPI from '@/plugins/Toggl.API'

  import RefreshButton from '@/components/RefreshButton'
  import WeekList from '@/components/WeekList'
  import BigHeadline from '@/components/BigHeadline'


  export default {
    components: {
      RefreshButton,
      WeekList,
      BigHeadline
    },

    data: () => ({
      isLoading: true,
      weekListData: null,
      user: auth.currentUser()
    }),

    async created() {
      await this.fetchApiResponse()
    },

    methods: {
      roundHalf(num) {
        return Math.round(num * 2) / 2
      },

      async fetchApiResponse() {
        try {
          this.isLoading = true

          const resultApi = await TogglAPI.getWeeklyReport(this.$date().startOf('week').format('YYYY-MM-DD'))
          const result = resultApi?.week_totals
          if (!result)
            throw new Error('Something is wrong with the API response')

          const userSetting_businessDays = this.user?.user_metadata?.businessDays
          if (!userSetting_businessDays || userSetting_businessDays.length !== 7)
            throw new Error('User didn\'t setuped the business days!')

          // Now, let's look what weekday it's currently.
          const currentWeekdayID = this.$date().day()

          let returnedData = {
            weekStatus: 0,
            details: []
          }

          // Loop through a regular business-week
          for (let i = 1; i < 8; i++) {
            const hoursToWork = userSetting_businessDays[i - 1]
            if (!hoursToWork)
              continue

            // If this day is a business day for the user 
            let weekday = { 
              dayId: i,
              status: null,
              label: this.$date().day(i).format('dd'),
              isToday: i === currentWeekdayID
            }

            if (weekday.dayId <= currentWeekdayID) {
              const realWorkedHours = this.roundHalf(result[i - 1] / 1000 / 60 / 60)
              weekday.status = (hoursToWork - realWorkedHours) * -1
              returnedData.weekStatus += weekday.status
            }
            
            returnedData.details.push(weekday)
          }

          this.weekListData = {
            ...returnedData,
            weekStatus: this.roundHalf(returnedData.weekStatus),
          }

          console.log(this.weekListData)

          this.isLoading = false
        } catch (error) {
          console.error(error.message)
        }
      }
    }
  }
</script>
