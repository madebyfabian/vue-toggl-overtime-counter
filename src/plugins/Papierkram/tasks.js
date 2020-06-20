import makeRequest from '@/plugins/Papierkram/helpers/makeRequest'
import PapierkramHelpers from '@/plugins/Papierkram/helpers/PapierkramHelpers'


/**
 * Gets a list of tasks.
 */
export const getTasks = async () => {
  const tasks = await makeRequest('/tracker/tasks', { requiresAuth: true })

  return PapierkramHelpers.formatTaskEntries(tasks)
}