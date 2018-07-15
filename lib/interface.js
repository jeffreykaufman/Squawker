'use strict';

const HTTPServer = require('./http_server');
const Methods = require('http').METHODS;

function Interface() {
    this.http_server = new HTTPServer();
}

Interface.prototype.start = function(port) {
    this.http_server.listen(port);
}

Methods.forEach(method => {
    Interface.prototype[method.toLowerCase()] = function(path, handler) {
        this.http_server[method.toLowerCase()](path, handler);
    }
});

module.exports = Interface;
