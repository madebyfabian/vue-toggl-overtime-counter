import dayjs from '@/plugins/Dayjs'


export default class PapierkramHelpers {

  /**
   * Format values into the formats the API needs.
   * @param {*} val The value to format.
   */
  static format( val ) {
    if (val instanceof dayjs) 
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
  }


  /**
   * Takes a number of seconds and transforms it into an object with hours, minutes and seconds.
   */
  static secondsToHMS( seconds ) {
    const hours   = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - (hours * 3600)) / 60);
    const sec     = seconds - (hours * 3600) - (minutes * 60);

    return { hours, minutes, seconds: sec }
  }


  /**
   * Groups an array of Projects by the customer
   * @param {Array<{}>} projects The array of Projects. 
   * @returns {{customerId: Array<{
      * id: Number, 
      * colorId: Number, 
      * description: String,
      * name: String,
      * customer: { id: Number, name: String }
   * }>}}
   */
  static groupProjectsByCustomer( projects ) {
    try {
      const groupedData = {}
      for (const project of projects) {
        const customerId = project?.customer?.id

        if (!groupedData?.[customerId])
          groupedData[customerId] = []

        groupedData[customerId].push(project)
      }

      return groupedData
    } catch (error) {
      console.error('Error sorting the projects by Customer. Maybe the given data is broken?')
    }
  }


  /**
   * Formattes a single API project entry and returns it.
   * @param {object} project Raw API project entry.
   */
  static formatProjectEntry( project ) {
    return {
      id: project.id,
      colorId: project.color,
      description: project.description,
      name: project.name,
      customer: {
        id: project.customer.id,
        name: project.customer.name
      }
    }
  }


  /**
   * Formattes an array of Task entries and returns it.
   * @param {array} tasks Raw API task entry. 
   */
  static formatTaskEntries( tasks ) {
    const res = []

    for (const task of tasks) {
      res.push({
        id: task.id,
      name: task.name,
      projectId: task.project_id
      })
    }

    return res
  }



  /**
   * Formattes a single API trackerEntry entry and returns it.
   * @param {array} entry Raw API trackerEntry.
   */
  static formatTrackerEntry( entry ) {
    return {
      billableDuration: entry.billable_duration,
      comments: entry.comments,
      duration: entry.duration,
      startedAt: entry.started_at,
      endedAt: entry.ended_at,
      id: entry.id,
      recordState: entry.record_state,
      taskId: entry.task_id,
      isBillable: !entry.unbillable
    }
  }
}
