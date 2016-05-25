var express = require('express'),
    fs = require('fs'),
    path = require('path');

var api = {
    sendEmpty: function(req, res) {
        res.send('');
    },

    sendFile: function(res, filePath) {
        fs.readFile(filePath, function(err, data) {
            if (err) {
                res.status(500).send(error.stack);
            } else {
                res.type(path.extname(filePath)).send(data);
            }
        });
    },

    handleError: function(res, error) {
        !error && (error = { stack: 'unknown error' });

        console.log(error.stack);
        res.status(500).send(error.stack);
    }
};

var Server = function(cfg, builder) {
    this._cfg = cfg;
    this._builder = builder;

    this._app = express();
    this._app
        .get('/favicon.ico', api.sendEmpty)
        .get('*', this._fileHandler.bind(this));
};

Server.prototype = {
    _fileHandler: function(req, res) {
        var filePath = this._cfg.getFilePath(req.path);

        console.log('request: %s', filePath);

        this._builder.get(filePath).then(
            api.sendFile.bind(api, res, filePath),
            api.handleError.bind(api, res));
    },

    listen: function(port) {
        this._app.listen(port);
    }
};

module.exports = Server;