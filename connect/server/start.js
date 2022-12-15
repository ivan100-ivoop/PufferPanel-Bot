const fetch = require('node-fetch');
const { panel } = require('./../../config.json');

module.exports = async (token, type, id) =>{
    if(!token) throw new Error("Error Token is returned!");
    if(!type) throw new Error("Error Authorization Type is returned!");
    if(!id) throw new Error("Error Server Id is returned!");
    let _res = await fetch(`${panel.url}/daemon/server/${id}/start?wait=false`, {
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