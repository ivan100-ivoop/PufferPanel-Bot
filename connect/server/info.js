const fetch = require('node-fetch');
const { panel, color } = require('./../../config.json');

async function getServerStatus(token, type, id){
    let _res = await fetch(`${panel.url}/daemon/server/${id}/status`, {
        method: 'GET',
        headers: {
            Authorization: `${type} ${token}`,
            accept: "application/json"
        }
    });
    if (_res.headers.get('content-type') && _res.headers.get('content-type').includes('json')) {
        const j = await _res.json();
        if(j.running === null){
            return color.undefined;
        } else if(j.running === true){
            return color.online;
        } else if(j.running === false){
            return color.offline;
        } else {
            return j;
        }
    } else {
        return color.undefined;
    }
}

module.exports = async (token, type, id) =>{
    if(!token) throw new Error("Error Token is returned!");
    if(!type) throw new Error("Error Authorization Type is returned!");
    if(!id) throw new Error("Error Server Id is returned!");
    let _res = await fetch(`${panel.url}/api/servers/${id}`, {
        method: 'GET',
        headers: {
            Authorization: `${type} ${token}`,
            accept: "application/json"
        }
    });
    if (_res.headers.get('content-type') && _res.headers.get('content-type').includes('json')) {
        _res = await _res.json();
        _res.server.status = await getServerStatus(token, type, _res.server.id);
        return _res.server;
    }
    return null;
};