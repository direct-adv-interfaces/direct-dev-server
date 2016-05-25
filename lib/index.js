var blockName = 'index';

var express = require('express'),
    chokidar = require('chokidar'),
    fs = require('fs'),
    path = require('path'),
    cdir = process.cwd();

var MakePlatform = require('enb/lib/make'),
    Config = require('./config'),
    Watcher = require('./watcher');

var cfg = new Config(blockName),
    app = express();





var buildFile = function(filePath){
        var makePlatform = new MakePlatform();

        return makePlatform
            .init(cdir)
            .then(function() {
                return makePlatform.build([filePath]);
            })
            .then(function() {
                makePlatform.destruct();
            });
    },
    getFile = function(filePath, rebuild) {

        return ((!rebuild && cache[filePath]) || (cache[filePath] = buildFile(filePath)));

        //cache['bundles/index/index.test.js'].then(function() {console.log(1111)}, function() {console.log('error',1111)});
    },
    cache = {};

app .get('/favicon.ico', function(req, res) { res.send(''); })
    .get('*', function (req, res) {
        var filePath = cfg.getFilePath(req.path),
            ext = path.extname(req.path);

        getFile(filePath).then(function() {
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

var watcher = new Watcher(cfg, blockName);

watcher.events.on('change', function(path) {
    console.log('rebuild: %s', path);
    getFile(path, true);
});

app.listen(3000);
//     // .fail(errorHandler);
