function generateUUID() {
  var d = new Date().getTime();
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;
      if(d > 0){
          r = (d + r)%16 | 0;
          d = Math.floor(d/16);
      } else {
          r = (d2 + r)%16 | 0;
          d2 = Math.floor(d2/16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

class ServerApi {
  _api = null

  constructor(api) {
    this._api = api
  }

  async create(data) {
    data.id = generateUUID();
    const res = await this._api.put(`/daemon/server/${data.id}`, data);
    if(res.status === 200){
      const res = await this._api.post(`/api/servers`, data);
      return res.data.id;
    }
    return false
  }

  async list(page = 1, pageSize, name) {
    const query = { page }
    if (pageSize) query.limit = pageSize
    if (name) query.name = `*${name}*`
    const res = await this._api.get('/api/servers', query)
    return res.data
  }

  async get(id) {
    const res = await this._api.get(`/api/servers/${id}?perms`)
    return res.data
  }

  async getStatus(id) {
    const res = await this._api.get(`/daemon/server/${id}/status`)
    if (res.data.installing) return 'installing'
    if (res.data.running) return 'online'
    return 'offline'
  }

  async getStats(id) {
    const res = await this._api.get(`/daemon/server/${id}/stats`)
    return res.data
  }

  async action(id, action, wait = false) {
    await this._api.post(`/daemon/server/${id}/${action}?wait=${wait}`)
    return true
  }

  async start(id, wait = false) {
    return await this.action(id, 'start', wait)
  }

  async stop(id, wait = false) {
    return await this.action(id, 'stop', wait)
  }

  async kill(id, wait = false) {
    return await this.action(id, 'kill', wait)
  }

  async install(id, wait = false) {
    return await this.action(id, 'install', wait)
  }

  async reload(id) {
    await this._api.post(`/api/servers/${id}/reload`)
    return true
  }

  async sendCommand(id, command) {
    await this._api.post(`/api/servers/${id}/console`, command)
    return true
  }

  async getConsole(id, time = 0) {
    const res = await this._api.get(`/api/servers/${id}/console?time=${time}`)
    return res.data
  }

  async updateName(id, name) {
    await this._api.put(`/api/servers/${id}/name/${encodeURIComponent(name)}`)
    return true
  }

  async getFlags(id) {
    const res = await this._api.get(`/api/servers/${id}/flags`)
    return res.data
  }

  async setFlags(id, flags) {
    await this._api.post(`/api/servers/${id}/flags`, flags)
    return true
  }

  async getDefinition(id) {
    const res = await this._api.get(`/api/servers/${id}/definition`)
    return res.data
  }

  async updateDefinition(id, data) {
    await this._api.put(`/api/servers/${id}/definition`, data)
    return true
  }

  async getData(id) {
    const res = await this._api.get(`/api/servers/${id}/data`)
    return res.data
  }

  async updateData(id, data) {
    await this._api.post(`/api/servers/${id}/data`, data)
    return true
  }

  async getUsers(id) {
    const res = await this._api.get(`/api/servers/${id}/user`)
    return res.data
  }

  async getUser(id, email) {
    const res = await this._api.get(`/api/servers/${id}/user/${email}`)
    return res.data
  }

  async updateUser(id, user) {
    await this._api.put(`/api/servers/${id}/user/${user.email}`, user)
    return true
  }

  async deleteUser(id, email) {
    await this._api.delete(`/api/servers/${id}/user/${email}`)
    return true
  }

  async delete(id) {
    await this._api.delete(`/api/servers/${id}`)
    return true
  }
}

module.exports = ServerApi;