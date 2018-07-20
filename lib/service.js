'use strict';

const HTTPServer = require('./http_server');
const Methods = require('http').METHODS;

function Service(configuration) {
    if(!(this instanceof Service))
        return new Service(configuration);

    this.configuration = configuration;
    this.socket        = new HTTPServer();
}

Service.prototype.start = function(port) {
    this.http_server.listen(port);
}

Methods.forEach(method => {
    Service.prototype[method.toLowerCase()] = function(path, handler) {
        this.http_server[method.toLowerCase()](path, handler);
    }
});

module.exports = Service;
