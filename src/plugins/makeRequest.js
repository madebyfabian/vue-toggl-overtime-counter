import auth from '@/plugins/GotrueAuth'

const _config = {
  proxyUrl: 'https://cors-anywhere-madebyfabian.herokuapp.com',
  providers: {
    papierkram: {
      baseUrl: 'https://{{subdomain}}.papierkram.de/api/v1',
      postContentType: 'application/x-www-form-urlencoded',
      needsProxy: true,
      authMethod: URLSearchParams
    },
    toggl: {
      baseUrl: 'https://www.toggl.com/api/v8',
      postContentType: 'application/json',
      needsProxy: false,
      authMethod: Headers
    },
    togglReports: {
      baseUrl: 'https://toggl.com/reports/api/v2',
      postContentType: 'application/json',
      needsProxy: false,
      authMethod: Headers
    }
  }
}


/**
 * Performs an API Request.
 * @param {string}   path                  e.g. "/auth" or "/projects"
 * @param {object}   options
 * @param {boolean}  options.requiresAuth  If the requested resource does need authentication. Default: false
 * @param {string}   options.method        The HTTP Method. Default: 'GET'
 * @param {object}   options.params        Object of additional GET queries/ POST params
 * @param {{name: string, ...: any}|string} options.provider
 */
export default async ( path, options ) => {
  try {
    const requiresAuth  = options?.requiresAuth || false,
          provider      = getProviderData(options?.provider)

    const fetchOptions = {
      method: options?.method || 'GET',
      headers: { 'Content-Type': provider.postContentType },
    }

    let queryParams = {}
    if (requiresAuth) {
      const authToken = getUserData(provider)?.authToken
      if (!authToken)
        throw new Error('The route requires auth, but no authToken is found in the user_metadata!')

      switch (provider.authMethod) {
        case URLSearchParams:
          queryParams.auth_token = authToken
          break
      
        case Headers:
          fetchOptions.headers.Authorization = `Basic ${btoa(`${authToken}:api_token`)}`
          break
      }
    } else 
      switch (provider.name) {
        case 'toggl': case 'togglReports':
          if (options?.params?.email && options?.params?.password)
            fetchOptions.headers.Authorization = `Basic ${btoa(`${options.params.email}:${options.params.password}`)}`
          break
      }
    
    if (options?.params)
      if (fetchOptions?.method === 'GET')
        queryParams = { ...queryParams, ...options?.params }
      else
        switch (provider.postContentType) {
          case 'application/json':
            fetchOptions.body = JSON.stringify(options?.params); break
        
          case 'application/x-www-form-urlencoded':
            fetchOptions.body = new URLSearchParams(options?.params).toString(); break
        }

    const url = buildUrl(provider, path) + '?' + new URLSearchParams(queryParams).toString()

    if (options?.debug)
      console.log('\nmakeRequest():\nURL:', url, '\nfetchOptions:', fetchOptions, '\n\n')
  
    const res = await fetch( url, fetchOptions )
    if (!res.ok) 
      throw new Error('Error with the request. Response is: ' + await res.text())

    return await res.json()
  } catch (error) {
    console.error(error)
  }
}


/**
 * @returns {{ name: string, baseUrl: string, postContentType: string, needsProxy: boolean, authMethod: object, ...: any }}
 */
const getProviderData = ( rawProviderOption ) => {
  if (!rawProviderOption)
    throw new Error('Please provide a provider.')

  let providerData = typeof rawProviderOption === 'string' ? { name: rawProviderOption } : rawProviderOption
  const providerDataFromConfig = _config.providers?.[providerData.name]
  if (!providerDataFromConfig)
    throw new Error(`The given provider "${providerData.name}" is not included in allowed ones: "${Object.keys(_config.providers).join('", "')}".`)
  return { ...providerData, ...providerDataFromConfig }
}


/**
 * 
 * @param {*} provider provider object from getProviderData()
 */
const buildUrl = ( provider, path ) => {
  let baseUrl = (provider.needsProxy ? _config.proxyUrl : '') + provider.baseUrl

  if (provider.name === 'papierkram') {
    const subdomain = provider?.subdomain || getUserData(provider)?.subdomain
    console.log(subdomain)
    if (!subdomain)
      throw new Error('Provider "papierkram" needs the value "subdomain"')
    else
      baseUrl = baseUrl.replace('{{subdomain}}', subdomain)
  }

  return baseUrl + path
} 


/**
 * @returns {{ authToken: string, subdomain: string }}
 */
const getUserData = ( provider ) => {
  return auth.currentUser()?.user_metadata?.data?.providers?.[provider.name]
}