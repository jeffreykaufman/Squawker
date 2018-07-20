'use strict';

const Methods  = require('http').METHODS;
const net      = require('net');
const Request  = require('./http_request');
const Response = require('./http_response');
const Router   = require('../router');

function ServiceSocket(configuration) {
    this.configuration = configuration;
    this.interface     = net.createServer(socket => {
        socket.once('readable', () => {
            let requestBuffer = Buffer.from('');

            while(true) {
                let buffer = socket.read();

                if(buffer === null)
                    break;

                requestBuffer = Buffer.concat([requestBuffer, buffer]);

                if(requestBuffer.indexOf('\r\n\r\n') !== -1)
                    break;
            }

            let request  = Request.from(requestBuffer),
                routes   = this.router.get(request),
                response = new Response(socket);

            if(routes) {
                if(routes[request.method.toLowerCase()]) {
                    routes[request.method.toLowerCase()](request, response);
                } else {
                    response.setStatus(405, 'Method Not Allowed');
                    response.setHeader('Allow', Object.keys(routes).join(', ').toUpperCase());
                    response.end();
                }
            } else {
                response.setStatus(404, 'Not Found');
                response.end();
            }
        });
    });
    this.router        = new Router();
}

ServiceSocket.prototype.listen = function(port) {
    this.interface.listen(port);
}

Methods.forEach(method => {
    ServiceSocket.prototype[method.toLowerCase()] = function(path, handler) {
        this.router[method.toLowerCase()](path, handler);
    };
});

module.exports = ServiceSocket;
