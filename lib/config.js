var path = require('path');

var Config = function(blockName) {
    this._block = blockName;
    this._data = require('../.test-server.js');
};

Config.prototype = {
    getFilePath: function(fileName) {
        return path.join(this._data.bundles, this._block, fileName);
    }
};

module.exports = Config;
