var utils = require('util'),
    spawn = require('child_process').spawn;

module.exports = function(port, cfg) {
    var defaultUrl = cfg.getDefaultUrl();

    defaultUrl && spawn('open', [utils.format('http://localhost:%s/%s', port, defaultUrl)]);
};
