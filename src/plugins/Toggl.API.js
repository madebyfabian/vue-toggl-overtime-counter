import auth from '@/plugins/GotrueAuth'

const config = { 
  baseUrl: 'https://cors-anywhere-madebyfabian.herokuapp.com/https://api.track.toggl.com/api/v8',
  baseUrlReportsAPI: 'https://cors-anywhere-madebyfabian.herokuapp.com/https://api.track.toggl.com/reports/api/v2'
}


/**
 * Toggl API Wrapper.
 */
export default class TogglAPI {

  /**
   * Get current user data.
   * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/users.md#get-current-user-data
   */
  static async authenticate( username, password ) {
    try {
      const res = await this.#get('/me', { Authorization: { username, password } })
      return {
        authToken: res.data.api_token,
        name: res.data.fullname
      }
    } catch (error) {
      console.error(error)
    }
  }


  /**
   * Returns a summary of tracked entries within the last 7 days
   * @param {string} since ISO 8601 date (YYYY-MM-DD) format. Defaults to today - 6 days.
   */
  static async getWeeklyReport( since = null ) {
    let params = {}
    if (since)
      params.since = since

    return await this.#get('/weekly', { 
      isReportsAPI: true, 
      params
    })
  }


  /**
   * Get data about all the workspaces where the token owner belongs to.
   * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspaces
   */
  static async getWorkspaces() {
    return await this.#get('/workspaces')
  }


  /**
   * Get workspace projects.
   * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-projects
   * @param {number} workspaceId The ID of the workspace.
   */
  static async getWorkspaceProjects( workspaceId = null ) {
    if (!workspaceId)
      workspaceId = auth.currentUser().user_metadata?.trackedWorkspace

    return await this.#get(`/workspaces/${workspaceId}/projects`)
  }


  /**
   * Get workspace clients.
   * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-clients
   * @param {number} workspaceId The ID of the workspace.
   */
  static async getWorkspaceClients( workspaceId = null ) {
    if (!workspaceId)
      workspaceId = auth.currentUser().user_metadata?.trackedWorkspace

    return await this.#get(`/workspaces/${workspaceId}/clients`)
  }


  /**
   * HTTP GET with the Authorization Headers
   * @param {string} path The API URL Path (e.g. "/me")
   * @param {object} options e.g. { isReportsAPI: true, params: { key: value, ... } }
   */
  static async #get( path, options = null ) {
    try {
      const baseUrl     = options?.isReportsAPI ? config.baseUrlReportsAPI : config.baseUrl,
            url         = new URL(baseUrl + path),
            params      = options?.params || {},
            authOptions = options?.Authorization

      if (options?.isReportsAPI) {
        // Use Reports API (https://github.com/toggl/toggl_api_docs/blob/master/reports.md)
        const user = auth.currentUser()
        const trackedProjects = user?.user_metadata?.trackedProjects
        if (!trackedProjects || !trackedProjects.length)
          throw new Error('No tracked projects defined by the user.')

        const workspaceId = user?.user_metadata?.trackedWorkspace
        if (!workspaceId)
          throw new Error('No workspace ID defined by the user.')

        params.user_agent = 'https://github.com/madebyfabian/overtimetrackr',
        params.project_ids = trackedProjects.join()
        params.workspace_id = workspaceId
      }

      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

      // Check if "Authorization" is set in the options object.
      let AuthorizationHeader
      if (!authOptions)
        AuthorizationHeader = this.#APITokenString
      else 
        AuthorizationHeader = btoa(`${authOptions.username}:${authOptions.password}`)
      
      const result = await fetch(url, {
        method: 'GET',
        headers: new Headers({
          Authorization: `Basic ${AuthorizationHeader}`
        })
      })

      return this.#handleAPIResponse(result)

    } catch (error) {
      console.error(error)
    }
  }


  /**
   * The HTTP Basic Authentication String
   * @returns Something like "XXXXXXXXXXXXXX=="
   */
  static get #APITokenString() {
    const APIToken = auth.currentUser()?.user_metadata?.togglApiKey
    if (!APIToken)
      throw new Error('No API Token provided!')
    
    return btoa(`${auth.currentUser()?.user_metadata?.togglApiKey}:api_token`)
  }


  /**
   * Handle a result object coming directly from the JS fetch() API.
   * @param {object} result fetch() result object
   */
  static async #handleAPIResponse( result ) {
    if (result.ok) 
      return await result.json()
    else {
      await result.json() // Check if it is possible to get an error object.
        .then(errorObj => { throw { ...errorObj, status: result.status } })
        .catch(e => { throw { status: result.status } })
    }
  }
}