'use strict';

const Methods = require('http').METHODS;
const Registry = require('./registry');

function Router() {
    this.registry = new Registry('/');
}

Router.prototype.get = function(request) {
    return this.registry.find(request.resource);
}

Methods.forEach(method => {
    Router.prototype[method.toLowerCase()] = function(path, handler) {
        let route = this.registry.find(path);

        if(!route) {
            route = this.registry.add(path, { }).value;
        }

        route[method.toLowerCase()] = handler;
    };
});

module.exports = Router;
