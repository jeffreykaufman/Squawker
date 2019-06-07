'use strict';

const fs           = require('fs');
const Musings      = require('musings');
const net          = require('net');
const tls          = require('tls');

const DebugJournal = require('../debug-journal');
const Methods      = require('../http/methods');
const Request      = require('../http/request');
const Response     = require('../http/response');
const Router       = require('../router');
const Status       = require('../http/statuses');

function ServiceSocket(configuration, mixins) {
    if(!(this instanceof ServiceSocket))
        return new ServiceSocket(...arguments);

    this.configuration = configuration;
    this.mixins = mixins;

    let journalConfiguration = {
        name: 'access'
    };

    if(this.configuration.get('accessLogDirectory'))
        journalConfiguration.directory = this.configuration.get('accessLogDirectory');

    this.accessJournal = Musings.journal(journalConfiguration);

    let options = this.configuration.secure ? { key: fs.readFileSync(this.configuration.key), cert: fs.readFileSync(this.configuration.certificate) } : { };

    this.interface = (this.configuration.secure ? tls : net).createServer(options, socket => {
        socket.once('data', (buffer) => {
            let request  = Request.build(buffer),
                response = Response.build(socket),
                routes   = this.router.getRoute(request);

            this.mixins.before.forEach(mixin => {
                mixin(request, response);
            });

            DebugJournal.write(`attempting to route request ${request.toString()}`);

            if(routes) {
                if(routes[request.method]) {
                    if(routes.path === request.resource) {
                        routes[request.method].length === 1 ? routes[request.method](response) : routes[request.method](request, response);
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

                        routes[request.method].length === 1 ? routes[request.method](response) : routes[request.method](request, response);
                    }
                } else {
                    response.status = new Status(405);
                    response.setHeader('Allow', Object.keys(routes).filter(value => value !== 'path' && value !== 'parameters' && routes[value] !== null).join(', ').toUpperCase());

                }
            } else {
                response.status = new Status(404);
            }

            this.mixins.after.forEach(mixin => {
                mixin(request, response);
            });

            if(!response.socket.destroyed)
                response.end();

            this.accessJournal.write('${1} ${2} ${3} [${4}] "${5}" ${6} ${7}', socket.address().address,
                                     '-', '-', Musings.Timestamps.format('DD/MMM/YYYY:HH:mm:ss ZZ'),
                                     `${request.method} ${request.resource} HTTP/${request.version}`,
                                     response.status.code, socket.bytesWritten);
        });
    });
    this.router        = new Router(this.configuration);
}

ServiceSocket.prototype.listen = function(port) {
    this.interface.listen(port);
};

Methods.forEach(method => {
    ServiceSocket.prototype[method.toLowerCase()] = function(path, handler) {
        this.router[method.toLowerCase()](path, handler);
    };
});

module.exports = ServiceSocket;
