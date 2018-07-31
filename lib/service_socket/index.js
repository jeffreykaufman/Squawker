'use strict';

const Methods  = require('http').METHODS;
const net      = require('net');
const Request  = require('./request');
const Response = require('./response');
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
                routes   = this.router.getRoute(request),
                response = new Response(socket);

            if(routes) {
                if(routes.handlers[request.method.toLowerCase()]) {
                    if(routes.path === request.resource) {
                        routes.handlers[request.method.toLowerCase()].static(request, response);
                    } else {
                        let difference = request.resource.substring(routes.path.length);

                        if(routes.handlers[request.method.toLowerCase()].parameterized[difference.split('/').length - 1]) {
                            let route = routes.handlers[request.method.toLowerCase()].parameterized[difference.split('/').length - 1],
                                parameters = difference.split('/').splice(0, difference.length - 1);

                            parameters.forEach((parameter, index) => {
                                request.parameters[route.parameters[index]] = parameter;
                            });

                            routes.handlers[request.method.toLowerCase()].parameterized[difference.split('/').length - 1].handler(request, response);
                        } else {
                            response.setStatus(404, 'Not Found');
                            response.end();
                        }
                    }
                } else {
                    response.setStatus(405, 'Method Not Allowed');
                    response.setHeader('Allow', Object.keys(routes.handlers).join(', ').toUpperCase());
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
