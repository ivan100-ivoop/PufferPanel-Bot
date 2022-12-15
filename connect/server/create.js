const fetch = require('node-fetch');
const { panel } = require('./../../config.json');

module.exports = async (token, type, egg) =>{
    if(!token) throw new Error("Error Token is returned!");
    if(!type) throw new Error("Error Authorization Type is returned!");
    if(!egg) throw new Error("Error Egg is returned!");
    let _res = await fetch(`${panel.url}/api/servers/`, {
        method: 'POST',
        body: JSON.stringify(egg),
        headers: {
            Authorization: `${type} ${token}`,
            accept: "application/json",
            "Content-Type": "application/json"
        }
    });
    if (_res.headers.get('content-type') && _res.headers.get('content-type').includes('json')) {
       return await _res.json();
    }
    return await _res.text();
};