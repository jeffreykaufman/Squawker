'use strict';

const Methods = require('http').METHODS;
const Registry = require('./registry');

function Router() {
    this.registry = new Registry('/');
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

Router.prototype.getHandler = function(request) {
    return this.registry.find(request.path)[request.method] || null;
}

module.exports = Router;
