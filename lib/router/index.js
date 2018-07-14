'use strict';

const Methods = require('http').METHODS;
const Registry = require('./registry');

function Router() {
    this.registries = { };

    Methods.forEach(method => this.registries[method] = new Registry('/'));
}

Methods.forEach(method => {
    Router.prototype[method.toLowerCase()] = function(path, handler) {
        this.registries[method].add(path, handler);
    };
});

Router.prototype.getHandler = function(request) {
    return this.registries[request.method.toLowerCase()].find(request.path);
}

module.exports = Router;
