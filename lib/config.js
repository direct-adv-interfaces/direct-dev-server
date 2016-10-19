var path = require('path');

var api = {
    normalizeArgs: function(args) {
        if (args && !Array.isArray(args)) {
            throw new Error('Invalid parameter type: enbArgs (array expected)');
        }

        return args || [];
    },

    normalizeUrl: function(str) {
        return '/' + ((str || '').replace(/(^\/)|(\/$)/g, ''));
    },

    invertDeps: function(targets) {
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

var Config = function(bundleName, target) {
    this._cwd = process.cwd();
    this._bundle = bundleName;
    this._target = target;
    this._data = require(this.resolvePath('.dev-server.js'));

    // базовый путь веб-сервера
    this._baseUrl = api.normalizeUrl(this._data.baseUrl);

    // зависимости таргетов от технологий
    this._techDeps = api.invertDeps(this._data.targets);

    // дополнительные аргументы для enb
    this._enbArgs = api.normalizeArgs(this._data.enbArgs);
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

    /**
     * Возвращает путь к файлу по маске enb таргета
     * @param mask
     * @returns {string}
     */
    getFilePathByMask: function(mask) {
        return this.getFilePath(mask.replace('?', this._bundle));
    },

    /**
     * Возвращает массив аргументов enb
     * @returns {string[]}
     */
    getEnbArgs: function() {
        return this._enbArgs;
    },

    /**
     * Возвращает таргет, который нужно открывать в браузере по умолчанию
     * @returns {string|undefined}
     */
    getDefaultUrl: function() {
        var target = this._target || this._data.defaultTarget;

        return target ?
            '/' + target.replace('?', this._bundle) :
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
     * @returns {String}
     */
    resolvePath: function(relativePath) {
        return path.join(this._cwd, relativePath);
    },

    /**
     * Возвращает базовый путь веб-сервера
     * @returns {String}
     */
    getBaseUrl: function() {
        return this._baseUrl;
    }
};

module.exports = Config;
