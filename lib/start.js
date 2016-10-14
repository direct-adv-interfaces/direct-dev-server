var Config = require('./config'),
    Builder = require('./builder'),
    Server = require('./server'),
    Watcher = require('./watcher'),
    log = require('./logger');

/**
 * Запускает dev-server
 * @param {String} bundleName - название бандла
 * @param {Number} port - порт сервера
 * @param {String} host - хост сервера
 * @param {String} [displayHost] - хост для отображаемой ссылки
 * @param {String} [target] - таргет, открываемый по умолчанию
 */
module.exports = function(bundleName, port, host, displayHost, target) {

    var cfg = new Config(bundleName, target),
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
    server.listen(port, host, displayHost)
};
