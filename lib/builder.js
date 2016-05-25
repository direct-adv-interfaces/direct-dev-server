var MakePlatform = require('enb/lib/make');

var Maker = function(cfg, filePath) {
    this._path = filePath;
    this._started = false;
    this._cfg = cfg;

    this._promise = this._build();
};

Maker.prototype = {
    _build: function() {
        if (this._started) {
            return true;
        }

        var ctx = this,
            makePlatform = new MakePlatform();

        ctx._started = true;

        return makePlatform.init(this._cfg.cwd())
            .then(function() {
                return makePlatform
                    .build([ctx._path])
                    .then(function() {
                        makePlatform.destruct();
                        return ctx._started || ctx._build();
                    });
            });
    },

    rebuild: function() {
        this._started = false;
        return (this._promise = this._promise.then(this._build.bind(this)))
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
     * Обновляет версию и возвращает промис сборки текущего файла
     * @param filePath {string}
     * @returns {promise}
     */
    rebuild: function(filePath) {
        return this._getMaker(filePath).rebuild();
    },

    /**
     * Возвращает промис сборки текущего файла
     * @param filePath {string}
     * @returns {promise}
     */
    get: function(filePath) {
        return this._getMaker(filePath).promise();
    },

    /**
     * Возвращает maker для указанного файла. Если его нет, создает.
     * @param filePath {string}
     * @returns {Maker}
     * @private
     */
    _getMaker: function(filePath) {
        return this._makers[filePath] || (this._makers[filePath] = new Maker(this._cfg, filePath));
    }
};

module.exports = Builder;
