'use strict';

const Methods  = require('../http/methods');
const Registry = require('./registry');
const Route    = require('./route');

function Router() {
    if(!(this instanceof Router))
        return new Router(...arguments);

    this.registry = new Registry('/');
}

Router.prototype.getRoute = function(request) {
    let closest = this.registry.find(request.resource);
    return closest ? closest.value : null;
}

Methods.forEach(method => {
    Router.prototype[method.toLowerCase()] = function(path, handler) {
        let parameters = [];
        let resource = path.split('/').map(x => {
            if(x) {
                if(x.charAt(0) !== ':') {
                    return x + '/';
                } else {
                    parameters.push(x.substring(1));
                    return '*/';
                }
            }
        }).filter(x => {
            if(x) return x;
        });

        resource = resource ? '/' + resource.join('') : '/';

        let entry = this.registry.find(resource, true);

        if(!entry) {
            entry = this.registry.add(resource, new Route(resource, parameters));
        }

        if(!entry.value) {
            entry.value = new Route(resource, parameters);
        }

        if(!entry.value[method]) {
            entry.value[method] = handler;
        }
    };
});

module.exports = Router;
