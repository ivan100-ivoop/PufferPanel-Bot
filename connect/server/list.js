const fetch = require('node-fetch');
const { panel, color } = require('./../../config.json');

async function getServerStatus(token, type, server){
    let _res = await fetch(`${panel.url}/daemon/server/${server.id}/status`, {
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

module.exports = async (token, type) =>{
    if(!token) throw new Error("Error Token is returned!");
    if(!type) throw new Error("Error Authorization Type is returned!");
    let _res = await fetch(`${panel.url}/api/servers`, {
        method: 'GET',
        headers: {
            Authorization: `${type} ${token}`,
            accept: "application/json"
        }
    });
    _res = await _res.json();
    if(!Array.isArray(_res.servers)){
        return null;
    }
    for(let i =0; i< _res.servers.length; i++){
        let server = _res.servers[i];
        let _status = await getServerStatus(token, type, server);
        server.status = _status;
    }
    return _res.servers;
};