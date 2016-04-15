var socket = require('socket.io-client');
var config = require('config');
var sonumiLogger = require('sonumi-logger');

function Device(deviceConfig) {
    var logDirectory = config.logging.logDir;

    logger = sonumiLogger.init(logDirectory);
    logger.addLogFile('info', logDirectory + '/sonumi-device-info.log', 'info');
    logger.addLogFile('errors', logDirectory + '/sonumi-device-errors.log', 'error');


    var host = config.server.host + ':' + config.server.port + '/devices';
    logger.log('Connecting to ' + host);
    var client = new socket(host);

    client.on('connect', function () {
        logger.log('connected!');
    });

    client.on('connect_error', function (err) {
        logger.error('connection error!');
        logger.error(err);
    });

    client.on('disconnect', function (data) {
        logger.log('disconnected!');
        logger.log(data);
    });

    var actions = [];

    logger.log('adding action handlers');
    // add action handlers
    deviceConfig.actions.forEach(function(action) {
        logger.log('Adding ' + action.label + ' action');
        actions.push({"label": action.label});

        client.on(action.label, function(actionId) {
            logger.log('Action ' + action.label + ' has been triggered');
            // trigger the action and send response to client
            action.action().then(
                function(message) {
                    if (message && message == 'executing') {
                        logger.log('Action ' + action.label + ' is already executing');
                        client.emit('action_executing', actionId);
                    } else {
                        logger.log('Action ' + action.label + ' has completed');
                        client.emit('action_complete', actionId);
                    }
                },
                function() {
                    logger.log('Action ' + action.label + ' has failed');
                    client.emit('action_failed', actionId);
                }
            );
        });
    });

    client.on('config', function() {
        logger.log('Action config has been triggered');

        client.emit(
            'device-config',
            {
                "id": Math.random(),
                "name": deviceConfig.name,
                "actions": actions
            }
        );
    });
}

module.exports = Device;