var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    log = require('./logger'),
    util = require('util');

var api = {
    sendEmpty: function(req, res) {
        res.send('');
    },

    sendFile: function(res, filePath) {
        fs.readFile(filePath, function(err, data) {
            if (err) {
                res.status(500).send(err.stack);
            } else {
                res.type(path.extname(filePath)).send(data);
            }
        });
    },

    handleError: function(res, error) {
        !error && (error = { stack: 'unknown error' });

        log.error(error.stack);
        res.status(500).send(error.stack);
    }
};

var Server = function(cfg, builder) {
    this._cfg = cfg;
    this._builder = builder;
    this._baseUrl = cfg.getBaseUrl();
    this._defaultUrl = this._baseUrl + cfg.getDefaultUrl();

    this._app = express();
    this._app.use(this._baseUrl, express.Router()
        .get('/favicon.ico', api.sendEmpty)
        .get('*.svg', api.sendEmpty)
        .get('*.png', api.sendEmpty)
        .get('*.gif', api.sendEmpty)
        .get('/', this._rootHandler.bind(this))
        .get('*', this._fileHandler.bind(this))
    );
};

Server.prototype = {
    _rootHandler: function(req, res) {

        if (this._defaultUrl) {
            res.redirect(this._defaultUrl);
        } else {
            res.send('Ok');
        }
    },

    _fileHandler: function(req, res) {
        var filePath = this._cfg.getFilePath(req.path);

        log.hint('request: %s', filePath);

        this._builder.get(filePath).then(
            api.sendFile.bind(api, res, filePath),
            api.handleError.bind(api, res));
    },

    listen: function(port, host, displayHost) {
        var baseUrl = this._cfg.getBaseUrl(),
            defaultHost = util.format('http://%s:%s', host, port);

        this._app.listen(port, host, function () {
             log.info('Server listening at %s%s', displayHost || defaultHost, baseUrl);
        });
    }
};

module.exports = Server;
