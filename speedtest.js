'use strict';

var speedTest = require('speedtest-net');

module.exports = exports = function(RED) {
    function SpeedTest(config) {
        var timeout = config.maxTime || 5 * 1000;
        RED.nodes.createNode(this, config);

        this.on('input', msg => {
            this.status({ fill: 'yellow', shape: 'dot', text: 'Requesting' });
            let speed = {maxTime: config.maxTime};
            if (config.serverId) {
                speed.serverId = config.serverId;
            }
            console.log(speed);
            var test = speedTest(speed);

            test.on('data', data => {
                var reponse = Object.assign({}, data, { config: config });
                this.status({});
                this.send({ payload: reponse });
            });

            test.on('error', err => {
                this.status({ fill: 'red', shape: 'dot', text: err.message });
                this.error(err, msg);
            });
        });
    }

    RED.nodes.registerType('speedtest', SpeedTest);
};
