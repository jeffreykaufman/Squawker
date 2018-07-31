'use strict';

function Route(path, handlers) {
    this.path     = path;
    this.handlers = handlers;
}

module.exports = Route;
