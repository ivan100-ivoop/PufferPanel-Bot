const fetch = require('node-fetch');
const { panel } = require('../config.json');

module.exports = async () =>{
    const params = `grant_type=client_credentials&client_id=${panel["client_id"]}&client_secret=${panel["client_secret"]}`;
    let _res = await fetch(`${panel.url}/oauth2/token`, {
        method: 'POST',
        body: params,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    _res = await _res.json();
    if(!_res.access_token){
        return null;
    }
    return {
        token: _res.access_token,
        type: _res.token_type
    }
};