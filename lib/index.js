var blockName = 'index',
    port = 3000;

var Config = require('./config'),
    Builder = require('./builder'),
    Server = require('./server'),
    Watcher = require('./watcher');

var cfg = new Config(blockName),
    builder = new Builder(cfg),
    server = new Server(cfg, builder),
    watcher = new Watcher(cfg),
    rebuildTarget = function(target){
        var targetPath = cfg.getFilePathByMask(target);

        console.log('rebuild: %s', targetPath);
        builder.rebuild(targetPath);
    };

// rebuild all targets
cfg.getAllTargets().forEach(rebuildTarget);

// listen to changes
watcher.events.on('change', rebuildTarget);

// start server
server.listen(port);
