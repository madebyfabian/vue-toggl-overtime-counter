import auth from './gotrue-auth'


const config = { BASE_URL: 'https://www.toggl.com/api/v8' }


/**
 * Toggl API Wrapper.
 */
export default class TogglAPI {
  /**
   * Get current user data.
   * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/users.md#get-current-user-data
   */
  static async getUserData() {
    return await this.#get('/me')
  }



  /**
   * Get data about all the workspaces where the token owner belongs to.
   * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspaces
   */
  static async getWorkspaces() {
    return await this.#get('/workspaces')
  }

  /**
   * Get single workspace.
   * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-single-workspace
   * @param {number} workspaceId The ID of the workspace.
   */
  static async getWorkspace( workspaceId ) {
    return await this.#get(`/workspaces/${workspaceId}`)
  }

  /**
   * Get workspace projects.
   * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-projects
   * @param {number} workspaceId The ID of the workspace.
   */
  static async getWorkspaceProjects( workspaceId ) {
    return await this.#get(`/workspaces/${workspaceId}/projects`)
  }

  /**
   * Get workspace clients.
   * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-clients
   * @param {number} workspaceId The ID of the workspace.
   */
  static async getWorkspaceClients( workspaceId ) {
    return await this.#get(`/workspaces/${workspaceId}/clients`)
  }


  
  // ------------------ PRIVATE ------------------

  /**
   * HTTP GET with the Authorization Headers
   * @param {string} path The API URL Path (e.g. "/me")
   */
  static async #get( path ) {
    const result = await fetch(config.BASE_URL + path, { 
      method: 'GET', 
      mode: 'no-cors', // 'cors' by default
      headers: new Headers({
        'Authorization': `Basic ${this.#APITokenString}`
      })
    })
    return this.#handleAPIResponse(result)
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