var httpServer = require('../index');

var actions = {
    ok: function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        // make something happen here
        res.end('{status: "OK"}');
    },
    post_ok: function(req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        // make something happen here, involving the posted data
        res.end('{status: "POSTED OK"}');
    }
};

// router object will deal with incoming queries
var device = {
    name: 'example device',
    routes: [
        {
            path: '/ok',
            label: 'Tell me it\'s all ok',
            func: actions.ok
        },
        {
            path: '/ok-post',
            label: 'Tell me it\'s all ok by post',
            func: actions.post_ok,
            method: 'POST'
        }
    ]
};

var server = new httpServer();

server.configureForDevice(device);

server.start();