const fetch = require('node-fetch');
const { panel } = require('./../../config.json');

module.exports = async (token, type, id) => {
    if(!token) throw new Error("Error Token is returned!");
    if(!type) throw new Error("Error Authorization Type is returned!");
    if(!id) throw new Error("Error User Id is returned!");
    let _res = await fetch(`${panel.url}/api/users/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `${type} ${token}`,
            accept: "application/json",
        }
    });

    if(await _res.text()){
        return await _res.json()
    }
    return null;
};