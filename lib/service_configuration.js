'use strict';

const merge = require('./utility').merge;

function ServiceConfiguration(identifier) {
    if(identifier !== undefined && typeof identifier !== 'string')
        throw new TypeError(`Optional argument "identifier" must be a string; got a(n) ${typeof identifier} instead.`);

    this.identifier = identifier || null;
}

ServiceConfiguration.from = function(configuration) {

}

ServiceConfiguration.prototype.get = function(property) {
    return this[property];
}

ServiceConfiguration.prototype.set = function(property, value) {
    this[property] = value;
}

module.exports = ServiceConfiguration;
