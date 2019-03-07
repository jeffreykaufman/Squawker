'use strict';

const DebugLog             = require('./logger/debug-logger');
const Methods              = require('http').METHODS;
const ServiceConfiguration = require('./service_configuration');
const ServiceSocket        = require('./service_socket');


function Service(configuration) {
    if(!(this instanceof Service))
        return new Service(configuration);

    this.configuration = configuration instanceof ServiceConfiguration ? configuration : new ServiceConfiguration(null);
    this.mixins        = { before: [ ], after: [ ] };
    this.socket        = new ServiceSocket(this.configuration, this.mixins);

    if(this.configuration.debug) {
        DebugLog.generate();
    }
}

Service.prototype.before = function(mixin) {
    this.mixins.before.push(mixin);
};

Service.prototype.after = function(mixin) {
    this.mixins.after.push(mixin);
};

Service.prototype.start = function(port) {
    this.socket.listen(port ? port : this.configuration.get('port'));
};

Methods.forEach(method => {
    Service.prototype[method.toLowerCase()] = function(path, handler) {
        this.socket[method.toLowerCase()](path, handler);
    }
});

module.exports = Service;
