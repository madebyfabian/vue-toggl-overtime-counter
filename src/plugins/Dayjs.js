import Vue from 'vue'
import dayjs from 'dayjs'

// Set locale
import 'dayjs/locale/de'
dayjs.locale('de')

// Add "duration" feature
// import duration from 'dayjs/plugin/duration'
// dayjs.extend(duration)

// Add "relativeTime" feature
// import relativeTime from 'dayjs/plugin/relativeTime'
// dayjs.extend(relativeTime)

Object.defineProperties(Vue.prototype, {
  $date: {
    get() {
      return dayjs
    }
  }
})


export default dayjs