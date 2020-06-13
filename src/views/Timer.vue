<template>
  <div>
    <button @click="add">add</button>
  </div>
</template>

<script>
  import auth from '@/plugins/GotrueAuth'
  import Papierkram from '@/plugins/Papierkram.API'

  export default {
    methods: {
      async add() {
        // const data = await Papierkram.addNewTrackerEntry({
        //   startedAt: this.$date().subtract(2, 'hours'),
        //   endedAt: this.$date(),
        //   billable: true,
        //   projectId: 5,
        //   taskName: 'Test vom API Wrapper'
        // })


        const data = await Papierkram.getTrackerEntries()

        data.forEach(item => {
          console.log(item.taskId)
        })
        
        console.log(data)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>