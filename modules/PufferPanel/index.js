const ApiClient = require('./client');
const ClientCookieSessionStore = require('./SessionStore');
const pufferPanel = require('./pufferPanel');

const storage = new ClientCookieSessionStore();

const _handleError = (e, client) => {
    const error = client.framework.getErrors();
    const log = client.framework.getLogger();

    if (e.status === 401) {
        log.error(error.panel.ErrSessionTimedOut);
    } else if (e.code === 'ErrGeneric' && e.msg) {
        log.error(e.msg)
    } else if (e.code === 'ErrUnknownError') {
        log.error(error.panel.ErrUnknownError)
    } else {
        log.error(error.panel[e.code])
    }
}

module.exports = async (client) => {    
    const panel = client.framework.getConfig("panel");
    const log = client.framework.getLogger();

    if(panel){
        log.info("Starting Addon PufferPanel.");
        client.pufferpanel = new ApiClient(panel.url, storage, (err)=> _handleError(err, client));
        if(panel.normal){
            log.info(`PufferPanel login with "email", "password" to server!`);
            await client.pufferpanel.auth.login(panel.email, panel.password)
            .catch(err=>{})
        }

        if(!panel.normal){
            log.info(`PufferPanel login with "client_id", "client_secret" to server!`);
            await client.pufferpanel.auth.oauth(panel.client_id, panel.client_secret)
            .catch(err=>{})
        }

        if(client.pufferpanel.auth.isLoggedIn()){
            log.info("PufferPanel connection successfully!");
            await pufferPanel(client);
        } else {
            log.warning("PufferPanel connection unsuccessfully!");
        }

    }
    
}