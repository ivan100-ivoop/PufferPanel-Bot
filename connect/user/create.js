const { info } = require('console');
const fetch = require('node-fetch');
const { panel } = require('./../../config.json');

module.exports = async (token, type, username, email, password) => {
    if(!token) throw new Error("Error Token is returned!");
    if(!type) throw new Error("Error Authorization Type is returned!");
    if(!username) throw new Error("Error User Username is returned!");
    if(!email) throw new Error("Error User Email is returned!");
    if(!password) throw new Error("Error User Password is returned!");

    let _res = await fetch(`${panel.url}/api/users/`, {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            username: username,
            password: password
        }),
        headers: {
            Authorization: `${type} ${token}`,
            accept: "application/json",
            "Content-Type": "application/json"
        }
    });

    if (_res.headers.get('content-type').includes('json')) {
        const j = await _res.json();
        return j.id;
    }
    return null;
};