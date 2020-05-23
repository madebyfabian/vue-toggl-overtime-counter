import auth from './gotrue-auth'


export default class TogglAPI {
  #APIHeaders
  #baseURL = 'https://www.toggl.com/api/v8'

  /**
   * Toggl API Wrapper.
   * @param {string} APIKey The Toggl API Key
   */
  constructor() {
    const APIKey = auth.currentUser()?.user_metadata?.togglApiKey
    if (!APIKey)
      throw new Error('APIKey is missing!.')

    this.#APIHeaders = {
      'Authorization': `Basic ${btoa(`${APIKey}:api_token`)}`
    }
  }



  /**
   * Get current user data.
   * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/users.md#get-current-user-data
   */
  async getUserData() {
    return await this.#get('/me')
  }



  /**
   * Get data about all the workspaces where the token owner belongs to.
   * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspaces
   */
  async getWorkspaces() {
    return await this.#get('/workspaces')
  }


  /**
   * Get single workspace.
   * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-single-workspace
   * @param {number} workspaceId The ID of the workspace.
   */
  async getWorkspaceById( workspaceId ) {
    return await this.#get(`/workspaces/${workspaceId}`)
  }


  /**
   * Get workspace projects.
   * @param {number} workspaceId The ID of the workspace.
   */
  async getWorkspaceProjects( workspaceId ) {
    return await this.#get(`/workspaces/${workspaceId}/projects`)
  }



  // ------------------ PRIVATE ------------------

  /**
   * HTTP GET with the Authorization Headers
   * @param {string} path The API URL Path (e.g. "/me")
   */
  async #get( path ) {
    const result = await fetch(this.#baseURL + path, { method: 'GET', headers: this.#APIHeaders })
    return this.#handleAPIResponse(result)
  }

  /**
   * Handle a result object coming directly from the JS fetch() API.
   * @param {object} result fetch() result object
   */
  async #handleAPIResponse( result ) {
    if (result.ok) 
      return await result.json()
    else {
      await result.json() // Check if it is possible to get an error object.
        .then(errorObj => { throw { ...errorObj, status: result.status } })
        .catch(e => { throw { status: result.status } })
    }
  }
}