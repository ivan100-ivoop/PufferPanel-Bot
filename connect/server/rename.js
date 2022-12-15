const fetch = require('node-fetch');
const { panel } = require('./../../config.json');

module.exports = async (token, type, id, name) =>{
    if(!token) throw new Error("Error Token is returned!");
    if(!type) throw new Error("Error Authorization Type is returned!");
    if(!id) throw new Error("Error Server Id is returned!");
    if(!name) throw new Error("Error Server New Name is returned!");
    let _res = await fetch(`${panel.url}/api/servers/${id}/${name}`, {
        method: 'POST',
        headers: {
            Authorization: `${type} ${token}`,
            accept: "application/json"
        }
    });
    if (_res.headers.get('content-type') && _res.headers.get('content-type').includes('json')) {
        return await _res.json();
    }
    return await _res.text();
};