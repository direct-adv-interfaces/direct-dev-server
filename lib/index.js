var blockName = 'index',
    port = 3000;

var Config = require('./config'),
    Builder = require('./builder'),
    Server = require('./server'),
    Watcher = require('./watcher');

var cfg = new Config(blockName),
    builder = new Builder(cfg),
    server = new Server(cfg, builder),
    watcher = new Watcher(cfg);

watcher.events.on('change', function(filePath) {
    console.log('rebuild: %s', filePath);
    builder.rebuild(filePath);
});

server.listen(port);
