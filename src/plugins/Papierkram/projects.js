import makeRequest from '@/plugins/Papierkram/helpers/makeRequest'
import PapierkramHelpers from '@/plugins/Papierkram/helpers/PapierkramHelpers'


/**
 * Get a list of all active projects
 * @param {{ autoComplete: String }} options
 * @returns {Array<{ id: Number, colorId: Number, description: String, name: String, customer: { id: Number, name: String } }>}
 */
export const getProjects = async ( options = {} ) => {
  const makeRequestOptions = { requiresAuth: true }
  if (options?.autoComplete)
    makeRequestOptions.query = { auto_complete: options?.autoComplete }

  const projects = await makeRequest('/projects', makeRequestOptions)

  return projects.map(project => PapierkramHelpers.formatProjectEntry(project))
} 


/**
 * Get a single project by the ID.
 * @param {Number} id
 */
export const getProject = async ( id ) => {
  if (!id || typeof id !== 'number')
    throw new Error('Please provide the id. It should be a number.')

  const project = await makeRequest(`/projects/${id}`, { requiresAuth: true })
  return PapierkramHelpers.formatProjectEntry(project)
}