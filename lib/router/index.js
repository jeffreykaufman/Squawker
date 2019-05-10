'use strict';

const DebugJournal = require('../debug-journal');
const Methods      = require('../http/methods');
const Path         = require('./path');
const Registry     = require('./registry');
const Route        = require('./route');

function Router(configuration) {
    if(!(this instanceof Router))
        return new Router(...arguments);

    this.configuration = configuration;
    this.registry      = new Registry('/');
}

Router.prototype.getRoute = function(request) {
    let closest = this.registry.find(request.resource, true);
    return closest ? closest.value : null;
}

Methods.forEach(method => {
    Router.prototype[method.toLowerCase()] = function(path, handler) {
        if(!Path.validate(path))
            return new Error('Invalid path!');

        path = new Path(path);

        let entry = this.registry.find(path.value, true);

        if(!entry)
            entry = this.registry.add(path.value, new Route(path.value, path.arguments));

        if(!entry.value)
            entry.value = new Route(path.value, path.arguments);

        if(!entry.value[method])
            entry.value[method] = handler;

        DebugJournal.write(`route to resource '${path.value}' with action '${method}' added`);
    };
});

module.exports = Router;
