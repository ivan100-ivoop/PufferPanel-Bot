const AUTH_COOKIE_NAME = 'puffer_auth'
const SCOPES_COOKIE_NAME = 'puffer_scopes'
  
class ClientCookieSessionStore {
  
    constructor() {
      this._cookieOptions = new Map();
    }
  
    setToken(token) {
      this._cookieOptions.set(AUTH_COOKIE_NAME, token);
    }
  
    setScopes(scopes) {
      this._cookieOptions.set(SCOPES_COOKIE_NAME, JSON.stringify(scopes));
    }
  
    getToken() {
      return this._cookieOptions.get(AUTH_COOKIE_NAME) || null
    }
  
    getScopes() {
      const res = this._cookieOptions.get(SCOPES_COOKIE_NAME)
      if (res) return JSON.parse(res)
      return null
    }
  
    isLoggedIn() {
      return this.getToken() !== null
    }
  
    deleteSession() {
      this._cookieOptions.deleteAll();
    }
}
  
module.exports = ClientCookieSessionStore;