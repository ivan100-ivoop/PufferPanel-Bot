const fetch = require('node-fetch');
const { panel } = require('./../../config.json');

function ConstructParams(info){
    let params = {id: info.id};
    if(info.email) { params["email"] = info.email}
    if(info.username) { params["username"] = info.username}
    if(info.password && info.newpassword) { params["password"] = info.password; params["newpassword"] = info.newpassword; }
    return JSON.stringify(params);
}

module.exports = async (token, type, info) => {
    if(!token) throw new Error("Error Token is returned!");
    if(!type) throw new Error("Error Authorization Type is returned!");
    if(!info) throw new Error("Error User Info is returned!");
    if(!info.id) throw new Error("Error User Id is returned!");
    const params = ConstructParams(info);
    let _res = await fetch(`${panel.url}/api/users/${info.id}`, {
        method: 'POST',
        body: params,
        headers: {
            Authorization: `${type} ${token}`,
            accept: "application/json",
            "Content-Type": "application/json"
        }
    });
    if (_res.headers.get('content-type') && _res.headers.get('content-type').includes('json')) {
        return await _res.json()
    }
    return null;
};