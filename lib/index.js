var blockName = 'index';

var express = require('express'),
    fs = require('fs'),
    path = require('path');

var Config = require('./config'),
    Builder = require('./builder'),
    Watcher = require('./watcher');

var cfg = new Config(blockName),
    builder = new Builder(cfg),
    watcher = new Watcher(cfg),
    webapp = express();

watcher.events.on('change', function(filePath) {
    console.log('rebuild: %s', filePath);
    builder.rebuild(filePath);
});

webapp
    .get('/favicon.ico', function(req, res) { res.send(''); })
    .get('*', function (req, res) {
        var filePath = cfg.getFilePath(req.path),
            ext = path.extname(req.path);

        builder.get(filePath).then(function() {
            fs.readFile(filePath, function(err, data) {
                if (err) {
                    res.status(500).send(error.stack);
                } else {
                    res.type(ext).send(data);
                }
            });
        }, function(error) {
            !error && (error = { stack: 'unknown error' });

            console.log(error.stack);
            res.status(500).send(error.stack);
        });

        console.log(filePath);
    });

webapp.listen(3000);
