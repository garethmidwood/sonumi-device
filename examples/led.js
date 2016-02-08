var httpServer = require('../index');

var gpioSupport = true;

try {
    var gpio = require('onoff').Gpio;
} catch (err) {
    gpioSupport = false;
}


var actions = {
    blink: function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});

        try {
            var led = new gpio(17, 'out');
            gpioSupport = true;
        } catch (err) {
            console.log('no gpio support');
            gpioSupport = false;
        }

        try {
            var iv = setInterval(function () {
                console.log('== blink ==');
                if (gpioSupport) {
                    led.writeSync(led.readSync() === 0 ? 1 : 0);
                }
            }, 500);

            // Stop blinking the LED and turn it off after 5 seconds.
            setTimeout(function () {
                clearInterval(iv); // Stop blinking

                if (gpioSupport) {
                    led.writeSync(0);  // Turn LED off.
                    led.unexport();    // Unexport GPIO and free resources
                }

                res.end('{status: "OK"}');
            }, 5000);
        } catch (err) {
            console.log('Error making LED blink: ' + err);
        }
    }
};

// router object will deal with incoming queries
var device = {
    name: 'LED Device',
    routes: [
        {
            path: '/blink',
            label: 'Blink',
            func: actions.blink
        }
    ]
};



var server = new httpServer();

server.configureForDevice(device);

server.start();