const fetch = require('node-fetch');
const { panel } = require('./../../config.json');

module.exports = async (token, type) => {
    if(!token) throw new Error("Error Token is returned!");
    if(!type) throw new Error("Error Authorization Type is returned!");
    let _res = await fetch(`${panel.url}/api/users`, {
        method: 'GET',
        headers: {
            Authorization: `${type} ${token}`,
            accept: "application/json"
        }
    });
    
    return await _res.json();  
};