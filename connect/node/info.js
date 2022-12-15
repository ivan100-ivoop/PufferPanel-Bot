const fetch = require('node-fetch');
const { panel, color } = require('./../../config.json');

module.exports = async (token, type, id) => {
    if(!token) throw new Error("Error Token is returned!");
    if(!type) throw new Error("Error Authorization Type is returned!");
    if(!id) throw new Error("Error Node Id is returned!");
    let _res = await fetch(`${panel.url}/api/nodes/${id}`, {
        method: 'GET',
        headers: {
            Authorization: `${type} ${token}`,
            accept: "application/json"
        }
    });
    
    _res = await _res.json();
    
    if(_res.statusCode !== 200){
        _res.status = color.offline;
    }
    _res.status = color.online;
    
    return _res;
};