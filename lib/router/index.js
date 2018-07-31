'use strict';

const Methods  = require('http').METHODS;
const Registry = require('./registry');
const Route    = require('./route');

function Router() {
    this.registry = new Registry('/');
}

Router.prototype.getRoute = function(request) {
    let closest = this.registry.find(request.resource);
    return new Route(closest.path, closest.value);
}

Methods.forEach(method => {
    Router.prototype[method.toLowerCase()] = function(path, handler) {
        let parameters = [];
        let resource = path.split('/').filter(x => {
            if(x) {
                if(x.charAt(0) !== ':') {
                    return x;
                } else {
                    parameters.push(x.substring(1));
                }
            }
        });

        resource = resource.map(x => x + '/');
        resource = resource ? '/' + resource.join('') : '/';

        let route = this.registry.find(resource, true);

        if(!route) {
            route = this.registry.add(resource, { });
        }

        if(!route.value) {
            route.value = { };
        }

        if(!route.value[method]) {
            route.value[method] = { parameterized: [], static: null };
        }

        if(parameters.length > 0) {
            route.value[method].parameterized[parameters.length] = { parameters: parameters, handler: handler};
        } else {
            route.value[method].static = handler;
        }
    };
});

module.exports = Router;
