'use strict';

const fs        = require('fs');
const Logger    = require('../logger');
const Methods   = require('../http/methods');
const net       = require('net');
const Request   = require('../http/request');
const Response  = require('../http/response');
const Router    = require('../router');
const Status    = require('../http/statuses');
const Timestamp = require('../logger/timestamp');
const tls       = require('tls');

function ServiceSocket(configuration) {
    if(!(this instanceof ServiceSocket))
        return new ServiceSocket(...arguments);

    this.configuration = configuration;
    this.accessLog = new Logger('access');

    let options = this.configuration.secure ? { key: fs.readFileSync(this.configuration.key), cert: fs.readFileSync(this.configuration.certificate) } :{ };

    this.interface = (this.configuration.secure ? tls : net).createServer(options, socket => {
        socket.once('readable', () => {
            let request  = Request.build(socket),
                response = Response.build(socket),
                routes   = this.router.getRoute(request);

            if(routes) {
                if(routes[request.method]) {
                    if(routes.path === request.resource) {
                        routes[request.method](request, response);
                    } else {
                        let parameterIndex = 0;

                        for(let i = 0; i < routes.path.length; i++) {
                            if(routes.path.charAt(i) === '*') {
                                let value = '';

                                for(let j = 0; j < request.resource.length; j++) {
                                    if(request.resource.charAt(i + j) === routes.path.charAt(i + 1)) {
                                        break;
                                    } else {
                                        value += request.resource.charAt(i + j);
                                    }
                                }

                                request.parameters[routes.parameters[parameterIndex]] = value;
                                parameterIndex++;
                            }
                        }

                        routes[request.method](request, response);
                    }
                } else {
                    response.status = new Status(405);
                    response.setHeader('Allow', Object.keys(routes).join(', ').toUpperCase());
                }
            } else {
                response.status = new Status(404);
            }

            response.end();

            this.accessLog.write('%s %s %s [%s] "%s" %s %s\n', socket.address().address,
                                 '-', '-', new Timestamp().format('%d/%b/%Y:%H:%M:%S %z'),
                                 `${request.method} ${request.resource} HTTP/${request.version}`,
                                 response.status.code, socket.bytesWritten);
        });
    });
    this.router        = new Router();

    this.accessLog.generate();
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
