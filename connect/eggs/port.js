const { join } = require('path');
const { writeFileSync } = require('fs');

function getPort(allocation){
    let ports = require(`./${allocation}`);
    if(ports.length >= 0){
        var port = ports[Math.floor(Math.random()*ports.length)];
        updatePorts(allocation, port, ports);
        return port;
    } else {
        return null;
    }
}

function updatePorts(allocation, port, ports){
    let _tmp = [];
    for(let i=0; i<ports.length; i++){
        if(ports[i] !== port){
            _tmp.push(ports[i]);
        }
    }
    writeFileSync(join(__dirname, allocation), JSON.stringify(_tmp));
}

function addPort(allocation, port){
    let ports = require(`./${allocation}`);
    if(!ports.includes(port)){
        ports.push(port);
    }
    writeFileSync(join(__dirname, allocation), JSON.stringify(ports));
    return true;
}

module.exports = (path, port=null) => {
    if(port){
        return addPort(path, port);
    } else {
        return getPort(path);
    }
};
