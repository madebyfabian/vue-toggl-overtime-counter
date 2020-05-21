<template>
  <h1>{{ renderedHeadlineString }}</h1>
</template>

<script>
  export default {
    name: 'BigHeadline',

    props: [ 'weekListData' ],

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
  }
</script>