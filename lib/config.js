var path = require('path'),
    os = require('os');

var api = {
    getHostName: function(remoteHost) {
        var hostname = os.hostname();

        console.log(hostname);
        return remoteHost && new RegExp(remoteHost).test(hostname) ? hostname : 'localhost';
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

var Config = function(bundleName) {
    this._cwd = process.cwd();
    this._bundle = bundleName;
    this._data = require(this.resolvePath('.dev-server.js'));

    // зависимости таргетов от технологий
    this._techDeps = api.invertDeps(this._data.targets);

    // хост web-сервера
    this._hostname = api.getHostName(this._data.remoteHost);
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
     * @returns {String}
     */
    resolvePath: function(relativePath) {
        return path.join(this._cwd, relativePath);
    },

    /**
     * Возвращает хост для веб-сервера
     * @returns {String}
     */
    getHostName: function() {
        return this._hostname;
    }
};

module.exports = Config;
