var socket = require('socket.io-client');

function Device(config) {
    var client = new socket('http://localhost:3100/devices');

    client.on('connect', function () {
        console.log('connected!');
    });

    client.on('disconnect', function (data) {
        console.log('disconnected!');
        console.log(data);
    });

    var actions = [];

    // add action handlers
    config.actions.forEach(function(action) {
        actions.push({"label": action.label});

        client.on(action.label, function(actionId) {
            // trigger the action and send response to client
            action.action().then(
                function(message) {
                    if (message && message == 'executing') {
                        client.emit('action_executing', actionId);
                    } else {
                        client.emit('action_complete', actionId);
                    }
                },
                function() {
                    client.emit('action_failed', actionId);
                }
            );
        });
    });

    client.on('config', function() {
        console.log('config requested!');

        client.emit(
            'device-config',
            {
                "id": Math.random(),
                "name": config.name,
                "actions": actions
            }
        );
    });
}

module.exports = Device;