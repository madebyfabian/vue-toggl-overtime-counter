<template>
  <div class="default-view">
    <RefreshButton 
      class="refresh-button" 
      @click.native="fetchApiResponse" 
      :isLoading="isLoading"
    />
    <h2>Hej, Fabian! Du hast diese Woche</h2>
    <BigHeadline :weekListData="weekListData" />
    <WeekList class="week-list" :weekListData="weekListData" />
    <!-- <div class="bottom-banner">
      Du hast insgesamt <strong>13 Überstunden</strong> im Jahr 2020! 🤓
      <router-link class="bottom-banner__link" to="/details">Ansehen →</router-link>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
  .default-view {
    padding: 80px 24px 24px;
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
        color: #2EAADC;
        padding-left: 12px;
        text-decoration: none;
        transition: opacity 150ms ease;

        &:hover {
          opacity: .75;
        }
      }
    }
  }
</style>

<script>
  import dayjs from 'dayjs'
  import 'dayjs/locale/de'
  import relativeTime from 'dayjs/plugin/relativeTime';
  dayjs.extend(relativeTime);
  dayjs.locale('de')

  import USER_SETTINGS from '../../.env.json'

  import RefreshButton from '../components/RefreshButton'
  import WeekList from '../components/WeekList'
  import BigHeadline from '../components/BigHeadline'

  // @ is an alias to /src
  export default {
    name: 'Home',

    components: {
      RefreshButton,
      WeekList,
      BigHeadline
    },

    data: () => ({
      isLoading: true,
      weekListData: null
    }),

    methods: {
      buildAPIUrl(pathname, data) {
        const url = new URL('https://toggl.com/reports/api/v2')
        url.pathname += '/' + pathname
        Object.keys(data).forEach((key, i) => {
          url.searchParams.append(key, Object.values(data)[i])
        })
        return url.href 
      },

      roundHalf(num) {
        return Math.round(num * 2) / 2
      },

      async fetchApiResponse() {
        try {
          this.isLoading = true

          // Call TOGGL API to get the entries for this week.
          const url = this.buildAPIUrl('weekly', {
            'user_agent': 'hello@madebyfabian.com',
            'workspace_id': 2123160,
            'since': '2020-05-18',
            'project_ids': 155439157
          })

          const resultApi = await fetch(url, {
            method: 'GET',
            headers: new Headers({
              'Authorization': `Basic ${btoa(`${USER_SETTINGS.API_KEY}:api_token`)}`
            })
          })

          if (!resultApi)
            throw new Error('Error with the API request')

          const resultJSON = await resultApi.json()
          if (!resultJSON)
            throw new Error('Error parsing JSON from API')

          const result = resultJSON?.week_totals
          if (!result)
            throw new Error('Something is wrong with the API response')


          
          const settings = {
            businessDays: [
              { dayId: 1, hoursToWork: 8 },
              { dayId: 2, hoursToWork: 8 },
              { dayId: 3, hoursToWork: 8 },
              { dayId: 4, hoursToWork: 8 },
              { dayId: 5, hoursToWork: 8 },
              { dayId: 6, hoursToWork: null },
              { dayId: 7, hoursToWork: null },
            ]
          }


          // Now, let's look what weekday it's currently.
          const currentWeekdayID = dayjs().day()
          
          
          const weekdaysToLoopThrough = settings.businessDays.filter(entry => !!entry.hoursToWork)
          let weekStatus = 0

          // Loop through a regular business-week
          weekdaysToLoopThrough.forEach((weekday, i) => {
            weekday.status = null
            weekday.label = dayjs().day(weekday.dayId).format('dd')
            weekday.isToday = weekday.dayId === currentWeekdayID

            const realWorkedHours = this.roundHalf(result[i] / 1000 / 60 / 60)

            if (weekday.dayId >= currentWeekdayID)
              return

            weekday.status = (weekday.hoursToWork - realWorkedHours) * -1
            weekStatus += weekday.status
          })

          this.weekListData = {
            weekStatus: this.roundHalf(weekStatus),
            details: weekdaysToLoopThrough
          }

          this.isLoading = false
        } catch (error) {
          console.log(error.message)
        }
      }
    },

    async created() {
      await this.fetchApiResponse()
    }
  }
</script>
