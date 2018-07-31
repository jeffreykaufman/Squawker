'use strict';

function ServiceConfiguration(identifier) {
    if(!(this instanceof ServiceConfiguration))
        return new ServiceConfiguration(identifier);

    Object.defineProperty(this, 'identifier', {
        value: identifier
    });

    this['port'] = 8080;
}

ServiceConfiguration.from = function() {
    let identifier = null,
        values     = null;

    if(arguments.length === 1) {
        if(typeof arguments[0] !== 'object' && !(arguments[0] instanceof Object))
            throw new TypeError(`ServiceConfiguration.from(): Expected object, got ${typeof arguments[0]} instead.`);
        values = arguments[0];
    } else if(arguments.length === 2) {
        if(typeof arguments[0] !== 'string')
            throw new TypeError(`ServiceConfiguration.from(): Expected string, got ${typeof arguments[0]} instead.`);
        if(typeof arguments[1] !== 'object' && !(arguments[1] instanceof Object))
            throw new TypeError(`ServiceConfiguration.from(): Expected object, got ${typeof arguments[1]} instead.`);
        identifier = arguments[0];
        values     = arguments[1];
    } else
        throw new TypeError(`ServiceConfiguration.from(): Expected 1 to 2 arguments, got ${arguments.length} instead.`);

    let configuration = new ServiceConfiguration(identifier);

    Object.getOwnPropertyNames(values).forEach(name => {
        if(Object.getOwnPropertyDescriptor(values, name).enumerable)
            configuration[name] = values[name];
    });

    return Object.freeze(configuration);
}

ServiceConfiguration.prototype.get = function(property) {
    return typeof this[property] !== 'undefined' ? this[property] : null;
}

module.exports = ServiceConfiguration;
