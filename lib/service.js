'use strict';

const HTTPServer = require('./http_server');
const Methods = require('http').METHODS;

function Service() {
    this.http_server = new HTTPServer();
}

Service.build = function(configuration) {
    let service = new Service();
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
