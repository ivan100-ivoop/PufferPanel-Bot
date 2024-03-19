const ax = require('axios');
const https = require('https');

const AuthApi = require('./auth');
const SelfApi = require('./self');
const UserApi = require('./users');
const NodeApi = require('./nodes');
const ServerApi = require('./servers');
const TemplateApi = require('./templates');

const http_instance = {
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
};

class ApiClient {
  _axios = null
  _host = null
  _errorHandler = null
  auth = null
  self = null
  server = null
  node = null
  user = null
  template = null

  constructor(host, sessionStore, errorHandler, axios = ax.create(http_instance)) {
    this._axios = axios
    this._host = host
    this._errorHandler = errorHandler
    this.auth = new AuthApi(this, sessionStore)
    this.self = new SelfApi(this)
    this.server = new ServerApi(this)
    this.node = new NodeApi(this)
    this.user = new UserApi(this)
    this.template = new TemplateApi(this)
  }

  _handleError(e) {
    const status = ((e || {}).response || {}).status
    const statusText = ((e || {}).response || {}).statusText
    const response = ((e || {}).response || {}).data
    const request = (e || {}).config
    let code = 'ErrUnknownError'
    let msg
    const error = (((e || {}).response || {}).data || {}).error
    if ((error || {}).code) code = error.code
    if ((error || {}).msg) msg = error.msg
    const result = { status, statusText, response, request, code, msg }
    if (this._errorHandler) this._errorHandler(
      result
    )
    throw result
  }

  _enhanceHeaders(headers) {
    headers.Origin = (new URL(this._host)).hostname;
    const token = this.auth.getToken()
    if (token) {
      return {
        ...headers,
        Authorization: 'Bearer ' + token
      }
    }
    return headers
  }

  async get(url, params = {}, headers = {}, options = {}) {
    const instance = this;
    return await this._axios.get(this._host + url, { params, ...options, headers: this._enhanceHeaders(headers) })
    .catch( r => {
      instance._errors(r, options)
    });
  }

  async post(url, data, params = {}, headers = {}, options = {}) {
    const instance = this;
    return await this._axios.post(this._host + url, data, { params, ...options, headers: this._enhanceHeaders(headers) })
    .catch( r => {
      instance._errors(r, options)
    });
  }

  async put(url, data, params = {}, headers = {}, options = {}) {
    const instance = this;
    return await this._axios.put(this._host + url, data, { params, ...options, headers: this._enhanceHeaders(headers) })
    .catch( r => {
      instance._errors(r, options)
    });
  }

  async delete(url, params = {}, headers = {}, options = {}) {
    const instance = this;  
    return await this._axios.delete(this._host + url, { params, ...options, headers: this._enhanceHeaders(headers) })
    .catch( r => {
      instance._errors(r, options)
    });
  }

  _errors(e, options){
    if (!Array.isArray(options.unhandledErrors) || options.unhandledErrors.indexOf(e.response.status) === -1) this._handleError(e);
  }
}

module.exports = ApiClient;