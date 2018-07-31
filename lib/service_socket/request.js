'use strict';

function Request(method, resource, headers, body) {
    this.method   = method;
    this.resource = resource;
    this.headers  = headers;
    this.body     = body;

    this.parameters = { };
}

Request.prototype.getHeader = function(name) {
    return this.headers[name] || null;
}

Request.from = function() {
    if(arguments.length !== 1)
        throw new TypeError(`Request.from(): Expected 1 argument, got ${arguments.length} instead.`);

    if(typeof arguments[0] !== 'string' && !(arguments[0] instanceof Buffer))
        throw new TypeError(`Request.from(): Expected string or Buffer, got ${typeof arguments[0]} instead.`);

    let message  = arguments[0].toString().split('\r\n'),
        request  = message.shift().split(' '),
        method   = request[0],
        resource = request[1].charAt(request[1].length - 1) === '/' ? request[1] : request[1] + '/',
        headers  = [];

    message.slice(0, message.indexOf('\r\n') - 1).forEach(header => {
        headers[header.substring(0, header.indexOf(':'))] = header.substring(header.indexOf(':') + 1).trim();
    });

    let body = Buffer.from(message.slice(message.indexOf('\r\n')).join('\r\n').trim());
    return new Request(method, resource, headers, body);
}

module.exports = Request;
