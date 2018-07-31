'use strict';

const ServiceSocket = require('./service_socket');
const Methods = require('http').METHODS;

function Service(configuration) {
    if(!(this instanceof Service))
        return new Service(configuration);

    this.configuration = configuration;
    this.socket        = new ServiceSocket();
}

Service.prototype.start = function(port) {
    this.socket.listen(port ? port : this.configuration.get('port'));
}

Methods.forEach(method => {
    Service.prototype[method.toLowerCase()] = function(path, handler) {
        this.socket[method.toLowerCase()](path, handler);
    }
});

module.exports = Service;
