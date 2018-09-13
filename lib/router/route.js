'use strict';

const Methods = require('../http/methods');

function Route(path, parameters) {
    if(!(this instanceof Route))
        return new Route(...arguments);

    this.path       = path;
    this.parameters = parameters;

    Methods.forEach(method => {
        this[method] = null;
    });
};

module.exports = Route;
