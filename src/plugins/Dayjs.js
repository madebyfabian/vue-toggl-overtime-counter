import Vue from 'vue'
import dayjs from 'dayjs'

// Set locale
import 'dayjs/locale/de'
dayjs.locale('de')

// Extends dayjs() constructor to support custom formats of input strings.
// e.g. dayjs('2020-05-05', 'YYYY-MM-DD')
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

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