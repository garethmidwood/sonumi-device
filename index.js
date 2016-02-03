var http = require('http');
var dispatcher = require('httpdispatcher');
var config = require('config');
var sonumiLogger = require('sonumi-logger');
var getmac = require('getmac');

var port,
    device,
    deviceMacAddress;

const SONUMI_ROUTE = '/sonumi';

function Server()
{
    var logDirectory = config.logging.logDir;
    logger = sonumiLogger.init(logDirectory);
    logger.addLogFile('info', logDirectory + '/server-info.log', 'info');
    logger.addLogFile('errors', logDirectory + '/server-error.log', 'error');

    port = config.server.port;
    logger.log('port is ' + port);

    getmac.getMac(function(err, macAddress) {
        if (err) throw err;
        deviceMacAddress = macAddress;
    });
}

Server.prototype = {
    start: function() {
        // create and start the server
        var server = http.createServer(this.handleRequest);

        server.listen(port, function(){
            logger.log('Server listening on port ' + port);
        });

        // default route to return action json
        this.addRoute(SONUMI_ROUTE, generateRouteJson);
    },
    handleRequest: function(request, response) {
        try {
            // log the request on console
            logger.log('Received request for ' + request.url);
            // Dispatch
            dispatcher.dispatch(request, response);
        } catch(err) {
            logger.error(err);
        }
    },
    configureForDevice: function(deviceConfig) {
        var self = this;

        if (typeof deviceConfig.name === 'undefined') {
            throw new Error('Your device has no defined [name]');
        }

        if (typeof deviceConfig.routes === 'undefined') {
            throw new Error('Your device has no defined [routes]');
        }

        // add each of the routes
        deviceConfig.routes.forEach(function(route) {
            if (typeof route.path === 'undefined'
            || typeof route.label === 'undefined'
            || typeof route.func === 'undefined') {
                throw new Error('One of your routes has [path/label/func] attribute missing');
            }

            if (typeof route.func !== 'function') {
                throw new Error('Your [route] method must be a function in ' + route.path);
            }

            if (route.method === 'POST') {
                self.addPostRoute(route.path, route.func);
            } else {
                self.addRoute(route.path, route.func);
            }
        });

        device = deviceConfig;
    },
    addRoute: function(path, handlerMethod) {
        logger.log('adding handler for GET path ' + path);
        dispatcher.onGet(path, handlerMethod);
    },
    addPostRoute: function(path, handlerMethod) {
        logger.log('adding handler for POST path ' + path);
        dispatcher.onPost(path, handlerMethod);
    }
};

function generateRouteJson(req, res)
{
    var deviceActions = [];

    device.routes.forEach(function(route) {
        deviceActions.push({path: route.path, label: route.label});
    });

    var responseJson = {
        'id': deviceMacAddress,
        'name': device.name,
        'actions': deviceActions
    };

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(responseJson));
}

module.exports = Server;
