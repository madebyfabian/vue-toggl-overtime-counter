<template>
  <div class="default-view">
    <RefreshButton 
      class="refresh-button-instance" 
      @click.native="isLoading = !isLoading" 
      :isLoading="isLoading"
    />
    <h2>Hej, Fabian! Du hast diese Woche</h2>
    <h1>{{ renderedHeadlineString }}</h1>

    <WeekList class="week-list" :weekListData="weekListData" />
  </div>
</template>

<style lang="scss" scoped>
  .default-view {
    padding: 80px 24px 24px;
    text-align: center;

    &:hover .refresh-button-instance {
      opacity: 1;
    }
  }

  .refresh-button-instance {
    position: fixed;
    top: 24px;
    left: 24px;
    opacity: 0;
  }

  .week-list {
    margin-bottom: 56px;
  }
</style>

<script>
  import dayjs from 'dayjs'
  import 'dayjs/locale/de'
  import relativeTime from 'dayjs/plugin/relativeTime';
  dayjs.extend(relativeTime);
  dayjs.locale('de')

  import RefreshButton from '../components/RefreshButton'
  import WeekList from '../components/WeekList'

  // @ is an alias to /src
  export default {
    name: 'Home',

    components: {
      RefreshButton,
      WeekList
    },

    data: () => ({
      isLoading: false,
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
      }
    },


    computed: {
      renderedHeadlineString() {
        let num = this.weekListData?.weekStatus
        if (num === 0)
          return `Keine Überstunden 🎉`

        if (!num)
          return '...'

        let emoji = (num > 0) ? '🤓' : '🙈',
            str = ''

        if (num > 0) {
          // Positive value
          if (num <= 1)
            str = 'Überstunde'
          else
            str = 'Überstunden'
        } else {
          // Negative value
          if (num >= -1)
            str = 'Minusstunde'
          else
            str = 'Minusstunden'
        }

        num = Math.abs(num)

        const renderedNum = num % 1 === .5 ? (num < 1 ? '1/2' : `${num-.5} 1/2`) : num.toLocaleString()

        return `${renderedNum} ${str} ${emoji}`
      }
    },


    async created() {
      try {
        // ONLY FOR DEVELOPMENT
        // const result = [26543000,28023000,25228000,null,null,null,null,79794000]
        
        // --------
        // Call TOGGL api to get the entries for this week.
        const url = this.buildAPIUrl('weekly', {
          'user_agent': 'hello@madebyfabian.com',
          'workspace_id': 2123160,
          'since': '2020-05-18',
          'project_ids': 155439157
        })

        const API_KEY = 'OWI5NjhhYmU3MmQyOTViZjdjMmRjODgyZjA2MjEzOGU6YXBpX3Rva2Vu'
        const resultApi = await fetch(url, {
          method: 'GET',
          headers: new Headers({
            'Authorization': `Basic ${API_KEY}`
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
        // --------


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

        console.log(this.weekListData.weekStatus)

      } catch (error) {
        console.log(error.message)
      }
    }
  }
</script>
