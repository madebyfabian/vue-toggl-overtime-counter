import auth from '@/plugins/GotrueAuth'


/**
 * Performs an API Request to the Papierkram API.
 * @param {string}  path e.g. "/auth" or "/projects"
 * @param {object}  options
 * @param {string}  options.subdomain     The User's own subdomain.
 * @param {boolean} options.requiresAuth  If the requested resource does need authentication. Default: false
 * @param {string}  options.method        The HTTP Method. Default: 'GET'
 * @param {object}  options.body          The body data object. (optional)
 * @param {object}  options.query         Object of additional URL queries.
 */
export default async ( path, options ) => {
  try {
    const requiresAuth  = options?.requiresAuth || false,
          method        = options?.method || 'GET',
          body          = options?.body,
          queries       = options?.query

    let subdomain = options?.subdomain
    if (!subdomain) {
      // Try to get subdomain from current user
      // @TEMP:
      throw new Error('@TEMP: Please provide a subdomain for now! (will fix this later)')
    }

    // Generate URL
    let url = `https://cors-everywhere.madebyfabian.workers.dev?https://${subdomain}.papierkram.de/api/v1${path}`
    let urlQueries = queries || {}
    
    if (requiresAuth) {
      const { authToken } = getCredentials()
      if (!authToken)
        throw new Error('papierkramApiCredentials not found in the user_metadata!')
  
      urlQueries.auth_token = authToken
    }

    url = `${url}?${new URLSearchParams(urlQueries).toString()}`
    
    const fetchOptions = { 
      method, 
      headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded'}),
      body: body ? new URLSearchParams(body) : null
    }
  
    const res = await fetch( url, fetchOptions )
    if (!res.ok) 
      throw new Error('Error with the Request: ' + await res.text())

    return await res.json()
  } catch (error) {
    console.error(error)
  }
}


const getCredentials = () => {
  const { user_metadata: data } = auth.currentUser()

  const authToken = data?.papierkramApiCredentials?.authToken,
        realtimeToken = data?.papierkramApiCredentials?.realtimeToken,
        subdomain = data?.papierkramApiCredentials?.subdomain

  if (!!(authToken && realtimeToken && subdomain))
    return { authToken, realtimeToken, subdomain }
}