'use strict';

const Musings              = require('musings');

const Methods              = require('./http/methods');
const ServiceConfiguration = require('./service_configuration');

let ServiceSocket;

class Service {
    constructor(configuration) {
        this.configuration = configuration instanceof ServiceConfiguration ? configuration : new ServiceConfiguration(null);
        this.mixins        = { before: [ ], after: [ ] };

        Musings.useIdentifier(this.configuration.identifier);

        ServiceSocket = require('./service_socket');
        this.socket   = new ServiceSocket(this.configuration, this.mixins);

        if(this.configuration.debug)
            require('./debug-journal').generate();
    }

    before(mixin) {
        this.mixins.before.push(mixin);
    }

    after(mixin) {
        this.mixins.after.push(mixin);
    }

    start(port) {
        this.socket.listen(port ? port : this.configuration.get('port'));
    }
}

Methods.forEach(method => {
    Service.prototype[method.toLowerCase()] = function(path, handler) {
        this.socket[method.toLowerCase()](path, handler);
    };
});

module.exports = Service;
