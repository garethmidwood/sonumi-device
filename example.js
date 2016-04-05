var device = require('./lib/device');

// this is your device configuration
var config = {
    // this will be displayed on the website
    "name": "my test device",
    // these are the actions that can be triggered on your device
    "actions": [
        {
            // the buttons on the site will be labelled with this value
            "label": "one",
            // and this is the function that will be called when the button is pressed
            "action": doOne
        },
        {
            "label": "two",
            "action": doTwo
        }
    ]
};

// put the functions for your device actions here
// each function must return a promise
function doOne() {
    return new Promise(
        function(resolve, reject) {
            setTimeout(function() {
                console.log('one! Ha Ha Ha Haaa!');
                resolve();
            }, 5000);
        }
    );
}

function doTwo() {
    return new Promise(
        function(resolve, reject) {
            console.log('two! Ha Ha Ha Haaa!');
            resolve('executing');
        }
    );
}

// and create your device with the config
new device(config);
