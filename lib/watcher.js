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
            handler = this._triggerEvents.bind(this),
            watcher = chokidar.watch(watchList, { persistent: true });

        watcher.on('ready', function() {
            console.log('watcher is ready');

            this.on('add', handler)
                .on('change', handler)
                .on('unlink', handler)
        });

        return watcher;
    },

    _triggerEvents: function(filePath) {
        var filename = path.basename(filePath),
            tech = filename.substr(filename.indexOf('.') + 1);

        this._cfg.getTechTargets(tech).forEach(function(target) {
            this.events.emit('change', target);
        }, this);
    }
};

module.exports = Watcher;
