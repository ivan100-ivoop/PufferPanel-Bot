const fetch = require('node-fetch');
const { panel, color } = require('../../config.json');

async function status(node){
    let _res = await fetch(`http://${node.publicHost}:${node.publicPort}`, {
        method: 'GET',
        headers: {}
    });
    if(_res.statusCode !== 200){
        return color.online;
    }
    return color.offline;
}

module.exports = async (token, type) => {
    if(!token) throw new Error("Error Token is returned!");
    if(!type) throw new Error("Error Authorization Type is returned!");
    let _res = await fetch(`${panel.url}/api/nodes`, {
        method: 'GET',
        headers: {
            Authorization: `${type} ${token}`,
            accept: "application/json"
        }
    });
    _res = await _res.json();
    if(!Array.isArray(_res)){
        return null;
    }
    for(let i =0; i< _res.length; i++){
        let node = _res[i];
        let _status = await status(node);
        node.status = _status;
    }
    return {
        count: _res.length,
        nodes: _res
    }
};