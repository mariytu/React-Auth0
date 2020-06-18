import auth0 from 'auth0-js'

const REDIRECT_ON_LOGIN = 'redirect_on_login'

// Stored outside class since private
// AccessToken is saved in memory, The user session is lost if they
// open a new browser tab o close the existing tab --> sol: silent authentication
// eslint-disable-next-line
let _idToken = null
let _accessToken = null
let _scopes = null
let _expiresAt = null

export default class Auth {
  // We'll pass React Router's history in so Auth can perform redirects
  constructor(history) {
    this.history = history
    this.userProfile = null
    this.requestedScopes = 'openid profile email read:courses'
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      responseType: 'token id_token',
      scope: this.requestedScopes,
    })
  }

  login = () => {
    // We save the current page before login for redirect after
    localStorage.setItem(
      REDIRECT_ON_LOGIN,
      JSON.stringify(this.history.location)
    )
    this.auth0.authorize()
  }

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
        const redirectLocation =
          localStorage.getItem(REDIRECT_ON_LOGIN) === 'undefined'
            ? '/'
            : JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN))
        this.history.push(redirectLocation)
      } else if (err) {
        this.history.push('/')
        alert(`Error: ${err.error}. Check the console for further details.`)
        console.log(err)
      }
      localStorage.removeItem(REDIRECT_ON_LOGIN)
    })
  }

  /**
   * 1. authResult.expiresIn contains expiration in seconds
   * 2. Multiply by 1000 to convert into milliseconds
   * 3. Add current Unix epoch time
   * This gives us the Unix epoch time when the token will expire
   */
  setSession = authResult => {
    // set the time that access token will expire
    _expiresAt = authResult.expiresIn * 1000 + new Date().getTime()
    /*const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    )*/

    // If there is a value on the `scope` param from the authResult,
    // use it to set scopes in the session for the user. Otherwise
    // use the scopes as requested. If no scopes were requested,
    // set it to nothing
    _scopes = authResult.scope || this.requestedScopes || ''

    //localStorage.setItem('access_token', authResult.accessToken)
    _accessToken = authResult.accessToken
    _idToken = authResult.idToken
    //localStorage.setItem('id_token', authResult.idToken)
    //localStorage.setItem('expires_at', expiresAt)
    //localStorage.setItem('scopes', JSON.stringify(scopes))
    this.scheduleTokenRenewal()
  }

  isAuthenticated = () => {
    //const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    return new Date().getTime() < _expiresAt
  }

  logout = () => {
    /*localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    localStorage.removeItem('scopes')
    this.userProfile = null*/
    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      returnTo: 'http://localhost:3000',
    })
  }

  getAccessToken = () => {
    //const accessToken = localStorage.getItem('access_token')
    if (!_accessToken) {
      throw new Error('No access token found.')
    }
    return _accessToken
  }

  getProfile = cb => {
    if (this.userProfile) return cb(this.userProfile)
    this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
      if (profile) this.userProfile = profile
      cb(profile, err)
    })
  }

  /**
   * Accepts an array of scopes. It checks for the list of granted
   * scopes by looking in localStorage for the list of scopes.
   */
  userHasScopes = scopes => {
    const grantedScopes = (_scopes || '').split(' ')
    /*const grantedScopes = (
      JSON.parse(localStorage.getItem('scopes')) || ''
    ).split(' ')*/
    return scopes.every(scope => grantedScopes.includes(scope))
  }

  renewToken = cb => {
    this.auth0.checkSession({}, (err, result) => {
      if (err) {
        console.log(`Error: ${err.error} - ${err.error_description}.`)
      } else {
        this.setSession(result)
      }
      if (cb) cb(err, result)
    })
  }

  scheduleTokenRenewal = () => {
    const delay = _expiresAt - Date.now()
    if (delay > 0) setTimeout(() => this.renewToken(), delay)
  }
}
