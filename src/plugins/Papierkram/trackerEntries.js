import makeRequest from '@/plugins/Papierkram/helpers/makeRequest'
import PapierkramHelpers from '@/plugins/Papierkram/helpers/PapierkramHelpers'
import dayjs from '@/plugins/Dayjs'


/**
 * Get a list of the last tracker entries.
 */
export const getTrackerEntries = async ( options = { groupEntriesByDate: false } ) => {
  const trackerEntries = await makeRequest('/tracker/time_entries', { requiresAuth: true })
  if (!trackerEntries)
    throw new Error()

  let entries = []
  for (let entry of trackerEntries) {
    entry = PapierkramHelpers.formatTrackerEntry(entry)

    if (!options?.groupEntriesByDate)
      entries.push(entry)
    else {
      const entryDate = dayjs(entry.startedAt).format('YYYY-MM-DD')
      const entryIndex = entries.findIndex(entry => entry.date === entryDate)
      if (entryIndex == -1) // not found
        entries.push({ date: entryDate, entries: [ entry ] })
      else
        entries[entryIndex].entries.push(entry)
    }
  }

  return entries
}


/**
 * Adds a new timer entry to the user's account.
 * @param {object}    options
 * @param {Date}      options.startedAt When the tracker has started
 * @param {Date}      options.endedAt   When the tracker has ended
 * @param {string}    options.comment   String with a comment. (optional)
 * @param {boolean}   options.billable  Boolean which indicates if this tracker entry is billable
 * @param {number}    options.projectId Number with the current project id (e.g. 5)
 * @param {task_name} options.taskName  String with the name of the current task.
 */
export const addNewTrackerEntry = async ( options ) => {
  try {
    const body = {
      'tracker_time_entry[started_at]': PapierkramHelpers.format(options.startedAt),
      'tracker_time_entry[ended_at]': PapierkramHelpers.format(options.endedAt),
      'tracker_time_entry[comments]': options?.comment || '',
      'tracker_time_entry[unbillable]': !options.billable,
      'project_id': options.projectId,
      'task_name': options.taskName,
      'timer': true,
    }

    return await makeRequest('/tracker/time_entries', { method: 'POST', requiresAuth: true, body })
  } catch (error) {
    console.error(error)
  }
}