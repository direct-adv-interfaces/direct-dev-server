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

var Config = function(blockName) {
    this._block = blockName;
    this._data = require('../.test-server.js');

    // зависимости таргетов от технологий
    this._techDeps = api.indertDeps(this._data.targets);
};

Config.prototype = {

    /**
     * Возвращает путь к файлу из папки с бандлами, относительно корня проекта
     * Например index.js => bundles/blockName/index.js
     * @param fileName {string}
     * @returns {string}
     */
    getFilePath: function(fileName) {
        return path.join(this._data.bundles, this._block, fileName);
    },

    getFilePathByMask: function(mask) {
        return this.getFilePath(mask.replace('?', this._block));
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

    /**
     * Возвращает маски путей к файлам для всех уровней переопределения
     * @param tech {string}
     * @returns {Array}
     */
    getTechFileMask: function(tech) {
        return this._data.levels.map(function(level) {
            return path.join(level, '**' , '*.' + tech);
        });
    }
};

module.exports = Config;
