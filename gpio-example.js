var device = require('./lib/device');

var gpioSupport = true;
var executing = false;

try {
    var gpio = require('onoff').Gpio;
} catch (err) {
    gpioSupport = false;
}

// this is your device configuration
var config = {
    // this will be displayed on the website
    "name": "my test device",
    // these are the actions that can be triggered on your device
    "actions": [
        {
            // the buttons on the site will be labelled with this value
            "label": "blink",
            // and this is the function that will be called when the button is pressed
            "action": blink
        }
    ]
};

// put the functions for your device actions here
// each function must return a promise
function blink() {
    return new Promise(
        function(resolve, reject) {
            if (executing) {
                console.log('command is already running');
                resolve('executing');
                console.log('did I need to do this?');
                return;
            }

            try {
                var led = new gpio(17, 'out');
                gpioSupport = true;
            } catch (err) {
                console.log('no gpio support');
                gpioSupport = false;
            }

            try {
                var iv = setInterval(function () {
                    executing = true;
                    console.log('== blink ==');
                    if (gpioSupport) {
                        led.writeSync(led.readSync() === 0 ? 1 : 0);
                    }
                }, 500);

                // Stop blinking the LED and turn it off after 5 seconds.
                setTimeout(function () {
                    clearInterval(iv); // Stop blinking

                    executing = false;

                    if (gpioSupport) {
                        led.writeSync(0);  // Turn LED off.
                        led.unexport();    // Unexport GPIO and free resources
                    }

                    resolve();
                }, 5000);
            } catch (err) {
                console.log('Error making LED blink: ' + err);
                reject();
            }
        }
    );
}

// and create your device with the config
new device(config);
