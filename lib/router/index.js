'use strict';

const Registry = require('./registry');

const METHODS = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'];

function Router() {
    this.registries = { };

    METHODS.forEach(method => this.registries[method] = new Registry('/'));
}

METHODS.forEach(method => {
    Router.prototype[method.toLowerCase()] = function(path, handler) {
        this.registries[method].add(path, handler);
    };
});

Router.prototype.getHandler = function(request) {
    return this.registries[request.method.toLowerCase()].find(request.path);
}

module.exports = Router;
