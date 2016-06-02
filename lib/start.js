var Config = require('./config'),
    Builder = require('./builder'),
    Server = require('./server'),
    Watcher = require('./watcher'),
    log = require('./logger');

module.exports = function(bundleName, port) {

    var cfg = new Config(bundleName),
        builder = new Builder(cfg),
        server = new Server(cfg, builder),
        watcher = new Watcher(cfg),
        rebuildTarget = function(target){
            var targetPath = cfg.getFilePathByMask(target);

            log.hint('rebuild: %s', targetPath);
            builder.rebuild(targetPath);
        };

    // rebuild all targets
    cfg.getAllTargets().forEach(rebuildTarget);

    // listen to changes
    watcher.events.on('change', rebuildTarget);

    // start server
    server.listen(port)
};
