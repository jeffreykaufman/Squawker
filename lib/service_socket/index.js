'use strict';

const fs        = require('fs');
const Logger    = require('../logger');
const Methods   = require('http').METHODS;
const net       = require('net');
const Request   = require('../http/request');
const Response  = require('../http/response');
const Router    = require('../router');
const Status    = require('../http/statuses');
const Timestamp = require('../logger/timestamp');
const tls       = require('tls');

function ServiceSocket(configuration) {
    this.configuration = configuration;
    this.accessLog = new Logger('access');
    this.accessLog.generate();

    let options = this.configuration.secure ? { key: fs.readFileSync(this.configuration.key), cert: fs.readFileSync(this.configuration.certificate) } :{ };

    this.interface     = (this.configuration.secure ? tls : net).createServer(options, socket => {
        socket.once('readable', () => {
            let request = Request.build(socket);

            if(this.configuration.debug)
                console.log(request.toString());

            let routes   = this.router.getRoute(request),
                response = new Response(socket);

            if(routes) {
                if(routes.handlers[request.method]) {
                    if(routes.path === request.resource) {
                        routes.handlers[request.method].static(request, response);
                    } else {
                        let difference = request.resource.substring(routes.path.length);

                        if(routes.handlers[request.method].parameterized[difference.split('/').length - 1]) {
                            let route = routes.handlers[request.method].parameterized[difference.split('/').length - 1],
                                parameters = difference.split('/').splice(0, difference.length - 1);

                            parameters.forEach((parameter, index) => {
                                request.parameters[route.parameters[index]] = parameter;
                            });

                            routes.handlers[request.method].parameterized[difference.split('/').length - 1].handler(request, response);
                        } else {
                            response.status = new Status(404);
                            response.end();
                        }
                    }
                } else {
                    response.status = new Status(405);
                    response.setHeader('Allow', Object.keys(routes.handlers).join(', ').toUpperCase());
                    response.end();
                }
            } else {
                response.status = new Status(404);
                response.end();
            }

            this.accessLog.write('%s %s %s [%s] "%s" %s %s\n', socket.address().address,
                                 '-', '-', new Timestamp().format('%d/%b/%Y:%H:%M:%S %z'),
                                 `${request.method} ${request.resource} HTTP/${request.version}`,
                                 response.status.code, socket.bytesWritten);
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
