var path = require('path');

var api = {
    indertDeps: function(targets) {
        var inverted = {};

        Object.keys(targets).forEach(function(target) {
            targets[target].forEach(function(tech) {
                !inverted[tech] && (inverted[tech] = {});
                inverted[tech][target] = true;
            });
        });

        return inverted;
    }
};

var Config = function(bundleName) {
    this._cwd = process.cwd();
    this._bundle = bundleName;
    this._data = require(this.resolvePath('.dev-server.js'));

    // зависимости таргетов от технологий
    this._techDeps = api.indertDeps(this._data.targets);
};

Config.prototype = {

    /**
     * Возвращает путь к файлу из папки с бандлами, относительно корня проекта
     * Например index.js => bundles/bundleName/index.js
     * @param fileName {string}
     * @returns {string}
     */
    getFilePath: function(fileName) {
        return path.join(this._data.bundles, this._bundle, fileName);
    },

    getFilePathByMask: function(mask) {
        return this.getFilePath(mask.replace('?', this._bundle));
    },

    getDefaultUrl: function() {
        return this._data.defaultTarget ?
            this._data.defaultTarget.replace('?', this._bundle) :
            undefined;
    },

    /**
     * Возвращает список технологий, за изменением которых нужно наблюдать
     * @returns {Array}
     */
    getObservableTechs: function() {
        return Object.keys(this._techDeps);
    },

    /**
     * Возвращает список таргетов, которые нужно пересобрать при изменении технологии
     * @param tech {string}
     * @returns {Array}
     */
    getTechTargets: function(tech) {
        var techs = this._techDeps[tech];

        return techs ? Object.keys(techs) : [];
    },

    getAllTargets: function() {
        return Object.keys(this._data.targets);
    },

    /**
     * Возвращает маски путей к файлам для всех уровней переопределения
     * @param tech {string}
     * @returns {Array}
     */
    getTechFileMask: function(tech) {
        return this._data.levels.map(function(level) {
            return path.join(level, '**' , '*.' + tech);
        });
    },

    /**
     * Возвращает путь относительно корневой папки проекта
     * @returns {*}
     */
    resolvePath: function(relativePath) {
        return path.join(this._cwd, relativePath);
    }
};

module.exports = Config;
