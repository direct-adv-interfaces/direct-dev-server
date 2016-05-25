var chokidar = require('chokidar'),
    events = require('events'),
    path = require('path');

var Watcher = function(cfg) {
    this._cfg = cfg;
    this.events = new events.EventEmitter();
    this._watcher = this._initWatcher(cfg);
};

Watcher.prototype = {
    _initWatcher: function(cfg) {
        var watchList = cfg.getObservableTechs().reduce(function(list, tech) {
                return list.concat(cfg.getTechFileMask(tech));
            }, []),
            watcher = chokidar.watch(watchList, { persistent: true });

        watcher
            .on('add', this._triggerEvent.bind(this))
            .on('change', this._triggerEvent.bind(this))
            .on('unlink', this._triggerEvent.bind(this));

        return watcher;
    },

    _triggerEvent: function(filePath) {
        var filename = path.basename(filePath),
            tech = filename.substr(filename.indexOf('.') + 1);

        this._cfg.getTechTargets(tech).forEach(function(target){
            var targetPath = this._cfg.getFilePathByMask(target);
            this.events.emit('change', targetPath);
        }, this);
    }
};

module.exports = Watcher;
