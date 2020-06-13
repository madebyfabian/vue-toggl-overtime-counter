import auth from '@/plugins/GotrueAuth'
import dayjs from '@/plugins/Dayjs'


/**
 * Wrapper for Papierkram's inofficial API
 * @see https://github.com/SimonIT/timetracker/blob/master/lib/api.dart
 */
export default class Papierkram {

  /**
   * Authenticates the user and updates identity with authToken, realtimeToken and subdomain.
   * Use this method only at account signup.
   * @param {string} email The user's email
   * @param {string} password The user's password
   */
  static async authenticate( email, password ) {
    try {
      const authData = await makeRequest('/auth', {
        method: 'POST',
        body: { email, password }
      })

      await auth.currentUser().update({ 
        data: { papierkramApiCredentials: { 
            authToken: authData.token, 
            realtimeToken: authData.realtime_token, 
            subdomain: authData.tenant_subdomain
        } }
      })

      return authData
    } catch (error) {
      console.error(error)
    }
  }


  
  /**
   * Get a list of the last tracker entries.
   * @returns {Array<{
      * billableDuration: Number, 
      * comments: String, 
      * duration: Number,
      * startedAt: Date,
      * endedAt: Date,
      * id: Number,
      * recordState: Boolean,
      * taskId: Number,
      * isBillable: Boolean
   * }>}
   */
  static async getTrackerEntries() {
    try {
      const res = await makeRequest('/tracker/time_entries', { requiresAuth: true })

      return res.map(entry => {
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
      })
    } catch (error) {
      console.error('Something is wrong with the API Response', error)
    }
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
  static async addNewTrackerEntry( options ) {
    try {
      const body = {
        'tracker_time_entry[started_at]': APIHelpers.format(options.startedAt),
        'tracker_time_entry[ended_at]': APIHelpers.format(options.endedAt),
        'tracker_time_entry[comments]': options?.comment || '',
        'tracker_time_entry[unbillable]': !options.billable,
        'project_id': options.projectId,
        'task_name': options.taskName,
        'timer': true,
      }

      console.log(body)

      return await makeRequest('/tracker/time_entries', { method: 'POST', requiresAuth: true, body })
    } catch (error) {
      console.error(error)
    }
  }

}


class APIHelpers {

  /**
   * Format values into the formats the API needs.
   * @param {*} val The value to format.
   */
  static format( val ) {
    if (val instanceof dayjs) 
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
  }

  /**
   * The papierkramApiCredentials saved in the current user's meta-data.
   */
  static get credentials() {
    const { user_metadata: data } = auth.currentUser()

    const authToken = data?.papierkramApiCredentials?.authToken,
          realtimeToken = data?.papierkramApiCredentials?.realtimeToken,
          subdomain = data?.papierkramApiCredentials?.subdomain

    if (!!(authToken && realtimeToken && subdomain))
      return { authToken, realtimeToken, subdomain }
  }

}



/**
 * Performs an API Request to the Papierkram API.
 * @param {string}  path e.g. "/auth" or "/projects"
 * @param {object}  options
 * @param {boolean} options.requiresAuth  If the requested resource does need authentication. Default: false
 * @param {string}  options.method        The HTTP Method. Default: 'GET'
 * @param {object}  options.body          The body data object. (optional)
 */
const makeRequest = async ( path, options ) => {
  try {
    const proxyURL      = 'https://cors-everywhere.madebyfabian.workers.dev?',
          baseURL       = proxyURL + 'https://madebyfabian.papierkram.de/api/v1'

    const requiresAuth  = options?.requiresAuth || false,
          method        = options?.method || 'GET',
          body          = options?.body

    let url = baseURL + path
    if (requiresAuth) {
      if (!APIHelpers.credentials?.authToken)
        throw new Error('papierkramApiCredentials not found in the user_metadata!')
    
      url += `?auth_token=${APIHelpers.credentials?.authToken}`
    }

    const fetchOptions = { 
      method, 
      headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded'})
    }

    if (body)
      fetchOptions.body = new URLSearchParams(body)
  
    const res = await fetch( url, fetchOptions )
    if (!res.ok) {
      console.error('Error with the Request: ', await res.text())
      throw new Error('Error with the Request.')
    }

    return await res.json()
  } catch (error) {
    console.error(error)
  }
}