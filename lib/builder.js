var spawn = require('child_process').spawn,
    vow = require('vow');

var Maker = function(cfg, filePath) {

    var deferred = vow.defer(),
        cmd = cfg.resolvePath('node_modules/.bin/enb'),
        process = spawn(cmd, ['make', filePath]);

    process.stderr.on('data', function(data) {
        console.log(data.toString());
    });

    process.on('close', function(code) {
        code !== null && console.log('build finished: %s (%s)', filePath, code);
        deferred.resolve(this._result);
    }.bind(this));

    this._process = process;
    this._promise = deferred.promise();
}

Maker.prototype = {
    kill: function(nextPromise) {
        this._result = nextPromise;
        this._process.kill();
    },
    promise: function() {
        return this._promise;
    }
};


var Builder = function(cfg) {
    this._cfg = cfg;
    this._makers = {};
};

Builder.prototype = {
    /**
     * Перезапускает сборку
     * @param filePath {string}
     * @returns {promise}
     */
    rebuild: function(filePath) {
        var prev = this._makers[filePath],
            next = this._createMaker(filePath);

        prev && prev.kill(next.promise());
    },

    /**
     * Возвращает промис сборки текущего файла
     * @param filePath {string}
     * @returns {promise}
     */
    get: function(filePath) {
        return (this._makers[filePath] || this._createMaker(filePath)).promise();
    },

    _createMaker: function(filePath) {
        return (this._makers[filePath] = new Maker(this._cfg, filePath));
    }
};

module.exports = Builder;
