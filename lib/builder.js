var MakePlatform = require('enb/lib/make');

var Builder = function(cfg) {
    this._cfg = cfg;
    this._cache = {};
};

Builder.prototype = {
    _buildFile: function(filePath) {
        var makePlatform = new MakePlatform();

        return makePlatform
            .init(this._cfg.cwd())
            .then(function() {
                return makePlatform.build([filePath]);
            })
            .then(function() {
                makePlatform.destruct();
            });
    },

    rebuild: function(filePath) {
        return (this._cache[filePath] = this._buildFile(filePath));
    },

    /**
     * Получает промис сборки текущего файла
     */
    get: function(filePath) {
        return this._cache[filePath] || this.rebuild(filePath);
    }
};

module.exports = Builder;
